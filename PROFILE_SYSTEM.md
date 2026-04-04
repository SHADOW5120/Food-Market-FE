# User Profile Frontend Documentation

## Overview

This document describes the complete User Profile Frontend implementation for the Food Market application. The profile system includes user information display, profile editing, and password management.

## Features

✅ **Profile Display Page** (`/profile`)
- View complete user profile with avatar, username, email, and phone
- Click-able avatar to change profile picture
- Organized sections: Personal Information & Security
- Quick access to edit and password change functions
- Safe logout with confirmation

✅ **Edit Profile Page** (`/profile/edit`)
- Update username and phone number
- Upload and preview avatar before saving
- Drag & drop avatar upload support
- Email display (read-only)
- Real-time validation feedback
- Save/Cancel buttons with change detection

✅ **Change Password Page** (`/profile/change-password`)
- Secure password change flow
- Current password verification
- New password with strength indicator
- Password strength requirements display
- Confirm password validation
- Clear feedback on requirements

✅ **User Experience**
- Responsive design (mobile, tablet, desktop)
- Loading states with spinner
- Success/error messages
- Form validation errors
- Disabled buttons during submissions
- Auto-redirect on success
- Confirmation dialogs for destructive actions

✅ **UI/UX**
- Clean, modern card-based layout
- Gradient hero background
- Smooth animations
- Consistent color scheme (orange/green)
- Clear section separation
- Accessible form fields

## Project Structure

```
app/
├── profile/
│   ├── page.tsx                    # Main profile page
│   ├── edit/
│   │   └── page.tsx                # Edit profile page
│   └── change-password/
│       └── page.tsx                # Change password page
└── page.tsx                        # Updated home page with profile link

components/
├── profile/
│   ├── ProfileCard.tsx             # Display user profile
│   ├── AvatarUpload.tsx            # Avatar upload with preview
│   ├── EditProfileForm.tsx         # Profile editing form
│   └── ChangePasswordForm.tsx      # Password change form
└── auth/
    └── Icons.tsx                   # Updated with UploadIcon & X

lib/
├── types.ts                        # Extended User type
├── api.ts                          # Profile API functions
├── validators.ts                   # Profile validators
├── auth-context.tsx                # Extended with updateUser
└── constants.ts

public/
```

## API Endpoints

### Get User Profile
```
GET /user/me
Authorization: Bearer {token}
```
Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-id",
      "username": "john_doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "avatar": "https://...",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Update Profile
```
PUT /user/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new_username",
  "phone": "+9876543210"
}
```

### Change Password
```
PUT /user/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

### Upload Avatar
```
POST /user/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "avatar": <File>
}
```
Response:
```json
{
  "success": true,
  "data": {
    "url": "https://..."
  }
}
```

## Components

### ProfileCard
Displays user's complete profile information with action buttons.

**Props:**
- `user: User` - User object with profile data
- `onLogout: () => void` - Logout handler
- `isLoggingOut?: boolean` - Loading state for logout

**Features:**
- Circular avatar with fallback emoji
- Change avatar button (links to edit page)
- Personal Information section
- Security section
- Edit Profile button
- Change Password button
- Logout button with confirmation
- Account creation date

### AvatarUpload
Avatar selection and preview component with drag & drop support.

**Props:**
- `currentAvatar?: string` - Current avatar URL
- `username: string` - Username for fallback display
- `onAvatarChange: (file: File) => void` - File change handler
- `isLoading?: boolean` - Loading state

**Features:**
- Large circular avatar preview
- Drag & drop file upload
- Click to select file
- File size validation (max 5MB)
- Image format validation
- Clear preview button
- Supported formats display

### EditProfileForm
Complete form for editing user profile.

**Props:**
- `user: User` - Current user data
- `onSuccess: (updatedUser: User) => void` - Success handler
- `onError: (error: string) => void` - Error handler

**Features:**
- Username input with validation
- Phone number input with validation
- Email display (read-only)
- Avatar upload section
- Real-time validation
- Change detection
- Save/Cancel buttons
- Success message
- Error handling

### ChangePasswordForm
Secure password change form with strength indicator.

**Props:**
- `onSuccess: () => void` - Success handler
- `onError: (error: string) => void` - Error handler

**Features:**
- Current password field
- New password field with strength indicator
- Confirm password field
- Password strength requirements display
- Real-time validation
- Error highlighting
- Loading state
- Success message
- Info box with requirements

## Validators

### validatePhone(phone: string)
Validates phone number format (10-15 characters with optional formatting).

### validatePasswordStrength(password: string)
Returns object with:
- `isStrong: boolean` - Is password strong enough
- `feedback: string[]` - Missing requirements

Requirements:
- At least 8 characters
- One uppercase letter
- One lowercase letter
- One number
- One special character

### validateChangePasswordForm(data)
Validates all fields in password change form:
- Current password required
- New password meets requirements
- New password differs from current
- Passwords match

### validateEditProfileForm(data)
Validates edit profile form:
- Username validation (3-20 characters, alphanumeric + _ -)
- Phone validation (if provided)

## State Management

### AuthContext Updates
Extended `AuthContext` with:
- `updateUser(updatedUser: Partial<User>)` - Update user data locally

The context handles:
- Persisting user data to localStorage
- Syncing authentication across tabs
- Token management
- User state updates

## Type Definitions

### User
```typescript
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

