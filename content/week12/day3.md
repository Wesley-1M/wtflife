# Week 12: Day 3 - Cloud Architecture

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐

---

## Learning Objectives

By the end of this day, you should:
- Understand cloud platforms (AWS, GCP, Azure)
- Know cloud deployment options
- Be able to design cloud architecture
- Understand serverless computing

## Topics

- Cloud providers comparison
- EC2 instances
- Container services (ECS, GKE)
- Serverless (Lambda, Cloud Functions)
- Managed databases
- CDN and storage

## Cloud Providers Overview

### AWS (Amazon Web Services)
- **Pros:** Market leader, extensive services, good pricing
- **Cons:** Complex, steeper learning curve
- **Best for:** Enterprise, complex architecture

### Google Cloud Platform (GCP)
- **Pros:** Good data analytics, clean interface, competitive pricing
- **Cons:** Smaller ecosystem
- **Best for:** Data science, startups

### Azure
- **Pros:** Good Microsoft integration, enterprise support
- **Cons:** More expensive, smaller market share
- **Best for:** Microsoft shops, enterprise

## Deployment Options

### 1. Virtual Machines (EC2)

```javascript
// Node.js on EC2 with PM2
const pm2 = require('pm2');

pm2.connect((err) => {
  if (err) process.exit(2);
  
  pm2.start({
    script: 'app.js',
    instances: 4,
    exec_mode: 'cluster'
  }, (err) => {
    if (err) pm2.disconnect();
  });
});

// Auto-scaling group can manage instances
```

### 2. Container Services

```yaml
# Deploy on AWS ECS with Docker
version: '3.8'

services:
  app:
    image: myapp:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

### 3. Serverless (AWS Lambda)

```javascript
// AWS Lambda function
exports.handler = async (event) => {
  const { userId } = event;
  
  try {
    const user = await fetchUser(userId);
    return {
      statusCode: 200,
      body: JSON.stringify(user)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// Trigger from API Gateway
module.exports.createUserHandler = async (event) => {
  const { email, password } = JSON.parse(event.body);
  
  // Validate
  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing fields' })
    };
  }
  
  // Create user
  const user = await User.create({ email, password });
  
  return {
    statusCode: 201,
    body: JSON.stringify(user)
  };
};
```

## Cloud Architecture Pattern

```
Client
  ↓
CDN (CloudFront)
  ↓
Load Balancer (ELB)
  ↓
  ├→ App Server 1 (EC2)
  ├→ App Server 2 (EC2)
  └→ App Server 3 (EC2)
  ↓
  ├→ Database (RDS)
  ├→ Cache (ElastiCache)
  └→ File Storage (S3)
```

## AWS Services Overview

```javascript
// S3: File Storage
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

async function uploadFile(filename, data) {
  const params = {
    Bucket: 'my-bucket',
    Key: filename,
    Body: data,
    ContentType: 'application/json'
  };
  
  return s3.upload(params).promise();
}

// RDS: Managed Database
const mysql = require('mysql2/promise');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const results = await connection.query('SELECT * FROM users');

// ElastiCache: Managed Redis
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379
});

await client.set('key', 'value', 'EX', 3600);
const value = await client.get('key');

// SQS: Message Queue
const sqs = new AWS.SQS();

async function sendMessage(message) {
  return sqs.sendMessage({
    QueueUrl: process.env.QUEUE_URL,
    MessageBody: JSON.stringify(message)
  }).promise();
}

// SNS: Notifications
const sns = new AWS.SNS();

async function sendNotification(email, message) {
  return sns.publish({
    TopicArn: process.env.TOPIC_ARN,
    Subject: 'Notification',
    Message: message
  }).promise();
}
```

## Auto-Scaling Configuration

```yaml
# AWS Auto Scaling
AWSTemplateFormatVersion: '2010-09-09'

Resources:
  LaunchTemplate:
    Type: AWS::EC2::LaunchTemplate
    Properties:
      LaunchTemplateData:
        ImageId: ami-12345
        InstanceType: t3.medium
        UserData:
          Fn::Base64: |
            #!/bin/bash
            npm install
            npm start

  AutoScalingGroup:
    Type: AWS::AutoScaling::AutoScalingGroup
    Properties:
      LaunchTemplate:
        LaunchTemplateId: !Ref LaunchTemplate
      MinSize: 2
      MaxSize: 10
      DesiredCapacity: 4
      TargetGroupARNs:
        - !Ref LoadBalancerTargetGroup

  ScalingPolicy:
    Type: AWS::AutoScaling::ScalingPolicy
    Properties:
      AdjustmentType: ChangeInCapacity
      AutoScalingGroupName: !Ref AutoScalingGroup
      PolicyType: TargetTrackingScaling
      TargetTrackingConfiguration:
        PredefinedMetricSpecification:
          PredefinedMetricType: ASGAverageCPUUtilization
        TargetValue: 70
```

## Serverless Architecture

```javascript
// API Gateway → Lambda → DynamoDB

// Lambda function
exports.handler = async (event) => {
  const AWS = require('aws-sdk');
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  
  if (event.httpMethod === 'GET') {
    const result = await dynamodb.scan({
      TableName: 'users'
    }).promise();
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items)
    };
  }
  
  if (event.httpMethod === 'POST') {
    const user = JSON.parse(event.body);
    await dynamodb.put({
      TableName: 'users',
      Item: user
    }).promise();
    
    return {
      statusCode: 201,
      body: JSON.stringify(user)
    };
  }
};

// Infrastructure as Code (Terraform)
resource "aws_lambda_function" "api" {
  filename      = "lambda.zip"
  function_name = "my-api"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs18.x"
}

resource "aws_apigatewayv2_api" "api" {
  name          = "my-api"
  protocol_type = "HTTP"
}
```

## Cost Optimization

```
- Use spot instances (70% savings)
- Right-size instances
- Use reserved instances for baseline
- Implement auto-scaling
- Clean up unused resources
- Monitor with CloudWatch
- Use CDN for static content
- Archive old data to S3 Glacier
```

## ✅ Checkpoint

- [ ] Understand cloud platforms
- [ ] Know deployment options
- [ ] Can design cloud architecture
- [ ] Understand serverless
- [ ] Know cost optimization

**Next:** Team Collaboration! 👥

