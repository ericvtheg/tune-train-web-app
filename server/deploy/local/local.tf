
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
    sns = "http://localhost:4566"
  }
}

variable "stage" {
  type    = string
  default = "local"
}

# SQS
resource "aws_sqs_queue" "tune-train-sqs-queue" {
  name      =   "tune-train-listen-sqs-queue-${var.stage}"
}

# sns
resource "aws_sns_topic" "tune-train-sns-topic" {
  name      =   "tune-train-listen-sns-topic-${var.stage}"
}

resource "aws_sns_topic_subscription" "tune-train-listen-sqs-target" {
  topic_arn = aws_sns_topic.tune-train-sns-topic.arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.tune-train-sqs-queue.arn
}

# S3 
resource "aws_s3_bucket" "tune-train-songs-bucket" {
  bucket = "tune-train-song-bucket-${var.stage}"
}
