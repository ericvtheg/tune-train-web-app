# Tune Train

A webapp built to find and connect with upcoming artists!

## Technologies Used

### Libraries / Frameworks

* Prisma for database access and schema management
* GraphQL for efficient client querying
* NestJS for inversion of control and other QoL features
* PassportJs for password management

### Cloud Infrastructure

* s3 for mp3 file storage
* SES for email correspondence
* SQS for ingestion queueing
* containers to run the application
* ECS for container scaling
* RDS for database
* VPCs for network security

Network Diagram \
![NetWork Diagram](./Tune%20Train%20-%20Cloud%20Infra.png)

## Getting Started

I use tflocal + localstack in order to create aws infrastructure locally (such as s3 & SQS). \
In order to use tflocal and localstack you'll need Python.

To install tflocal

```bash
pip install terraform-local
```

To run app

```bash
npm i
npm run start:dev
```