# Seller Portal - Complete Implementation Guide

## ✅ Frontend Implementation Complete

This document outlines the complete Seller/Vendor Portal system that has been implemented in the React/Next.js frontend application.

---

## 🎯 Frontend Features Implemented

### 1. **Seller Authentication System**
- ✅ Seller Registration Page (`/seller-auth/register`)
  - Multi-step form with personal and store information
  - Comprehensive form validation
  - Error handling with user-friendly messages
  - Form sections: Personal Info, Store Info, Contact, Address
  
- ✅ Seller Login Page (`/seller-auth/login`)
  - Email and password authentication
  - "Remember me" functionality
  - "Forgot password" link
  - Role-based access control

### 2. **Seller Dashboard** (`/seller/dashboard`)
- ✅ Dashboard Overview with 4 key metrics:
  - Total Orders (clickable to orders page)
  - Revenue Summary
  - Total Products (clickable to products page)
  - Average Rating
  
- ✅ Revenue Trend Chart (Last 30 Days)
  - Line chart visualization using custom SVG
  - Date-based data points
  
- ✅ Order Status Distribution Chart
  - Bar chart showing pending, confirmed, delivering, completed orders
  
- ✅ Recent Orders Section
  - Table showing last 5 orders
  - Customer name and email
  - Order total and status
  - Direct links to order details
  
- ✅ Quick Action Cards
  - Add Product
  - View Orders
  - View Analytics

### 3. **Product Management** (`/seller/products`)
- ✅ Product List Page
  - Paginated product table (10 items per page)
  - Search functionality
  - Status filter (draft, active, inactive, out_of_stock)
  - Action buttons: View, Edit, Delete
  - Product details: image, name, price, stock, sold, status
  
- ✅ Create Product Page (`/seller/products/new`)
  - Form fields: name, description, price, stock, category, status
  - Image upload with preview
  - Form validation
  - Category dropdown
  - Status selection (draft/active/inactive)
  
- ✅ Product Detail & Edit Page (`/seller/products/[id]`)
  - View product information
  - Edit existing products
  - Update product status
  - Manage stock quantity

### 4. **Order Management** (`/seller/orders`)
- ✅ Orders List Page
  - Paginated orders table
  - Search by order ID or customer name
  - Filter by order status
  - Columns: Order ID, Customer, Date, Total, Status
  - View button to access order details
  
- ✅ Order Detail Page (`/seller/orders/[id]`)
  - Order items with images and quantities
  - Customer information (name, email, phone)
  - Delivery address
  - Order summary (subtotal, tax, delivery fee, total)
  - Current status display
  - Status update functionality
  - Notes/history tracking

### 5. **Analytics Dashboard** (`/seller/analytics`)
- ✅ Period Filter (Week/Month/Year)
- ✅ Key Metrics Display:
  - Total Revenue
  - Total Orders
  - Average Order Value
  - Conversion Rate
  
- ✅ Revenue Trend Chart
  - Visualizes revenue over selected period
  
- ✅ Top Selling Products Chart
  - Bar chart showing best-performing products
  
- ✅ Detailed Insights:
  - Customer insights (total, repeat, new)
  - Order status breakdown (pending, completed, cancelled)

### 6. **Store Settings/Profile** (`/seller/settings`)
- ✅ Store Logo Upload
  - Image preview
  - File upload with validation
  
- ✅ Store Information Section
  - Store name
  - Store description
  
- ✅ Contact Information
  - Phone number
  
- ✅ Address Management
  - Street address
  - City, State, ZIP code

### 7. **UI Components Created**
- ✅ **Seller Layout** - Main layout with sidebar and topbar
- ✅ **Sidebar** - Navigation with all menu items
- ✅ **Topbar** - User info and notifications
- ✅ **Stat Card** - Metric display with trends
- ✅ **Status Badge** - Order status indicator
- ✅ **Chart Card** - Chart container
- ✅ **Charts** - SimpleBarChart and SimpleLineChart
- ✅ **Product Row** - Table row for products
- ✅ **Protected Route** - Role-based access control

### 8. **Architecture & Code Quality**
- ✅ Type-safe TypeScript throughout
- ✅ Reusable components and hooks
- ✅ Proper error handling with toast notifications
- ✅ Loading states and skeleton screens
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Consistent UI/UX with existing app
- ✅ Motion animations with Framer Motion
- ✅ Clean API abstraction layer
- ✅ Form validation with error messages

---

## 🔌 Backend APIs Required

