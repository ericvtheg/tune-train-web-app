terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

variable "access_key" {}

variable "secret_access_key" {}

variable "stage" {}

variable "service" {
  type    = string
  default = "tune-train"
}

# uses terra-user credentials
provider "aws" {
  region     = "us-east-1"
  access_key = var.access_key
  secret_key = var.secret_access_key
}

module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "primary-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a"]
  private_subnets = ["10.0.1.0/24"]
  public_subnets  = ["10.0.101.0/24"]

  enable_nat_gateway     = true
  one_nat_gateway_per_az = true
}

#security groups

# elastic load balancer

# ecs w/ ec2(for free tier?) (in private subnet)
  # cluster
  # task

# rds (in private subnet)

resource "aws_s3_bucket" "song-bucket" {
  bucket = "songs-${var.stage}"
}



# secrets

# cloudwatch monitor / healthcheck
# cdn
# roles
  # github actions roles
  # nestjs role


#github 
# action roles
# linting
# running tests


# elb

# private subnet
# rds
# ec2

# services:
# s3