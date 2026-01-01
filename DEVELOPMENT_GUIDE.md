# Development Guide

## Complete Workflow for Creating New Features

This guide covers how to add new features, components, routes, and backend functions to the Robotics Club application.

---

## 📋 Table of Contents

1. [Creating a New Frontend Component](#creating-a-new-frontend-component)
2. [Creating a New Page/Route](#creating-a-new-pageroute)
3. [Creating a New Backend API Endpoint](#creating-a-new-backend-api-endpoint)
4. [Authentication Workflow](#authentication-workflow)
5. [Best Practices](#best-practices)

---

## Creating a New Frontend Component

### Step 1: Determine Component Type

| Type | Location | Purpose |
|------|----------|---------|
| **Reusable UI** | `components/` | Buttons, inputs, cards |
| **Page-specific** | `club/[section]/` | Page content |
| **Auth-related** | `components/Authenticate-comp/` | Login, register |
| **Animated** | `components/Animated-comps/` | Visual effects |
| **Layout** | `components/Header-comps/` | Header, footer |

### Step 2: Create Component File

**Basic Component Template:**

```jsx
// app/components/NewFeature.js
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

export default function NewFeature({ prop1, prop2 }) {
    // State management
    const [state, setState] = useState(initialValue);
    const { user, token, isAuthenticated } = useAuth();

    // Side effects
    useEffect(() => {
        // Fetch data or subscribe to changes
        fetchData();
        
        // Cleanup
        return () => {
            // Cleanup subscriptions
        };
    }, [dependency]);

    // Event handlers
    const handleAction = async () => {
        try {
            // Action logic
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Render
    return (
        <div className="new-feature">
            <h1>New Feature</h1>
            {/* Component JSX */}
        </div>
    );
}
```

### Step 3: Example - Complete Feature Component

```jsx
// app/components/FeatureCard.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/app/hooks/useAuth';

export default function FeatureCard({ title, description, onAction }) {
    const [loading, setLoading] = useState(false);
    const { user, isAuthenticated } = useAuth();

    const handleClick = async () => {
        setLoading(true);
        try {
            await onAction();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <div>Please login to access this feature</div>;
    }

    return (
        <div className="feature-card p-4 border border-gray-700 rounded-lg">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <p className="text-gray-400 mt-2">{description}</p>
            
            <button
                onClick={handleClick}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-primary text-black rounded hover:bg-yellow-400 disabled:opacity-50"
            >
                {loading ? 'Loading...' : 'Action'}
            </button>
        </div>
    );
}
```

---

## Creating a New Page/Route

### Step 1: Create Route Directory Structure

```
app/
├── club/
│   └── new-feature/          # New route directory
│       ├── page.js           # Main page component
│       └── components/       # Route-specific components (optional)
```

### Step 2: Create Page Component

**Basic Page Template:**

```jsx
// app/club/new-feature/page.js
'use client';

import RoleProtectedRoute from '@/app/components/RoleProtectedRoute';
import FeatureComponent from '@/app/components/FeatureComponent';
import Header from '@/app/Header';
import Footer from '@/app/Footer';

export default function NewFeaturePage() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            
            <main className="container mx-auto px-4 py-8">
                <RoleProtectedRoute allowedRoles={['admin', 'officebearer', 'member']}>
                    <FeatureComponent />
                </RoleProtectedRoute>
            </main>
            
            <Footer />
        </div>
    );
}
```

### Step 3: Route Protection Levels

| Protection | Usage |
|------------|-------|
| `ProtectedRoute` | Any authenticated user |
| `RoleProtectedRoute` | Specific roles only |
| None | Public route |

**Examples:**

```jsx
// Public route - anyone can access
<RoleProtectedRoute allowedRoles={[]}>
    <PublicPage />
</RoleProtectedRoute>

// Member+ routes
<RoleProtectedRoute allowedRoles={['member', 'officebearer', 'admin']}>
    <MemberPage />
</RoleProtectedRoute>

// Admin only
<RoleProtectedRoute allowedRoles={['admin']}>
    <AdminPage />
</RoleProtectedRoute>
```

---

## Creating a New Backend API Endpoint

### Step 1: Create Controller Function

```javascript
// controllers/featureController.js
const FeatureModel = require('../models/featureModel');

const getFeatures = async (req, res) => {
    try {
        const features = await FeatureModel.find().sort({ createdAt: -1 });
        res.json({ success: true, features });
    } catch (error) {
        console.error('Error fetching features:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch features' });
    }
};

const createFeature = async (req, res) => {
    try {
        const feature = new FeatureModel({
            ...req.body,
            createdBy: req.user._id
        });
        await feature.save();
        res.status(201).json({ success: true, feature });
    } catch (error) {
        console.error('Error creating feature:', error);
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { getFeatures, createFeature };
```

### Step 2: Create Route File

```javascript
// routes/featureRouter.js
const express = require('express');
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const { getFeatures, createFeature } = require('../controllers/featureController');

router.get('/', authenticateToken, getFeatures);
router.post('/', authenticateToken, requireRole(['admin', 'officebearer']), createFeature);

module.exports = router;
```

### Step 3: Register Route in Server

```javascript
// index.js
const featureRouter = require('./routes/featureRouter');
app.use('/features', featureRouter);
```

### Step 4: Create Model

```javascript
// models/featureModel.js
const mongoose = require('mongoose');

const FeatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'social-logins' },
    createdAt: { type: Date, default: Date.now }
});

const FeatureModel = mongoose.model('Feature', FeatureSchema);
module.exports = FeatureModel;
```

---

## Authentication Workflow

### Complete Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Complete Authentication Flow                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. REGISTRATION                                                    │
│  User fills form → POST /auth/register → Server hashes password     │
│  → Creates user → Generates JWT → Returns { token, user }           │
│  → Client stores in localStorage                                    │
│                                                                     │
│  2. LOGIN                                                           │
│  User enters credentials → POST Server validates      │
 /auth/login →│  → Returns token + user → AuthProvider updates context              │
│                                                                     │
│  3. SUBSEQUENT REQUESTS                                             │
│  API request includes: Headers: { Authorization: 'Bearer <token>' } │
│  → authenticateToken middleware verifies JWT → Fetches user         │
│  → Attaches user to req.user → Route handler executes               │
│                                                                     │
│  4. ROLE-BASED ACCESS                                               │
│  requireRole(['admin']) checks req.user.role → Returns 403 if invalid│
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Code Examples

**Frontend - Checking Auth State:**

```jsx
import { useAuth } from '@/app/hooks/useAuth';

function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuth();

    if (!isAuthenticated) {
        return <div>Please login</div>;
    }

    return (
        <div>
            <p>Welcome, {user.name}!</p>
            <p>Your role: {user.role}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}
```

**Backend - Protecting Routes:**

```javascript
// Single role
router.get('/admin-only', authenticateToken, requireRole(['admin']), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

// Multiple roles
router.get('/privileged', authenticateToken, requireRole(['admin', 'officebearer']), (req, res) => {
    res.json({ message: 'Privileged access granted' });
});

// All authenticated users
router.get('/members', authenticateToken, (req, res) => {
    res.json({ message: 'Member access granted', user: req.user });
});
```

---

## Best Practices

### Frontend Best Practices

1. **Use TypeScript** - Add type safety
2. **Optimize Images** - Use `imageUtils.js` for compression
3. **Lazy Load** - Use `next/dynamic` for heavy components
4. **Loading States** - Always show loading indicators

```jsx
// Lazy loading example
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
    loading: () => <div>Loading...</div>,
    ssr: false
});
```

### Backend Best Practices

1. **Validate Input** - Use `express-validator`
2. **Rate Limit** - Add rate limiting
3. **Error Handling** - Never expose stack traces
4. **Security Headers** - Use `helmet`

```javascript
// Input validation example
const { body, validationResult } = require('express-validator');

router.post('/',
    body('email').isEmail().normalizeEmail(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    }
);
```

### Database Best Practices

1. **Indexes** - Add indexes for frequently queried fields
2. **Pagination** - Don't return all records
3. **Soft Delete** - Use `isDeleted` flag instead of hard delete

```javascript
// Adding indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
EventSchema.index({ date: 1 });

// Pagination
router.get('/events', authenticateToken, async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const events = await EventModel.find()
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 });
    
    res.json({ events, page, limit });
});
```

---

## 📁 File Checklist for New Feature

```
New Feature: FeatureName

Frontend:
├── app/components/FeatureName.js
├── app/club/feature-name/page.js
└── app/components/api.js (add API functions)

Backend:
├── robotics-club-backend/controllers/featureController.js
├── robotics-club-backend/models/featureModel.js
├── robotics-club-backend/routes/featureRouter.js
└── robotics-club-backend/index.js (register route)
```

---

## 🐛 Debugging Tips

### Frontend Debugging

1. Check browser console for errors
2. Verify localStorage has token
3. Test API endpoint directly with curl/postman
4. Check Network tab for failed requests

### Backend Debugging

1. Check server logs in terminal
2. Verify MongoDB connection
3. Test endpoints with Postman
4. Check JWT token expiration

```javascript
router.get('/', authenticateToken, async (req, res) => {
    console.log('User:', req.user._id);
    console.log('Params:', req.params);
});
```

---

## 📚 Related Documentation

- [VULNERABILITY_ANALYSIS.md](VULNERABILITY_ANALYSIS.md) - Security issues and fixes
- [FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md) - Frontend architecture
- [BACKEND_STRUCTURE.md](BACKEND_STRUCTURE.md) - Backend architecture

