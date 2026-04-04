# Seller Dashboard - Quick Start Guide

## 🚀 Five-Minute Setup

### 1. Access the Dashboard
```
Navigate to: http://localhost:3000/seller
(After logging in)
```

### 2. What You See

#### Dashboard Page (`/seller`)
- 4 metric cards showing store performance
- Recent orders overview
- Quick action buttons

#### Products Page (`/seller/products`)
- List of all your products
- Search and filter functionality
- Add/Edit/Delete buttons

#### Orders Page (`/seller/orders`)
- List of all customer orders
- Search and status filter
- View details button

---

## 📍 Navigation

### Menu Items
- **📊 Dashboard** - Overview & stats
- **📦 Products** - Manage your products
- **📋 Orders** - Track customer orders

### Quick Links
- Click stat cards to navigate to details pages
- "View Details" buttons take you to order pages
- "Add Product" button creates new products

---

## 🎯 Common Tasks

### Add a New Product
1. Go to `/seller/products`
2. Click "Add Product" button
3. Fill in product details:
   - Name
   - Description
   - Price
   - Category
   - Upload image (optional)
4. Click "Add Product"

### Edit a Product
1. Go to `/seller/products`
2. Find product in list
3. Click "Edit" button
4. Modify details
5. Click "Update Product"

### Delete a Product
1. Go to `/seller/products`
2. Find product in list
3. Click "Delete" button
4. Confirm deletion

### Toggle Product Status
1. Go to `/seller/products`
2. Find product in list
3. Click "Toggle Status" button
4. Product availability changes immediately

### View Order Details
1. Go to `/seller/orders`
2. Find order in list
3. Click "View Details" button
4. See complete order information

### Update Order Status
1. From `/seller/orders` list:
   - Click "Update Status" button
   - Select new status from dropdown
   - Click "Update"

2. From order details page:
   - Click "Update Status" button
   - Select new status
   - Click "Update"

---

## 🔍 Search & Filter

### Product Search
- Enter product name in search box
- Results update in real-time
- "All Status" filter to see everything
- "Available" filter to see in-stock items
- "Unavailable" filter to see out-of-stock

