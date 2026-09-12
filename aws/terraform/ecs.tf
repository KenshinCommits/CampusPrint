# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "campusprint-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "campusprint-cluster"
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "campusprint-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "campusprint-ecs-task-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Allow task execution role to read secrets
resource "aws_iam_role_policy" "ecs_task_execution_secrets" {
  name = "campusprint-ecs-task-execution-secrets"
  role = aws_iam_role.ecs_task_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "kms:Decrypt"
        ]
        Resource = [
          aws_secretsmanager_secret.jwt_secret.arn,
          "${aws_secretsmanager_secret.jwt_secret.arn}:*",
          aws_kms_key.dynamodb.arn
        ]
      }
    ]
  })
}

# IAM Role for Backend ECS Task
resource "aws_iam_role" "backend_task_role" {
  name = "campusprint-backend-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "campusprint-backend-task-role"
  }
}

# DynamoDB access for backend
resource "aws_iam_role_policy" "backend_dynamodb" {
  name = "campusprint-backend-dynamodb"
  role = aws_iam_role.backend_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:DeleteItem"
        ]
        Resource = [
          aws_dynamodb_table.users.arn,
          aws_dynamodb_table.orders.arn,
          "${aws_dynamodb_table.orders.arn}/index/*"
        ]
      }
    ]
  })
}

# S3 access for backend
resource "aws_iam_role_policy" "backend_s3" {
  name = "campusprint-backend-s3"
  role = aws_iam_role.backend_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject"
        ]
        Resource = "${aws_s3_bucket.files.arn}/*"
      }
    ]
  })
}

# CloudWatch Logs for backend
resource "aws_iam_role_policy" "backend_logs" {
  name = "campusprint-backend-logs"
  role = aws_iam_role.backend_task_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.backend.arn}:*"
      }
    ]
  })
}

# ECS Task Definition - Backend
resource "aws_ecs_task_definition" "backend" {
  family                   = "campusprint-backend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.backend_task_role.arn

  container_definitions = jsonencode([
    {
      name      = "backend"
      image     = var.backend_image_uri
      essential = true
      portMappings = [
        {
          containerPort = 4000
          hostPort      = 4000
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      environment = [
        {
          name  = "DB_DRIVER"
          value = "dynamodb"
        },
        {
          name  = "PORT"
          value = "4000"
        },
        {
          name  = "AWS_REGION"
          value = var.aws_region
        },
        {
          name  = "USERS_TABLE"
          value = aws_dynamodb_table.users.name
        },
        {
          name  = "ORDERS_TABLE"
          value = aws_dynamodb_table.orders.name
        },
        {
          name  = "RATE_BW_PER_PAGE"
          value = "2"
        },
        {
          name  = "RATE_COLOR_PER_PAGE"
          value = "8"
        },
        {
          name  = "BINDING_FEE_STAPLE"
          value = "0"
        },
        {
          name  = "BINDING_FEE_SPIRAL"
          value = "20"
        },
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "CORS_ORIGIN"
          value = "https://campusprint-frontend.local"
        }
      ]
      secrets = [
        {
          name      = "JWT_SECRET"
          valueFrom = "${aws_secretsmanager_secret.jwt_secret.arn}:jwt_secret::"
        }
      ]
      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:4000/health || exit 1"]
        interval    = 30
        timeout     = 3
        retries     = 3
        startPeriod = 5
      }
    }
  ])

  tags = {
    Name = "campusprint-backend"
  }
}

# ECS Task Definition - Frontend
resource "aws_ecs_task_definition" "frontend" {
  family                   = "campusprint-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name      = "frontend"
      image     = var.frontend_image_uri
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
          protocol      = "tcp"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      healthCheck = {
        command     = ["CMD-SHELL", "wget --quiet --tries=1 --spider http://localhost/health || exit 1"]
        interval    = 30
        timeout     = 3
        retries     = 3
        startPeriod = 5
      }
    }
  ])

  tags = {
    Name = "campusprint-frontend"
  }
}

# ECS Service - Backend
resource "aws_ecs_service" "backend" {
  name            = "campusprint-backend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  deployment_configuration {
    minimum_healthy_percent = 100
    maximum_percent         = 200
  }

  tags = {
    Name = "campusprint-backend"
  }
}

# ECS Service - Frontend
resource "aws_ecs_service" "frontend" {
  name            = "campusprint-frontend"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = true
  }

  deployment_configuration {
    minimum_healthy_percent = 100
    maximum_percent         = 200
  }

  tags = {
    Name = "campusprint-frontend"
  }
}

# Auto Scaling for Backend
resource "aws_appautoscaling_target" "backend_target" {
  max_capacity       = 2
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "backend_cpu" {
  name               = "campusprint-backend-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend_target.resource_id
  scalable_dimension = aws_appautoscaling_target.backend_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

resource "aws_appautoscaling_policy" "backend_memory" {
  name               = "campusprint-backend-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend_target.resource_id
  scalable_dimension = aws_appautoscaling_target.backend_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    target_value = 80.0
  }
}

# Auto Scaling for Frontend
resource "aws_appautoscaling_target" "frontend_target" {
  max_capacity       = 2
  min_capacity       = 1
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "frontend_cpu" {
  name               = "campusprint-frontend-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend_target.resource_id
  scalable_dimension = aws_appautoscaling_target.frontend_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend_target.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}

# CloudWatch Alarms
resource "aws_cloudwatch_metric_alarm" "backend_cpu_high" {
  alarm_name          = "campusprint-backend-cpu-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "70"
  alarm_description   = "Alert when backend CPU exceeds 70%"
  alarm_actions       = []

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }
}

resource "aws_cloudwatch_metric_alarm" "backend_memory_high" {
  alarm_name          = "campusprint-backend-memory-high"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "MemoryUtilization"
  namespace           = "AWS/ECS"
  period              = "60"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "Alert when backend memory exceeds 80%"
  alarm_actions       = []

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.backend.name
  }
}
