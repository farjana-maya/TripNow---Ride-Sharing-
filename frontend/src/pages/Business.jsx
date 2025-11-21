import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, X, Navigation, Building2, Users, TrendingUp, Shield, 
  Clock, DollarSign, BarChart3, Globe, Briefcase, CheckCircle,
  ArrowRight, Phone, Mail, MapPin, Star, Zap, Award,
  FileText, Calendar, CreditCard, Settings, ChevronDown
} from 'lucide-react';

const BusinessPage = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('rides');
  const [selectedPlan, setSelectedPlan] = useState('professional');
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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/login');
  };

  const solutions = [
    {
      id: 'rides',
      title: 'Employee Rides',
      icon: Users,
      gradient: 'from-emerald-500 to-blue-500',
      description: 'Seamless commute solutions for your team',
      features: [
        'Automated ride scheduling',
        'Real-time ride tracking',
        'Centralized billing',
        'Custom routing options',
        'Safety & compliance reports'
      ]
    },
    {
      id: 'delivery',
      title: 'Business Delivery',
      icon: Building2,
      gradient: 'from-blue-500 to-purple-500',
      description: 'Fast and reliable delivery solutions',
      features: [
        'Same-day delivery',
        'Live package tracking',
        'Bulk delivery management',
        'Proof of delivery',
        'API integration'
      ]
    },
    {
      id: 'fleet',
      title: 'Fleet Management',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500',
      description: 'Optimize your company\'s vehicle operations',
      features: [
        'Real-time fleet tracking',
        'Driver performance analytics',
        'Maintenance scheduling',
        'Fuel cost optimization',
        'Route optimization'
      ]
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: 'Cost Savings',
      description: 'Reduce transportation costs by up to 40% with optimized routing and bulk discounts',
      stat: '40%',
      gradient: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: Clock,
      title: 'Time Efficiency',
      description: 'Save 15+ hours per week on transportation management and coordination',
      stat: '15hrs',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Enhanced Safety',
      description: 'Verified drivers, 24/7 monitoring, and comprehensive insurance coverage',
      stat: '100%',
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Productivity Boost',
      description: 'Increase employee productivity with reliable and stress-free commutes',
      stat: '+35%',
      gradient: 'from-pink-400 to-pink-600'
    }
  ];

  const pricingPlans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '299',
      period: 'month',
      description: 'Perfect for small teams',
      features: [
        'Up to 50 rides/month',
        'Basic analytics dashboard',
        'Email support',
        'Standard vehicles only',
        'Next-day invoicing'
      ],
      highlighted: false,
      gradient: 'from-gray-500 to-gray-600'
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '799',
      period: 'month',
      description: 'Most popular for growing businesses',
      features: [
        'Up to 200 rides/month',
        'Advanced analytics & reports',
        'Priority 24/7 support',
        'All vehicle types',
        'Real-time invoicing',
        'Dedicated account manager',
        'Custom routing'
      ],
      highlighted: true,
      gradient: 'from-emerald-500 to-blue-500'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'Tailored for large organizations',
      features: [
        'Unlimited rides',
        'Custom analytics dashboard',
        'Dedicated support team',
        'Premium fleet access',
        'API integration',
        'Multiple account managers',
        'Custom SLA',
        'White-label options'
      ],
      highlighted: false,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      company: 'TechCorp Solutions',
      logo: '🏢',
      person: 'Sarah Johnson',
      role: 'HR Director',
      content: 'TripNow Business has transformed our employee transportation. We\'ve cut costs by 45% and employee satisfaction has soared.',
      rating: 5,
      gradient: 'from-emerald-400 to-blue-500'
    },
    {
      company: 'Global Logistics Inc',
      logo: '📦',
      person: 'Michael Chen',
      role: 'Operations Manager',
      content: 'The delivery solution is outstanding. Real-time tracking and reliable service have made our operations so much more efficient.',
      rating: 5,
      gradient: 'from-blue-400 to-purple-500'
    },
    {
      company: 'StartUp Ventures',
      logo: '🚀',
      person: 'Emily Rodriguez',
      role: 'CEO',
      content: 'As a growing startup, TripNow Business gave us enterprise-level transportation without the enterprise price tag.',
      rating: 5,
      gradient: 'from-purple-400 to-pink-500'
    }
  ];

  const stats = [
    { number: '500+', label: 'Business Clients', icon: Building2 },
    { number: '50K+', label: 'Monthly Rides', icon: Users },
    { number: '98%', label: 'On-Time Rate', icon: Clock },
    { number: '4.9★', label: 'Client Rating', icon: Star }
  ];

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
              <span>business@tripnow.com</span>
            </div>
          </div>
          <div className="hidden md:block">
            <span>🎉 Special: Get 2 months free with annual plans!</span>
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
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl transform group-hover:rotate-12 transition-transform duration-500 shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                  <Navigation className="text-emerald-500 transform rotate-45" size={24} />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  TripNow
                </h1>
                <p className="text-xs text-gray-500 tracking-wider font-semibold">BUSINESS</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {[
                { name: 'Home', href: '/' },
                { name: 'Solutions', href: '#solutions' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Why Us', href: '#benefits' },
                { name: 'Contact', href: '#contact' }
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

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="px-6 py-2.5 text-gray-700 hover:text-emerald-500 font-semibold transition-all"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Sign Out
                  </button>
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
                    className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Get Started
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
              {['Solutions', 'Pricing', 'Why Us', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(' ', '-')}`}
                  className="block text-gray-700 hover:text-emerald-500 font-semibold py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full font-semibold shadow-lg">
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto space-y-8">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300 rounded-full shadow-sm animate-bounce">
              <span className="text-emerald-600 text-sm font-bold">🚀 TRUSTED BY 500+ BUSINESSES</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black leading-tight text-gray-900">
              Power Your Business
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                With Smart Mobility
              </span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Enterprise-grade transportation and delivery solutions that scale with your business. Save costs, boost efficiency, and delight your team.
            </p>

            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <button className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>Request Demo</span>
                <ArrowRight size={20} />
              </button>
              <button className="px-10 py-5 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-lg font-bold hover:border-emerald-500 hover:text-emerald-500 transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>View Pricing</span>
                <ChevronDown size={20} />
              </button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <stat.icon className="mx-auto text-emerald-500" size={32} />
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 border border-blue-300 rounded-full mb-6">
              <span className="text-blue-600 text-sm font-bold">COMPREHENSIVE SOLUTIONS</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900">
              Built For Your <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">Business Needs</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Choose the solution that fits your business model</p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 p-2 rounded-2xl space-x-2">
              {solutions.map((solution) => (
                <button
                  key={solution.id}
                  onClick={() => setActiveTab(solution.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all ${
                    activeTab === solution.id
                      ? `bg-gradient-to-r ${solution.gradient} text-white shadow-lg`
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {solution.title}
                </button>
              ))}
            </div>
          </div>

          {solutions.map((solution) => (
            activeTab === solution.id && (
              <div key={solution.id} className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className={`inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r ${solution.gradient} rounded-full text-white shadow-lg`}>
                    <solution.icon size={24} />
                    <span className="font-bold text-lg">{solution.title}</span>
                  </div>
                  
                  <h3 className="text-4xl font-black text-gray-900">{solution.description}</h3>
                  
                  <div className="space-y-4">
                    {solution.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3 group">
                        <CheckCircle className={`flex-shrink-0 bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} size={24} strokeWidth={3} />
                        <span className="text-gray-700 font-medium text-lg">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button className={`px-8 py-4 bg-gradient-to-r ${solution.gradient} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center space-x-2`}>
                    <span>Learn More</span>
                    <ArrowRight size={20} />
                  </button>
                </div>

                <div className="relative">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-12 shadow-2xl border-4 border-white">
                    <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-5 rounded-3xl`}></div>
                    
                    {/* Animated Visual Elements */}
                    <div className="relative h-full flex items-center justify-center">
                      <div className="absolute inset-0">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute inset-0 border-2 rounded-full animate-ping`}
                            style={{
                              animationDelay: `${i * 0.5}s`,
                              borderColor: solution.gradient.includes('emerald') ? '#10b981' : solution.gradient.includes('purple') ? '#a855f7' : '#3b82f6',
                              opacity: 0.2
                            }}
                          ></div>
                        ))}
                      </div>
                      
                      <div className={`relative w-48 h-48 bg-gradient-to-br ${solution.gradient} rounded-full flex items-center justify-center shadow-2xl animate-bounce`}>
                        <solution.icon className="text-white" size={80} strokeWidth={2} />
                      </div>
                    </div>

                    {/* Floating Info Cards */}
                    <div className="absolute top-8 right-8 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 animate-pulse">
                      <div className="text-xs text-gray-500 font-semibold">Active Users</div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent`}>2.5K+</div>
                    </div>

                    <div className="absolute bottom-8 left-8 p-4 bg-white rounded-2xl shadow-xl border border-gray-100 animate-pulse" style={{animationDelay: '0.5s'}}>
                      <div className="text-xs text-gray-500 font-semibold">Cost Saved</div>
                      <div className={`text-2xl font-black bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent`}>$45K</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Why Businesses Choose TripNow</h2>
            <p className="text-xl text-gray-600">Real impact on your bottom line</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-2xl h-full">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${benefit.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`}></div>
                  
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg`}>
                      <benefit.icon className="text-white" size={32} strokeWidth={2.5} />
                    </div>
                    
                    <div className={`text-5xl font-black bg-gradient-to-br ${benefit.gradient} bg-clip-text text-transparent mb-4`}>
                      {benefit.stat}
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300 rounded-full mb-6">
              <span className="text-emerald-600 text-sm font-bold">TRANSPARENT PRICING</span>
            </div>
            <h2 className="text-5xl lg:text-6xl font-black mb-6 text-gray-900">
              Plans That <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">Scale With You</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">No hidden fees. Cancel anytime. Get started in minutes.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingPlans.map((plan) => (
              <div key={plan.id} className={`relative group ${plan.highlighted ? 'lg:-translate-y-4' : ''}`}>
                {plan.highlighted && (
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-sm font-bold shadow-lg z-10">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`relative p-8 bg-white rounded-3xl border-2 transition-all h-full ${
                  plan.highlighted 
                    ? 'border-emerald-300 shadow-2xl' 
                    : 'border-gray-100 hover:border-emerald-200 shadow-lg hover:shadow-xl'
                }`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${plan.gradient} opacity-5 rounded-full blur-2xl`}></div>
                  
                  <div className="relative space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-gray-600">{plan.description}</p>
                    </div>

                    <div className="flex items-baseline space-x-2">
                      {plan.price !== 'Custom' && <span className="text-gray-500 text-2xl font-bold">$</span>}
                      <span className={`text-6xl font-black bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                        {plan.price}
                      </span>
                      <span className="text-gray-500 font-medium">/{plan.period}</span>
                    </div>

                    <button className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                      plan.highlighted
                        ? `bg-gradient-to-r ${plan.gradient} text-white shadow-lg hover:shadow-xl`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </button>

                    <div className="pt-6 space-y-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-3">
                          <CheckCircle className={`flex-shrink-0 bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`} size={20} strokeWidth={3} />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">
              Trusted By <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-600">See what our clients have to say</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="group">
                <div className="relative p-8 bg-white rounded-3xl border-2 border-gray-100 hover:border-emerald-200 transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-2xl h-full">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${testimonial.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${testimonial.gradient} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                        {testimonial.logo}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{testimonial.company}</div>
                        <div className="flex space-x-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="text-yellow-400 fill-current" size={16} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed italic">"{testimonial.content}"</p>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="font-bold text-gray-900">{testimonial.person}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="relative py-24 px-6 bg-white">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500"></div>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            
            <div className="relative px-8 py-20 text-center">
              <div className="max-w-4xl mx-auto space-y-8">
                <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight">
                  Ready To Transform Your
                  <span className="block mt-2">Business Operations?</span>
                </h2>
                
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                  Join 500+ companies already saving costs and boosting productivity with TripNow Business
                </p>

                <div className="flex flex-wrap justify-center gap-6 pt-8">
                  <button className="px-10 py-5 bg-white text-emerald-600 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 flex items-center space-x-2">
                    <span>Schedule Demo</span>
                    <Calendar size={20} />
                  </button>
                  <button className="px-10 py-5 bg-white/20 backdrop-blur-md border-2 border-white text-white rounded-full text-lg font-bold hover:bg-white/30 transition-all transform hover:scale-105 flex items-center space-x-2">
                    <span>Contact Sales</span>
                    <Phone size={20} />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 pt-16">
                  {[
                    { icon: Shield, label: 'Enterprise Security' },
                    { icon: Zap, label: 'Quick Setup' },
                    { icon: Award, label: '24/7 Support' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <item.icon className="text-white" size={24} />
                      </div>
                      <span className="text-white font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Everything You Need</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for modern businesses</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time insights and custom reports' },
              { icon: CreditCard, title: 'Flexible Billing', desc: 'Multiple payment options & invoicing' },
              { icon: Settings, title: 'Easy Integration', desc: 'API access & seamless connectivity' },
              { icon: Globe, title: 'Multi-Location', desc: 'Manage operations across cities' },
              { icon: FileText, title: 'Compliance Ready', desc: 'Automated reporting & documentation' },
              { icon: Briefcase, title: 'Dedicated Support', desc: 'Personal account management team' }
            ].map((feature, idx) => (
              <div key={idx} className="group p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:-translate-y-1 shadow-md hover:shadow-xl">
                <feature.icon className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} strokeWidth={2} />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Got questions? We've got answers</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How quickly can we get started?',
                a: 'Most businesses are up and running within 24 hours. Our onboarding team will guide you through the entire setup process.'
              },
              {
                q: 'Can we customize the solution for our needs?',
                a: 'Absolutely! Our Enterprise plan offers full customization including white-label options, custom integrations, and tailored workflows.'
              },
              {
                q: 'What kind of support do you provide?',
                a: 'All plans include email support. Professional and Enterprise plans get 24/7 priority support with dedicated account managers.'
              },
              {
                q: 'Is there a minimum contract period?',
                a: 'No long-term commitments required. You can start with monthly billing and upgrade or cancel anytime.'
              },
              {
                q: 'How does billing work?',
                a: 'We offer flexible billing options including monthly, quarterly, and annual plans. Enterprise clients can request custom billing terms.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="group p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-emerald-200 transition-all">
                <summary className="flex justify-between items-center cursor-pointer font-bold text-lg text-gray-900 list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="group-open:rotate-180 transition-transform text-emerald-500" size={24} />
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
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
                    TripNow Business
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">ENTERPRISE MOBILITY</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Empowering businesses with next-generation transportation and delivery solutions. Trusted by industry leaders worldwide.
              </p>
              <div className="flex space-x-4">
                {['LinkedIn', 'Twitter', 'Facebook'].map((social, idx) => (
                  <button key={idx} className="w-10 h-10 bg-gray-800 rounded-full hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-500 transition-all flex items-center justify-center font-bold text-sm">
                    {social.charAt(0)}
                  </button>
                ))}
              </div>
            </div>
            
            {[
              { title: 'Solutions', links: ['Employee Rides', 'Delivery', 'Fleet Management', 'API Access'] },
              { title: 'Resources', links: ['Case Studies', 'Documentation', 'Blog', 'Webinars'] },
              { title: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] }
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
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">&copy; 2025 TripNow Business. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BusinessPage;