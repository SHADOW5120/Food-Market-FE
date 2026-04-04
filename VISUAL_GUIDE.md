# 🎨 Profile System - Visual Guide & Feature Showcase

## Overview

This document provides a visual representation of the User Profile system and showcases all features implemented.

---

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Food Market Application                     │
│                         Home Page                                │
│                    [Profile] [Logout] buttons                    │
└────────┬────────────────────────────────────────,────────────────┘
         │
         ├──────────────────────┬──────────────────────┬────────────────┐
         │                      │                      │                │
    [/profile]          [/profile/edit]      [/profile/         [Auth checks]
      Displays              Change profile    change-password]   Redirects
      ✓ Avatar                ✓ Username         ✓ Current pwd    ✓ to login
      ✓ Username             ✓ Phone            ✓ New password   ✓ if not auth
      ✓ Email                ✓ Avatar preview   ✓ Confirm pwd
      ✓ Phone                ✓ Save/Cancel      ✓ Strength meter
      ✓ Account date         ✓ Validation       ✓ Requirements
      ✓ Edit button          ✓ Error messages   ✓ Save/Cancel
      ✓ Password button      ✓ Success message  ✓ Error/Success msgs
      ✓ Logout button        
```

---

## 📱 Page Layouts

### Profile Page (`/profile`)

```
┌─────────────────────────────────────────────────────┐
│ ← Back to Home                                      │
│ My Profile                                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│               ┌─────────────────┐                  │
│               │                 │                  │
│               │   👤 Avatar     │  Change Avatar  │
│               │                 │                  │
│               └─────────────────┘                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│  Personal Information                               │
│  ─────────────────────                              │
│  • Username:    john_doe                            │
│  • Email:       john@example.com                    │
│  • Phone:       +1234567890 (or "Not set")          │
├─────────────────────────────────────────────────────┤
│  Security                                           │
│  ────────                                           │
│  Manage your password and secure your account       │
│                                                     │
│  [     Change Password     ]                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [     Edit Profile      ]  [     Logout     ]     │
│                                                     │
└─────────────────────────────────────────────────────┘

Mobile: Full width, single column
Tablet: Centered, max-width: 42rem
Desktop: Centered, max-width: 42rem, shadow
```

### Edit Profile Page (`/profile/edit`)

```
┌─────────────────────────────────────────────────────┐
│ ← Back to Profile                                   │
│ Edit Profile                                        │
│ Update your profile information                     │
├─────────────────────────────────────────────────────┤
│  Profile Picture                                    │
│  ────────────────                                   │
│               ┌─────────────────┐                  │
│               │                 │                  │
│               │   👤 Avatar     │                  │
│               │                 │                  │
│               └─────────────────┘                  │
│                 Remove Preview                      │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ 📤 Drag and drop your image here            │  │
│  │ or click to select a file (max 5MB)         │  │
│  │ Supported: JPG, PNG, GIF, WebP              │  │
│  └──────────────────────────────────────────────┘  │
│                                                     │
│  💡 Tip: Save your profile changes to upload       │
├─────────────────────────────────────────────────────┤
│  Personal Information                               │
│  ─────────────────────                              │
│  Email                                              │
│  ├─────────────────────────────────────────┤      │
│  │ john@example.com       (Read-only)      │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  Username  ✓                                        │
│  ├──────────┬──────────────────────────────┤      │
│  │ john_doe │ Min 3, max 20 characters      │      │
│  └──────────┴──────────────────────────────┘      │
│                                                     │
│  Phone Number                                       │
│  ├─────────────────────────────────────────┤      │
│  │ +1234567890                             │      │
│  │ or click clear                          │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [  Save Changes  ]  [ Cancel ]                    │
│                                                     │
│  ✓ Profile updated successfully! (auto-dismiss)    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Change Password Page (`/profile/change-password`)

