# HTD-X Architecture Overview

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend Application                │   │
│  │  - Authentication Pages (Login, Register, Password Reset)│   │
│  │  - Dashboard (Bot Management, Stats)                     │   │
│  │  - File Manager                                          │   │
│  │  - Environment Variable Editor                           │   │
│  │  - Bot Console (Real-time via Socket.IO)                │   │
│  │  - Admin Panel                                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                         │
│  - SSL/TLS Termination (Certbot)                               │
│  - Load Balancing                                              │
│  - Static Asset Serving                                        │
│  - Rate Limiting                                               │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Express.js Backend API (TypeScript)              │   │
│  │                                                          │   │
│  │  Routes:                                                 │   │
│  │  ├── /api/auth/* (Registration, Login, Token Refresh)   │   │
│  │  ├── /api/bots/* (Upload, Start, Stop, Delete)         │   │
│  │  ├── /api/files/* (File Manager Operations)            │   │
│  │  ├── /api/env/* (Environment Variables)                │   │
│  │  ├── /api/admin/* (Admin Operations)                   │   │
│  │  └── /api/system/* (Monitoring, Stats)                 │   │
│  │                                                          │   │
│  │  Middleware:                                             │   │
│  │  ├── Authentication (JWT Verification)                 │   │
│  │  ├── Authorization (Role-Based Access Control)         │   │
│  │  ├── Validation (Input Sanitization)                   │   │
│  │  ├── Rate Limiting                                      │   │
│  │  └── Error Handling                                     │   │
│  │                                                          │   │
│  │  Socket.IO Namespace:                                   │   │
│  │  └── /console/* (Real-time bot logs)                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  MySQL Database  │  │   PM2 Manager    │  │  File System     │
│                  │  │                  │  │                  │
│  Prisma ORM      │  │  - Bot Processes │  │  /var/www/htdx/  │
│  ├── Users       │  │  - Process Logs  │  │  ├── users/      │
│  ├── Bots        │  │  - Status        │  │  │  ├── {uid}/   │
│  ├── Deployments │  │                  │  │  │  │  └── bots/ │
│  ├── Plans       │  │                  │  │  │  │     ├── {bid}/
│  └── Audit Logs  │  └──────────────────┘  │  │  │     │  ├── src/
│                  │                        │  │  │     │  ├── package.json
│                  │                        │  │  │     │  └── .env
│                  │                        │  │  │     └── ...
│                  │                        │  │  ├── temp/
│                  │                        │  │  └── logs/
│                  │                        │  │
└──────────────────┘                        └──────────────────┘
```

## Data Flow

### 1. User Registration & Authentication
```
User Input → Validation → Password Hash (bcrypt) → Save to DB → JWT Token → Response
```

### 2. Bot Upload & Deployment
```
ZIP File Upload → Multer Middleware → ZIP Validation → Extract → 
Store in /var/www/htdx/users/{uid}/bots/{bid}/ → npm install → 
Generate PM2 Config → PM2 Start → Record Deployment → Response
```

### 3. Real-Time Console
```
PM2 Log Stream → Socket.IO Emit → WebSocket → Frontend Console Display
```

### 4. Resource Monitoring
```
OS Stats Query → Calculate Per-Process Usage → Socket.IO Emit → 
Frontend Charts Update (Every 5 seconds)
```

## Security Architecture

### Authentication & Authorization
- **JWT Tokens:** Short-lived access tokens (15 minutes) + long-lived refresh tokens (7 days)
- **Password Security:** bcrypt hashing with 10 salt rounds
- **Session Management:** Refresh token rotation
- **Role-Based Access Control:** Super Admin, Moderator, User roles with granular permissions

### Data Protection
- **Directory Traversal Prevention:** Path normalization and validation
- **ZIP File Validation:** Magic number verification, file count limits
- **Input Sanitization:** All user inputs validated and sanitized
- **File Access Control:** Ownership verification before any file operation
- **Environment Variable Masking:** Sensitive values masked in UI

### API Security
- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS:** Restricted to frontend domain
- **HTTPS Only:** Enforced by Nginx
- **Audit Logging:** All admin actions logged

## Database Schema Overview

See `DATABASE.md` for complete schema design.

## Service Architecture

### Backend Service Organization
```
backend/
├── src/
│   ├── index.ts                 # Entry point, Express setup
│   ├── middleware/              # Auth, validation, error handling
│   ├── routes/                  # API endpoints
│   ├── controllers/             # Request handlers
│   ├── services/                # Business logic
│   ├── repositories/            # Database access layer
│   ├── utils/                   # Helpers, validators
│   ├── types/                   # TypeScript interfaces
│   └── constants/               # Application constants
```

### Frontend Service Organization
```
frontend/
├── app/                         # Next.js app directory
├── components/                  # React components
├── hooks/                       # Custom React hooks
├── services/                    # API clients
├── utils/                       # Helper functions
├── types/                       # TypeScript types
├── styles/                      # TailwindCSS config
└── public/                      # Static assets
```

## Deployment Strategy

1. **Backend:** PM2 process manager with auto-restart on reboot
2. **Frontend:** Next.js production build with Nginx serving
3. **Database:** MySQL with automated backups
4. **SSL/TLS:** Certbot with Let's Encrypt certificates
5. **Monitoring:** PM2+ or custom monitoring scripts
6. **Logging:** Centralized logs in `/var/www/htdx/logs/`
