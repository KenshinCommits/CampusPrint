variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "325355906800"
}

variable "app_name" {
  description = "Application name"
  type        = string
  default     = "campusprint"
}

variable "backend_image_uri" {
  description = "Backend Docker image URI in ECR"
  type        = string
}

variable "frontend_image_uri" {
  description = "Frontend Docker image URI in ECR"
  type        = string
}

variable "backend_cpu" {
  description = "CPU units for backend ECS task (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "backend_memory" {
  description = "Memory MB for backend ECS task"
  type        = number
  default     = 512
}

variable "frontend_cpu" {
  description = "CPU units for frontend ECS task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory MB for frontend ECS task"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 1
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 1
}

variable "dynamodb_billing_mode" {
  description = "DynamoDB billing mode (PAY_PER_REQUEST or PROVISIONED)"
  type        = string
  default     = "PAY_PER_REQUEST"
}

variable "log_retention_days" {
  description = "CloudWatch Logs retention in days"
  type        = number
  default     = 7
}

variable "jwt_secret_length" {
  description = "JWT secret length"
  type        = number
  default     = 32
}