```
┌─────────────────────────────────────────────────────┐
│ ← Back to Profile                                   │
│ Change Password                                     │
│ Update your password to keep your account secure    │
├─────────────────────────────────────────────────────┤
│  Current Password                                   │
│  ├─────────────────────────────────────────┤      │
│  │ ••••••••  👁️ show/hide                │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  New Password                                       │
│  ├─────────────────────────────────────────┤      │
│  │ ••••••••  👁️ show/hide                │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  Strength: [████████░░] Strong  ← Indicator         │
│                                                     │
│  Password needs:                                    │
│  • At least 8 characters                            │
│  • One uppercase letter                             │
│  • One lowercase letter                             │
│  • One number                                       │
│  • One special character                            │
│                                                     │
│  Confirm New Password                               │
│  ├─────────────────────────────────────────┤      │
│  │ ••••••••  👁️ show/hide                │      │
│  └─────────────────────────────────────────┘      │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │ 💡 Password Requirements:                 │    │
│  │ • At least 8 chars                        │    │
│  │ • Uppercase letter                        │    │
│  │ • Lowercase letter                        │    │
│  │ • Number                                  │    │
│  │ • Special character                       │    │
│  └───────────────────────────────────────────┘    │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [ Change Password ]  [ Cancel ]                   │
│                                                     │
│  ✓ Pwd changed successfully! (auto-dismiss)        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 User Flow Diagram

```
LOGIN
  ↓
HOME PAGE
  ↓
  [Profile Button]
  ↓
PROFILE PAGE (/profile)
  ├─→ [Edit Profile Button]  ──→ EDIT PAGE (/profile/edit)
  │                                ├─→ [Save] ──→ SUCCESS ──→ Back to Profile
  │                                └─→ [Cancel] ──→ Back to Profile
  │
  ├─→ [Change Password Button] ──→ PASSWORD PAGE (/profile/change-password)
  │                                  ├─→ [Change Password] → SUCCESS → Back
  │                                  └─→ [Cancel] ──→ Back to Profile
  │
  └─→ [Logout Button]
      ├─→ Confirmation Dialog
      ├─→ [Confirm] ──→ LOGOUT ──→ LOGIN PAGE
      └─→ [Cancel] ──→ Stay on Profile
```

---

## 🔄 State Management Flow

```
┌──────────────────────────────────────────────────────┐
│              AuthContext (Global State)              │
│                                                      │
│  • user: User | null                                │
│  • isAuthenticated: boolean                         │
│  • isLoading: boolean                               │
│  • login(user, token)                               │
│  • logout()                                         │
│  • setUser(user)                                    │
│  • updateUser(partial) ← NEW                        │
└──────┬───────────────────────────────────────────────┘
       │
       ├─→ localStorage (persistence)
       │   • accessToken
       │   • user (JSON)
       │
       └─→ Components (read/update)
           • ProfileCard ← reads user
           • EditForm ← updates user
           • ChangePasswordForm ← updates context
```

---

## 📊 Form State Management

### Edit Profile Form

```
State:
✓ formData: { username, phone }
✓ avatarFile: File | null
✓ errors: Record<string, string>
✓ isLoading: boolean
✓ successMessage: string
✓ hasChanges: boolean

Validation:
  username → validateUsername()
  phone → validatePhone()

Submission:
  1. Validate form
  2. Show errors if any
  3. Set loading
  4. updateProfile API call
  5. uploadAvatar API call (if file)
  6. updateUser() context
  7. Redirect to profile
```

### Change Password Form

```
State:
✓ formData: { currentPassword, newPassword, confirmPassword }
✓ errors: Record<string, string>
✓ isLoading: boolean
✓ successMessage: string
✓ passwordStrength: { isStrong, feedback }

Validation:
  currentPassword required
  newPassword → validatePassword()
  newPassword ≠ currentPassword
  confirmPassword matches newPassword

Strength Check:
  • min 8 chars
  • has uppercase
  • has lowercase
  • has number
  • has special char
