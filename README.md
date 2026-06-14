# Host TalkDrive Pro (HTD-X)

A production-ready SaaS platform for managing WhatsApp bots on Linux VPS without requiring Pterodactyl Wings.

## Phase 1: Core Authentication System

### Completed

✅ JWT Authentication (Access + Refresh tokens)  
✅ User Registration with strong password validation  
✅ Email Verification via SMTP  
✅ Login with session tracking  
✅ Password Reset functionality  
✅ Account suspension support  
✅ Role-based access control (SUPER_ADMIN, MODERATOR, USER)  
✅ Comprehensive error handling  
✅ Activity logging for audit trails  
✅ Type-safe TypeScript throughout  

### Quick Start

```bash
cd backend
npm install
cp .env.example .env
# Configure your database and SMTP credentials in .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

### API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/logout` - User logout (protected)

### Security Features

- bcrypt password hashing (12 rounds)
- JWT token management with expiration
- SQL injection prevention via Prisma ORM
- Email validation
- Strong password enforcement
- Rate limiting ready
- CORS protection

### Database

MySQL with Prisma ORM. Schema includes:

- Users with roles and subscription plans
- JWT Refresh tokens
- Email verification tokens
- Password reset tokens
- Activity audit logs
- Subscription plan configurations

### Next Phase

Phase 2 will include:
- Frontend authentication pages (Login, Register, Verify Email, Reset Password)
- User dashboard layout with Glassmorphism dark theme
- Mobile-first responsive design