### Authentication Endpoints

#### 1. **Seller Register**
```
POST /api/seller/auth/register
Content-Type: application/json

Request:
{
  "username": "seller_name",
  "email": "seller@example.com",
  "password": "SecurePassword123!",
  "storeName": "My Store",
  "phone": "+1-555-123-4567",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zip": "10001"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "seller_123",
      "username": "seller_name",
      "email": "seller@example.com",
      "phone": "+1-555-123-4567",
      "role": "seller",
      "createdAt": "2024-03-21T10:00:00Z"
    },
    "accessToken": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "expiresIn": 3600
  }
}
```

#### 2. **Seller Login**
```
POST /api/seller/auth/login
Content-Type: application/json

Request:
{
  "email": "seller@example.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "seller_123",
      "username": "seller_name",
      "email": "seller@example.com",
      "role": "seller"
    },
    "accessToken": "jwt_token_here",
    "expiresIn": 3600
  }
}
```

---

### Dashboard Endpoints

#### 3. **Get Dashboard Stats**
```
GET /api/seller/dashboard/stats
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "totalOrders": 24,
    "totalRevenue": 2450.00,
    "totalProducts": 18,
    "activeProducts": 16,
    "averageRating": 4.8,
    "totalCustomers": 156,
    "pendingOrders": 5,
    "completedOrders": 19
  }
}
```

#### 4. **Get Analytics Data**
```
GET /api/seller/dashboard/analytics?period=month
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "date": "2024-02-21",
      "revenue": 234.50,
      "orders": 5,
      "customers": 3,
      "products": 8
    },
    ...
  ]
}
```

---

### Product Management Endpoints

#### 5. **Get Seller Products (Paginated)**
```
GET /api/seller/products?page=1&limit=10&status=active
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "prod_123",
        "name": "Delicious Burger",
        "description": "...",
        "price": 12.99,
        "categoryId": "cat_1",
        "image": "url",
        "stock": 100,
        "sold": 45,
        "views": 234,
        "status": "active",
        "rating": 4.5,
        "reviewCount": 12,
        "createdAt": "2024-03-20T10:00:00Z"
      },
      ...
    ],
    "total": 18,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

#### 6. **Get Product by ID**
```
GET /api/seller/products/{productId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "prod_123",
    "name": "Delicious Burger",
    "description": "...",
    "price": 12.99,
    "categoryId": "cat_1",
    "image": "url",
    "stock": 100,
    "sold": 45,
    "views": 234,
    "status": "active",
    "rating": 4.5,
    "reviewCount": 12,
    "createdAt": "2024-03-20T10:00:00Z"
  }
}
```

#### 7. **Create Product**
```
POST /api/seller/products
Content-Type: multipart/form-data
Headers: Authorization: Bearer {token}

Request:
{
  "name": "Delicious Burger",
  "description": "Juicy burger with fresh ingredients",
  "price": "12.99",
  "categoryId": "cat_1",
  "stock": "100",
  "status": "active",
  "image": <file>
}

Response:
{
  "success": true,
  "data": {
    "id": "prod_456",
    "name": "Delicious Burger",
    "description": "Juicy burger with fresh ingredients",
    "price": 12.99,
    "categoryId": "cat_1",
    "image": "url",
    "stock": 100,
    "sold": 0,
    "status": "active",
    "createdAt": "2024-03-21T10:00:00Z"
  }
}
```

#### 8. **Update Product**
```
PUT /api/seller/products/{productId}
Content-Type: multipart/form-data
Headers: Authorization: Bearer {token}

Request:
{
  "name": "Updated Burger Name",
  "price": "14.99",
  "stock": "75",
  "status": "active",
  "image": <file> (optional)
}

Response:
{
  "success": true,
  "data": { ... updated product object ... }
}
```

#### 9. **Delete Product**
```
DELETE /api/seller/products/{productId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": null
}
```

---

### Order Management Endpoints

#### 10. **Get Seller Orders (Paginated)**
```
GET /api/seller/orders?page=1&limit=10&status=pending
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "order_123",
        "orderNumber": "ORD-001",
        "customer": {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1-555-123-4567"
        },
        "deliveryAddress": {
          "street": "456 Oak Ave",
          "city": "Los Angeles",
          "state": "CA",
          "zip": "90001"
        },
        "items": [
          {
            "id": "item_1",
            "name": "Burger",
            "quantity": 2,
            "price": 12.99,
            "image": "url"
          }
        ],
        "subtotal": 25.98,
        "tax": 2.07,
        "deliveryFee": 5.00,
        "total": 33.05,
        "status": "pending",
        "createdAt": "2024-03-21T10:00:00Z"
      },
      ...
    ],
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

