# Week 12: Day 3 - E2E Testing with Playwright

**Duration:** 2.5 hours  
**Difficulty:** ⭐⭐⭐⭐ (Advanced)  
**Prerequisites:** Week 12 Days 1-2

---

## 📚 Learning Objectives

By the end of this lesson, you'll be able to:
- ✅ Set up Playwright for E2E testing
- ✅ Write E2E test scenarios
- ✅ Test complete user workflows
- ✅ Handle browser interactions
- ✅ Debug failed tests

---

## 1️⃣ Playwright Setup

### Installation

```bash
npm install --save-dev @playwright/test
npx playwright install

# Install browsers
npx playwright install chromium firefox webkit
```

### Configuration

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 2️⃣ Writing E2E Tests

### Basic Test

```javascript
// e2e/home.spec.js
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  await expect(page).toHaveTitle(/Home/);
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### Navigating Pages

```javascript
test('navigate between pages', async ({ page }) => {
  await page.goto('/');
  
  // Click link
  await page.click('a[href="/about"]');
  
  // Verify URL changed
  await expect(page).toHaveURL('/about');
  
  // Verify page content
  await expect(page.locator('h1')).toContainText('About');
});
```

---

## 3️⃣ User Interactions

### Forms & Input

```javascript
test('submit form', async ({ page }) => {
  await page.goto('/signup');
  
  // Fill form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'SecurePass123!');
  
  // Check checkbox
  await page.check('input[name="agree"]');
  
  // Submit
  await page.click('button:has-text("Sign Up")');
  
  // Wait for navigation
  await page.waitForURL('/dashboard');
  
  // Verify success
  await expect(page.locator('text=Welcome')).toBeVisible();
});
```

### Complex Interactions

```javascript
test('table operations', async ({ page }) => {
  await page.goto('/users');
  
  // Get table rows
  const rows = page.locator('tbody tr');
  const count = await rows.count();
  expect(count).toBeGreaterThan(0);
  
  // Click action in first row
  await rows.first().locator('button:has-text("Edit")').click();
  
  // Fill edit form
  await page.fill('input[name="name"]', 'Updated Name');
  await page.click('button:has-text("Save")');
  
  // Verify update
  await expect(page.locator('text=Updated')).toBeVisible();
});
```

---

## 4️⃣ Login & Authentication

### Authentication Setup

```javascript
// auth.setup.js
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button:has-text("Login")');
  
  // Save auth state
  await page.context().storageState({ path: 'auth.json' });
});
```

### Using Authentication

```javascript
import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth.json' });

test('authenticated user views dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page.locator('h1')).toContainText('Dashboard');
  await expect(page.locator('text=Logged in')).toBeVisible();
});
```

---

## 5️⃣ Advanced Testing

### Waiting for Elements

```javascript
test('wait for dynamic content', async ({ page }) => {
  await page.goto('/');
  
  // Wait for API response
  await page.waitForResponse(response => 
    response.url().includes('/api/data') && response.status() === 200
  );
  
  // Wait for element
  await page.waitForSelector('[data-testid="content"]');
  
  // Wait for specific condition
  await page.waitForFunction(() => {
    return document.querySelectorAll('li').length > 5;
  });
});
```

### Handling Dialogs

```javascript
test('handle alerts and dialogs', async ({ page }) => {
  // Listen for dialog
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.accept();
  });
  
  // Click button that triggers dialog
  await page.click('button:has-text("Delete")');
});
```

### Taking Screenshots

```javascript
test('take screenshots', async ({ page }) => {
  await page.goto('/');
  
  // Full page screenshot
  await page.screenshot({ path: 'full.png' });
  
  // Element screenshot
  await page.locator('header').screenshot({ path: 'header.png' });
  
  // Viewport size
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.screenshot({ path: 'desktop.png' });
});
```

---

## 6️⃣ Running Tests

### Command Line

```bash
# Run all tests
npx playwright test

# Run single file
npx playwright test e2e/home.spec.js

# Run in headed mode (see browser)
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Run with UI
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

---

## 📝 Practice Exercises

### Exercise 1: Complete Workflow
Test user signup → login → dashboard flow

### Exercise 2: Form Validation
Test form with various inputs and errors

### Exercise 3: Navigation
Test all page navigation paths

### Exercise 4: Error Scenarios
Test error conditions and edge cases

---

## ✅ Summary

- **Playwright** automates cross-browser testing
- **Locators** find elements reliably
- **User actions** simulate real usage
- **Authentication** handles login workflows
- **Waiting** handles async operations
- **Debugging** with UI and headed mode

---

## 🔗 Next Steps

**Tomorrow (Day 4):** CI/CD Pipelines  
**Continue:** Automate your testing!

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

