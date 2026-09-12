#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CampusPrintStack } from './cdk-stack';

const app = new cdk.App();

// Read configuration from environment variables or defaults
const awsAccountId = process.env.AWS_ACCOUNT_ID || '325355906800';
const awsRegion = process.env.AWS_REGION || 'ap-south-1';
const environmentName = process.env.ENVIRONMENT || 'dev';

new CampusPrintStack(app, `CampusPrint-${environmentName}`, {
  env: {
    account: awsAccountId,
    region: awsRegion,
  },
  awsAccountId,
  awsRegion,
  environmentName,
  description: 'CampusPrint AWS Infrastructure Stack',
});