#### 11. **Get Order Detail**
```
GET /api/seller/orders/{orderId}
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": { ... order object from above ... }
}
```

#### 12. **Update Order Status**
```
PUT /api/seller/orders/{orderId}/status
Headers: Authorization: Bearer {token}
Content-Type: application/json

Request:
{
  "status": "delivering",
  "notes": "Order is on its way"
}

Response:
{
  "success": true,
  "data": { ... updated order object ... }
}
```

---

### Store Profile Endpoints

#### 13. **Get Store Profile**
```
GET /api/seller/store
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "id": "store_123",
    "name": "My Store",
    "description": "Best burgers in town",
    "logo": "url",
    "coverImage": "url",
    "email": "seller@example.com",
    "phone": "+1-555-123-4567",
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "rating": 4.8,
    "reviewCount": 245,
    "verified": true,
    "status": "active",
    "sellerId": "seller_123",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### 14. **Update Store Profile**
```
PUT /api/seller/store
Content-Type: multipart/form-data
Headers: Authorization: Bearer {token}

Request:
{
  "name": "Updated Store Name",
  "description": "Updated description",
  "phone": "+1-555-987-6543",
  "address": "456 New Street",
  "city": "Chicago",
  "state": "IL",
  "zip": "60601",
  "logo": <file> (optional),
  "coverImage": <file> (optional)
}

