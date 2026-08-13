## 📖 Project Overview
Food Market is a high-performance Single Page Application (SPA) designed to connect food enthusiasts with local culinary merchants. This repository contains the **Front-End** source code, focusing on delivering a seamless UI/UX for both buyers and sellers. 

*Note: The current iteration utilizes mock data for business logic simulation, laying the groundwork for future backend RESTful API integration.*

## 🚀 Tech Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (Ensuring strict type-checking and 0 compile errors)
- **Styling:** Tailwind CSS (Fully Responsive & WCAG Accessible)
- **State Management:** React Context API (AuthContext, CartContext)
- **Performance Optimization:** Lazy-loading (for Chart.js), Optimistic UI Updates

## ✨ Core Features

### 🛒 For Buyers
- **Authentication & Profile:** Secure login/registration with real-time client-side validation and profile management (avatar uploads).
- **Shopping Experience:** Browse dynamic product grids, view detailed dish information, and manage favorites (Wishlist) with instant optimistic UI updates.
- **Smart Cart:** Dynamic calculation of subtotals, taxes (10%), and fixed shipping fees, persisted via `localStorage`.
- **Order Tracking:** Checkout flow with a visual timeline tracker to monitor order status (Pending, Confirmed, Delivering, Completed, Cancelled).

### 🏪 For Sellers (Merchant Portal)
- **Analytics Dashboard:** Visual representation of key business metrics (Revenue, Total Orders, Product Count, Average Rating) using lazy-loaded charts over weekly, monthly, and yearly intervals.
- **Product Management:** Complete CRUD operations for digital menus, including image uploads via FormData and availability status toggling.
- **Order Fulfillment:** Comprehensive order management interface to track customer details and update processing states synchronously.

## 🏗️ Architecture
The project strictly follows **Clean Architecture** principles and a 4-tier modular design:
1. **UI Layout Tier:** Reusable React components styled with Tailwind CSS, ensuring responsive design across desktop and mobile.
2. **Global State Tier:** React Context API to manage synchronous states (e.g., cart badges) without prop-drilling or render hell.
3. **API Service Tier:** Centralized API callers handling Bearer Token injections for security.
4. **Mock Data Tier:** TypeScript interfaces and mocked data models for isolated frontend development.

## Project Image
1. Home
<img width="624" height="280" alt="image" src="https://github.com/user-attachments/assets/7ef18361-215d-4690-98fb-11ddf98a6c02" />
<img width="624" height="280" alt="image" src="https://github.com/user-attachments/assets/23b04d62-649b-4d44-a295-3293698da648" />

2. Authentication
<img width="624" height="280" alt="image" src="https://github.com/user-attachments/assets/ef32ca28-37f0-4119-ba9c-2ae460f6b8cf" />
<img width="624" height="281" alt="image" src="https://github.com/user-attachments/assets/a21362e2-8ba4-4773-a3e3-1e901efd74bb" />

3. User Infor
<img width="1429" height="643" alt="Picture1" src="https://github.com/user-attachments/assets/376e12e0-90b3-466c-9cb6-9dd7958dd0bb" />

4. Store
<img width="624" height="281" alt="image" src="https://github.com/user-attachments/assets/ea6dce13-7bae-4acf-9dbd-e7fc597dc2e3" />

5. Product
<img width="624" height="280" alt="image" src="https://github.com/user-attachments/assets/2a910361-b15d-493d-820f-e70f7052b646" />
<img width="624" height="277" alt="image" src="https://github.com/user-attachments/assets/e59eaacd-96fb-4e4f-8c86-ab85fd8bb1e4" />

6. Seller Dashboard
<img width="624" height="279" alt="image" src="https://github.com/user-attachments/assets/1dfc9c24-fd6f-428d-8298-ef3a29e1bb8d" />







