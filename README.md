# Robotics Club Website

A full-stack web application for managing a robotics club with event management, chatroom, and role-based access control.

## 🏗️ Architecture

```
robotics-club/
├── robotisc-club/           # Next.js Frontend
│   ├── app/                 # App Router pages
│   ├── components/          # Reusable components
│   ├── hooks/               # Custom React hooks
│   └── utils/               # Utility functions
│
└── robotics-club-backend/   # Express.js Backend
    ├── controllers/         # Business logic
    ├── middleware/          # Auth & route middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    └── utils/               # Helper functions
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [FRONTEND_STRUCTURE.md](FRONTEND_STRUCTURE.md) | Frontend architecture, components, and routing |
| [BACKEND_STRUCTURE.md](BACKEND_STRUCTURE.md) | Backend architecture, API endpoints, and database |
| [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) | Step-by-step guide for adding new features |
| [VULNERABILITY_ANALYSIS.md](VULNERABILITY_ANALYSIS.md) | Security issues and remediation |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Frontend Setup
```bash
cd robotics-club
npm install
npm run dev
```
Access at: http://localhost:3000

### Backend Setup
```bash
cd robotics-club-backend
npm install
# Create .env file with MONGODB_URI and JWT_SECRET
npm start
```
API runs at: http://localhost:8080

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| `member` | View events, join chatroom |
| `officebearer` | All member permissions + Create/Edit events |
| `admin` | Full access + User management |

## 📄 Key Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Landing page |
| `/register` | Public | Registration |
| `/club/welcome` | Authenticated | Welcome page |
| `/club/events` | Authenticated | View events |
| `/club/chatroom` | Authenticated | Chat room |
| `/club/admin` | Admin/OB | Admin dashboard |
| `/club/admin/events` | Admin/OB | Manage events |
| `/club/admin/users` | Admin only | Manage users |

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **React** - UI library
- **Tailwind CSS** - Styling
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database
- **Socket.IO** - Real-time communication
- **JWT** - Authentication

## 🔧 Configuration

### Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

**Backend (.env):**
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/robotics-club
JWT_SECRET=your-secret-key
NODE_ENV=development
```

## 📦 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `GET /auth/me` - Get current user

### Events
- `GET /events` - List all events
- `POST /events` - Create event (Admin/OB)
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

### Chat
- WebSocket events for real-time messaging

## 🧪 Development

### Adding New Features
1. See [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for complete workflow
2. Create frontend component in `app/components/`
3. Create backend controller in `controllers/`
4. Add route in `routes/`
5. Register route in `index.js`

### Security Considerations
Review [VULNERABILITY_ANALYSIS.md](VULNERABILITY_ANALYSIS.md) for security guidelines before deployment.

## 📄 License

MIT