```

---

## 🎨 UI Components Hierarchy

```
App
├── Layout
│   └── AuthProvider
│       ├── /profile
│       │   └── ProfileCard
│       │       ├── User Avatar (circular, clickable)
│       │       ├── PersonalInfo Section
│       │       ├── Security Section
│       │       ├── Action Buttons
│       │       └── Account Footer
│       │
│       ├── /profile/edit
│       │   └── EditProfileForm
│       │       ├── AvatarUpload
│       │       │   ├── Avatar Preview
│       │       │   └── Drag & Drop Area
│       │       ├── Input Fields
│       │       │   ├── Email (read-only)
│       │       │   ├── Username
│       │       │   └── Phone
│       │       ├── Validation Errors
│       │       └── Save/Cancel Buttons
│       │
│       └── /profile/change-password
│           └── ChangePasswordForm
│               ├── Input Fields
│               │   ├── Current Password
│               │   ├── New Password
│               │   ├── Confirm Password
│               │   └── Password Strength Indicator
│               ├── Requirements Feedback
│               └── Change/Cancel Buttons
```

---

## 🔐 Security Flow

```
User Login
    ↓
Store Token & User
    ↓
All Page Accesses
    ├─→ Check Auth
    ├─→ If not auth → Redirect to Login
    └─→ If auth → Load page
        ↓
    API Call
        ├─→ Add Bearer Token to header
        ├─→ Send request
        └─→ Get response
            ├─→ Success → Update state
            └─→ Error → Show message

Password Change
    ├─→ Require current password
    ├─→ Validate new password strength
    ├─→ Confirm match
    ├─→ Send to API
    └─→ Secure endpoint handles actual change

Avatar Upload
    ├─→ Validate file type (image)
    ├─→ Validate file size (max 5MB)
    ├─→ Preview before save
    ├─→ Send as FormData with token
    └─→ Store URL in user profile
```

---

## 🎯 Validation Flow

```
User Input
    ↓
onChange Handler
    ├─→ Update state
    └─→ Clear error for field
    ↓
Validator Function
    ├─→ Check rules
    └─→ Return error or undefined
    ↓
Display
    ├─→ Error message (red)
    ├─→ Field highlight (red border)
    └─→ Disable submit button
    ↓
onSubmit Handler
    ├─→ Validate all fields
    ├─→ If errors → Display & stop
    └─→ If valid → Submit form
```

---

## 📊 API Integration Pattern

```
Component
    ↓
Event Handler (onClick, onSubmit)
    ├─→ Validate form
    ├─→ Set isLoading = true
    ├─→ Call API function
    │   └─→ lib/api.ts
    │       ├─→ addAuthHeader()
    │       ├─→ fetch() with Bearer token
    │       └─→ Parse response
    ├─→ Handle success
    │   ├─→ Update context
    │   ├─→ Show message
    │   └─→ Redirect if needed
    ├─→ Handle error
    │   └─→ Show error message
    └─→ Set isLoading = false
