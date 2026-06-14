# Host TalkDrove Pro (HTD-X)

A production-ready SaaS platform for managing WhatsApp bots on a Linux VPS.

## Project Overview

HTD-X allows users to:
- Upload WhatsApp bot ZIP files
- Extract and manage bot files
- Edit bot configurations and environment variables
- Install dependencies using npm
- Deploy bots using PM2
- Monitor resource usage in real-time
- View live console logs
- Manage subscription limits

## Tech Stack

**Backend:** Node.js, TypeScript, Express.js, Socket.IO, MySQL, Prisma ORM
**Frontend:** Next.js, TypeScript, TailwindCSS, Glassmorphism Dark Theme
**Infrastructure:** Ubuntu 24.04, Nginx, PM2, Certbot SSL

## Project Structure

```
htdx/
├── backend/              # Express.js backend application
├── frontend/             # Next.js frontend application
├── database/             # Prisma schema and migrations
├── scripts/              # Deployment and utility scripts
├── nginx/                # Nginx configuration files
├── docs/                 # Project documentation
├── uploads/              # Temporary upload storage
├── storage/              # Persistent bot storage
└── logs/                 # Application logs
```

## Development Phases

- **Phase 1:** Architecture, Database Design, Authentication Backend
- **Phase 2:** Frontend Authentication & Dashboard Layout
- **Phase 3:** ZIP Upload & Extraction System
- **Phase 4:** File Manager & Environment Variable Editor
- **Phase 5:** Dependency Installer
- **Phase 6:** PM2 Deployment Engine
- **Phase 7:** Real-Time Console with Socket.IO
- **Phase 8:** Resource Monitoring System
- **Phase 9:** Admin Panel & Subscription Management
- **Phase 10:** Production Deployment

## Getting Started

See `docs/SETUP.md` for detailed installation instructions.

## License

Proprietary - Host TalkDrove Pro
