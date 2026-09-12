# DynamoDB Tables
resource "aws_dynamodb_table" "users" {
  name           = "campusprint-users"
  billing_mode   = var.dynamodb_billing_mode
  hash_key       = "email"
  point_in_time_recovery_specification {
    enabled = true
  }

  attribute {
    name = "email"
    type = "S"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.dynamodb.arn
  }

  tags = {
    Name = "campusprint-users"
  }
}

resource "aws_dynamodb_table" "orders" {
  name           = "campusprint-orders"
  billing_mode   = var.dynamodb_billing_mode
  hash_key       = "orderId"
  point_in_time_recovery_specification {
    enabled = true
  }

  attribute {
    name = "orderId"
    type = "S"
  }

  attribute {
    name = "userId"
    type = "S"
  }

  global_secondary_index {
    name            = "userIdIndex"
    hash_key        = "userId"
    projection_type = "ALL"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.dynamodb.arn
  }

  tags = {
    Name = "campusprint-orders"
  }
}

# KMS Key for DynamoDB encryption
resource "aws_kms_key" "dynamodb" {
  description             = "KMS key for CampusPrint DynamoDB encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name = "campusprint-dynamodb-key"
  }
}

resource "aws_kms_alias" "dynamodb" {
  name          = "alias/campusprint-dynamodb"
  target_key_id = aws_kms_key.dynamodb.key_id
}
