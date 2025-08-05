# AdminAppointmentManager

A comprehensive React component for admins to manage dental appointments with advanced filtering, sorting, and status management capabilities.

## Features

### 📊 **Dashboard Statistics**
- Total appointments count
- Approved appointments
- Pending appointments  
- Cancelled appointments
- Real-time statistics with color-coded cards

### 🔍 **Advanced Filtering & Search**
- **Text Search**: Search across patient name, phone, email, dentist name, and treatment
- **Status Filters**: Filter by overall status, dentist status, or patient status
- **Date Range**: Filter appointments by date range
- **Dentist Filter**: Filter by specific dentist
- **Real-time filtering** with debounced search

### 📋 **Table View with Sorting**
- **Sortable Columns**: Patient, Date & Time, Status, Created Date
- **Pagination**: Configurable page sizes (10, 20, 30, 40, 50)
- **Responsive Design**: Mobile-friendly table layout
- **Action Buttons**: View, Reschedule, Delete for each appointment

### 🔄 **Status Management**
The system tracks three different status perspectives:

#### **Overall Status**
- `PENDING` - Initial appointment state
- `APPROVED` - Appointment confirmed
- `REJECTED` - Appointment denied
- `CANCELLED_BY_PATIENT` - Patient cancelled
- `CANCELLED_BY_DENTIST` - Dentist cancelled
- `RESCHEDULED` - Appointment rescheduled
- `COMPLETED` - Appointment finished
- `NO_SHOW` - Patient didn't attend

#### **Dentist Status** 
View appointment from dentist's perspective

#### **Patient Status**
View appointment from patient's perspective

### 🏥 **Appointment Details Modal**
Comprehensive appointment information display:

#### **Status Overview**
- Visual status indicators for all three status types
- Color-coded status badges with icons

#### **Patient Information**
- Patient name, phone, email
- Age and gender
- Linked registered user (if applicable)

#### **Dentist Information**  
- Dentist profile with photo
- Name, email, phone
- Specialization details

#### **Treatment & Additional Info**
- Treatment type/name
- Additional patient notes
- Status change reasons
- Modification history

#### **Status Management Panel**
- Individual status controls for all three perspectives
- Dropdown selectors with visual status indicators
- Real-time status updates

### 📅 **Appointment Rescheduling**
- **Date/Time Selection**: Interactive date and time pickers
- **Conflict Detection**: Prevents double-booking dentists
- **Reason Tracking**: Optional reason for rescheduling
- **Automatic Status Update**: Sets status to `RESCHEDULED`
- **Notification System**: Ready for email/SMS integration

### 🗑️ **Appointment Management**
- **Delete Appointments**: Remove appointments with confirmation
- **Bulk Operations**: Ready for future bulk status updates
- **Audit Trail**: Track who made changes (`admin`, `dentist`, `patient`)

## Database Schema

### Enhanced Appointment Model

```prisma
model Appointment {
  id              String            @id @default(cuid())
  patientName     String?
  patientPhone    String
  patientEmail    String?
  patientAge      String?
  gender          String?
  userId          String?           // Optional registered user
  treatmentId     String?
  treatmentName   String?
  otherInfo       String?           @db.Text
  appointmentDate DateTime
  appointmentTime String
  
  // Triple status tracking
  status          AppointmentStatus @default(PENDING)
  dentistStatus   AppointmentStatus @default(PENDING) 
  patientStatus   AppointmentStatus @default(PENDING)
  
  // Audit fields
  statusReason    String?           @db.Text
  lastModifiedBy  String?           // admin, dentist, patient
  
  dentistId       String
  createdAt       DateTime          @default(now())
  updatedAt       DateTime          @updatedAt
  
  // Relations
  dentist         Dentist           @relation(fields: [dentistId], references: [id], onDelete: Cascade)
  user            User?             @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum AppointmentStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED_BY_PATIENT
  CANCELLED_BY_DENTIST
  RESCHEDULED
  COMPLETED
  NO_SHOW
}
```

## API Endpoints

