# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Primary Development Workflow
```bash
npm run dev          # Full dev setup: install deps, generate Prisma, push DB, export search data, start dev server with turbo
npm run dev:start    # Start dev server only (after initial setup)
npm run build        # Standard build
npm run build:production  # Production build with NODE_ENV=production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with test data
```

### Production Deployment
```bash
npm run deploy-app   # Full production deployment: stop PM2, generate Prisma, push DB, install deps, export search data, build, start PM2
```

### Database Operations
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes to database
npx tsx prisma/seed.ts  # Run database seeding
npx tsx _scripts/exportSearchData.ts  # Export dentist search data to JSON
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15+ with App Router and Turbo mode
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with custom credentials (email/password and WhatsApp/phone)
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: TanStack Query (React Query) for server state
- **Real-time**: Socket.io for chat and live features
- **File Upload**: Custom FTP client for media management

### Project Structure

#### App Router Organization
- `src/app/(actions)/` - Server Actions grouped by domain (admin, appointments, dentists, etc.)
- `src/app/(auth)/` - Authentication pages (login, register, password reset, email verification)
- `src/app/(pages)/` - Static pages grouped by category (company, legal, patients, dentists)
- `src/app/(tools)/` - Development and admin tools
- `src/app/api/` - API routes organized by feature with nested resource patterns
- `src/app/admin/` - Admin dashboard pages
- `src/app/manage-dentists/` - Dentist management interface

#### Key Directories
- `src/components/` - Reusable UI components, organized by feature
- `src/hooks/` - Custom React hooks for data fetching and state management
- `src/lib/` - Utility functions and configurations
- `src/providers/` - React context providers (Query, Socket, Video)
- `src/types/` - TypeScript type definitions
- `src/services/` - External service integrations

### Database Schema
The application uses a comprehensive schema centered around:
- **Users**: Multi-role system (USER, ADMIN, DENTIST) with profile management
- **Dentists**: Professional profiles with specialties, locations, ratings, and availability
- **Appointments**: Booking system with status tracking and payment integration
- **Treatments**: Dental services with costs, FAQs, and instructional content
- **Reviews**: Rating system with categories and aggregated statistics
- **Chat/Messaging**: Real-time communication system with conversations and typing indicators
- **Media**: File management system for images, videos, and documents

### Authentication System
- NextAuth.js v5 with JWT strategy
- Dual authentication: email/password and WhatsApp/phone OTP
- Role-based access control (USER, ADMIN, DENTIST)
- Custom session extensions for role and phone number

### Key Features
- **Appointment Booking**: Complex scheduling system with dentist availability
- **Real-time Chat**: Socket.io implementation with typing indicators and message status
- **Search & Discovery**: Fuzzy search with location-based filtering
- **Content Management**: Rich text editing for treatments, blogs, and dentist profiles
- **Media Management**: Custom FTP-based file upload system
- **WhatsApp Integration**: OTP verification and messaging capabilities
- **Review System**: Multi-category rating system with aggregated statistics

## Important Implementation Notes

### Development Workflow
1. The `npm run dev` command runs a complete setup including database schema updates and search data export
2. Search data is exported to `src/app/dentist.json` for client-side search functionality
3. The application uses Turbo mode for faster development builds

### Database Considerations
- MySQL database with comprehensive foreign key relationships
- Prisma generates client to `node_modules/.prisma/client`
- Seeding is required for development data
- Search data export is critical for search functionality

### Build Configuration
- TypeScript and ESLint errors are ignored during builds (configured for rapid development)
- Multiple image domains configured for CDN and local development
- Experimental caching enabled for performance

### API Structure
- Server Actions in `(actions)` directories for form handling and mutations
- REST API routes in `api/` directory following resource-based patterns
- Real-time features implemented via Socket.io endpoints

### Authentication Flow
- Supports both traditional email/password and modern WhatsApp OTP authentication
- Custom credential providers for NextAuth.js
- Role-based routing and component access control

### File Organization Patterns
- Route groups used extensively for logical organization without affecting URL structure
- Client components clearly separated with "Client" suffix
- Hooks organized by feature domain (admin, cost, ratings, etc.)
- Types centralized but also feature-specific when needed