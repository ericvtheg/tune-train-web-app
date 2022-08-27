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

### VPC

module "vpc" {
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

### ECR

resource "aws_ecr_repository" "tune-train" {
  name                 = "${local.prefix}-repo-${var.stage}"
  image_tag_mutability = "MUTABLE"
  tags = local.common_tags
  force_delete = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

### ECS

### RDS

resource "aws_db_subnet_group" "tune-train-db-subnet-group" {
  name = "${local.prefix}-db-subnet-group"

  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

resource "aws_db_instance" "tune-train" {
  depends_on = [module.vpc, resource.aws_db_subnet_group.tune-train-db-subnet-group]

  allocated_storage           = 5
  max_allocated_storage       = 20
  allow_major_version_upgrade = false
  identifier = "${local.prefix}-${var.stage}"
  availability_zone           = var.azs[0]
  engine                      = "postgres"
  engine_version              = "14.4"
  instance_class              = "db.t4g.micro"
  skip_final_snapshot         = true
  tags                        = local.common_tags
  performance_insights_enabled = true
  performance_insights_retention_period = 7

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  port     = var.db_port


  db_subnet_group_name = aws_db_subnet_group.tune-train-db-subnet-group.name
  # vpc_security_group_ids = [module.vpc.vpc_id] TODO add security groups
  # security_group_names =
}
