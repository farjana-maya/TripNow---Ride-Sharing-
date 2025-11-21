import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, MapPin, DollarSign, Clock, TrendingUp, Shield, 
  CheckCircle, ArrowRight, Star, Users, Zap, Award,
  Phone, Mail, ChevronRight, Navigation
} from 'lucide-react';

const DrivePage = () => {
  const navigate = useNavigate();
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl shadow-lg"></div>
                <div className="absolute inset-1 bg-white rounded-xl flex items-center justify-center">
                  <Navigation className="text-emerald-500 transform rotate-45" size={20} />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
                  TripNow
                </h1>
                <p className="text-xs text-gray-500 tracking-wider font-semibold">DRIVE & EARN</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 text-gray-700 hover:text-emerald-500 font-semibold transition-all"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-5 py-2.5 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-300 rounded-full shadow-sm mb-6">
              <span className="text-emerald-600 text-sm font-bold">🚗 JOIN OUR DRIVER COMMUNITY</span>
            </div>
            
            <h1 className="text-6xl lg:text-7xl font-black leading-tight text-gray-900 mb-6">
              Drive with TripNow
              <span className="block mt-2 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Earn on Your Terms
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-10">
              Be your own boss. Set your schedule. Earn competitive rates with the fastest-growing ride-sharing platform.
            </p>

            <button
              onClick={() => setShowRegistrationForm(true)}
              className="group relative px-12 py-5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105 overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start Driving Today</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-20">
            {[
              { icon: DollarSign, value: '$2,500+', label: 'Avg. Monthly Earnings', color: 'from-emerald-400 to-emerald-600' },
              { icon: Users, value: '10K+', label: 'Active Drivers', color: 'from-blue-400 to-blue-600' },
              { icon: Star, value: '4.9★', label: 'Driver Rating', color: 'from-yellow-400 to-orange-600' },
              { icon: Clock, value: '24/7', label: 'Flexible Schedule', color: 'from-purple-400 to-pink-600' }
            ].map((stat, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 blur group-hover:opacity-100 transition duration-300" 
                     style={{background: `linear-gradient(to right, ${stat.color.split(' ')[0].replace('from-', '#')}, ${stat.color.split(' ')[1].replace('to-', '#')})`}}></div>
                <div className="relative bg-white rounded-2xl p-6 text-center transform group-hover:-translate-y-2 transition-all">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    <stat.icon className="text-white" size={28} />
                  </div>
                  <div className="text-3xl font-black text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">
              Why Drive with <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">TripNow?</span>
            </h2>
            <p className="text-xl text-gray-600">Experience the freedom of being your own boss</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: 'High Earnings',
                description: 'Keep up to 85% of each fare. Weekly payouts directly to your account.',
                color: 'from-emerald-400 to-emerald-600',
                features: ['85% commission rate', 'Weekly payments', 'Bonus incentives', 'Surge pricing']
              },
              {
                icon: Clock,
                title: 'Total Flexibility',
                description: 'Drive when you want. No fixed hours. Complete control of your schedule.',
                color: 'from-blue-400 to-blue-600',
                features: ['Work anytime', 'Choose your hours', 'No minimum shifts', 'Instant start/stop']
              },
              {
                icon: Shield,
                title: 'Safety First',
                description: 'Comprehensive insurance coverage and 24/7 safety support for all drivers.',
                color: 'from-purple-400 to-purple-600',
                features: ['Full insurance', '24/7 support', 'Emergency assistance', 'Verified riders']
              }
            ].map((benefit, idx) => (
              <div key={idx} className="group relative">
                <div className="relative p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:-translate-y-2 shadow-lg hover:shadow-2xl">
                  <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl`}>
                    <benefit.icon className="text-white" size={36} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{benefit.description}</p>
                  <div className="space-y-2">
                    {benefit.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <CheckCircle className="text-emerald-500 flex-shrink-0" size={18} />
                        <span className="text-sm text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-50 via-emerald-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 text-gray-900">Get Started in 3 Easy Steps</h2>
            <p className="text-xl text-gray-600">Start earning in less than 24 hours</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up',
                description: 'Create your driver account and provide basic information in minutes.',
                icon: Users
              },
              {
                step: '02',
                title: 'Get Verified',
                description: 'Submit your documents for quick verification. Our team reviews within 24 hours.',
                icon: Shield
              },
              {
                step: '03',
                title: 'Start Earning',
                description: 'Once approved, go online and start accepting rides immediately.',
                icon: TrendingUp
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                <div className="relative p-8 bg-white rounded-3xl shadow-xl border-2 border-gray-100 hover:border-emerald-300 transition-all transform hover:scale-105">
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-xl">
                    {step.step}
                  </div>
                  <div className="mt-6">
                    <step.icon className="text-emerald-500 mb-4" size={40} strokeWidth={2} />
                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {idx < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="text-emerald-400" size={32} strokeWidth={3} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 text-gray-900">Driver Requirements</h2>
            <p className="text-lg text-gray-600">Make sure you meet these basic requirements</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Valid driver\'s license (minimum 2 years)',
              'Clean driving record',
              'Vehicle registration documents',
              'Vehicle insurance papers',
              'Age 21 or older',
              'Background check clearance',
              'Smartphone with GPS',
              'Good communication skills'
            ].map((req, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200">
                <CheckCircle className="text-emerald-500 flex-shrink-0" size={24} />
                <span className="text-gray-800 font-medium">{req}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-5xl lg:text-6xl font-black text-white mb-6">
            Ready to Hit the Road?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of drivers earning great money with flexible hours
          </p>
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="px-12 py-5 bg-white text-emerald-600 rounded-full text-xl font-bold shadow-2xl hover:shadow-3xl transition-all transform hover:scale-105"
          >
            Register as Driver Now
          </button>
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistrationForm && (
        <DriverRegistrationModal onClose={() => setShowRegistrationForm(false)} />
      )}
    </div>
  );
};

const DriverRegistrationModal = ({ onClose }) => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Navigate to registration page with driver role pre-selected
    navigate('/register', { state: { role: 'driver', fromDrivePage: true } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          ✕
        </button>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Car className="text-white" size={36} />
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2">
            Become a Driver
          </h3>
          <p className="text-gray-600">
            Start your journey to financial freedom
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-xl">
            <CheckCircle className="text-emerald-500" size={20} />
            <span className="text-sm text-gray-700 font-medium">Quick 5-minute registration</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
            <CheckCircle className="text-blue-500" size={20} />
            <span className="text-sm text-gray-700 font-medium">24-hour verification process</span>
          </div>
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
            <CheckCircle className="text-purple-500" size={20} />
            <span className="text-sm text-gray-700 font-medium">Start earning immediately after approval</span>
          </div>
        </div>

        <button
          onClick={handleRegister}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          Continue to Registration
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already registered? <button onClick={() => navigate('/login')} className="text-emerald-500 font-semibold hover:underline">Sign In</button>
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DrivePage;