terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"

    }
  }

  backend "s3" {
    bucket                  = "tune-train-terraform-state-bucket"
    key                     = "tfstate"
    region                  = "us-east-2"
    profile                 = "default"
    encrypt                 = "true"
    dynamodb_table          = "tune-train-terraform-state"
    shared_credentials_file = "$HOME/.aws/credentials"
  }
}

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

  # don't think I need nat_gateway (at least not always)
  enable_nat_gateway     = true
  enable_dns_hostnames   = true
  one_nat_gateway_per_az = true

  tags = local.common_tags
}

### ECR

resource "aws_ecr_repository" "tune-train" {
  name                 = "${local.prefix}-repo-${var.stage}"
  image_tag_mutability = "MUTABLE"
  tags                 = local.common_tags
  force_delete         = true

  image_scanning_configuration {
    scan_on_push = true
  }
}

### IAM

resource "aws_iam_role" "ecs_agent" {
  name               = "${local.prefix}-execution-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_agent.json
  tags               = local.common_tags
}

data "aws_iam_policy_document" "ecs_agent" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "ecs_agent" {
  role       = aws_iam_role.ecs_agent.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs_agent" {
  name = "ecs-agent"
  role = aws_iam_role.ecs_agent.name
}

### Security Group

### Cloudwatch

resource "aws_cloudwatch_log_group" "log-group" {
  name = "${local.prefix}-${var.stage}-logs"
  tags = local.common_tags
}


### Autoscaling

# Launch Template
data "aws_ami" "aws_optimized_ecs" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn-ami*amazon-ecs-optimized"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["591542846629"] # AWS
}

resource "aws_launch_configuration" "tune-train-launch-config" {
  name          = "${local.prefix}-${var.stage}-launch-config"
  image_id      = data.aws_ami.aws_optimized_ecs.id
  instance_type = "t2.micro"

  lifecycle {
    create_before_destroy = true
  }

  user_data = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${local.prefix}-${var.stage}-cluster >> /etc/ecs/ecs.config
EOF

  # security_groups = [module.ec2_sg.security_group_id]

  # key_name             = aws_key_pair.ecs.key_name
  iam_instance_profile = aws_iam_instance_profile.ecs_agent.arn
}

resource "aws_autoscaling_group" "tune-train-asg" {
  depends_on = [module.vpc, resource.aws_launch_configuration.tune-train-launch-config]
  name       = resource.aws_launch_configuration.tune-train-launch-config.name

  termination_policies      = ["OldestInstance"]
  default_cooldown          = 30
  health_check_grace_period = 30

  launch_configuration = aws_launch_configuration.tune-train-launch-config.name
  min_size             = 1
  max_size             = 2 #todo bump this eventually

  lifecycle {
    create_before_destroy = true
  }

  vpc_zone_identifier = module.vpc.private_subnets
}

### ECS

resource "aws_ecs_cluster" "tune-train-cluster" {
  name = "${local.prefix}-${var.stage}-cluster"
  tags = local.common_tags
}

# ECS task

resource "aws_ecs_task_definition" "task_definition" {
  family             = "${local.prefix}-${var.stage}"
  execution_role_arn = "arn:aws:iam::516207173224:role/ecsTaskExecutionRole"
  cpu                = 512
  memory             = 1024
  container_definitions = jsonencode([
    {
      name      = "${local.prefix}-${var.stage}"
      image     = "516207173224.dkr.ecr.${local.aws_region}.amazonaws.com/${local.prefix}-repo-${var.stage}:35f786658ef3777f230e20afd2df50c01dae1a18"
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
  tags = merge(
    local.common_tags,
    {
      Name = "${local.prefix}-${var.stage}"
    }
  )
}

# ECS service

resource "aws_ecs_service" "tune-train" {
  name            = var.service
  task_definition = aws_ecs_task_definition.task_definition.arn
  cluster         = aws_ecs_cluster.tune-train-cluster.id
  desired_count   = 1
}

### ALB

### RDS

resource "aws_db_subnet_group" "tune-train-db-subnet-group" {
  name = "${local.prefix}-db-subnet-group"

  subnet_ids = module.vpc.private_subnets

  tags = local.common_tags
}

resource "aws_db_instance" "tune-train" {
  depends_on = [module.vpc, resource.aws_db_subnet_group.tune-train-db-subnet-group]

  allocated_storage                     = 5
  max_allocated_storage                 = 20
  allow_major_version_upgrade           = false
  identifier                            = "${local.prefix}-${var.stage}"
  availability_zone                     = var.azs[0]
  engine                                = "postgres"
  engine_version                        = "14.4"
  instance_class                        = "db.t4g.micro"
  skip_final_snapshot                   = true
  tags                                  = local.common_tags
  performance_insights_enabled          = true
  performance_insights_retention_period = 7

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password


  db_subnet_group_name = aws_db_subnet_group.tune-train-db-subnet-group.name
  # vpc_security_group_ids = [module.vpc.vpc_id] TODO add security groups
  # security_group_names =
}
