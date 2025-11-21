import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Eye, Heart, Users, Award, TrendingUp, Shield, Zap, Star, ChevronRight, Menu, X, MapPin, Clock, DollarSign, Navigation, Phone, Mail, Globe, Cpu, ShieldCheck, Rocket, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [counters, setCounters] = useState({ users: 0, drivers: 0, cities: 0, rating: 0 });
  const [activeValue, setActiveValue] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const animateCounters = () => {
      const targets = { users: 50000, drivers: 10000, cities: 100, rating: 49 };
      const duration = 2000;
      const steps = 60;
      const increment = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        setCounters({
          users: Math.floor(targets.users * progress),
          drivers: Math.floor(targets.drivers * progress),
          cities: Math.floor(targets.cities * progress),
          rating: Math.floor(targets.rating * progress) / 10
        });
        if (step >= steps) clearInterval(timer);
      }, increment);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    });

    const statsSection = document.getElementById('stats-section');
    if (statsSection) observer.observe(statsSection);

    return () => observer.disconnect();
  }, []);

  const values = [
    { 
      icon: ShieldCheck, 
      title: 'Safety First', 
      desc: 'Advanced AI-powered safety features and 24/7 monitoring ensure every journey is secure',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'from-emerald-50 to-white'
    },
    { 
      icon: Cpu, 
      title: 'Smart Technology', 
      desc: 'Machine learning algorithms optimize routes and match you with the perfect driver',
      color: 'from-blue-500 to-blue-600',
      bg: 'from-blue-50 to-white'
    },
    { 
      icon: Globe, 
      title: 'Global Vision', 
      desc: 'Expanding to new markets while maintaining our commitment to local communities',
      color: 'from-purple-500 to-purple-600',
      bg: 'from-purple-50 to-white'
    },
    { 
      icon: Rocket, 
      title: 'Innovation', 
      desc: 'Constantly evolving our platform with cutting-edge features and sustainable solutions',
      color: 'from-orange-500 to-orange-600',
      bg: 'from-orange-50 to-white'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30">
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-xl shadow-2xl py-3' : 'bg-white/90 backdrop-blur-lg py-5'}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Enhanced Logo */}
            <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl transform group-hover:rotate-12 transition-transform duration-500 shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center shadow-inner">
                  <Navigation className="text-emerald-600 transform rotate-45" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-700 bg-clip-text text-transparent">
                  TripNow
                </h1>
                <p className="text-xs text-gray-500 tracking-widest font-medium">MOVE SMARTER</p>
              </div>
            </div>

            {/* Enhanced Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {[
                { name: 'Home', href: '/', isRoute: true },
                 { name: 'Ride', href: '/ride', isRoute: false },
                { name: 'Drive', href: '/drive', isRoute: false },
                { name: 'Business', href: '/business', isRoute: false },
                { name: 'FoodTrip', href: '/foodtrip', isRoute: false },
          
                { name: 'Enterprise', href: '#enterprise', isRoute: false },
                { name: 'Services', href: '#services', isRoute: false },
                { name: 'About', href: '/about', isRoute: true },
                { name: 'Contact', href: '/contact', isRoute: true }
              ].map((item) => (
                item.isRoute ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`relative font-semibold text-sm tracking-wide transition-all group ${
                      item.name === 'About' 
                        ? 'text-emerald-600 font-bold' 
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all ${
                      item.name === 'About' ? 'scale-100' : 'scale-0 group-hover:scale-100'
                    }`}></span>
                  </button>
                ) : (
                  <a
                    key={item.name}
                    href={item.href}
                    className="relative text-gray-700 hover:text-emerald-600 font-semibold text-sm tracking-wide transition-all group"
                  >
                    {item.name}
                    <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              ))}
            </nav>

            {/* Enhanced CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                      <User className="text-white" size={16} />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name || 'User'}
                    </span>
                  </div>
                </>
              ) : null}
            </div>

            <button
              className="lg:hidden text-emerald-600 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

      </header>

      {/* Enhanced Hero Section */}
      <section className="relative pt-24 pb-32 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl mb-8 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-emerald-700 text-sm font-semibold">EST. 2020 • 🚀 Our Journey</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight text-gray-900 mb-6">
                Revolutionizing
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
             Transportation
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
            We're building the future of transportation through innovative technology, 
            sustainable solutions, and an unwavering commitment to excellence.
          </p>

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { number: counters.users.toLocaleString(), label: 'Active Users', color: 'from-emerald-500 to-emerald-600' },
              { number: counters.drivers.toLocaleString(), label: 'Driver Partners', color: 'from-blue-500 to-blue-600' },
              { number: counters.cities, label: 'Cities Worldwide', color: 'from-purple-500 to-purple-600' },
              { number: `${counters.rating.toFixed(1)}★`, label: 'Customer Rating', color: 'from-orange-500 to-orange-600' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                <div className={`text-3xl lg:text-4xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent mb-2`}>
                  {stat.number}
                </div>
                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-2xl">
                <span className="text-blue-700 text-sm font-semibold">OUR JOURNEY</span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight">
                Pioneering the Future of
                <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Smart Transportation
                </span>
              </h2>

              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Founded by a team of visionary engineers and transportation experts, 
                  TripNow emerged as a response to the growing need for intelligent, 
                  sustainable urban mobility solutions.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our platform leverages cutting-edge AI and machine learning to optimize 
                  routes, reduce congestion, and provide unparalleled service quality 
                  across global markets.
                </p>
                <div className="grid grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-emerald-600">2020</div>
                    <div className="text-sm font-semibold text-gray-600">Company Founded</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-blue-600">15+</div>
                    <div className="text-sm font-semibold text-gray-600">Countries Served</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Visual Element */}
            <div className="relative">
              <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50"></div>
                {/* Abstract Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400 rounded-full blur-xl"></div>
                  <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-400 rounded-full blur-xl"></div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center">
                    <Zap className="text-emerald-600" size={32} />
                  </div>
                </div>
                <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center">
                    <ShieldCheck className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="absolute bottom-1/4 left-1/3 transform -translate-x-1/2 translate-y-1/2">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-2xl border border-gray-100 flex items-center justify-center">
                    <Globe className="text-purple-600" size={20} />
                  </div>
                </div>

                {/* Central Element */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                      <Rocket className="text-white" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Innovation Driven</h3>
                    <p className="text-gray-600 max-w-xs">Transforming mobility through technology</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Vision */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-emerald-50/20">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-gray-900">
              Our Strategic Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Driving innovation while maintaining our core commitment to excellence and sustainability
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="group relative">
              <div className="relative p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-6 right-6 opacity-10">
                  <Target size={80} className="text-emerald-600" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Target className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  To revolutionize urban transportation through intelligent technology that connects communities, 
                  reduces environmental impact, and creates economic opportunities worldwide.
                </p>
                <div className="space-y-3">
                  {['AI-Powered Routing', 'Zero-Emission Fleet', 'Community Partnerships'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="relative p-8 bg-white rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="absolute top-6 right-6 opacity-10">
                  <Eye size={80} className="text-blue-600" />
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                  <Eye className="text-white" size={32} />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  To create a world where transportation is seamless, sustainable, and accessible to all, 
                  powered by technology that anticipates needs and enhances human connection.
                </p>
                <div className="space-y-3">
                  {['Global Accessibility', 'Sustainable Innovation', 'Human-Centric Design'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Values Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-gray-900">
              Our Core Principles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The foundation of everything we build and every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="group relative cursor-pointer"
                onMouseEnter={() => setActiveValue(idx)}
                onClick={() => setActiveValue(idx)}
              >
                <div className={`relative p-6 rounded-3xl border-2 transition-all duration-500 transform ${
                  activeValue === idx 
                    ? 'border-emerald-300 bg-white shadow-2xl scale-105' 
                    : 'border-gray-100 bg-gray-50/50 hover:border-gray-200 hover:shadow-lg'
                }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transform transition-all duration-500 ${
                    activeValue === idx 
                      ? 'bg-gradient-to-br from-emerald-500 to-blue-500 scale-110 rotate-3' 
                      : 'bg-white shadow-md group-hover:scale-105'
                  }`}>
                    <value.icon 
                      className={`transition-all duration-500 ${
                        activeValue === idx ? 'text-white' : `bg-gradient-to-br ${value.color} bg-clip-text text-transparent`
                      }`} 
                      size={28} 
                    />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    activeValue === idx ? 'text-gray-900' : 'text-gray-700'
                  }`}>
                    {value.title}
                  </h3>
                  <p className={`text-sm leading-relaxed transition-all duration-500 ${
                    activeValue === idx 
                      ? 'text-gray-600 opacity-100 max-h-20' 
                      : 'text-gray-500 opacity-0 max-h-0 overflow-hidden'
                  }`}>
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section id="stats-section" className="relative py-24 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white">
              Global Impact
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Transforming transportation across continents through innovation and dedication
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { 
                number: `${counters.users.toLocaleString()}+`, 
                label: 'Rides Completed', 
                icon: TrendingUp,
                description: 'Safe journeys delivered'
              },
              { 
                number: `${counters.drivers.toLocaleString()}+`, 
                label: 'Driver Partners', 
                icon: Users,
                description: 'Economic opportunities created'
              },
              { 
                number: `${counters.cities}+`, 
                label: 'Cities Worldwide', 
                icon: Globe,
                description: 'Global presence'
              },
              { 
                number: `${counters.rating.toFixed(1)}★`, 
                label: 'Customer Rating', 
                icon: Star,
                description: 'Service excellence'
              }
            ].map((stat, idx) => (
              <div key={idx} className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 hover:border-white/30 transition-all duration-500 hover:scale-105">
                <stat.icon className="mx-auto text-white mb-6 drop-shadow-lg" size={48} strokeWidth={2} />
                <div className="text-4xl lg:text-5xl font-black text-white mb-2 drop-shadow-lg">{stat.number}</div>
                <div className="text-lg font-bold text-white mb-2">{stat.label}</div>
                <div className="text-white/70 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl mb-8">
              <span className="text-emerald-700 text-sm font-semibold">JOIN OUR MISSION</span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-black leading-tight text-gray-900 mb-6">
              Ready to Shape the
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Future of Mobility?
              </span>
            </h2>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Whether you're looking for seamless transportation or want to join our network 
              of driver partners, TripNow offers opportunities to be part of something bigger.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/register')}
                className="px-12 py-5 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-1"
              >
                Start Your Journey
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-12 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl text-lg font-bold hover:border-emerald-300 hover:text-emerald-600 transition-all duration-300 transform hover:scale-105"
              >
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative py-16 px-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        {/* Footer Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        
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
                  <p className="text-xs text-gray-400 font-semibold tracking-widest">PREMIUM MOBILITY</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
                Revolutionizing urban mobility with sustainable, reliable, and premium transportation 
                solutions for the modern world.
              </p>
              <div className="flex space-x-3">
                {['Twitter', 'LinkedIn', 'Instagram'].map((social, idx) => (
                  <button 
                    key={idx}
                    className="w-10 h-10 bg-gray-800 rounded-xl hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 transition-all duration-300 flex items-center justify-center font-semibold text-sm hover:shadow-lg"
                  >
                    {social.charAt(0)}
                  </button>
                ))}
              </div>
            </div>

            {[
              { 
                title: 'Solutions', 
                links: ['Enterprise', 'Ride Sharing', 'Food Delivery', 'Logistics'] 
              },
              { 
                title: 'Company', 
                links: ['About Us', 'Careers', 'Blog', 'Press Kit'] 
              },
              { 
                title: 'Legal', 
                links: ['Terms', 'Privacy', 'Cookies', 'Licenses'] 
              }
            ].map((col, idx) => (
              <div key={idx}>
                <h5 className="text-lg font-bold mb-4 text-white">{col.title}</h5>
                <ul className="space-y-3">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 font-medium text-sm">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              &copy; 2025 TripNow Technologies. All rights reserved. 
              <span className="block sm:inline"> Building the future of mobility.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;