# HTD-X Database Schema Design

## Overview

The database uses MySQL with Prisma ORM for type-safe access.

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────────┐
│    User     │────────▶│  RefreshToken│         │EmailVerific. │
│             │         │              │         │              │
│ - id (PK)   │         │ - id (PK)    │         │ - id (PK)    │
│ - email     │         │ - userId (FK)│         │ - userId (FK)│
│ - username  │         │ - token      │         │ - token      │
│ - password  │         │ - expiresAt  │         │ - expiresAt  │
│ - role      │         │              │         │              │
│ - plan      │         └──────────────┘         └──────────────┘
│ - status    │
└─────────────┘
      │
      │ 1:N
      ▼
 ┌──────────────┐
 │     Bot      │         ┌──────────────┐
 │              │────────▶│  Deployment  │
 │ - id (PK)    │         │              │
 │ - userId (FK)│         │ - id (PK)    │
 │ - name       │         │ - botId (FK) │
 │ - status     │         │ - status     │
 │ - startFile  │         │ - pm2Id      │
 │ - createdAt  │         │ - timestamp  │
 └──────────────┘         │ - uptime     │
      │                  └──────────────┘
      │
      │ 1:N
      ▼
 ┌──────────────────┐
 │  ActivityLog     │
 │                  │
 │ - id (PK)        │
 │ - userId (FK)    │
 │ - botId (FK)     │
 │ - action         │
 │ - details        │
 │ - timestamp      │
 └──────────────────┘

┌──────────────┐
│SubscriptionPlan│
 │              │
 │ - id (PK)    │
 │ - name       │
 │ - maxBots    │
 │ - ramPerBot  │
 │ - price      │
 └──────────────┘

┌──────────────┐
│ PasswordReset│
 │              │
 │ - id (PK)    │
 │ - userId (FK)│
 │ - token      │
 │ - expiresAt  │
 └──────────────┘

┌──────────────┐
│Announcement  │
 │              │
 │ - id (PK)    │
 │ - title      │
 │ - message    │
 │ - createdAt  │
 └──────────────┘
```

## Tables

### User
Stores user account information.

```sql
CREATE TABLE User (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  passwordHash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'MODERATOR', 'USER') DEFAULT 'USER',
  subscriptionPlanId VARCHAR(36),
  status ENUM('ACTIVE', 'SUSPENDED', 'DELETED') DEFAULT 'ACTIVE',
  emailVerified BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastLoginAt TIMESTAMP NULL,
  FOREIGN KEY (subscriptionPlanId) REFERENCES SubscriptionPlan(id)
);
```

### RefreshToken
Stores refresh tokens for session management.

```sql
CREATE TABLE RefreshToken (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_expiresAt (expiresAt)
);
```

### EmailVerification
Stores email verification tokens.

```sql
CREATE TABLE EmailVerification (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL UNIQUE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_expiresAt (expiresAt)
);
```

### PasswordReset
Stores password reset tokens.

```sql
CREATE TABLE PasswordReset (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  expiresAt TIMESTAMP NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_userId_expiresAt (userId, expiresAt)
);
```

### SubscriptionPlan
Stores subscription plan configurations.

```sql
CREATE TABLE SubscriptionPlan (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  maxBots INT NOT NULL,
  ramPerBotMB INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  billingCycle ENUM('MONTHLY', 'YEARLY') DEFAULT 'MONTHLY',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Bot
Stores bot information.

```sql
CREATE TABLE Bot (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('IDLE', 'RUNNING', 'STOPPED', 'ERROR') DEFAULT 'IDLE',
  startFile VARCHAR(255) NOT NULL,
  directoryPath VARCHAR(500) NOT NULL,
  pm2Id INT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deletedAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_userId (userId),
  INDEX idx_status (status),
  INDEX idx_createdAt (createdAt)
);
```

### Deployment
Stores deployment records.

```sql
CREATE TABLE Deployment (
  id VARCHAR(36) PRIMARY KEY,
  botId VARCHAR(36) NOT NULL,
  userId VARCHAR(36) NOT NULL,
  status ENUM('SUCCESS', 'FAILED', 'RUNNING') DEFAULT 'RUNNING',
  pm2Id INT NULL,
  pm2Pid INT NULL,
  uptime BIGINT DEFAULT 0,
  deploymentTimestamp TIMESTAMP NOT NULL,
  lastRestartAt TIMESTAMP NULL,
  errorMessage TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (botId) REFERENCES Bot(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
  INDEX idx_botId (botId),
  INDEX idx_userId (userId),
  INDEX idx_status (status)
);
```

### ActivityLog
Stores audit logs for all user and admin actions.

```sql
CREATE TABLE ActivityLog (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36),
  botId VARCHAR(36),
  action VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSON,
  ipAddress VARCHAR(45),
  userAgent VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id) ON DELETE SET NULL,
  FOREIGN KEY (botId) REFERENCES Bot(id) ON DELETE SET NULL,
  INDEX idx_userId (userId),
  INDEX idx_botId (botId),
  INDEX idx_createdAt (createdAt),
  INDEX idx_action (action)
);
```

### Announcement
Stores admin announcements.

```sql
CREATE TABLE Announcement (
  id VARCHAR(36) PRIMARY KEY,
  createdByUserId VARCHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  priority ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
  isPublished BOOLEAN DEFAULT FALSE,
  publishedAt TIMESTAMP NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdByUserId) REFERENCES User(id),
  INDEX idx_isPublished (isPublished),
  INDEX idx_createdAt (createdAt)
);
```

## Indexes Strategy

1. **User lookups:** `email`, `username`
2. **Time-based queries:** `createdAt`, `expiresAt`, `deploymentTimestamp`
3. **Foreign key lookups:** All FK columns
4. **Status filtering:** Bot and Deployment status columns
5. **Activity auditing:** Composite index on `(userId, createdAt)`

## Seed Data

### Default Subscription Plans

```json
[
  {
    "id": "free-plan",
    "name": "Free",
    "maxBots": 3,
    "ramPerBotMB": 512,
    "price": 0
  },
  {
    "id": "premium-plan",
    "name": "Premium",
    "maxBots": -1,
    "ramPerBotMB": 2048,
    "price": 99.99
  }
]
```

## Retention Policy

- **Activity Logs:** Retained for 90 days, then archived/deleted
- **Deleted Bots:** Soft delete with `deletedAt` timestamp for recovery
- **Expired Tokens:** Cleaned up by scheduled job (24-hour retention after expiry)