### Order Search
- Search by customer name
- Search by email address
- Search by order number (#ORD-001)
- Filter by status (Pending, Confirmed, Delivering, Completed)

---

## 💾 Form Validation

### Product Form Rules
- **Name**: Required
- **Description**: Required (at least 10 characters recommended)
- **Price**: Required and must be greater than 0
- **Category**: Must select from dropdown
- **Image**: Optional, must be under 5MB
- **Status**: Must select Available or Unavailable

### Error Messages
If validation fails:
- ❌ Error message appears in RED
- Form won't submit until fixed
- Fix the error and try again

---

## 📊 Dashboard Metrics

### Stat Cards Show
1. **Total Orders** - All customer orders (with trend ↑↓)
2. **Revenue** - Total money earned (with trend ↑↓)
3. **Products** - Number of products listed (with trend ↑↓)
4. **Avg Rating** - Customer rating (with trend ↑↓)

### Trend Indicators
- ↑ Green arrow = Increase
- ↓ Red arrow = Decrease
- Click card to see more details

---

## 📋 Order Information

### Customer Info Shows
- **Name**: Customer's full name
- **Email**: Clickable email link
- **Phone**: Clickable phone link

### Order Details Include
- **Order Number**: Unique identifier (#ORD-001)
- **Date Ordered**: When order was placed
- **Items**: What customer ordered with quantities
- **Prices**: Subtotal, tax, delivery fee, total
- **Status**: Current order status
- **Address**: Delivery location
- **Notes**: Special instructions from customer

### Status Meanings
- **Pending** (Yellow) - Order just received
- **Confirmed** (Blue) - Order confirmed, preparing
- **Delivering** (Purple) - Order on the way
- **Completed** (Green) - Order delivered

---

## 🖼️ Product Image Upload

### How to Upload
1. Click the dotted box area
2. Select image from your computer
3. Image preview appears on the left
4. Must be PNG or JPG format
5. Maximum file size: 5MB

### Image Requirements
- Format: PNG or JPG only
- Size: Under 5MB
- Recommended: 500x500 pixels or larger
- Aspect ratio: Square (1:1) works best

---

## 🎨 Status Color Guide

### Products
- 🟢 **Green** = Available (in stock)
- ⚫ **Gray** = Unavailable (out of stock)

### Orders
- 🟡 **Yellow** = Pending (awaiting confirmation)
- 🔵 **Blue** = Confirmed (preparing order)
- 🟣 **Purple** = Delivering (on the way)
- 🟢 **Green** = Completed (delivered)

---

## ⌚ Estimated Times

### Delivery Estimates
- Orders show estimated delivery time
- Format: Time of day (HH:MM AM/PM)
- Helps customer plan for delivery

---

## 📱 Mobile Support

### Mobile Features
- Sidebar collapses to hamburger menu
- Menu accessible via ☰ icon
- Touch-friendly buttons
- Responsive tables
- Full functionality on mobile devices

### Best Mobile Practices
- Click "View Details" before taking action
- Use landscape mode for bigger tables
- Mobile drawer might cover content - swipe to close

---

## ⚡ Tips & Tricks

### Efficiency Tips
1. Use search to quickly find products/orders
2. Filters reduce list clutter
3. Click status badges to understand order state
4. Use "Update Status" for quick order changes
5. Add all product details before publishing

### Common Workflows

**Daily Routine**:
1. Check Dashboard for new orders
2. Go to Orders page
3. Update statuses as orders progress
4. Check Products page for inventory

**Product Management**:
1. Regularly add new products
2. Remove unavailable items
3. Update prices as needed
4. Manage product descriptions

**Order Processing**:
1. Confirm pending orders
2. Update status to "Delivering"
3. Mark as "Completed" when delivered
4. Review customer feedback

---

## 🐛 Troubleshooting

### Page Not Loading
- Check login status
- Try refreshing the page
- Clear browser cache
- Check network connection

### Changes Not Saving
- Check form validation errors
- Look for error messages in red
- Ensure all required fields filled
- Try again or refresh page

### Image Won't Upload
- Check image file format (PNG/JPG)
- Verify file size under 5MB
- Try smaller image file
- Use different image name

### Search Not Working
- Check spelling of search term
- Clear search box and try again
- Try using filters instead
- Refresh page

### Status Update Stuck
- Click Update button again
- Check internet connection
- Refresh page
- Try different status

---

## 🔐 Security Notes

### Keep Safe
- Don't share your login credentials
- Logout when done
- Use strong passwords
- Check email for account alerts

### Data Protection
- All data transmitted securely
- Bearer token for authentication
- No sensitive info in URLs
- Regular backups recommended

---

## 📞 Support

### When Something Goes Wrong
1. Check error message shown
2. Review troubleshooting section above
3. Refresh the page
4. Clear browser cache
5. Try different browser
6. Contact support if issue persists

### What Info to Provide
- Page where error occurs
- Error message shown
- Steps taken before error
- Browser type and version
- Order/Product ID if relevant

---

## 🎓 Learning Resources

### Full Documentation
- See `SELLER_DASHBOARD.md` for complete guide
- Includes architecture and technical details
- Component specifications
- API documentation

### Code Examples
Check pages for real-world examples:
- `/app/seller/page.tsx` - Dashboard
- `/app/seller/products/page.tsx` - Product list
- `/app/seller/orders/page.tsx` - Order list

---

## ✨ Feature Overview

| Feature | Status | Location |
|---------|--------|----------|
| View Dashboard Stats | ✅ Ready | `/seller` |
| List Products | ✅ Ready | `/seller/products` |
| Add Products | ✅ Ready | `/seller/products/new` |
| Edit Products | ✅ Ready | `/seller/products/[id]` |
| Delete Products | ✅ Ready | `/seller/products` |
| Toggle Availability | ✅ Ready | `/seller/products` |
| Search Products | ✅ Ready | `/seller/products` |
| Filter Products | ✅ Ready | `/seller/products` |
| List Orders | ✅ Ready | `/seller/orders` |
| View Order Details | ✅ Ready | `/seller/orders/[id]` |
| Update Order Status | ✅ Ready | `/seller/orders` & `/seller/orders/[id]` |
| Search Orders | ✅ Ready | `/seller/orders` |
| Filter Orders | ✅ Ready | `/seller/orders` |
| Contact Customers | ✅ Ready | `/seller/orders/[id]` |

---

## 🎯 Next Steps

1. **Explore Dashboard** - Get familiar with interface
2. **Add Test Products** - Practice product management
3. **View Sample Orders** - Understand order details
4. **Update Statuses** - Practice workflow
5. **Use Filters** - Practice searching and filtering

---

## 📈 Ready to Use!

Your seller dashboard is fully set up and ready to use. All features are working with mock data. To connect to a real backend, follow the integration guide in `SELLER_DASHBOARD.md`.

**Happy Selling! 🎉**

