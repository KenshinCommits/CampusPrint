# S3 Bucket for file storage
resource "aws_s3_bucket" "files" {
  bucket = "campusprint-files-${var.aws_account_id}-${var.aws_region}"

  tags = {
    Name = "campusprint-files"
  }
}

resource "aws_s3_bucket_versioning" "files" {
  bucket = aws_s3_bucket.files.id

  versioning_configuration {
    status = "Disabled"
  }
}

resource "aws_s3_bucket_public_access_block" "files" {
  bucket = aws_s3_bucket.files.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.s3.arn
    }
  }
}

# S3 Lifecycle policy - intelligent tiering and expiration
resource "aws_s3_bucket_lifecycle_configuration" "files" {
  bucket = aws_s3_bucket.files.id

  rule {
    id     = "delete-old-files"
    status = "Enabled"

    expiration {
      days = 30
    }

    transition {
      days          = 1
      storage_class = "INTELLIGENT_TIERING"
    }
  }
}

# KMS Key for S3 encryption
resource "aws_kms_key" "s3" {
  description             = "KMS key for CampusPrint S3 encryption"
  deletion_window_in_days = 10
  enable_key_rotation     = true

  tags = {
    Name = "campusprint-s3-key"
  }
}

resource "aws_kms_alias" "s3" {
  name          = "alias/campusprint-s3"
  target_key_id = aws_kms_key.s3.key_id
}