### GET `/api/admin/appointments`
Fetch appointments with filtering and pagination

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search term
- `sortBy` - Sort field
- `sortOrder` - asc/desc
- `status` - Filter by overall status
- `dentistStatus` - Filter by dentist status  
- `patientStatus` - Filter by patient status
- `dentistId` - Filter by dentist
- `dateFrom` - Start date filter
- `dateTo` - End date filter

### GET `/api/admin/appointments/stats`
Get appointment statistics and counts

### PATCH `/api/admin/appointments/{id}/status`
Update appointment status

**Body:**
```json
{
  "status": "APPROVED",
  "dentistStatus": "APPROVED", 
  "patientStatus": "PENDING",
  "statusReason": "Doctor confirmed availability",
  "lastModifiedBy": "admin"
}
```

### PATCH `/api/admin/appointments/{id}/reschedule`
Reschedule appointment

**Body:**
```json
{
  "appointmentDate": "2024-01-15",
  "appointmentTime": "14:30",
  "statusReason": "Patient requested new time"
}
```

### DELETE `/api/admin/appointments/{id}`
Delete appointment

## Usage

### Basic Usage

```tsx
import AdminAppointmentManager from '@/components/admin/AdminAppointmentManager';

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <AdminAppointmentManager />
    </div>
  );
}
```

### With React Query Provider

```tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminAppointmentManager from '@/components/admin/AdminAppointmentManager';

const queryClient = new QueryClient();

export default function AdminPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <AdminAppointmentManager />
    </QueryClientProvider>
  );
}
```

## Setup Instructions

### 1. Database Schema Update

Run the database migration:

```bash
npx prisma db push
npx prisma generate
```

### 2. Install Dependencies

Ensure you have the required dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-table
npm install date-fns lucide-react sonner
```

### 3. Seed Sample Data

Generate sample appointments for testing:

```bash
npx tsx prisma/seed-appointments.ts
```

### 4. Add to Navigation

Add to your admin navigation:

```tsx
<Link href="/admin/appointments">
  Manage Appointments
</Link>
```

## Styling & Theming

The component uses Tailwind CSS with a consistent design system:

- **Color Scheme**: Blue primary, semantic colors for status
- **Status Colors**: 
  - Green: Approved/Completed
  - Yellow: Pending 
  - Red: Rejected/Cancelled
  - Blue: Rescheduled
  - Gray: No Show
- **Responsive**: Mobile-first design
- **Dark Mode**: Ready for dark mode implementation

## Future Enhancements

### 🔔 **Notification System**
- Email notifications for status changes
- SMS reminders for appointments
- Push notifications for mobile apps

### 📊 **Advanced Analytics**
- Appointment trends and patterns
- Dentist performance metrics
- Patient behavior insights
- Revenue tracking per appointment

### 🔧 **Bulk Operations**
- Bulk status updates
- Bulk rescheduling
- Bulk export functionality

### 📱 **Mobile App Integration**
- Real-time sync with mobile apps
- Offline capability
- Push notifications

### 🔐 **Permission System**
- Role-based access control
- Field-level permissions
- Audit logging

## Performance Considerations

- **Pagination**: Large datasets handled efficiently
- **Debounced Search**: Reduces API calls
- **Optimized Queries**: Efficient database queries with relations
- **Caching**: React Query caching for better UX
- **Loading States**: Proper loading indicators

## Security Features

- **Input Validation**: All inputs validated
- **SQL Injection Prevention**: Prisma ORM protection
- **Access Control**: Admin-only access
- **Audit Trail**: Track all modifications
- **Data Sanitization**: Prevent XSS attacks

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and roles
- **Color Contrast**: WCAG compliant colors
- **Focus Management**: Proper focus indicators

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Browsers**: iOS Safari, Chrome Mobile
- **Progressive Enhancement**: Graceful degradation

---

**Component Path**: `src/components/admin/AdminAppointmentManager.tsx`  
**API Routes**: `src/app/api/admin/appointments/`  
**Page**: `src/app/admin/appointments/page.tsx` 