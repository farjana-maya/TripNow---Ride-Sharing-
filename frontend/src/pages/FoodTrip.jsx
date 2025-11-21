import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingBag, Clock, Star, TrendingUp, Flame, 
  ChevronRight, MapPin, Heart, Filter, X, Menu, Navigation,
  Shield, Phone, Mail, Users, Award, Zap, DollarSign
} from 'lucide-react';
import NotificationBadge from '../components/NotificationBadge';

const FoodTrip = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/login');
  };

  const toggleFavorite = (restaurantId) => {
    setFavorites(prev => 
      prev.includes(restaurantId) 
        ? prev.filter(id => id !== restaurantId)
        : [...prev, restaurantId]
    );
  };

  const categories = [
    { id: 'all', name: 'All', icon: '🍽️' },
    { id: 'burger', name: 'Burgers', icon: '🍔' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'asian', name: 'Asian', icon: '🍜' },
    { id: 'dessert', name: 'Desserts', icon: '🍰' },
    { id: 'healthy', name: 'Healthy', icon: '🥗' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800',
      rating: 4.8,
      reviews: 2543,
      deliveryTime: '15-25',
      category: 'burger',
      minOrder: 10,
      popular: true,
      offer: '20% OFF',
      tags: ['Fast Food', 'American']
    },
    {
      id: 2,
      name: 'Pizza Paradise',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800',
      rating: 4.9,
      reviews: 3821,
      deliveryTime: '20-30',
      category: 'pizza',
      minOrder: 15,
      popular: true,
      offer: 'Free Delivery',
      tags: ['Italian', 'Pizza']
    },
    {
      id: 3,
      name: 'Sushi Master',
      image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800',
      rating: 4.7,
      reviews: 1876,
      deliveryTime: '25-35',
      category: 'asian',
      minOrder: 20,
      popular: false,
      tags: ['Japanese', 'Sushi']
    },
    {
      id: 4,
      name: 'Sweet Dreams',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800',
      rating: 4.9,
      reviews: 2154,
      deliveryTime: '10-20',
      category: 'dessert',
      minOrder: 8,
      popular: true,
      offer: 'Buy 1 Get 1',
      tags: ['Desserts', 'Bakery']
    },
    {
      id: 5,
      name: 'Green Bowl',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
      rating: 4.6,
      reviews: 987,
      deliveryTime: '15-25',
      category: 'healthy',
      minOrder: 12,
      popular: false,
      tags: ['Healthy', 'Organic']
    },
    {
      id: 6,
      name: 'Noodle Express',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
      rating: 4.8,
      reviews: 3245,
      deliveryTime: '20-30',
      category: 'asian',
      minOrder: 10,
      popular: true,
      offer: '15% OFF',
      tags: ['Asian', 'Noodles']
    }
  ];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         restaurant.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-50">
      {/* Top Info Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-6">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+880 1234-567890</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} />
              <span>food@tripnow.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🍔 Free Delivery on orders over $20!</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-lg shadow-lg' : 'bg-white/80 backdrop-blur-md'}`}>
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl transform group-hover:rotate-12 transition-transform duration-500 shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🍔</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                  FoodTrip
                </h1>
                <p className="text-xs text-gray-500 tracking-wider font-semibold">BY TRIPNOW</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', href: '/' },
                { name: 'Restaurants', href: '#restaurants' },
                { name: 'Offers', href: '#offers' },
                { name: 'Track Order', href: '#track' },
                { name: 'Help', href: '#help' }
              ].map((item) => (
                item.href.startsWith('/') ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className="relative text-gray-700 hover:text-orange-500 font-semibold transition-all group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
                  </button>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative text-gray-700 hover:text-orange-500 font-semibold transition-all group"
                  >
                    {item.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              ))}
            </nav>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <NotificationBadge user={user} />
                  <button className="relative p-3 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-full hover:border-orange-300 transition-all">
                    <ShoppingBag className="text-orange-600" size={20} />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      3
                    </span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                      className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-full hover:border-orange-300 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-orange-600 font-semibold">{user.role.toUpperCase()}</p>
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
                            <button
                              onClick={() => {
                                setShowProfileDropdown(false);
                                navigate('/profile');
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all flex items-center space-x-3 text-gray-700 hover:text-orange-600 font-medium"
                            >
                              <Users size={18} />
                              <span>My Profile</span>
                            </button>
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
                    className="px-6 py-2.5 text-gray-700 hover:text-orange-500 font-semibold transition-all"
                  >
                    Sign In
                  </button>
                  <button 
                    onClick={() => navigate('/register')}
                    className="relative px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold overflow-hidden group shadow-lg hover:shadow-xl transition-all"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-orange-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-6 pb-6 space-y-4 border-t border-gray-200 pt-6">
              {['Home', 'Restaurants', 'Offers', 'Track Order', 'Help'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-gray-700 hover:text-orange-500 font-semibold py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6">
        <div className="absolute top-10 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-300 rounded-full shadow-sm mb-6">
              <span className="text-orange-600 text-sm font-bold">🍕 DELICIOUS FOOD DELIVERED</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black leading-tight text-gray-900 mb-6">
              Craving Something
              <span className="block mt-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Delicious?
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Your favorite restaurants at your doorstep. Fast delivery, hot food, happy you.
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative p-2 bg-white rounded-3xl shadow-2xl border border-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 flex items-center space-x-3 px-4">
                    <MapPin className="text-orange-500" size={24} />
                    <input
                      type="text"
                      placeholder="Enter delivery address"
                      className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                    />
                  </div>
                  <div className="w-px h-12 bg-gray-200"></div>
                  <div className="flex-1 flex items-center space-x-3 px-4">
                    <Search className="text-gray-400" size={24} />
                    <input
                      type="text"
                      placeholder="Search restaurants or dishes"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 py-4 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none font-medium"
                    />
                  </div>
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl font-bold hover:shadow-lg transition-all transform hover:scale-105">
                    Find Food
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center justify-center space-x-12 mt-12">
              {[
                { icon: '🍽️', label: '500+ Restaurants', color: 'from-orange-600 to-red-600' },
                { icon: '⚡', label: '30 Min Delivery', color: 'from-blue-600 to-purple-600' },
                { icon: '⭐', label: '4.8★ Rating', color: 'from-pink-600 to-red-600' }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className={`text-lg font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-6 bg-white sticky top-[88px] z-40 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Offers */}
      <section className="py-16 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">🔥 Hot Deals</h2>
              <p className="text-gray-600">Limited time offers you can't miss!</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '20% OFF', desc: 'On orders above $30', gradient: 'from-orange-400 to-red-500', icon: '🎉' },
              { title: 'FREE DELIVERY', desc: 'This weekend only', gradient: 'from-blue-400 to-purple-500', icon: '🚚' },
              { title: 'BUY 1 GET 1', desc: 'On selected items', gradient: 'from-pink-400 to-red-500', icon: '🎁' }
            ].map((offer, idx) => (
              <div key={idx} className="relative group">
                <div className={`relative p-8 bg-gradient-to-r ${offer.gradient} rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}>
                  <div className="absolute top-0 right-0 text-9xl opacity-10">{offer.icon}</div>
                  <div className="relative text-white">
                    <div className="text-5xl font-black mb-3">{offer.title}</div>
                    <div className="text-xl font-semibold">{offer.desc}</div>
                    <button className="mt-6 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all">
                      Claim Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurants Grid */}
      <section id="restaurants" className="py-16 px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                {selectedCategory === 'all' ? 'All Restaurants' : `${categories.find(c => c.id === selectedCategory)?.name} Restaurants`}
              </h2>
              <p className="text-gray-600">{filteredRestaurants.length} restaurants found</p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl font-bold hover:border-orange-300 transition-all">
              <Filter size={20} />
              <span>Filters</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <div 
                key={restaurant.id} 
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-[1.02] cursor-pointer"
                onClick={() => setSelectedRestaurant(restaurant)}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img 
                    src={restaurant.image} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {restaurant.popular && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                        🔥 POPULAR
                      </span>
                    )}
                    {restaurant.offer && (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                        {restaurant.offer}
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(restaurant.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                  >
                    <Heart 
                      size={20} 
                      className={favorites.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                  </button>

                  {/* Delivery Time */}
                  <div className="absolute bottom-4 left-4 flex items-center space-x-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
                    <Clock size={16} className="text-orange-600" />
                    <span className="text-sm font-bold text-gray-900">{restaurant.deliveryTime} min</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{restaurant.name}</h3>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="fill-yellow-400 text-yellow-400" size={18} />
                      <span className="font-bold text-gray-900">{restaurant.rating}</span>
                      <span className="text-sm text-gray-500">({restaurant.reviews})</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600 font-medium">Min ${restaurant.minOrder}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {restaurant.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all transform hover:scale-105">
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose FoodTrip */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black text-gray-900 mb-4">
              Why Order From <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">FoodTrip</span>
            </h2>
            <p className="text-xl text-gray-600">Fast, fresh, and fantastic every time</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'Average delivery under 30 minutes', color: 'from-orange-400 to-orange-600' },
              { icon: Shield, title: 'Safe & Secure', desc: 'Contactless delivery available', color: 'from-blue-400 to-blue-600' },
              { icon: DollarSign, title: 'Best Prices', desc: 'Lowest delivery fees guaranteed', color: 'from-green-400 to-green-600' },
              { icon: Award, title: 'Quality Food', desc: 'Fresh ingredients, hot delivery', color: 'from-purple-400 to-purple-600' }
            ].map((feature, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-orange-300 transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-md`}>
                    <feature.icon className="text-white" size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-orange-50 to-red-50">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-6xl font-black leading-tight text-gray-900">
              Hungry?
              <span className="block mt-2 bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                Order Now!
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of food lovers. Download the app and get your first order at 50% off!
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="px-12 py-5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105">
                Order Food Now
              </button>
              <button className="px-12 py-5 bg-gray-900 text-white rounded-full text-xl font-bold hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center space-x-3">
                <span>📱</span>
                <span>Download App</span>
              </button>
            </div>
            
            {/* App Store Badges */}
            <div className="flex justify-center items-center space-x-4 pt-6">
              <div className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all cursor-pointer flex items-center space-x-2">
                <span className="text-2xl">🍎</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </div>
              <div className="px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all cursor-pointer flex items-center space-x-2">
                <span className="text-2xl">📱</span>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </div>
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
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🍔</span>
                </div>
                <div>
                  <h4 className="text-xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                    FoodTrip
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">BY TRIPNOW</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">Bringing delicious food from your favorite restaurants straight to your door. Fast, fresh, and always on time.</p>
              <div className="flex space-x-4">
                {['F', 'T', 'I', 'Y'].map((social, idx) => (
                  <button key={idx} className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 transition-all flex items-center justify-center font-bold">
                    {social}
                  </button>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Press Kit'] },
              { title: 'For You', links: ['Restaurants', 'Offers', 'Track Order', 'Help Center'] },
              { title: 'Legal', links: ['Terms', 'Privacy', 'Cookies', 'Refunds'] }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 className="text-lg font-bold mb-4">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-orange-400 transition-colors font-medium">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">&copy; 2025 FoodTrip by TripNow. All rights reserved.</p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Dhaka, Bangladesh</span>
              </span>
              <span className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+880 1234-567890</span>
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Restaurant Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => setSelectedRestaurant(null)}>
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64 overflow-hidden">
              <img 
                src={selectedRestaurant.image} 
                alt={selectedRestaurant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <button 
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
              >
                <X size={24} className="text-gray-900" />
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <h2 className="text-4xl font-black mb-2">{selectedRestaurant.name}</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                    <span className="font-bold">{selectedRestaurant.rating}</span>
                    <span className="text-sm opacity-90">({selectedRestaurant.reviews} reviews)</span>
                  </div>
                  <span>•</span>
                  <span>{selectedRestaurant.deliveryTime} min</span>
                  <span>•</span>
                  <span>Min ${selectedRestaurant.minOrder}</span>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedRestaurant.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <h3 className="text-2xl font-black text-gray-900 mb-6">Popular Items</h3>
              
              <div className="space-y-4">
                {[
                  { name: 'Classic Burger', price: 12.99, desc: 'Juicy beef patty with fresh veggies', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
                  { name: 'Cheese Pizza', price: 15.99, desc: 'Wood-fired with mozzarella', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
                  { name: 'Caesar Salad', price: 9.99, desc: 'Fresh romaine with parmesan', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all">
                    <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-600 mb-2">${item.price}</div>
                      <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-bold hover:shadow-lg transition-all">
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-lg font-bold hover:shadow-xl transition-all transform hover:scale-[1.02]">
                View Full Menu
              </button>
            </div>
          </div>
        </div>
      )}

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
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FoodTrip;