### UpdateProfilePayload
```typescript
interface UpdateProfilePayload {
  username?: string;
  phone?: string;
  avatar?: string;
}
```

### ChangePasswordPayload
```typescript
interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
```

## Usage Examples

### Access Profile Page
```
/profile
```
Displays current user's complete profile with all information.

### Edit Profile
```
/profile/edit
```
Allows user to:
- Update username
- Update phone number
- Change avatar
- See real-time validation feedback

### Change Password
```
/profile/change-password
```
Allows user to:
- Verify current password
- Set new password
- See strength requirements
- Confirm password change

### From Home Page
Added Profile button in header navigation that links to profile page.

## Security Features

✅ **Password Security**
- Strong password requirements enforced
- Password strength indicator
- Password confirmation required
- Current password verification

✅ **Form Validation**
- Real-time validation feedback
- Server-side validation support
- Clear error messages
- Type safety with TypeScript

✅ **Data Protection**
- Bearer token authentication
- Secure API calls with headers
- localStorage for token storage
- Email cannot be changed (security)

✅ **User Actions**
- Logout confirmation dialog
- Disabled buttons during submission
- Loading states to prevent double-submission
- Error messages for failed requests

## Customization

### Styling
- Colors: Modify orange/green theme in components
- Layout: Card width and padding in component classes
- Animations: Update in globals.css

### Validation Rules
- Username: Edit `validateUsername()` in validators.ts
- Phone: Edit `validatePhone()` in validators.ts
- Password: Edit `validatePasswordStrength()` in validators.ts

### API Endpoints
Update endpoint URLs in `lib/api.ts`:
- `/user/me` - Get profile
- `/user/profile` - Update profile
- `/user/change-password` - Change password
- `/user/avatar` - Upload avatar

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Error Handling

### Common Errors

**Authentication Error**
- User not logged in → Redirect to login
- Invalid token → Clear token and redirect

**Validation Error**
- Display field-specific error messages
- Highlight invalid fields
- Show helpful error text

**API Error**
- Display error message to user
- Don't disable form (allow retry)
- Log errors for debugging

**File Upload Error**
- File too large: Show size limit
- Wrong format: Show supported formats
- Upload failed: Show retry message

## Testing Checklist

- [ ] View profile page without errors
- [ ] Avatar displays correctly or shows fallback
- [ ] Can navigate to edit profile page
- [ ] Edit username with validation
- [ ] Edit phone with validation
- [ ] Upload and preview avatar
- [ ] Drag and drop avatar upload
- [ ] Navigate to change password page
- [ ] Password strength indicator works
- [ ] Password requirements feedback works
- [ ] Change password with validation
- [ ] Logout with confirmation
- [ ] Responsive on mobile, tablet, desktop
- [ ] Loading states display correctly
- [ ] Error messages display correctly
- [ ] Success messages display correctly
- [ ] Can't submit with invalid data
- [ ] Back buttons work correctly

## Future Enhancements

- [ ] Sidebar navigation with profile, orders, settings
- [ ] Editable inline fields (instead of separate page)
- [ ] Dark mode support
- [ ] Two-factor authentication
- [ ] Social login integration
- [ ] Address management
- [ ] Notification preferences
- [ ] Order history in profile
- [ ] Delete account functionality
- [ ] Profile picture crop/edit tool
- [ ] Activity log/login history
- [ ] Advanced security settings

## Troubleshooting

### Avatar not uploading
- Check file size (max 5MB)
- Check file format (JPG, PNG, GIF, WebP)
- Verify API endpoint is correct
- Check network tab for upload requests

### Changes not saving
- Check browser console for errors
- Verify API endpoint is accessible
- Check authentication token is valid
- Ensure Content-Type headers are correct

### Validation not working
- Check validators are imported correctly
- Verify form field names match validator keys
- Check error state is updating

### Page not loading
- Verify user is authenticated
- Check redirects in useEffect
- Verify auth context is working
- Check network requests in browser

## Support

For issues or questions about the profile system:
1. Check the error messages displayed
2. Review browser console for technical errors
3. Verify API endpoints are running
4. Check network tab for failed requests
5. Review validation rules in validators.ts
