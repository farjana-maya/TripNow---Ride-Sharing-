# 🚗 TripNow - Ride Sharing Website

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel"/>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"/>
</p>

<p align="center">
  A modern, full-stack ride-sharing platform built with Laravel and React that connects riders with drivers for seamless transportation services.
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🚖 For Riders
- **Real-time Ride Booking** - Book rides instantly with live driver tracking
- **Multiple Vehicle Types** - Choose from bike, standard, premium, SUV, or van
- **Scheduled Rides** - Book rides in advance for future travel
- **Fare Estimation** - Get accurate fare estimates before booking
- **Ride History** - Track all past and current rides
- **Rating & Reviews** - Rate drivers and provide feedback
- **Secure Payments** - Multiple payment methods supported
- **Live Map Tracking** - Real-time driver location on Google Maps

### 🚗 For Drivers
- **Driver Dashboard** - Comprehensive earnings and ride statistics
- **Ride Requests** - Accept or reject ride requests
- **Navigation** - Integrated GPS navigation to pickup and drop locations
- **Earnings Tracking** - Real-time earnings and payout management
- **Document Management** - Upload and manage required documents
- **Status Control** - Go online/offline as per availability
- **Rating System** - Build reputation through rider ratings

### 👨‍💼 For Admins
- **Complete Dashboard** - Overview of platform analytics
- **Driver Management** - Approve, reject, or block drivers
- **Rider Management** - Monitor and manage rider accounts
- **Ride Management** - Track all rides in real-time
- **Payment & Finance** - Comprehensive financial reports
- **Analytics** - Detailed insights and statistics
- **Dispute Resolution** - Handle rider-driver disputes
- **Document Verification** - Review driver documents

---

## 🛠 Tech Stack

### Backend
- **Framework**: Laravel 10.x
- **Language**: PHP 8.0+
- **Database**: MySQL 8.0 / MariaDB
- **Authentication**: Laravel Sanctum (Token-based)
- **API**: RESTful API Architecture

### Frontend
- **Framework**: React 18.x
- **Language**: JavaScript (ES6+)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Routing**: React Router DOM

### Additional Technologies
- **Maps**: Google Maps API
- **Real-time**: WebSockets (Pusher/Laravel Echo)
- **Email**: SMTP (Gmail/Mailtrap)
- **File Storage**: Local/AWS S3

---

## 🏗 System Architecture

```
tripnow/
├── backend/                 # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── RideController.php
│   │   │   │   ├── DriverController.php
│   │   │   │   ├── AdminController.php
│   │   │   │   └── ...
│   │   │   └── Middleware/
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Driver.php
│   │   │   ├── Ride.php
│   │   │   ├── Rating.php
│   │   │   └── ...
│   │   └── Services/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   └── config/
│
├── frontend/                # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── Footer.js
│   │   │   ├── MapView.jsx
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── RiderDashboard.jsx
│   │   │   ├── DriverDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── apiService.js
│   │   │   └── driverService.js
│   │   └── App.jsx
│   └── public/
│
└── database/
    └── tripnow.sql          # Database Schema
```

---

## 📦 Installation

### Prerequisites
- PHP >= 8.0
- Composer
- Node.js >= 14.x
- MySQL/MariaDB
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/farjana-maya/TripNow---Ride-Sharing-.git
cd TripNow---Ride-Sharing-
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_DATABASE=tripnow
# DB_USERNAME=root
# DB_PASSWORD=your_password
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder
cd ../frontend

# Install Node dependencies
npm install
```

---

## 🗄 Database Setup

### Option 1: Using SQL File

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE tripnow"

# Import database schema
mysql -u root -p tripnow < database/tripnow.sql
```

### Option 2: Using Migrations

```bash
cd backend

# Run migrations
php artisan migrate

# Seed database (optional)
php artisan db:seed
```

### Database Schema Overview

