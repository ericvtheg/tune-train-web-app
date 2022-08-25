terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"

    }
  }

  backend "s3" {
    bucket                  = "tune-train-terraform-state"
    key                     = "tfstate"
    region                  = "us-east-1"
    profile                 = "default"
    encrypt                 = "true"
    dynamodb_table          = "tune-train-terraform-state-dynamodb"
    shared_credentials_file = "$HOME/.aws/credentials"
  }
}

# uses terra-user credentials
provider "aws" {
  region = var.aws_region
}

module "ecs_vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = "${local.prefix}-vpc"
  cidr = local.vpc_cidr

  azs             = var.azs
  private_subnets = var.private_subnets
  public_subnets  = var.public_subnets

  enable_nat_gateway     = true
  enable_dns_hostnames   = true
  one_nat_gateway_per_az = true

  tags = local.common_tags
}