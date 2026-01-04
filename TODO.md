# Fix Hardcoded API URLs - TODO

## Status: ✅ Completed

### Files Modified:
1. `robotics-club/app/club/admin/page_broken_backup.js`
2. `robotics-club/app/club/admin/page_test.js`

### Files Created/Updated:
1. `robotics-club/.env.local` - Added `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL`

### Changes Made:
1. Added import: `import { API_BASE_URL } from '@/app/utils/apiConfig'`
2. Replaced `http://localhost:8080` with `${API_BASE_URL}` in all fetch calls
3. Added environment variables for both REST API and WebSocket

### Architecture:
- **REST API**: `api.js` and `apiConfig.js` use `NEXT_PUBLIC_API_URL`
- **WebSocket**: `chatroom/page.js` uses `SOCKET_URL` from `NEXT_PUBLIC_SOCKET_URL`

### Environment Variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080      # REST API
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080    # WebSocket
```

Both API and WebSocket will work correctly using environment variables. The chatroom already imports `SOCKET_URL` from `apiConfig.js`, so no code changes were needed there - just the env variable.