**Main Tables:**
- `users` - User accounts (riders, drivers, admins)
- `drivers` - Driver profiles and documents
- `rides` - Ride bookings and details
- `ride_assignments` - Driver-ride assignments
- `ratings` - Rider and driver ratings
- `payments` - Payment transactions
- `notifications` - System notifications
- `disputes` - Dispute management
- `driver_payouts` - Driver earnings and payouts

---

## ⚙ Configuration

### Backend Configuration (.env)

```env
APP_NAME=TripNow
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_DATABASE=tripnow
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Frontend Configuration

Update `frontend/src/services/apiService.js`:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

---

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
php artisan serve
# Server runs at: http://localhost:8000
```

### Start Frontend Development Server

```bash
cd frontend
npm run dev
# Server runs at: http://localhost:5173
```

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:5173/admin

### Default Login Credentials

**Admin:**
- Email: admin@gmail.com
- Password: admin123

**Test Rider:**
- Email: rider@example.com
- Password: password

**Test Driver:**
- Email: driver@example.com
- Password: password

---

## 📡 API Documentation

### Authentication Endpoints

```
POST   /api/register          - Register new user
POST   /api/login             - User login
POST   /api/logout            - User logout
GET    /api/user              - Get authenticated user
```

### Ride Endpoints

```
GET    /api/rides             - Get all rides
POST   /api/rides             - Create new ride
GET    /api/rides/{id}        - Get ride details
PUT    /api/rides/{id}        - Update ride
DELETE /api/rides/{id}        - Cancel ride
```

### Driver Endpoints

```
POST   /api/drivers/register  - Register as driver
GET    /api/drivers           - Get all drivers (admin)
GET    /api/drivers/{id}      - Get driver details
PUT    /api/drivers/{id}      - Update driver profile
POST   /api/drivers/approve   - Approve driver (admin)
POST   /api/drivers/reject    - Reject driver (admin)
```

### Admin Endpoints

```
GET    /api/admin/dashboard   - Get dashboard stats
GET    /api/admin/analytics   - Get analytics data
GET    /api/admin/finance     - Get financial reports
GET    /api/admin/riders      - Manage riders
```

---

## 👥 User Roles

### 1. Rider
- Book and manage rides
- View ride history
- Rate drivers
- Manage profile

### 2. Driver
- Accept/reject ride requests
- Track earnings
- Upload documents
- Manage availability

### 3. Admin
- Manage drivers and riders
- Monitor all rides
- Generate reports
- Handle disputes
- Financial management

---

## 📱 Key Features Explained

### Real-time Ride Tracking
- Live driver location updates using Google Maps API
- ETA calculations
- Route optimization

### Smart Matching Algorithm
- Finds nearest available drivers
- Considers driver ratings
- Vehicle type matching

### Secure Payment System
- Multiple payment methods (Cash, Card, Wallet)
- Transaction history
- Automated driver payouts

### Rating System
- 5-star rating for drivers and riders
- Review comments
- Performance analytics

### Notification System
- Real-time push notifications
- Email notifications
- SMS alerts (optional)

---

## 🔒 Security Features

- Token-based authentication (Laravel Sanctum)
- Password encryption (bcrypt)
- CSRF protection
- SQL injection prevention
- XSS protection
- Rate limiting on APIs

---

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests
cd frontend
npm run test
```

---

## 📈 Future Enhancements

- [ ] Mobile apps (React Native)
- [ ] In-app chat between rider and driver
- [ ] Promo codes and discounts
- [ ] Ride sharing (multiple passengers)
- [ ] Advanced analytics dashboard
- [ ] Integration with third-party payment gateways
- [ ] Multi-language support
- [ ] Dark mode

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Developer

**Farjana Maya**
- GitHub: [@farjana-maya](https://github.com/farjana-maya)
- Email: farjanamaya61@gmail.com

---

## 🙏 Acknowledgments

- Laravel Framework
- React.js Community
- Tailwind CSS
- Google Maps API
- All open-source contributors

---

## 📞 Support

For support, email support@tripnow.com or create an issue in this repository.

---

<p align="center">Made with ❤️ by Farjana Maya</p>
<p align="center">⭐ Star this repo if you find it helpful!</p>