```

---

## 🎯 Key Implementation Details

### Avatar Upload
```
┌─────────────────────────────────┐
│ Avatar Upload Component         │
├─────────────────────────────────┤
│ • File input (hidden)           │
│ • Click area (shows dialog)     │
│ • Drag & drop support          │
│ • Preview display              │
│ • Clear button                  │
│ • Validation:                   │
│   - Type: image/*               │
│   - Size: < 5MB                 │
│ • Error messages                │
└─────────────────────────────────┘
        ↓
    Upload File
        ↓
    uploadAvatar() API
        ↓
    FormData with Bearer token
        ↓
    Store URL in user profile
```

### Password Strength Indicator
```
Password Input
    ↓
validatePasswordStrength()
    ├─→ Check rules
    ├─→ Build feedback array
    └─→ Return isStrong + feedback
    ↓
Display
    ├─→ Progress bar (color coded)
    ├─→ Strength label
    ├─→ Requirements checklist
    └─→ Missing requirements
```

---

## 💻 Responsive Breakpoints

```
Mobile (< 640px)
├─ Full-width cards
├─ Single column layout
├─ Touch-friendly buttons
├─ Readable font sizes
└─ Proper spacing

Tablet (640-1024px)
├─ Centered cards
├─ Max-width 42rem
├─ Balanced spacing
└─ Two-column possible

Desktop (> 1024px)
├─ Centered cards
├─ Max-width 42rem
├─ Professional spacing
└─ Hover states
```

---

## 🔄 Error Handling Examples

### Network Error
```
User tries to save profile
    ↓
Network fails
    ↓
API returns error
    ↓
Show: "An error occurred. Please try again."
    ↓
Keep form data
    ↓
User can retry
```

### Validation Error
```
User submits invalid form
    ↓
Validator finds errors
    ↓
Show field-specific errors:
"Username must be 3-20 characters"
"Phone number is invalid"
    ↓
Disable submit button
    ↓
Highlight invalid fields
    ↓
User fixes and retries
```

### file Upload Error
```
User selects non-image file
    ↓
Check file type
    ↓
Show: "Please select an image file"
    ↓
Allow retry

OR

File too large (> 5MB)
    ↓
Check file size
    ↓
Show: "File size must be less than 5MB"
    ↓
Allow retry
```

---

## ✨ Loading & Feedback States

```
User Action
    ↓
Request Starts
    ├─→ Set isLoading = true
    └─→ Disable buttons
    ↓
API Call
    ├─→ Success
    │   ├─→ Show ✓ message (3s)
    │   ├─→ Update state
    │   └─→ Redirect if needed
    └─→ Error
        ├─→ Show ⚠️ message
        ├─→ Keep form data
        └─→ Enable buttons
    ↓
Request Ends
    └─→ Set isLoading = false
        └─→ Enable buttons
```

---

## 📈 Complete User Journey

```
1. LOGIN PAGE
   └─→ User logs in
       └─→ Stored in AuthContext
           └─→ Stored in localStorage

2. HOME PAGE
   ├─→ See profile button
   └─→ Click Profile

3. PROFILE PAGE
   ├─→ View all info
   ├─→ Avatar visible
   ├─→ Can edit
   └─→ Can change password

4. EDIT PAGE
   ├─→ Update fields
   ├─→ See validation
   ├─→ Upload avatar
   ├─→ Click Save
   ├─→ See success msg
   └─→ Auto redirect to profile

5. CHANGE PASSWORD PAGE
   ├─→ Enter current pwd
   ├─→ Enter new pwd
   ├─→ See strength meter
   ├─→ Confirm password
   ├─→ Click Change
   ├─→ See success msg
   └─→ Auto redirect to profile

6. LOGOUT
   ├─→ Click logout
   ├─→ Confirm dialog
   ├─→ Token cleared
   ├─→ Context cleared
   └─→ Redirect to login
```

---

## 🎓 Learning Path

```
1. Understand Structure (30 min)
   ├─ QUICK_START_PROFILE.md
   ├─ Browse components folder
   └─ Check types.ts

2. Study Components (1 hour)
   ├─ ProfileCard.tsx
   ├─ EditProfileForm.tsx
   ├─ ChangePasswordForm.tsx
   └─ AvatarUpload.tsx

3. Review API & Validation (30 min)
   ├─ lib/api.ts
   └─ lib/validators.ts

4. Test Features (1-2 hours)
   ├─ Follow manual testing steps
   ├─ Test validation
   └─ Test error handling

5. Extend Features (varies)
   ├─ Add more validators
   ├─ Add components
   └─ Add API calls
```

---

**This visual guide helps understand the complete profile system architecture!**

---

Total Diagrams: 15+  
Complexity: Medium  
Understanding Level: Beginner to Intermediate  
Time to Study: 1-2 hours  

For more details, see [PROFILE_SYSTEM.md](PROFILE_SYSTEM.md)
