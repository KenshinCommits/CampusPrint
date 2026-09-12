output "backend_repository_uri" {
  description = "Backend ECR repository URI"
  value       = aws_ecr_repository.backend.repository_uri
}

output "frontend_repository_uri" {
  description = "Frontend ECR repository URI"
  value       = aws_ecr_repository.frontend.repository_uri
}

output "users_table_name" {
  description = "Users DynamoDB table name"
  value       = aws_dynamodb_table.users.name
}

output "orders_table_name" {
  description = "Orders DynamoDB table name"
  value       = aws_dynamodb_table.orders.name
}

output "files_bucket_name" {
  description = "S3 bucket for file storage"
  value       = aws_s3_bucket.files.bucket
}

output "files_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.files.arn
}

output "jwt_secret_arn" {
  description = "JWT secret ARN in Secrets Manager"
  value       = aws_secretsmanager_secret.jwt_secret.arn
}

output "backend_log_group_name" {
  description = "CloudWatch log group for backend"
  value       = aws_cloudwatch_log_group.backend.name
}

output "frontend_log_group_name" {
  description = "CloudWatch log group for frontend"
  value       = aws_cloudwatch_log_group.frontend.name
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "backend_service_name" {
  description = "Backend ECS service name"
  value       = aws_ecs_service.backend.name
}

output "frontend_service_name" {
  description = "Frontend ECS service name"
  value       = aws_ecs_service.frontend.name
}

output "security_group_id" {
  description = "ECS security group ID"
  value       = aws_security_group.ecs.id
}