Response:
{
  "success": true,
  "data": { ... updated store object ... }
}
```

---

### Notification Endpoints

#### 15. **Get Notifications**
```
GET /api/seller/notifications
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": [
    {
      "id": "notif_1",
      "type": "order",
      "title": "New Order Received",
      "message": "Order #ORD-001 has been placed",
      "read": false,
      "createdAt": "2024-03-21T10:00:00Z"
    },
    ...
  ]
}
```

#### 16. **Mark Notification as Read**
```
PUT /api/seller/notifications/{notificationId}/read
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": null
}
```

---

## 📊 Database Schema Changes Required

### New Tables

#### 1. **sellers** table
```sql
CREATE TABLE sellers (
  id VARCHAR(36) PRIMARY KEY,
  userId VARCHAR(36) UNIQUE NOT NULL,
  storeId VARCHAR(36) NOT NULL,
  businessLicense VARCHAR(255),
  verificationStatus ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  commissionRate DECIMAL(5, 2) DEFAULT 10.00,
  balance DECIMAL(15, 2) DEFAULT 0.00,
  bankAccount VARCHAR(255),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

#### 2. **stores** table
```sql
CREATE TABLE stores (
  id VARCHAR(36) PRIMARY KEY,
  sellerId VARCHAR(36) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  logo VARCHAR(500),
  coverImage VARCHAR(500),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  country VARCHAR(100),
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviewCount INT DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sellerId) REFERENCES sellers(id)
);
```

#### 3. **seller_analytics** table
```sql
CREATE TABLE seller_analytics (
  id VARCHAR(36) PRIMARY KEY,
  sellerId VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  revenue DECIMAL(15, 2) DEFAULT 0.00,
  ordersCount INT DEFAULT 0,
  customersCount INT DEFAULT 0,
  productsCount INT DEFAULT 0,
  viewsCount INT DEFAULT 0,
  conversionRate DECIMAL(5, 2) DEFAULT 0.00,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sellerId) REFERENCES sellers(id),
  UNIQUE KEY unique_seller_date (sellerId, date)
);
```

#### 4. **seller_notifications** table
```sql
CREATE TABLE seller_notifications (
  id VARCHAR(36) PRIMARY KEY,
  sellerId VARCHAR(36) NOT NULL,
  type ENUM('order', 'review', 'message', 'system') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  relatedId VARCHAR(36),
  read BOOLEAN DEFAULT false,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sellerId) REFERENCES sellers(id)
);
```

#### 5. **seller_products** table (extends products)
```sql
ALTER TABLE products ADD COLUMN sellerId VARCHAR(36) AFTER storeId;
ALTER TABLE products ADD COLUMN stock INT DEFAULT 0;
ALTER TABLE products ADD COLUMN sold INT DEFAULT 0;
ALTER TABLE products ADD COLUMN views INT DEFAULT 0;
ALTER TABLE products ADD COLUMN status ENUM('draft', 'active', 'inactive', 'out_of_stock') DEFAULT 'active';
ALTER TABLE products ADD FOREIGN KEY (sellerId) REFERENCES sellers(id);
```

#### 6. **seller_orders** table (extends orders)
```sql
ALTER TABLE orders ADD COLUMN sellerId VARCHAR(36);
ALTER TABLE orders ADD FOREIGN KEY (sellerId) REFERENCES sellers(id);
```

---

## 🔐 Authentication & Authorization Updates

### 1. **User Role Extension**
- Update `users` table to ensure `role` field supports: `'user'`, `'seller'`, `'admin'`
- Add role-based middleware on backend

### 2. **Middleware Requirements**
- Create `@RequireRole('seller')` middleware
- Create `@RequireRole('admin')` middleware
- Create `@SellerOwnershipCheck` middleware for product/order verification

### 3. **Token Payload**
Include in JWT token:
```json
{
  "userId": "user_123",
  "email": "seller@example.com",
  "role": "seller",
  "sellerId": "seller_123",
  "storeId": "store_123"
}
```

---

## 🌍 Environment Variables

Add to backend `.env`:
```
# Seller Settings
SELLER_COMMISSION_RATE=10
SELLER_VERIFICATION_REQUIRED=true
SELLER_BANK_INTEGRATION=stripe

# File Upload
MAX_FILE_SIZE=5242880  # 5MB in bytes
UPLOAD_DIR=./uploads/sellers

# Notifications
ENABLE_SELLER_NOTIFICATIONS=true
```

---

## 📋 Additional Backend Features (Optional/Future)

### 1. **Seller Dashboard Analytics**
- Monthly revenue calculations
- Customer acquisition metrics
- Product performance metrics
- Top-selling products analysis

### 2. **Advanced Order Management**
- Batch order status updates
- Order export (CSV, PDF)
- Order history/timeline
- Refund processing

### 3. **Inventory Management**
- Stock level alerts
- Automatic re-order notifications
- Stock history tracking
- Bulk inventory updates

### 4. **Seller Reviews & Ratings**
- Customer reviews per seller
- Average seller rating
- Review response system
- Rating display on store profile

### 5. **Seller Messaging**
- Direct customer messaging
- Message history
- Notification for new messages
- Message templates

### 6. **Financial Management**
- Commission calculations
- Payout history
- Seller earnings dashboard
- Tax reporting

### 7. **Seller Verification System**
- Document upload and verification
- Business license validation
- Bank account verification
- KYC (Know Your Customer) checks

---

## 🚀 Deployment Checklist

### Frontend
- [x] Components created
- [x] Pages implemented
- [x] API integration points ready
- [x] Type safety implemented
- [x] Error handling added
- [x] Responsive design complete
- [ ] Performance optimization needed
- [ ] SEO optimization needed

### Backend Required
- [ ] Database schema migrations
- [ ] API endpoints implementation
- [ ] Authentication middleware
- [ ] Role-based access control
- [ ] File upload handling
- [ ] Email notifications (order updates)
- [ ] Analytics data aggregation
- [ ] Error handling middleware
- [ ] Rate limiting
- [ ] Input validation
- [ ] API documentation (Swagger)
- [ ] Testing (unit, integration, e2e)

---

## 📝 API Integration Summary

The frontend is ready to consume all the API endpoints listed above. Each endpoint call is properly typed using TypeScript interfaces and is wrapped with error handling and toast notifications for user feedback.

### Key Integration Points:
1. All API calls use the centralized `apiClient` in `lib/api.ts`
2. Authentication is handled via JWT tokens stored in auth store
3. All seller routes are protected with `ProtectedRoute` component
4. Forms have comprehensive validation before API calls
5. Loading states and error states are handled gracefully

---

## 🎨 UI/UX Features

- **Modern Dashboard Design** - Clean, professional interface
- **Responsive Layout** - Mobile, tablet, and desktop support
- **Dark Mode Ready** - CSS variables for theming
- **Smooth Animations** - Framer Motion for transitions
- **Accessibility** - Semantic HTML, proper form labels
- **Loading States** - Skeleton screens and spinners
- **Error Handling** - Toast notifications for feedback
- **Form Validation** - Real-time error messages

---

## 📞 Support & Maintenance

- Regular updates to match backend API changes
- Component library for reusability
- Documentation for future maintenance
- Type safety prevents runtime errors
- Clean code architecture for scalability

