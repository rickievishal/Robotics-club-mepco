# Frontend Architecture Documentation

## Overview

The Robotics Club frontend is built with **Next.js 14 (App Router)**, **React**, and **Tailwind CSS**. It uses a component-based architecture with a clear separation of concerns.

---

## 📁 Project Structure

```
robotics-club/
├── app/                          # Next.js App Router directory
│   ├── layout.jsx                # Root layout with AuthProvider
│   ├── page.jsx                  # Landing page
│   ├── globals.css               # Global styles
│   ├── Header.jsx                # Global header component
│   ├── Footer.jsx                # Global footer component
│   │
│   ├── club/                     # Main club routes
│   │   ├── welcome/              # Welcome page (authenticated)
│   │   │   └── page.js
│   │   ├── events/               # Public events page
│   │   │   └── page.js
│   │   ├── chatroom/             # Real-time chat
│   │   │   └── page.js
│   │   ├── register/             # User registration
│   │   │   └── page.js
│   │   │
│   │   ├── admin/                # Admin-only routes
│   │   │   ├── page.js           # Admin dashboard
│   │   │   ├── events/           # Event management
│   │   │   │   └── page.js
│   │   │   └── users/            # User management
│   │   │       └── page.js
│   │   │
│   │   ├── members/              # Member-only routes
│   │   │   └── events/
│   │   │       └── page.js
│   │   │
│   │   └── obs/                  # OBS tools (office bearers)
│   │       └── ob-tools/
│   │           └── schedule-events/
│   │               ├── layout.js
│   │               └── page.js
│   │
│   ├── components/               # Reusable components
│   │   ├── api.js                # API utility functions
│   │   ├── Button.js             # Custom button
│   │   ├── Input.js              # Custom input
│   │   ├── ProtectedRoute.jsx    # Auth protection HOC
│   │   ├── RoleProtectedRoute.jsx# Role-based protection
│   │   │
│   │   ├── Animated-comps/       # Animation components
│   │   │   ├── BlurText.js
│   │   │   ├── ShinyText.js
│   │   │   └── ShinyText.css
│   │   │
│   │   ├── Authenticate-comp/    # Auth components
│   │   │   └── AdminAuth.js
│   │   │
│   │   ├── google-auth/          # Google OAuth
│   │   │   ├── GoogleLoginBtn.js
│   │   │   └── OauthWrapper.js
│   │   │
│   │   ├── Header-comps/         # Header components
│   │   │   └── LoginStatus.js
│   │   │
│   │   └── shadcn-comps/         # UI components
│   │       └── DatePicker.js
│   │
│   ├── hooks/                    # Custom React hooks
│   │   └── useAuth.js            # Authentication hook
│   │
│   ├── register/                 # Registration page
│   │   └── page.js
│   │
│   └── utils/                    # Utility functions
│       └── imageUtils.js         # Image compression utils
│
├── public/                       # Static assets
│   └── favicon.ico
│
├── package.json                  # Dependencies
├── next.config.mjs              # Next.js configuration
├── jsconfig.json                # JavaScript path aliases
├── tailwind.config.js           # Tailwind configuration
└── postcss.config.mjs           # PostCSS configuration
```

---

## 🎨 Design System

### Color Palette
```css
:root {
    --primary: #f0c808;        /* Main accent color */
    --background: rgb(10,10,10); /* Dark background */
    --surface: rgb(13,13,13);   /* Card background */
    --border: rgb(29,29,29);     /* Border color */
    --text-primary: white;       /* Primary text */
    --text-secondary: rgb(155,155,155); /* Secondary text */
}
```

### Typography
- **Headings:** Sans-serif, bold
- **Body:** Sans-serif, regular
- **Code:** Monospace

---

## 🔐 Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────┐    ┌────────────┐    ┌──────────────────┐    │
│   │ Landing │───►│ Login/Reg  │───►│ AuthProvider     │    │
│   │  Page   │    │   Page     │    │ (useAuth hook)   │    │
│   └─────────┘    └────────────┘    └────────┬─────────┘    │
│                                             │              │
│                                             ▼              │
│                                    ┌──────────────────┐    │
│                                    │ localStorage     │    │
│                                    │ (token, userData)│    │
│                                    └────────┬─────────┘    │
│                                             │              │
│                                             ▼              │
│   ┌─────────┐    ┌────────────┐    ┌──────────────────┐    │
│   │ Protected◄────│ Route      ◄────│ RoleProtected    │    │
│   │  Page   │    │ Component  │    │ Route HOC        │    │
│   └─────────┘    └────────────┘    └──────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Role-Based Access Control

### User Roles
| Role | Permissions |
|------|------------|
| `member` | View events, join chatroom |
| `officebearer` | All member permissions + Create/Edit events |
| `admin` | Full access + User management |

