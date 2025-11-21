import React, { useState, useEffect } from 'react';
import { Menu, X, MapPin, Clock, Shield, DollarSign, Star, ChevronRight, Navigation, Zap, Users, Award, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBadge from '../components/NotificationBadge';

const TripNowLanding = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [activeService, setActiveService] = useState('ride');
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Check for driver approval notifications on landing page
  useEffect(() => {
    const checkDriverApproval = async () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('auth_token');

      if (userData && token) {
        const user = JSON.parse(userData);
        if (user.role === 'driver') {
          try {
            const response = await fetch('http://localhost:8000/api/driver/info', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });

            const data = await response.json();
            if (data.success && data.driver && data.driver.status === 'approved') {
              // Check if notification was already shown
              const approvalShown = localStorage.getItem('driver_approval_shown');
              if (!approvalShown) {
                // Show persistent approval notification
                setTimeout(() => {
                  const notification = document.createElement('div');
                  notification.className = 'fixed top-4 right-4 z-50 max-w-sm bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl shadow-2xl p-6 transform translate-x-full transition-transform duration-500';
                  notification.innerHTML = `
                    <div class="flex items-start space-x-4">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span class="text-2xl">🎉</span>
                        </div>
                      </div>
                      <div class="flex-1">
                        <h4 class="font-bold text-lg mb-2">Congratulations!</h4>
                        <p class="text-sm opacity-90 mb-4">Your driver application has been approved! You can now start accepting rides and earning money.</p>
                        <div class="flex space-x-2">
                          <button onclick="this.closest('.fixed').remove(); window.location.href='/driver/dashboard'" class="px-4 py-2 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                            Go to Dashboard
                          </button>
                          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition-colors">
                            Dismiss
                          </button>
                        </div>
                      </div>
                      <button onclick="this.closest('.fixed').remove()" class="flex-shrink-0 text-white/70 hover:text-white">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                    </div>
                  `;
                  document.body.appendChild(notification);

                  // Animate in
                  setTimeout(() => {
                    notification.classList.remove('translate-x-full');
                  }, 100);

                  // Mark as shown
                  localStorage.setItem('driver_approval_shown', 'true');
                }, 1000);
              }
            }
          } catch (error) {
            console.error('Error checking driver approval:', error);
          }
        }
      }
    };

    checkDriverApproval();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-2 px-6">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>support@tripnow.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🎉 Special Offer: Get 20% off on your first ride!</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl transform group-hover:rotate-12 transition-transform duration-500 shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                  <Navigation className="text-emerald-500 transform rotate-45" size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  TripNow
                </h1>
                <p className="text-xs text-gray-500 tracking-wider font-semibold">MOVE SMARTER</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', href: '#home' },
                { name: 'Ride', href: '/ride' },
                { name: 'Drive', href: '/drive' },
                { name: 'Business', href: '/business' },
                { name: 'FoodTrip', href: '/foodtrip' },
                { name: 'About', href: '/about' },
                { name: 'Contact', href: '/contact' }
              ].map((item) => (
                item.href.startsWith('/') ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="relative text-gray-700 hover:text-emerald-500 font-semibold transition-all group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative text-gray-700 hover:text-emerald-500 font-semibold transition-all group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              ))}
            </nav>

            {/* Auth Buttons or Profile */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <NotificationBadge user={user} />
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-full hover:border-emerald-300 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold">{user.role.toUpperCase()}</p>
                      </div>
                    </button>

                  {showProfileDropdown && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowProfileDropdown(false)}
                      ></div>
                      <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-bold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>

                        <div className="py-2">
                          {user.role === 'driver' && (
                            <button
                              onClick={() => {
                                setShowProfileDropdown(false);
                                navigate('/driver/dashboard');
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all flex items-center space-x-3 text-gray-700 hover:text-emerald-600 font-medium"
                            >
                              <Navigation size={18} />
                              <span>Driver Dashboard</span>
                            </button>
                          )}
                          {user.role === 'admin' && (
                            <button
                              onClick={() => {
                                setShowProfileDropdown(false);
                                navigate('/admin/dashboard');
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all flex items-center space-x-3 text-gray-700 hover:text-emerald-600 font-medium"
                            >
                              <Shield size={18} />
                              <span>Admin Dashboard</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setShowProfileDropdown(false);
                              navigate('/profile');
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all flex items-center space-x-3 text-gray-700 hover:text-emerald-600 font-medium"
                          >
                            <Users size={18} />
                            <span>Profile</span>
                          </button>
                          <div className="my-2 border-t border-gray-100"></div>
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 text-left hover:bg-red-50 transition-all flex items-center space-x-3 text-gray-700 hover:text-red-600 font-medium"
                          >
                            <X size={18} />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  </div>
                </div>
              ) : (
                <>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-6 py-2.5 text-gray-700 hover:text-emerald-500 font-semibold transition-all"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-emerald-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 space-y-4 border-t border-gray-200 pt-6">
              {['Home', 'Ride', 'Drive', 'Business', 'FoodTrip', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-700 hover:text-emerald-500 font-semibold py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              
              {user ? (
                <>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-emerald-600 font-semibold">{user.role.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {user.role === 'driver' && (
                    <button
                      onClick={() => {
                        navigate('/driver/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 text-gray-700 hover:text-emerald-500 font-semibold transition-all border border-emerald-200 rounded-full flex items-center justify-center space-x-2"
                    >
                      <Navigation size={18} />
                      <span>Driver Dashboard</span>
                    </button>
                  )}

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        navigate('/admin/dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="w-full px-6 py-3 text-gray-700 hover:text-emerald-500 font-semibold transition-all border border-emerald-200 rounded-full flex items-center justify-center space-x-2"
                    >
                      <Shield size={18} />
                      <span>Admin Dashboard</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 text-gray-700 hover:text-emerald-500 font-semibold transition-all border border-emerald-200 rounded-full flex items-center justify-center space-x-2"
                  >
                    <Users size={18} />
                    <span>Profile</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow-lg flex items-center justify-center space-x-2"
                  >
                    <X size={18} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 text-gray-700 hover:text-emerald-500 font-semibold transition-all border border-emerald-200 rounded-full"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => {
                      navigate('/register');
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold shadow-lg"
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Booking Form */}
      <section id="home" className="relative pt-20 pb-32 px-6">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300 rounded-full shadow-sm">
                <span className="text-emerald-600 text-sm font-bold">🚀 The Future of Transportation</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black leading-tight text-gray-900">
                Move at the
                <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Speed of Now
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Experience next-generation ride-sharing with AI-powered matching, instant bookings, and seamless journeys across the city.
              </p>

              <div className="relative p-8 bg-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-blue-50/50 rounded-3xl"></div>
                
                <div className="relative space-y-6">
                  <div className="flex space-x-2 bg-gray-100 p-1.5 rounded-2xl">
                    {['ride', 'food', 'delivery'].map((service) => (
                      <button
                        key={service}
                        onClick={() => setActiveService(service)}
                        className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all ${
                          activeService === service
                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute"></div>
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Pickup Location"
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2 z-10">
                      <MapPin className="text-blue-500" size={20} />
                    </div>
                    <input
                      type="text"
                      placeholder="Enter Drop Location"
                      value={dropLocation}
                      onChange={(e) => setDropLocation(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
                    />
                  </div>

                  <button className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]">
                    Find Your Ride
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-8 pt-4">
                {[
                  { label: 'Active Drivers', value: '5K+' },
                  { label: 'Cities', value: '50+' },
                  { label: 'Rating', value: '4.9★' }
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-emerald-50 to-blue-50"></div>
                
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 400 400">
                  <defs>
                    <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  {[...Array(20)].map((_, i) => (
                    <g key={i}>
                      <line x1={i * 20} y1="0" x2={i * 20} y2="400" stroke="#94a3b8" strokeWidth="1" />
                      <line x1="0" y1={i * 20} x2="400" y2={i * 20} stroke="#94a3b8" strokeWidth="1" />
                    </g>
                  ))}
                  <path d="M50,100 Q200,50 350,150" stroke="url(#routeGradient)" strokeWidth="4" fill="none" strokeDasharray="8,8" className="animate-pulse" />
                  <path d="M100,300 Q200,250 300,200" stroke="url(#routeGradient)" strokeWidth="4" fill="none" strokeDasharray="8,8" className="animate-pulse" style={{animationDelay: '0.5s'}} />
                </svg>

                <div className="absolute top-1/4 left-1/4 animate-bounce">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
                      <MapPin className="text-white" size={32} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                </div>

                <div className="absolute bottom-1/4 right-1/4 animate-bounce" style={{animationDelay: '0.5s'}}>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl">
                    <MapPin className="text-white" size={32} />
                  </div>
                </div>

                <div className="absolute top-1/3 left-1/2 w-14 h-14 bg-white rounded-xl flex items-center justify-center animate-pulse shadow-xl border-2 border-emerald-200">
                  <span className="text-3xl">🚗</span>
                </div>

                <div className="absolute top-8 right-8 p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-emerald-100">
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Estimated Time</div>
                  <div className="text-xl font-black text-emerald-600">12 mins</div>
                </div>

                <div className="absolute bottom-8 left-8 p-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-blue-100">
                  <div className="text-xs text-gray-500 mb-1 font-semibold">Estimated Fare</div>
                  <div className="text-xl font-black text-blue-600">$15.50</div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-emerald-300/30 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-transparent rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-300 rounded-full mb-6 shadow-sm">
              <span className="text-blue-600 text-sm font-bold">REVOLUTIONARY FEATURES</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900">
              Why Choose <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">TripNow</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the perfect blend of technology and convenience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Instant Match', desc: 'AI-powered driver matching in milliseconds', color: 'from-emerald-400 to-emerald-600', bg: 'from-emerald-50 to-emerald-100' },
              { icon: Shield, title: 'Ultra Secure', desc: 'Military-grade encryption & verified drivers', color: 'from-blue-400 to-blue-600', bg: 'from-blue-50 to-blue-100' },
              { icon: DollarSign, title: 'Smart Pricing', desc: 'Dynamic fares with zero hidden charges', color: 'from-purple-400 to-purple-600', bg: 'from-purple-50 to-purple-100' },
              { icon: Award, title: 'Premium Service', desc: '24/7 support with 4.9★ average rating', color: 'from-pink-400 to-pink-600', bg: 'from-pink-50 to-pink-100' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.bg} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md`}>
                    <feature.icon className={`bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`} size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Our Premium Services</h2>
            <p className="text-xl text-gray-600">Everything you need, all in one place</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Ride Sharing',
                desc: 'Premium rides with verified drivers',
                gradient: 'from-emerald-400 via-emerald-500 to-blue-500',
                icon: '🚗',
                features: ['Real-time tracking', 'Multiple vehicle types', 'Instant booking']
              },
              {
                title: 'Food Delivery',
                desc: 'Your favorite meals delivered hot',
                gradient: 'from-orange-400 via-red-500 to-pink-500',
                icon: '🍔',
                features: ['Live order tracking', '30-min delivery', 'Zero contact']
              },
              {
                title: 'Drive & Earn',
                desc: 'Make money on your schedule',
                gradient: 'from-blue-400 via-purple-500 to-pink-500',
                icon: '💰',
                features: ['Flexible hours', 'Weekly payouts', 'Top earnings']
              }
            ].map((service, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:scale-105 overflow-hidden shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className="text-6xl mb-6">{service.icon}</div>
                    <h3 className="text-3xl font-black mb-3 text-gray-900">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 font-medium">{service.desc}</p>
                    
                    <div className="space-y-3 mb-6">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <ChevronRight className="text-emerald-500" size={18} strokeWidth={3} />
                          <span className="text-sm text-gray-700 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <button className={`w-full py-3.5 bg-gradient-to-r ${service.gradient} text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105`}>
                      Get Started
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6">
        <div className="container mx-auto relative z-10">
          <div className="relative p-16 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative grid md:grid-cols-4 gap-12 text-center">
              {[
                { number: '50K+', label: 'Daily Rides', icon: Users },
                { number: '10K+', label: 'Active Drivers', icon: Star },
                { number: '100+', label: 'Cities', icon: MapPin },
                { number: '4.9★', label: 'User Rating', icon: Award }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-4">
                  <stat.icon className="mx-auto text-white drop-shadow-lg" size={48} strokeWidth={2} />
                  <div className="text-5xl font-black text-white drop-shadow-lg">{stat.number}</div>
                  <div className="text-xl text-white font-bold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto relative z-10 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-6xl font-black leading-tight text-gray-900">
              Ready to Experience
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                The Future?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join millions of users who have already made the switch to smarter transportation.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button 
                onClick={() => navigate('/register')}
                className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Start Your Journey
              </button>
              <button className="px-12 py-5 bg-gray-100 border-2 border-gray-200 text-gray-700 rounded-full text-xl font-bold hover:bg-gray-200 transition-all transform hover:scale-105">
                Download App
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto relative z-10">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Navigation className="text-white transform rotate-45" size={20} />
                </div>
                <div>
                  <h4 className="text-xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                    TripNow
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">MOVE SMARTER</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">The next generation of ride-sharing. Fast, secure, and reliable transportation at your fingertips.</p>
              <div className="flex space-x-4">
                {['T', 'F', 'I'].map((social, idx) => (
                  <button key={idx} className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 transition-all flex items-center justify-center font-bold">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Company', links: ['About', 'Careers', 'Blog', 'Press'] },
              { title: 'Support', links: ['Help', 'Safety', 'Contact', 'FAQ'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'License'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 className="text-lg font-bold mb-4">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 TripNow. All rights reserved. Made with ❤️ for the future.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TripNowLanding;