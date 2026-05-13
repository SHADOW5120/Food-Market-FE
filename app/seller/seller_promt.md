Implement a complete Seller/Vendor system for this React/Next.js application.

Current situation:
- The app only supports normal users
- There is currently NO seller login/register flow
- There is NO seller dashboard/management system
- Seller-specific features and analytics are missing

Your task:
Build a full modern Seller Portal with clean architecture, reusable components, and production-ready code.

Required features:

1. Seller Authentication
- Seller Register page
- Seller Login page
- Seller session/auth handling
- Role-based authentication (`user` vs `seller`)
- Protected seller routes
- Validation and error handling
- Modern UI consistent with the existing app

2. Seller Dashboard
Create a premium dashboard UI with:
- Overview cards
- Revenue summary
- Orders summary
- Product summary
- Recent activity
- Charts/analytics
- Responsive layout
- Sidebar/topbar navigation

3. Seller Product Management
- Create product
- Edit product
- Delete product
- Upload/manage product images
- Product inventory/stock management
- Product status (active/draft/out of stock)

4. Seller Order Management
- View customer orders
- Update order status
- Track pending/completed/cancelled orders
- Order details page

5. Seller Analytics
- Revenue chart
- Sales trends
- Top-selling products
- Monthly/weekly statistics
- Order conversion metrics

6. Seller Profile & Settings
- Store profile
- Seller avatar/logo
- Contact info
- Store description
- Password change
- Notification preferences

7. Permissions & Security
- Ensure sellers can only access/manage their own data
- Protect seller APIs and pages
- Handle unauthorized access properly

UI/UX requirements:
- Use modern SaaS dashboard design
- Use TailwindCSS + shadcn/ui style
- Smooth Framer Motion animations
- Sticky sidebar/topbar where appropriate
- Responsive for desktop/tablet/mobile
- Clean spacing and premium UI
- Similar quality to Stripe/Vercel/Linear dashboards

Technical requirements:
- Use scalable folder structure
- Reusable components/hooks
- Proper loading/error states
- Type-safe architecture if using TypeScript
- Clean API abstraction layer
- Optimize rendering/performance

IMPORTANT:
After implementation is complete, generate a clear list of:
1. New backend APIs required
2. API request/response structure
3. Required database schema changes
4. Required authentication/authorization updates
5. Any environment variables or external services needed

Also clearly separate:
- Frontend completed work
- Backend APIs still required
- Optional future improvements