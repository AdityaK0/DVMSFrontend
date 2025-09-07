# Vendor Management Portal - Frontend

A comprehensive React frontend for a Vendor Management Portal built with Vite, React Router v6, Axios, Zustand, and TailwindCSS.

## 🚀 Features

- **Authentication System**: Signup, login, and protected routes
- **Vendor Onboarding**: Multi-step business profile creation
- **Dashboard**: Overview with stats and recent activities
- **Product Management**: CRUD operations for products
- **Customer Management**: Customer list with CSV upload functionality
- **Event Management**: Create and manage events/festivals with templates
- **Messaging System**: Send campaign messages with template library
- **Analytics Dashboard**: Charts and insights using Recharts
- **Settings**: Profile and preferences management

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with Vite
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **File Format**: All components use `.jsx` files

## 📁 Project Structure

```
src/
├── api/              # Axios API calls for each module
│   ├── config.jsx    # Axios configuration with interceptors
│   ├── auth.jsx      # Authentication API calls
│   ├── vendor.jsx    # Vendor profile API calls
│   ├── products.jsx  # Product management API calls
│   ├── customers.jsx # Customer management API calls
│   ├── events.jsx    # Event management API calls
│   └── messages.jsx  # Messaging API calls
├── components/       # Reusable UI components
│   ├── AuthForm.jsx
│   ├── OnboardingStepper.jsx
│   ├── DashboardStatsCard.jsx
│   ├── ProductList.jsx
│   ├── CustomerTable.jsx
│   ├── EventList.jsx
│   ├── MessageForm.jsx
│   ├── AnalyticsCharts.jsx
│   └── ...
├── pages/           # Route-based pages
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Customers.jsx
│   ├── Events.jsx
│   ├── Messages.jsx
│   ├── Analytics.jsx
│   └── Settings.jsx
├── layouts/         # Layout components
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── store/           # Zustand stores
│   ├── authStore.jsx
│   └── vendorStore.jsx
├── routes/          # React Router configuration
│   └── AppRoutes.jsx
├── App.jsx
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### API Configuration

The API base URL is configured in `src/api/config.jsx`:
```javascript
const API_BASE_URL = 'http://localhost:8000/api/';
```

Update this URL to match your backend API endpoint.

### TailwindCSS

TailwindCSS is configured with custom colors and components. The configuration is in `tailwind.config.js`.

## 📱 Routes

- `/vendor/login` - Login page
- `/vendor/signup` - Signup page
- `/vendor/onboarding` - Vendor onboarding (protected)
- `/vendor/dashboard` - Main dashboard (protected)
- `/vendor/products` - Product management (protected)
- `/vendor/products/new` - Add new product (protected)
- `/vendor/customers` - Customer management (protected)
- `/vendor/events` - Event management (protected)
- `/vendor/events/new` - Create new event (protected)
- `/vendor/messages` - Messaging system (protected)
- `/vendor/analytics` - Analytics dashboard (protected)
- `/vendor/settings` - Settings and profile (protected)

## 🔐 Authentication

The app uses JWT tokens for authentication. Tokens are stored in localStorage and automatically included in API requests via Axios interceptors.

### Protected Routes

Routes are protected using the `ProtectedRoute` component which:
- Redirects unauthenticated users to login
- Redirects authenticated users without vendor profiles to onboarding
- Allows access to protected routes for fully onboarded users

## 🎨 UI Components

### Reusable Components

- **AuthForm**: Handles both login and signup
- **OnboardingStepper**: Multi-step vendor profile creation
- **DashboardStatsCard**: Displays key metrics
- **ProductList**: Product management with search and filters
- **CustomerTable**: Customer list with sorting and search
- **EventList**: Event management with status filtering
- **MessageForm**: Campaign message composition
- **AnalyticsCharts**: Data visualization with Recharts

### Styling

All components use TailwindCSS with custom utility classes:
- `.btn-primary` - Primary button style
- `.btn-secondary` - Secondary button style
- `.input-field` - Form input style
- `.card` - Card container style

## 📊 State Management

### Auth Store (Zustand)

Manages authentication state:
- User information
- JWT token
- Login/logout functions
- Authentication status

### Vendor Store (Zustand)

Manages vendor-specific state:
- Vendor profile information
- Onboarding status
- Vendor operations (create, update, get analytics)

## 🔌 API Integration

### API Endpoints

The app expects the following API endpoints:

#### Authentication
- `POST /auth/register/` - User registration
- `POST /auth/login/` - User login
- `POST /auth/logout/` - User logout
- `GET /auth/me/` - Get current user

#### Vendor
- `POST /vendors/` - Create vendor profile
- `GET /vendors/:id/` - Get vendor profile
- `PUT /vendors/:id/` - Update vendor profile
- `GET /vendors/:id/analytics/` - Get vendor analytics

#### Products
- `GET /products/` - Get all products
- `POST /products/` - Create product
- `GET /products/:id/` - Get product
- `PUT /products/:id/` - Update product
- `DELETE /products/:id/` - Delete product

#### Customers
- `GET /customers/` - Get all customers
- `POST /customers/` - Create customer
- `POST /customers/upload/` - Upload CSV file

#### Events
- `GET /events/` - Get all events
- `POST /events/` - Create event
- `GET /events/templates/` - Get event templates

#### Messages
- `POST /messages/send/` - Send message
- `GET /messages/history/` - Get message history
- `GET /messages/templates/` - Get message templates

## 🧪 Development

### Adding New Features

1. Create API functions in the appropriate `src/api/` file
2. Add state management in Zustand stores if needed
3. Create reusable components in `src/components/`
4. Create page components in `src/pages/`
5. Add routes in `src/routes/AppRoutes.jsx`


