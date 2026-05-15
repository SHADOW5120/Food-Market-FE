# Seller Portal - Quick Start Guide

## 🚀 Getting Started

### 1. Seller Registration
**URL**: `/seller-auth/register`

Fill in all required information:
- **Personal Info**: Username, Email, Password
- **Store Info**: Store Name
- **Contact**: Phone Number
- **Address**: Street, City, State, ZIP

### 2. Seller Login
**URL**: `/seller-auth/login`

After registration, login with:
- Email
- Password
- Optional: "Remember me"

---

## 📊 Main Seller Portal Features

### Dashboard (`/seller/dashboard`)
Your home page showing:
- **Total Orders**: Quick access to all orders
- **Revenue**: Total sales amount
- **Products**: Total product count
- **Rating**: Your store average rating

### Charts & Metrics
- **Revenue Trend**: 30-day sales visualization
- **Order Status**: Distribution of pending, confirmed, delivering, completed orders
- **Recent Orders**: Last 5 orders with quick access
- **Quick Actions**: Add products, view orders, check analytics

---

## 📦 Product Management

### View All Products (`/seller/products`)
- Search products by name
- Filter by status: Draft, Active, Inactive, Out of Stock
- View product details: image, price, stock, sold count, status
- Actions: View, Edit, Delete products
- Pagination support

### Add New Product (`/seller/products/new`)
Required fields:
- **Name**: Product name
- **Description**: Product details
- **Price**: Product price in dollars
- **Stock**: Quantity available
- **Category**: Pizza, Burgers, Desserts, Drinks, Other
- **Status**: Draft (hidden) or Active (published)
- **Image**: Optional product image

### Edit Product
- Update any product field
- Change status
- Modify pricing and stock
- Replace product image

### Delete Product
- Removes product from your store
- Orders with deleted products are preserved

---

## 📋 Order Management

### View Orders (`/seller/orders`)
- See all customer orders
- Search by Order ID or Customer Name
- Filter by status: Pending, Confirmed, Delivering, Completed, Cancelled
- View customer name, email, order date, and total
- Pagination support

### Order Details (`/seller/orders/[id]`)
View complete order information:
- **Order Items**: Each item with image, quantity, and subtotal
- **Customer Info**: Name, email, phone, delivery address
- **Order Summary**: Subtotal, tax, delivery fee, total
- **Order Status**: Current status display
- **Update Status**: Change order status and add notes

Status progression:
1. **Pending** - New order received
2. **Confirmed** - Order confirmed and being prepared
3. **Delivering** - Order is being delivered
4. **Completed** - Order received by customer
5. **Cancelled** - Order cancelled

---

## 📈 Analytics (`/seller/analytics`)

### Time Period Selection
- **Week**: Last 7 days
- **Month**: Last 30 days
- **Year**: Last 12 months

### Key Metrics
- **Total Revenue**: Sum of all sales
- **Total Orders**: Number of orders received
- **Average Order Value**: Revenue divided by orders
- **Conversion Rate**: Percentage of completed sales

### Charts
- **Revenue Trend**: Line chart showing daily sales
- **Top Products**: Bar chart of best-selling items

### Detailed Insights
- **Customer Insights**: Total, repeat, and new customers
- **Order Status**: Breakdown of pending, completed, cancelled orders

---

## ⚙️ Store Settings (`/seller/settings`)

### Store Profile
- **Logo**: Your store logo/branding
- **Store Name**: Name visible to customers
- **Description**: Store description and details

### Contact Information
- **Phone**: Store phone number

### Address Information
- **Address**: Street address
- **City, State, ZIP**: Location details

### Save Changes
- All changes are saved to your store profile
- Updates visible to customers immediately

---

## 🔐 Navigation & Security

### Sidebar Navigation
Quick access to all sections:
1. **Dashboard** - Home page
2. **Products** - Manage your products
3. **Orders** - Manage customer orders
4. **Analytics** - View sales insights
5. **Settings** - Update store profile
6. **Logout** - Exit seller portal

### Mobile Menu
- Tap floating menu button (bottom right)
- Access all navigation items
- Click to expand/collapse

### Protected Routes
All seller pages are protected. You must:
- Be logged in as a seller
- Have a valid JWT token
- Attempting to access customer pages will redirect you

---

## 💡 Tips & Best Practices

### Product Management
✅ **DO:**
- Add high-quality product images
- Write detailed descriptions
- Keep stock accurate
- Use appropriate categories
- Archive instead of delete (saves order history)

❌ **DON'T:**
- Leave products as "Draft" if you want sales
- Use misleading descriptions
- Set unrealistic prices
- Ignore low stock warnings

### Order Management
✅ **DO:**
- Update order status promptly
- Communicate with customers
- Process refunds fairly
- Keep accurate records

❌ **DON'T:**
- Ignore pending orders
- Cancel confirmed orders without reason
- Delay status updates
- Ignore customer messages

### Analytics Review
✅ **DO:**
- Check analytics weekly
- Analyze top-performing products
- Track revenue trends
- Monitor customer feedback

❌ **DON'T:**
- Ignore declining sales
- Skip monthly review
- Ignore low ratings
- Forget to update inventory

---

## ❓ Common Questions

### Q: How do I add a product?
A: Go to Products → Add Product → Fill form → Upload image → Create

### Q: How do I update an order status?
A: Orders → Select order → Change status in dropdown → Update Status

### Q: How do I delete a product?
A: Products → Select product → Click delete → Confirm deletion

### Q: Where can I see my earnings?
A: Analytics → View total revenue and trends

### Q: How do I update my store info?
A: Settings → Modify store details → Save Changes

### Q: Can I recover a deleted product?
A: Currently, deletion is permanent. Always review before deleting.

### Q: How often is analytics data updated?
A: Analytics are updated in real-time as orders are received.

### Q: What file formats are supported for images?
A: PNG, JPG, GIF (Max 5MB)

---

## 🔗 Quick Links

| Page | URL |
|------|-----|
| Seller Login | `/seller-auth/login` |
| Seller Register | `/seller-auth/register` |
| Dashboard | `/seller/dashboard` |
| Products | `/seller/products` |
| Add Product | `/seller/products/new` |
| Orders | `/seller/orders` |
| Analytics | `/seller/analytics` |
| Settings | `/seller/settings` |

---

## 📧 Support

For issues or questions:
1. Check this guide first
2. Review the implementation documentation
3. Check error messages in the UI (toast notifications)
4. Verify all required fields are filled correctly

---

## 🎯 Success Metrics

Track your seller success:
- ✅ Monitor revenue trends
- ✅ Track order count growth
- ✅ Maintain high customer ratings
- ✅ Keep products up to date
- ✅ Respond to customer messages promptly
- ✅ Update inventory regularly

Happy selling! 🎉
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

