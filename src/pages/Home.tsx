import React, { useState, useEffect } from 'react';
import { Printer, Shield, Clock, Star, TrendingUp, Award, CheckCircle, MessageCircle } from 'lucide-react';

export default function EnhancedHome() {
  const [scrollY, setScrollY] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [customerCount, setCustomerCount] = useState(0);
  const [printersCount, setPrintersCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const statsElement = document.getElementById('stats-section');
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (statsVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        setCustomerCount(Math.floor((500 * step) / steps));
        setPrintersCount(Math.floor((150 * step) / steps));
        setSatisfactionCount(Math.floor((99 * step) / steps));
        
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [statsVisible]);

  const features = [
    {
      icon: Printer,
      title: "Wide Selection",
      description: "Choose from a variety of printers to match your specific requirements"
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All our printers come with warranty and quality assurance"
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      description: "Quick delivery and excellent customer support via WhatsApp"
    }
  ];

  const testimonials = [
    {
      name: "Adebayo Johnson",
      role: "Small Business Owner",
      content: "Best printer purchase I've made! The quality is outstanding and customer service was excellent.",
      rating: 5
    },
    {
      name: "Ngozi Okafor",
      role: "Freelance Designer",
      content: "Fast delivery and professional service. Highly recommend Hyperdist for all printer needs!",
      rating: 5
    },
    {
      name: "Ibrahim Musa",
      role: "Office Manager",
      content: "Great prices and authentic products. The WhatsApp support made everything so easy.",
      rating: 5
    }
  ];

  const whyChooseUs = [
    { icon: Award, text: "Authorized Dealer" },
    { icon: CheckCircle, text: "Genuine Products" },
    { icon: TrendingUp, text: "Competitive Prices" },
    { icon: MessageCircle, text: "24/7 Support" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2349135114075?text=Hello,%20I%20would%20like%20to%20inquire%20about%20your%20printers"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-green-600 transition-all duration-300 hover:scale-110">
            <MessageCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat with us!
        </div>
      </a>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm">
                🏆 Trusted Printer Provider in Nigeria
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-slate-900 leading-tight">
              Quality Printers for<br />Every Need
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Find the perfect printer for your home or office. From compact inkjets to professional laser printers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group px-8 py-4 bg-slate-900 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Browse Products
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
              
              <button className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-lg font-semibold text-lg hover:border-slate-900 hover:bg-slate-50 transition-all duration-300 hover:scale-105 shadow-sm">
                Contact Us
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-700">
              {whyChooseUs.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300"
                >
                  <item.icon className="h-4 w-4 text-slate-900" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-3 bg-slate-400 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="group">
              <div className="bg-slate-800 rounded-xl p-8 hover:bg-slate-750 transition-all duration-300 border border-slate-700 hover:border-slate-600">
                <div className="text-5xl font-bold mb-2 text-white">
                  {customerCount}+
                </div>
                <div className="text-lg text-slate-400">Happy Customers</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-slate-800 rounded-xl p-8 hover:bg-slate-750 transition-all duration-300 border border-slate-700 hover:border-slate-600">
                <div className="text-5xl font-bold mb-2 text-white">
                  {printersCount}+
                </div>
                <div className="text-lg text-slate-400">Printers Sold</div>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-slate-800 rounded-xl p-8 hover:bg-slate-750 transition-all duration-300 border border-slate-700 hover:border-slate-600">
                <div className="text-5xl font-bold mb-2 text-white">
                  {satisfactionCount}%
                </div>
                <div className="text-lg text-slate-400">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              Why Choose Hyperdist?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We provide the best printing solutions with unmatched service quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 hover:border-slate-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-slate-900 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                
                <div className="mt-6 flex items-center text-slate-900 font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Learn more
                  <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              What Our Customers Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                
                <p className="text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="border-t border-slate-200 pt-4">
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="relative bg-slate-900 rounded-2xl p-12 md:p-16 text-center shadow-xl overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255) 1px, transparent 0)`,
                backgroundSize: '40px 40px'
              }}></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
                Contact us today to find the perfect printer for your needs
              </p>
              
              <button className="group px-10 py-5 bg-white text-slate-900 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <span className="flex items-center justify-center gap-2">
                  Get in Touch
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}