import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Business from './pages/Business'
import FoodTrip from './pages/FoodTrip'

// Phase 6: Driver Management Pages
import DrivePage from './pages/DrivePage'
import DriverForm from './pages/DriverForm'
import DriverPending from './pages/DriverPending'
import DriverDashboard from './pages/DriverDashboard'
import AdminDriverManagement from './pages/AdminDriverManagement'

// Rider Pages
import RiderDashboard from './pages/RiderDashboard'
import RidePage from './pages/RidePage'
import SearchingDriverPage from './pages/SearchingDriverPage'
import RideAcceptedPage from './pages/RideAcceptedPage'
import RideCompletedPage from './pages/RideCompletedPage'

// Admin Rider Management
import AdminRiderManagement from './pages/AdminRiderManagement'

// Admin Ride Management - FIXED: Added missing imports
import AdminRidesList from './pages/AdminRidesList'
import RideAnalytics from './pages/RideAnalytics'
import AdminRideManagement from './pages/AdminRideManagement'

// Admin Finance Management
import PaymentFinance from './pages/admin/PaymentFinance'

import './index.css'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
         <Route path="/business" element={<Business />} />
          <Route path="/foodtrip" element={<FoodTrip />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/drivers" element={<AdminDriverManagement />} />
        <Route path="/admin/riders" element={<AdminRiderManagement />} />
        
        {/* FIXED: Admin Ride Management Routes */}
        <Route path="/admin/rides" element={<AdminRidesList />} />
        <Route path="/admin/rides/analytics" element={<RideAnalytics />} />
        <Route path="/admin/rides/management" element={<AdminRideManagement />} />
        
        {/* Admin Finance Route */}
        <Route path="/admin/finance" element={<PaymentFinance />} />

        {/* Phase 6: Driver Routes */}
        <Route path="/drive" element={<DrivePage />} />
        <Route path="/driver-form" element={<DriverForm />} />
        <Route path="/driver/pending" element={<DriverPending />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />

        {/* Rider Routes */}
        <Route path="/rider/dashboard" element={<RiderDashboard />} />
        <Route path="/ride" element={<RidePage />} />
        <Route path="/ride/searching" element={<SearchingDriverPage />} />
        <Route path="/ride/accepted" element={<RideAcceptedPage />} />
        <Route path="/ride/completed" element={<RideCompletedPage />} />

        {/* Profile Route */}
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </Router>
  )
}

export default App