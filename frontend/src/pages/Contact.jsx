import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Navigation, Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Contact = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Map integration
  useEffect(() => {
    const loadMap = () => {
      if (!mapRef.current || mapLoaded) return;

      // Create a simple embedded map (in a real app, you'd use Google Maps API or similar)
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = `
        <div style="width:100%;height:100%;background:linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 100%);border-radius:20px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
          <div style="position:absolute;top:0;left:0;right:0;bottom:0;background:url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grid\" width=\"10\" height=\"10\" patternUnits=\"userSpaceOnUse\"><path d=\"M 10 0 L 0 0 0 10\" fill=\"none\" stroke=\"%233b82f6\" stroke-width=\"0.5\" opacity=\"0.3\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grid)\"/></svg>')">
          </div>
          <div style="position:relative;z-index:10;text-align:center;padding:2rem">
            <div style="width:80px;height:80px;background:linear-gradient(135deg,#10b981,#3b82f6);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;box-shadow:0 10px 25px rgba(59,130,246,0.3);animation:pulse 2s infinite">
              <MapPin style="color:white;width:32px;height:32px"/>
            </div>
            <h3 style="font-size:1.5rem;font-weight:bold;color:#1f2937;margin-bottom:0.5rem">TripNow Headquarters</h3>
            <p style="color:#6b7280;margin-bottom:1.5rem">Dhaka, Bangladesh</p>
            <a href="https://maps.google.com/?q=Dhaka+Bangladesh" target="_blank" rel="noopener noreferrer" 
               style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:linear-gradient(135deg,#10b981,#3b82f6);color:white;border-radius:12px;text-decoration:none;font-weight:600;transition:all 0.3s;box-shadow:0 4px 15px rgba(59,130,246,0.3)">
              Open in Maps <ExternalLink style="width:16px;height:16px"/>
            </a>
          </div>
          <div style="position:absolute;bottom:20px;right:20px;background:white;padding:1rem;border-radius:12px;box-shadow:0 4px 15px rgba(0,0,0,0.1)">
            <div style="display:flex;align-items:center;gap:0.5rem">
              <div style="width:12px;height:12px;background:#10b981;border-radius:50%"></div>
              <span style="font-size:0.875rem;font-weight:600">Our Location</span>
            </div>
          </div>
        </div>
      `;
      setMapLoaded(true);
    };

    // Simulate map loading
    const timer = setTimeout(loadMap, 500);
    return () => clearTimeout(timer);
  }, [mapLoaded]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 5000);
    }
  };

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
                item.href.startsWith('/') ? (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`relative font-semibold text-sm tracking-wide transition-all group ${
                      item.name === 'Contact' 
                        ? 'text-emerald-600 font-bold' 
                        : 'text-gray-700 hover:text-emerald-600'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 transition-all ${
                      item.name === 'Contact' ? 'scale-100' : 'scale-0 group-hover:scale-100'
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
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl animate-pulse"></div>

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-emerald-200 rounded-2xl mb-8 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-emerald-700 text-sm font-semibold">24/7 Customer Support</span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-black leading-tight text-gray-900 mb-6">
            Let's Start
            <span className="block mt-2 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              A Conversation
            </span>
          </h1>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
            Ready to transform your mobility experience? Our team is here to help you 
            navigate the future of transportation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone size={18} className="text-emerald-600" />
              <span className="font-semibold">+880 1234-567890</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail size={18} className="text-emerald-600" />
              <span className="font-semibold">hello@tripnow.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Cards */}
      <section className="relative py-16 px-6 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Phone,
                title: 'Call Support',
                content: '+880 1234-567890',
                subcontent: 'Available 24/7 for urgent matters',
                action: 'Call Now',
                color: 'from-emerald-500 to-emerald-600',
                bg: 'from-emerald-50 to-white'
              },
              {
                icon: Mail,
                title: 'Email Us',
                content: 'support@tripnow.com',
                subcontent: 'Typically reply within 2 hours',
                action: 'Send Email',
                color: 'from-blue-500 to-blue-600',
                bg: 'from-blue-50 to-white'
              },
              {
                icon: MapPin,
                title: 'Visit Office',
                content: 'Dhaka, Bangladesh',
                subcontent: 'Mon-Fri, 9:00 AM - 6:00 PM',
                action: 'Get Directions',
                color: 'from-purple-500 to-purple-600',
                bg: 'from-purple-50 to-white'
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-gradient-to-br ${item.bg} rounded-3xl border border-gray-100 hover:border-emerald-300 transition-all duration-500 transform hover:-translate-y-2 shadow-lg hover:shadow-2xl overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-10">
                    <item.icon size={60} className="text-gray-400" />
                  </div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    <item.icon className="text-white" size={28} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-lg font-semibold text-gray-800 mb-2">{item.content}</p>
                  <p className="text-gray-600 mb-6">{item.subcontent}</p>
                  
                  <button className="w-full py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-emerald-300 transition-all duration-300 group-hover:shadow-md">
                    {item.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Contact Form & Map Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-slate-50/50 via-blue-50/20 to-emerald-50/20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Enhanced Contact Form */}
            <div className="space-y-8">
              <div className="text-left">
                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-gray-900 leading-tight">
                  Get in Touch
                  <span className="block text-transparent bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text">
                    We're Listening
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Have a project in mind? Looking for partnership opportunities? 
                  Or just want to say hello? We'd love to hear from you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-all duration-300 shadow-sm hover:shadow-md resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-3">
                      <Send size={20} />
                      <span>Send Message</span>
                    </div>
                  )}
                </button>

                {submitStatus === 'success' && (
                  <div className="flex items-center space-x-3 p-4 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl animate-fade-in">
                    <CheckCircle size={24} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold">Message sent successfully!</p>
                      <p className="text-sm text-emerald-600">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="flex items-center space-x-3 p-4 text-red-700 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                    <AlertCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold">Something went wrong</p>
                      <p className="text-sm text-red-600">Please try again or contact us directly.</p>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Enhanced Map Section */}
            <div className="space-y-8">
              {/* Interactive Map */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                <div 
                  ref={mapRef}
                  className="w-full h-96 bg-gray-100 rounded-3xl animate-pulse"
                />
              </div>

              {/* Enhanced Office Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="text-emerald-600" size={24} />
                    <h3 className="text-xl font-bold text-gray-900">Office Hours</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM' },
                      { day: 'Saturday', hours: '10:00 AM - 4:00 PM' },
                      { day: 'Sunday', hours: 'Emergency Only' }
                    ].map((schedule, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                        <span className="font-semibold text-gray-700 text-sm">{schedule.day}</span>
                        <span className="text-gray-600 text-sm">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Emergency Support</h3>
                  <p className="text-emerald-100 mb-4">24/7 emergency line for urgent matters</p>
                  <div className="flex items-center space-x-2">
                    <Phone size={20} />
                    <span className="font-bold text-lg">+880 1234-567891</span>
                  </div>
                </div>
              </div>

              {/* Quick Response Info */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3">What to Expect</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span>Response within 2 hours during business hours</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span>Dedicated account manager for enterprise inquiries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-emerald-600" />
                    <span>24/7 technical support available</span>
                  </div>
                </div>
              </div>
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
                Revolutionizing urban mobility with sustainable, reliable, and premium transportation solutions for the modern world.
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

export default Contact;