### Route Protection
```jsx
// Protected route example
<RoleProtectedRoute allowedRoles={['admin', 'officebearer']}>
    <AdminEventsPage />
</RoleProtectedRoute>
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      Data Flow Diagram                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Frontend Component                                        │
│         │                                                   │
│         ▼                                                   │
│   API Call (fetch/axios)                                    │
│         │                                                   │
│         ▼                                                   │
│   ┌─────────────────────────────────────────┐              │
│   │         Backend API (Express)            │              │
│   │  ┌─────────┐  ┌─────────┐  ┌─────────┐  │              │
│   │  │ Auth    │  │ Events  │  │ Chat    │  │              │
│   │  │ Routes  │  │ Routes  │  │ Routes  │  │              │
│   │  └────┬────┘  └────┬────┘  └────┬────┘  │              │
│   └───────┼────────────┼────────────┼───────┘              │
│           │            │            │                       │
│           ▼            ▼            ▼                       │
│   ┌─────────────────────────────────────────┐              │
│   │         MongoDB Database                 │              │
│   │  ┌─────────┐  ┌─────────┐               │              │
│   │  │ Users   │  │ Events  │               │              │
│   │  └─────────┘  └─────────┘               │              │
│   └─────────────────────────────────────────┘              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Key Components

### 1. AuthProvider (`hooks/useAuth.js`)
Manages global authentication state:
- Stores user data and token in context
- Persists auth state in localStorage
- Provides `login()`, `logout()`, `isAuthenticated()` methods

### 2. RoleProtectedRoute (`components/RoleProtectedRoute.jsx`)
HOC for protecting routes based on user role:
- Checks authentication status
- Validates user role against allowed roles
- Redirects unauthorized users

### 3. GoogleLoginBtn (`components/google-auth/GoogleLoginBtn.js`)
Google OAuth integration:
- Handles Google sign-in
- Exchanges auth code for JWT token
- Updates auth context

### 4. AdminEventsPage (`club/admin/events/page.js`)
Event management interface:
- CRUD operations for events
- Image upload with compression
- Real-time status updates

---

## 🔌 API Integration

### Base Configuration (`components/api.js`)
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const fetchAPI = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        },
    });
    
    if (!response.ok) {
        throw new Error('API request failed');
    }
    
    return response.json();
};
```

### Common Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/me` | Get current user |
| GET | `/events` | List all events |
| POST | `/events` | Create event |
| PUT | `/events/:id` | Update event |
| DELETE | `/events/:id` | Delete event |

---

## 🖼️ Image Handling

### Image Utils (`utils/imageUtils.js`)
```javascript
// Image compression settings
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 800;
const QUALITY = 0.7;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

// Functions
compressImage(file)        // Compress and resize image
validateImage(file)        // Validate type and size
formatFileSize(bytes)      // Human-readable size
getBase64Size(base64)      // Get base64 size
```

---

## 🚀 Adding New Features

### Step 1: Create Component
```jsx
// app/components/NewFeature.js
'use client';
import { useState } from 'react';

export default function NewFeature() {
    // Component logic
    return (
        <div className="new-feature">
            {/* UI */}
        </div>
    );
}
```

### Step 2: Add Route
```jsx
// app/club/new-feature/page.js
'use client';
import RoleProtectedRoute from '@/app/components/RoleProtectedRoute';
import NewFeature from '@/app/components/NewFeature';

export default function NewFeaturePage() {
    return (
        <RoleProtectedRoute allowedRoles={['admin', 'officebearer']}>
            <NewFeature />
        </RoleProtectedRoute>
    );
}
```

### Step 3: Add API Route (Backend)
```javascript
// robotics-club-backend/routes/newFeatureRouter.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');

router.post('/', authenticateToken, requireRole(['admin']), async (req, res) => {
    // Handler logic
});

module.exports = router;
```

### Step 4: Register Route in Backend
```javascript
// robotics-club-backend/index.js
app.use('/new-feature', newFeatureRouter);
```

---

## 📱 Responsive Design

The application uses Tailwind CSS for responsive design:
- **Mobile:** `md:` prefix
- **Tablet:** `lg:` prefix
- **Desktop:** `xl:` prefix

Example:
```jsx
<div className="w-full md:w-1/2 lg:w-1/3">
    {/* Responsive layout */}
</div>
```

---

## 🧪 State Management

### Local State
```jsx
const [state, setState] = useState(initialValue);
```

### Context State (Auth)
```jsx
const { user, token, login, logout } = useAuth();
```

### Server State (TanStack Query recommended)
```jsx
// Currently using useEffect + fetch
useEffect(() => {
    fetchData();
}, []);
```

---

## 📄 Page Routes Summary

| Route | Protection | Description |
|-------|------------|-------------|
| `/` | Public | Landing page |
| `/register` | Public | Registration |
| `/club/welcome` | All authenticated | Welcome page |
| `/club/events` | All authenticated | View events |
| `/club/chatroom` | All authenticated | Chat room |
| `/club/admin` | Admin/Officebearer | Admin dashboard |
| `/club/admin/events` | Admin/Officebearer | Manage events |
| `/club/admin/users` | Admin only | Manage users |
| `/club/members/events` | Members+ | Member events |
| `/club/obs/ob-tools/schedule-events` | Officebearer+ | OBS tools |

---

## ⚡ Performance Optimizations

1. **Code Splitting** - Next.js automatic
2. **Image Compression** - Client-side compression
3. **Lazy Loading** - Dynamic imports
4. **Caching** - LocalStorage for auth state

---

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID |

