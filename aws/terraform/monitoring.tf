# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/campusprint-backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "campusprint-backend"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/campusprint-frontend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "campusprint-frontend"
  }
}

# Secrets Manager
resource "aws_secretsmanager_secret" "jwt_secret" {
  name                    = "campusprint/jwt-secret"
  description             = "JWT secret for CampusPrint backend"
  recovery_window_in_days = 7

  tags = {
    Name = "campusprint-jwt-secret"
  }
}

resource "aws_secretsmanager_secret_version" "jwt_secret" {
  secret_id = aws_secretsmanager_secret.jwt_secret.id
  secret_string = jsonencode({
    jwt_secret = random_password.jwt_secret.result
  })
}

resource "random_password" "jwt_secret" {
  length  = var.jwt_secret_length
  special = true
}

# Data source for default VPC
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# Security Group for ECS
resource "aws_security_group" "ecs" {
  name        = "campusprint-ecs-sg"
  description = "Security group for CampusPrint ECS tasks"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 4000
    to_port     = 4000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "campusprint-ecs-sg"
  }
}
