# Seller Dashboard System - Complete Guide

## Overview

The Seller Dashboard is a comprehensive store management interface for vendors to manage their products, orders, and store performance. It provides a complete CRUD interface for product management and order tracking with real-time status updates.

## Table of Contents

1. [Architecture](#architecture)
2. [File Structure](#file-structure)
3. [Components](#components)
4. [Pages](#pages)
5. [API Integration](#api-integration)
6. [Data Models](#data-models)
7. [Features](#features)
8. [Getting Started](#getting-started)
9. [Development Guide](#development-guide)
10. [Troubleshooting](#troubleshooting)

---

## Architecture

### Component Hierarchy

```
SellerLayout (wrapper)
├── Sidebar (navigation)
├── Topbar (header)
└── Main Content
    ├── Dashboard (overview)
    ├── Products (list/manage)
    │   ├── Product List
    │   ├── Add/Edit Form
    │   └── ProductRow (table component)
    └── Orders (list/details)
        ├── Orders List
        └── Order Details
```

### Technology Stack

- **Framework**: Next.js 16.2.1 with TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: React Hooks (useState, useContext)
- **Authentication**: Bearer Token with useAuth hook
- **Routing**: Next.js App Router with dynamic routes

---

## File Structure

```
app/seller/
├── page.tsx                    # Dashboard (overview & stats)
├── products/
│   ├── page.tsx               # Products list with CRUD
│   ├── new/
│   │   └── page.tsx           # Add new product form
│   └── [id]/
│       └── page.tsx           # Edit product form
└── orders/
    ├── page.tsx               # Orders list with filters
    └── [id]/
        └── page.tsx           # Order details view

components/seller/
├── SellerLayout.tsx           # Main layout wrapper
├── Sidebar.tsx                # Navigation menu
├── Topbar.tsx                 # Header with store info
├── StatusBadge.tsx            # Color-coded status display
├── StatCard.tsx               # Dashboard metric card
└── ProductRow.tsx             # Product table row

lib/
├── api.ts                     # API functions (seller endpoints)
├── types.ts                   # Type definitions (Product, Order, etc.)
├── auth-context.tsx           # Auth state management
├── hooks.ts                   # Custom hooks
└── validators.ts              # Form validation functions
```

---

## Components

### SellerLayout

**Purpose**: Wrapper component that provides consistent layout across all seller pages.

**Props**:
```typescript
interface SellerLayoutProps {
  children: React.ReactNode;
  user?: User;
}
```

**Usage**:
```tsx
<SellerLayout user={user}>
  {/* Page content */}
</SellerLayout>
```

**Features**:
- Fixed sidebar navigation
- Topbar with user profile
- Responsive mobile drawer
- Main content area

---

### Sidebar

**Purpose**: Navigation menu for seller dashboard with mobile support.

**Features**:
- Dashboard link
- Products management link
- Orders management link
- Mobile responsive drawer
- Logout button
- Active state highlighting

**Menu Items**:
- 📊 Dashboard
- 📦 Products
- 📋 Orders

---

### Topbar

**Purpose**: Header component showing store information and user profile.

**Displays**:
- Store name from user profile
- Store status badge
- User avatar with initials
- Notification bell (placeholder)

---

### StatusBadge

**Purpose**: Color-coded status indicator component.

**Supported Statuses**:
- `pending`: Yellow badge
- `confirmed`: Blue badge
- `delivering`: Purple badge
- `completed`: Green badge
- `available`: Green badge
- `unavailable`: Gray badge

**Usage**:
```tsx
<StatusBadge status="confirmed" />
```

---

### StatCard

**Purpose**: Dashboard metric card with trend indicators.

**Props**:
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  onClick?: () => void;
}
```

**Example**:
```tsx
<StatCard
  title="Total Orders"
  value={150}
  icon="📋"
  trend={{ value: 12, direction: 'up' }}
  onClick={() => router.push('/seller/orders')}
/>
```

---

### ProductRow

**Purpose**: Table row component for displaying product information with action buttons.

**Features**:
- Product image preview
- Product name and category
- Price display
- Status badge
- Edit button
- Delete button (with confirmation)
- Toggle status button

---

## Pages

### Dashboard (/seller)

**Purpose**: Overview of seller store with key metrics and recent orders.

**Features**:
- 4 stat cards: Total Orders, Revenue, Products, Average Rating
- Trend indicators for each stat
- Quick action buttons
- Recent orders table with 3 latest orders
- Click-through to relevant pages

**Mock Data**:
```typescript
const stats = [
  { title: 'Total Orders', value: 156, trend: +12 },
  { title: 'Revenue', value: '$4,285.50', trend: +18 },
  { title: 'Products', value: 24, trend: +3 },
  { title: 'Avg Rating', value: '4.8/5', trend: 0.2 },
];
```

---

### Products List (/seller/products)

**Purpose**: Manage all products with search, filter, and CRUD operations.

**Features**:
- Search by product name (real-time)
- Filter by status (All/Available/Unavailable)
- Product count display
- Table with columns:
  - Product image
  - Product name
  - Category
  - Price
  - Status
  - Actions (Edit, Delete, Toggle)
- Add product button
- Empty state handling

**Search/Filter**:
```typescript
const filtered = products.filter(p => {
  const searchMatch = p.name.toLowerCase().includes(query);
  const statusMatch = status === 'All' || p.status === status;
  return searchMatch && statusMatch;
});
```

---

### Add Product (/seller/products/new)

**Purpose**: Form to create new products.

**Form Fields**:
- Image upload with preview
- Product name (required)
- Description (required)
- Price (required, must be > 0)
- Category (dropdown)
- Status (radio: available/unavailable)

**Validation**:
- All required fields must be filled
- Price must be positive number
- Image must be under 5MB and valid image format

**Categories Available**:
- Pizza
- Burgers
- Salad
- Drinks
- Desserts
- Appetizers
- Other

---

### Edit Product (/seller/products/[id])

**Purpose**: Form to update existing product details.

**Features**:
- Pre-populate form with current product data
- Image replacement or keep current
- All validation same as create
- Back navigation to products list

**Note**: Currently uses same form as new product, but structured to handle both operations.

---

### Orders List (/seller/orders)

**Purpose**: View and manage all customer orders.

**Features**:
- Search by customer name, email, or order number
- Filter by order status
- Order count display
- Table with columns:
  - Order number
  - Customer name with email
  - Number of items
  - Total price
  - Status badge
  - Order date
  - Actions (View Details, Update Status)
- Status update modal for quick changes
- Empty state handling

**Status Options**:
- Pending (yellow)
- Confirmed (blue)
- Delivering (purple)
- Completed (green)

---

### Order Details (/seller/orders/[id])

**Purpose**: Detailed view of single order with all information.

**Sections**:

#### Customer Information
- Name
- Email (clickable for contact)
- Phone (clickable for contact)

#### Delivery Address
- Full address display
- Street, city, state, zip

#### Order Items
- Product list with quantities
- Price for each item
- Subtotal of items

#### Order Summary (Sidebar)
- Subtotal
- Tax
- Delivery fee
- Total price
- Estimated delivery time
- Status update button

#### Features
- Status badge display
- Quick status update modal
- Customer notes display
- Back navigation
- Sticky summary sidebar

---

## API Integration

### Seller API Endpoints

All endpoints require authentication with Bearer token.

#### Dashboard
```
GET /seller/dashboard
Response: { stats, recentOrders, topProducts }
```

#### Products
```
GET    /seller/products          # List all products
POST   /seller/products          # Create new product
PUT    /seller/products/:id      # Update product
DELETE /seller/products/:id      # Delete product
```

#### Orders
```
GET    /seller/orders            # List all orders
GET    /seller/orders/:id        # Get order details
PUT    /seller/orders/:id        # Update order status
```

### API Function Examples

**Create Product**:
```typescript
const formData = new FormData();
formData.append('name', 'Pizza');
formData.append('price', '12.99');
formData.append('image', file);
await createProduct(formData);
```

**Update Order Status**:
```typescript
await updateOrderStatus(orderId, 'confirmed');
```

**Get Orders**:
```typescript
const { data: orders } = await getSellerOrders();
```

### Authentication

All seller API calls use the `getAuthHeader()` function which adds the Bearer token:
```
Authorization: Bearer <accessToken>
```

The token is retrieved from `localStorage.getItem('accessToken')`.

---

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  status: 'available' | 'unavailable';
  createdAt?: string;
  updatedAt?: string;
}
```

### Order
```typescript
interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  items: OrderItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'confirmed' | 'delivering' | 'completed';
  notes?: string;
  createdAt: string;
  estimatedDelivery?: string;
}
```

### OrderItem
```typescript
interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}
```

### SellerStats
```typescript
interface SellerStats {
  totalOrders: number;
  revenue: number;
  products: number;
  rating: number;
  trend: {
    orders: number;
    revenue: number;
  };
}
```

---

## Features

### Dashboard Features
- ✅ Statistical overview with 4 key metrics
- ✅ Trend indicators for each metric
- ✅ Recent orders at a glance
- ✅ Quick navigation to products and orders
- ✅ Responsive design

### Product Management
- ✅ List all products with pagination/filtering
- ✅ Search products by name
- ✅ Filter by availability status
- ✅ Add new products with image upload
- ✅ Edit existing products
- ✅ Delete products with confirmation
- ✅ Toggle product availability
- ✅ Category organization
- ✅ Price management

### Order Management
- ✅ View all orders in list
- ✅ Search orders by customer/email/order number
- ✅ Filter orders by status
- ✅ View detailed order information
- ✅ Update order status
- ✅ Contact customer (email/phone links)
- ✅ View order items and totals
- ✅ See customer delivery address
- ✅ View special instructions/notes

### UI Features
- ✅ Responsive mobile-first design
- ✅ Mobile drawer navigation
- ✅ Color-coded status indicators
- ✅ Form validation with error messages
- ✅ Confirmation dialogs for destructive actions
- ✅ Loading states
- ✅ Empty states
- ✅ Toast notifications (ready to implement)

---

## Getting Started

### 1. Access Seller Dashboard

Navigate to `/seller` after logging in as a seller account.

### 2. View Dashboard Overview

The dashboard page shows:
- Key statistics
- Revenue trends
- Recent orders overview
- Product count

### 3. Manage Products

Go to `/seller/products` to:
- See all your products
- Search by name
- Filter by availability
- Add new products via `/seller/products/new`
- Edit products via `/seller/products/[id]`
- Delete or toggle status

### 4. Manage Orders

Go to `/seller/orders` to:
- See all customer orders
- Search and filter orders
- View order details by clicking "View Details"
- Update order status from the modal

---

## Development Guide

### Adding a New Feature

#### 1. Extend Type Definitions

Add types to `lib/types.ts`:
```typescript
export interface NewFeature {
  id: string;
  // ... fields
}
```

#### 2. Create API Function

Add to `lib/api.ts`:
```typescript
export async function getNewFeature(): Promise<{
  success: boolean;
  data?: NewFeature[];
  error?: string;
}> {
  try {
    const response = await authenticatedFetch(`${API_BASE_URL}/seller/feature`);
    // ... handle response
  } catch (error) {
    // ... handle error
  }
}
```

#### 3. Create Component

Create component in `components/seller/`:
```tsx
interface Props {
  data: NewFeature;
  onAction?: () => void;
}

export function FeatureComponent({ data, onAction }: Props) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

#### 4. Create Page

Create page in `app/seller/`:
```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { SellerLayout } from '@/components/seller/SellerLayout';

export default function FeaturePage() {
  const { user } = useAuth();

  return (
    <SellerLayout user={user}>
      {/* Page content */}
    </SellerLayout>
  );
}
```

### Styling Guidelines

- Use Tailwind CSS utility classes
- Mobile-first responsive design
- Green color scheme for primary actions (#16a34a)
- Gray color scheme for secondary actions
- Status colors: yellow (pending), blue (confirmed), purple (delivering), green (completed)

### Form Validation

Use validators from `lib/validators.ts`:
```typescript
const errors: Record<string, string> = {};

if (!name.trim()) errors.name = 'Name is required';
if (price <= 0) errors.price = 'Price must be > 0';

if (Object.keys(errors).length > 0) {
  setErrors(errors);
  return;
}
```

### API Error Handling

```typescript
try {
  const result = await apiFunction();
  if (!result.success) {
    setErrors({ submit: result.error || 'Operation failed' });
    return;
  }
  // Handle success
} catch (error) {
  setErrors({ submit: 'An unexpected error occurred' });
}
```

---

## Integration Checklist

- [ ] Replace mock data with actual API calls
- [ ] Implement real image upload to backend
- [ ] Add pagination for large lists
- [ ] Implement toast notifications for user feedback
- [ ] Add loading skeletons for better UX
- [ ] Implement real-time updates for orders
- [ ] Add analytics/reporting features
- [ ] Implement product analytics/views
- [ ] Add inventory management
- [ ] Implement promotional pricing
- [ ] Add bulk operations (delete, status change)
- [ ] Implement order export (PDF/CSV)
- [ ] Add customer communication features

---

## Troubleshooting

### Issue: Not authenticated in seller pages

**Solution**: Ensure user is logged in and token is stored in localStorage. The `useAuth` hook should provide the user object.

```typescript
if (!user) {
  return <div>Please log in as a seller</div>;
}
```

### Issue: Images not uploading

**Solution**: Check file size (max 5MB) and format. Use FormData for multipart requests:

```typescript
const formData = new FormData();
formData.append('image', file);
```

### Issue: API calls failing

**Solution**: Verify:
1. API base URL in environment: `NEXT_PUBLIC_API_URL`
2. Bearer token in localStorage
3. API endpoint paths match backend routes
4. Request headers include `Content-Type`

### Issue: Responsive design broken

**Solution**: Use Tailwind's responsive prefixes:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Mobile: 1 column, Desktop: 3 columns */}
</div>
```

---

## Next Steps

1. **Connect to Backend**: Replace mock data with API calls
2. **Implement Image Upload**: Integrate file upload to server
3. **Add Notifications**: Implement toast/alert system
4. **Real-time Updates**: Add WebSocket for live order updates
5. **Analytics**: Add charts for sales trends
6. **Inventory**: Add stock management features

---

## Support

For questions or issues:
1. Check the documentation in relevant files
2. Review component prop interfaces
3. Check console for error messages
4. Verify API endpoints are correctly configured
5. Test with mock data first before backend integration

