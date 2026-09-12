import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

interface CampusPrintStackProps extends cdk.StackProps {
  awsAccountId: string;
  awsRegion: string;
  environmentName: string;
}

export class CampusPrintStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CampusPrintStackProps) {
    super(scope, id, props);

    const { awsAccountId, awsRegion, environmentName } = props;

    // ============================================
    // DynamoDB Tables
    // ============================================

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'campusprint-users',
      partitionKey: {
        name: 'email',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    const ordersTable = new dynamodb.Table(this, 'OrdersTable', {
      tableName: 'campusprint-orders',
      partitionKey: {
        name: 'orderId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Add GSI for userId to query orders by student
    ordersTable.addGlobalSecondaryIndex({
      indexName: 'userIdIndex',
      partitionKey: {
        name: 'userId',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ============================================
    // S3 Bucket for File Storage
    // ============================================

    const filesBucket = new s3.Bucket(this, 'FilesBucket', {
      bucketName: `campusprint-files-${awsAccountId}-${awsRegion}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(30),
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(1),
            },
          ],
        },
      ],
    });

    // ============================================
    // Secrets Manager for JWT_SECRET
    // ============================================

    const jwtSecret = new secretsmanager.Secret(this, 'JwtSecret', {
      secretName: 'campusprint/jwt-secret',
      description: 'JWT secret for CampusPrint backend',
      generateSecretString: {
        passwordLength: 32,
        excludeCharacters: '"\'\\',
      },
    });

    // ============================================
    // CloudWatch Log Groups
    // ============================================

    const backendLogGroup = new logs.LogGroup(this, 'BackendLogGroup', {
      logGroupName: '/ecs/campusprint-backend',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const frontendLogGroup = new logs.LogGroup(this, 'FrontendLogGroup', {
      logGroupName: '/ecs/campusprint-frontend',
      retention: logs.RetentionDays.ONE_WEEK,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ============================================
    // ECR Repositories
    // ============================================

    const backendRepo = new ecr.Repository(this, 'BackendRepo', {
      repositoryName: 'campusprint-backend',
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const frontendRepo = new ecr.Repository(this, 'FrontendRepo', {
      repositoryName: 'campusprint-frontend',
      imageScanOnPush: true,
      imageTagMutability: ecr.TagMutability.IMMUTABLE,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // ============================================
    // VPC and ECS Cluster
    // ============================================

    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true,
    });

    const cluster = new ecs.Cluster(this, 'Cluster', {
      clusterName: 'campusprint-cluster',
      vpc: vpc,
    });

    // ============================================
    // IAM Roles
    // ============================================

    // Task Execution Role (for ECS to pull images and write logs)
    const taskExecutionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'ECS task execution role for CampusPrint',
    });

    taskExecutionRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy')
    );

    // Grant access to read JWT secret
    jwtSecret.grantRead(taskExecutionRole);

    // Task Role for Backend (for app to access DynamoDB and S3)
    const backendTaskRole = new iam.Role(this, 'BackendTaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      description: 'Backend task role for DynamoDB and S3 access',
    });

    // DynamoDB permissions
    backendTaskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:DeleteItem',
        ],
        resources: [usersTable.tableArn, ordersTable.tableArn, `${ordersTable.tableArn}/index/*`],
      })
    );

    // S3 permissions for file uploads
    backendTaskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          's3:GetObject',
          's3:PutObject',
          's3:DeleteObject',
        ],
        resources: [`${filesBucket.bucketArn}/*`],
      })
    );

    // CloudWatch Logs permissions
    backendTaskRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'logs:CreateLogStream',
          'logs:PutLogEvents',
        ],
        resources: [`${backendLogGroup.logGroupArn}:*`],
      })
    );

    // ============================================
    // ECS Task Definitions
    // ============================================

    const backendTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      'BackendTaskDefinition',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        executionRole: taskExecutionRole,
        taskRole: backendTaskRole,
      }
    );

    const backendContainer = backendTaskDefinition.addContainer('backend', {
      image: ecs.ContainerImage.fromRegistry(
        `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com/campusprint-backend:latest`
      ),
      containerPort: 4000,
      protocol: ecs.Protocol.TCP,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'backend',
        logGroup: backendLogGroup,
      }),
      environment: {
        DB_DRIVER: 'dynamodb',
        PORT: '4000',
        AWS_REGION: awsRegion,
        USERS_TABLE: usersTable.tableName,
        ORDERS_TABLE: ordersTable.tableName,
        RATE_BW_PER_PAGE: '2',
        RATE_COLOR_PER_PAGE: '8',
        BINDING_FEE_STAPLE: '0',
        BINDING_FEE_SPIRAL: '20',
        CORS_ORIGIN: `https://<FRONTEND_URL>`, // Will be updated after frontend deploy
        NODE_ENV: 'production',
      },
      secrets: {
        JWT_SECRET: ecs.Secret.fromSecretsManager(jwtSecret),
        AWS_ACCESS_KEY_ID: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'AwsAccessKeySecret',
            'campusprint/aws-credentials'
          ),
          'AWS_ACCESS_KEY_ID'
        ),
        AWS_SECRET_ACCESS_KEY: ecs.Secret.fromSecretsManager(
          secretsmanager.Secret.fromSecretNameV2(
            this,
            'AwsSecretKeySecret',
            'campusprint/aws-credentials'
          ),
          'AWS_SECRET_ACCESS_KEY'
        ),
      },
    });

    backendContainer.addPortMappings({
      containerPort: 4000,
      protocol: ecs.Protocol.TCP,
    });

    // Frontend Task Definition
    const frontendTaskDefinition = new ecs.FargateTaskDefinition(
      this,
      'FrontendTaskDefinition',
      {
        memoryLimitMiB: 512,
        cpu: 256,
        executionRole: taskExecutionRole,
      }
    );

    const frontendContainer = frontendTaskDefinition.addContainer('frontend', {
      image: ecs.ContainerImage.fromRegistry(
        `${awsAccountId}.dkr.ecr.${awsRegion}.amazonaws.com/campusprint-frontend:latest`
      ),
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
      logging: ecs.LogDriver.awsLogs({
        streamPrefix: 'frontend',
        logGroup: frontendLogGroup,
      }),
    });

    frontendContainer.addPortMappings({
      containerPort: 80,
      protocol: ecs.Protocol.TCP,
    });

    // ============================================
    // ECS Services
    // ============================================

    const backendService = new ecs.FargateService(this, 'BackendService', {
      cluster: cluster,
      taskDefinition: backendTaskDefinition,
      serviceName: 'campusprint-backend',
      desiredCount: 1,
      assignPublicIp: true,
      circuitBreaker: {
        rollback: true,
      },
    });

    // Configure Auto Scaling
    const backendScaling = backendService.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 2,
    });

    backendScaling.scaleOnCpuUtilization('BackendCpuScaling', {
      targetUtilizationPercent: 70,
    });

    backendScaling.scaleOnMemoryUtilization('BackendMemoryScaling', {
      targetUtilizationPercent: 80,
    });

    const frontendService = new ecs.FargateService(this, 'FrontendService', {
      cluster: cluster,
      taskDefinition: frontendTaskDefinition,
      serviceName: 'campusprint-frontend',
      desiredCount: 1,
      assignPublicIp: true,
      circuitBreaker: {
        rollback: true,
      },
    });

    // Configure Auto Scaling for Frontend
    const frontendScaling = frontendService.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 2,
    });

    frontendScaling.scaleOnCpuUtilization('FrontendCpuScaling', {
      targetUtilizationPercent: 70,
    });

    // ============================================
    // CloudWatch Alarms
    // ============================================

    new cloudwatch.Alarm(this, 'BackendTaskFailureAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'ECS/ContainerInsights',
        metricName: 'TaskCount',
        statistic: 'Average',
        dimensions: {
          ServiceName: 'campusprint-backend',
          ClusterName: 'campusprint-cluster',
        },
      }),
      threshold: 0,
      evaluationPeriods: 2,
      alarmDescription: 'Alert when backend ECS tasks are down',
    });

    new cloudwatch.Alarm(this, 'BackendHighCpuAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'ECS/ContainerInsights',
        metricName: 'CpuUtilized',
        statistic: 'Average',
        dimensions: {
          ServiceName: 'campusprint-backend',
          ClusterName: 'campusprint-cluster',
        },
      }),
      threshold: 70,
      evaluationPeriods: 2,
      alarmDescription: 'Alert when backend CPU exceeds 70%',
    });

    // ============================================
    // Outputs
    // ============================================

    new cdk.CfnOutput(this, 'BackendRepoUri', {
      value: backendRepo.repositoryUri,
      description: 'Backend ECR Repository URI',
    });

    new cdk.CfnOutput(this, 'FrontendRepoUri', {
      value: frontendRepo.repositoryUri,
      description: 'Frontend ECR Repository URI',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      description: 'Users DynamoDB Table Name',
    });

    new cdk.CfnOutput(this, 'OrdersTableName', {
      value: ordersTable.tableName,
      description: 'Orders DynamoDB Table Name',
    });

    new cdk.CfnOutput(this, 'FilesBucketName', {
      value: filesBucket.bucketName,
      description: 'S3 Bucket for file storage',
    });

    new cdk.CfnOutput(this, 'JwtSecretArn', {
      value: jwtSecret.secretArn,
      description: 'JWT Secret ARN in Secrets Manager',
    });

    new cdk.CfnOutput(this, 'BackendLogGroupName', {
      value: backendLogGroup.logGroupName,
      description: 'CloudWatch Log Group for Backend',
    });

    new cdk.CfnOutput(this, 'FrontendLogGroupName', {
      value: frontendLogGroup.logGroupName,
      description: 'CloudWatch Log Group for Frontend',
    });
  }
}
