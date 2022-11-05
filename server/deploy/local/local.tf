
provider "aws" {
  region                      = "us-east-2"
  access_key                  = "xxxx"
  secret_key                  = "xxxx"
  s3_use_path_style         = true # not sure if I need this
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  endpoints {
    sqs = "http://localhost:4566"
    s3 = "http://localhost:4566"
  }
}

# Create SQS
resource "aws_sqs_queue" "queue" {
  name      =   "tune-train-listens-queue-sqs"
}

### S3 
resource "aws_s3_bucket" "tune-train-songs-bucket" {
  bucket = "tune-train-songs-bucket"
}
