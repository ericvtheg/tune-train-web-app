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
      identifiers = ["ecs-tasks.amazonaws.com", "ecs.amazonaws.com", "ec2.amazonaws.com"]
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

resource "aws_cloudwatch_log_group" "tune-train-log-group" {
  name = "${local.prefix}-${var.stage}-logs"
  tags = local.common_tags
}


### Autoscaling

# AMI
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
  name_prefix          = "${local.prefix}-${var.stage}-launch-config-"
  image_id             = data.aws_ami.aws_optimized_ecs.id
  instance_type        = "t2.micro"
  iam_instance_profile = aws_iam_instance_profile.ecs_agent.arn

  lifecycle {
    create_before_destroy = true
  }


  user_data = <<EOF
#!/bin/bash
echo ECS_CLUSTER=${local.prefix}-${var.stage}-cluster >> /etc/ecs/ecs.config
EOF

  # security_groups = [module.ec2_sg.security_group_id]

  key_name             = "eric"

}

resource "aws_autoscaling_group" "tune-train-asg" {
  depends_on  = [module.vpc, resource.aws_launch_configuration.tune-train-launch-config]
  name_prefix = resource.aws_launch_configuration.tune-train-launch-config.name_prefix

  termination_policies      = ["OldestInstance"]
  default_cooldown          = 30
  health_check_grace_period = 30

  launch_configuration = aws_launch_configuration.tune-train-launch-config.name
  min_size             = 1
  max_size             = 2 #todo bump this eventually

  lifecycle {
    create_before_destroy = true
  }

  vpc_zone_identifier = module.vpc.public_subnets
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
      image     = "516207173224.dkr.ecr.${local.aws_region}.amazonaws.com/${local.prefix}-repo-${var.stage}:74040205e36a01e5531b8d8c210d8ba41b8c951e" # todo dont hardcode github sha here
      cpu       = 512
      memory    = 1024
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          "awslogs-group"         = "${resource.aws_cloudwatch_log_group.tune-train-log-group.name}"
          "awslogs-region"        = "us-east-2"
          "awslogs-stream-prefix" = "ecs"
        }

      }
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

  load_balancer {
    target_group_arn = aws_alb_target_group.tune-train-alb-target-group.arn
    container_name   = aws_ecs_task_definition.task_definition.family
    container_port   = 3000
  }
}


### S3 
# songs bucket

# alb logs bucket
resource "aws_s3_bucket" "alb-logs-bucket" {
  bucket = "alb-logs-bucket-41231"

  tags = local.common_tags
}

### ALB

resource "aws_alb" "tune-train-alb" {
  depends_on = [module.vpc]

  name               = "${local.prefix}-alb-${var.stage}"
  internal           = false
  load_balancer_type = "application"
  # security_groups    = [aws_security_group.lb_sg.id]
  subnets = module.vpc.public_subnets

  enable_deletion_protection = false

  access_logs {
    bucket  = aws_s3_bucket.alb-logs-bucket.bucket
    prefix  = "tune-train-alb"
    enabled = true
  }

  tags = local.common_tags
}

resource "aws_alb_target_group" "tune-train-alb-target-group" {
  name     = "${local.prefix}-alb-tg-${var.stage}"
  port     = 3000
  protocol = "HTTP"
  vpc_id   = module.vpc.vpc_id

  tags = local.common_tags
}

resource "aws_lb_listener" "tune-train-backend" {
  load_balancer_arn = aws_alb.tune-train-alb.arn
  port              = 3000
  protocol          = "HTTP"
  # acm certificate
  # listener certificate
  # ssl_policy        = "ELBSecurityPolicy-2016-08"
  # certificate_arn   = "arn:aws:iam::187416307283:server-certificate/test_cert_rab3wuqwgja25ct3n4jdj2tzu4"

  default_action {
    type             = "forward"
    target_group_arn = aws_alb_target_group.tune-train-alb-target-group.arn
  }

  tags = local.common_tags
}



### CloudFront

#prevent ddos attack
# cache popular songs near edge?

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
