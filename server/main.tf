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

resource "aws_alb" "main" {
  name            = var.app_name
  subnets         = module.vpc.public_subnets
  security_groups = ["${aws_security_group.lb.id}"]
}

resource "aws_alb_target_group" "main" {
  name        = var.app_name
  port        = 80
  protocol    = "HTTP"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
}

# ALB Security group
# This is the group you need to edit if you want to restrict access to your application
resource "aws_security_group" "lb" {
  name        = "tf-ecs-alb"
  description = "controls access to the alb"
  vpc_id      = module.vpc.vpc_id

  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# Traffic to the ECS Cluster should only come from the ALB
resource "aws_security_group" "ecs_tasks" {
  name        = "tf-ecs-tasks"
  description = "allow inbound access from the ALB only"
  vpc_id      = module.vpc.vpc_id

  ingress {
    protocol        = "tcp"
    from_port       = 3000
    to_port         = 3000
    security_groups = ["${aws_security_group.lb.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

module "a" {
  source = "./modules/ecs-autoscaling"

  subnets           = module.vpc.private_subnets
  security_groups   = aws_security_group.ecs_tasks.id
  target_group_arn  = aws_alb_target_group.main.id
  load_balancer_arn = aws_alb.main.id

  ecs_cluster_id                 = aws_ecs_cluster.main.id
  ecs_cluster_name               = aws_ecs_cluster.main.name
  ecs_service_name               = "app"
  ecs_task_image                 = "177188985094.dkr.ecr.us-east-1.amazonaws.com/example/nest:latest"
  ecs_task_port                  = 3000
  ecs_compute_cpu                = 256
  ecs_compute_memory             = 512
  autoscaling_min_instances      = 2
  autoscaling_max_instances      = 5
  autoscaling_cpu_low_threshold  = 40
  autoscaling_cpu_high_threshold = 60
}

### ECS

resource "aws_ecs_cluster" "main" {
  name = "app-cluster"
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


# private subnet
# rds
# ec2

# services:
# s3