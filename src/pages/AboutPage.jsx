import { Link } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { ArrowRight, Instagram, MessageCircle, Mail, Shield, Users, Home, MapPin, Heart, Star } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

const TEAM_VALUES = [
  { icon: Shield, title: 'Trust First', desc: 'Every property is verified. Every agent is vetted. We hold ourselves to the highest standard so you don\'t have to worry.' },
  { icon: Home, title: 'Home for Everyone', desc: 'Whether you need a night\'s stay or a forever home, My Wari has you covered across all 36 states.' },
  { icon: Users, title: 'Community Driven', desc: 'We\'re built on relationships — with guests, hosts, agents, and the communities we serve across Nigeria.' },
  { icon: Heart, title: 'Care in Every Detail', desc: 'From the moment you search to the moment you move in, we\'re with you every step of the way.' },
];

const MILESTONES = [
  { year: '2023', title: 'The Idea', desc: 'My Wari was born from a simple frustration: finding safe, quality short-term accommodation in Nigeria was too hard.' },
  { year: '2024', title: 'First Launch', desc: 'We launched our beta platform in Lagos with 200 verified properties and a passionate founding team.' },
  { year: '2025', title: 'Nationwide', desc: 'Expanded to 10 cities, surpassed 10,000 bookings, and onboarded 500+ verified agents and property managers.' },
  { year: '2026', title: 'Mobile App & Web App', desc: 'Launched the My Wari app to make property discovery and booking seamless from any smartphone in Nigeria.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-[#F5F0E8]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10">
          <div className="w-full h-full rounded-full bg-primary-600 translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-5">
          <div className="w-full h-full rounded-full bg-bark translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              Our Story
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Making Nigeria Feel Like<br />
              <span className="text-primary-600">Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed mb-10">
              Inspired by the Ijaw word <strong>"Wari"</strong> — meaning <em>Home</em> — we built a platform where every Nigerian can find safe, comfortable, and affordable accommodation with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/search" className="btn-primary inline-flex items-center gap-2">
                Browse Properties <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-secondary inline-flex items-center gap-2">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION STATEMENT */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80"
                alt="About My Wari"
                className="rounded-3xl shadow-2xl w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-900/20 to-transparent" />
              {/* Floating card */}
              <div className="absolute -bottom-8 -right-8 bg-white rounded-2xl shadow-xl p-6 max-w-[200px]">
                <p className="font-display text-4xl font-bold text-primary-700 mb-1">50K+</p>
                <p className="text-gray-500 text-sm">Nigerians housed and happy</p>
              </div>
              {/* Logo watermark card */}
              <div className="absolute top-6 left-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-lg flex items-center gap-3">
                <img src={logoImg} alt="My Wari" className="h-10 w-auto object-contain" />
              </div>
            </div>
            <div>
              <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-3">Who We Are</p>
              <h2 className="section-title mb-6">A Platform Built for Nigerians, by Nigerians</h2>
              <div className="space-y-5 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-gray-900">My Wari</strong> is a digital platform that helps people easily find and book trusted shortlet apartments and Airbnb-style stays across different cities. Inspired by the Ijaw word <strong>"Wari,"</strong> meaning <em>Home</em>, our mission is to make every stay comfortable, secure, and affordable.
                </p>
                <p>
                  Through the My Wari mobile app, users can discover available apartments, book instantly, make secure payments, and get location directions with ease.
                </p>
                <p>
                  We partner with apartment owners, property managers, and agents to connect guests with quality accommodations while helping properties reach more customers. <strong className="text-primary-700">At My Wari, we believe home should always be within reach.</strong>
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-6 mt-8 pt-8 border-t border-gray-100">
                {[
                  { val: '12K+', label: 'Listings' },
                  { val: '500+', label: 'Agents' },
                  { val: '36', label: 'States' },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-display text-3xl font-bold text-primary-700">{s.val}</p>
                    <p className="text-gray-500 text-sm mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VALUES */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">What We Stand For</p>
            <h2 className="section-title">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-3">The principles that guide every decision we make at My Wari.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_VALUES.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-primary-600 transition-colors">
                  <v.icon size={26} className="text-primary-700 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY / MILESTONES */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold uppercase tracking-wider text-sm mb-2">How We Got Here</p>
            <h2 className="section-title">Our Journey</h2>
          </div>
          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-0.5 bg-primary-100" />
            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <span className="inline-block bg-primary-100 text-primary-700 rounded-full px-3 py-1 text-xs font-bold mb-3">{m.year}</span>
                      <h3 className="font-display text-xl font-bold text-gray-900 mb-2">{m.title}</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                  {/* Circle on timeline */}
                  <div className="md:w-auto relative z-10">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-md">
                      <span className="text-white text-xs font-bold">{i + 1}</span>
                    </div>
                  </div>
                  <div className="md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL / CONNECT */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-700 to-primary-900">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-300 font-semibold uppercase tracking-wider text-sm mb-2">Let's Connect</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">Find Us Online</h2>
          <p className="text-primary-200 mb-10 text-lg">Follow our journey and connect with us on social media.</p>
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <a
              href="https://www.instagram.com/mywariltd?igsh=cGJmNDZzZzNsY24y&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white rounded-2xl px-6 py-4 transition-all font-medium"
            >
              <Instagram size={20} className="text-pink-300" />
              <div className="text-left">
                <p className="text-xs text-white/60">Follow us on</p>
                <p className="font-semibold">Instagram</p>
              </div>
            </a>
            <a
              href="https://wa.me/2348162983569"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white rounded-2xl px-6 py-4 transition-all font-medium"
            >
              <MessageCircle size={20} className="text-green-300" />
              <div className="text-left">
                <p className="text-xs text-white/60">Chat with us on</p>
                <p className="font-semibold">WhatsApp</p>
              </div>
            </a>
            <a
              href="mailto:hello.mywari@gmail.com"
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white rounded-2xl px-6 py-4 transition-all font-medium"
            >
              <Mail size={20} className="text-blue-300" />
              <div className="text-left">
                <p className="text-xs text-white/60">Email us at</p>
                <p className="font-semibold">hello.mywari@gmail.com</p>
              </div>
            </a>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-4 rounded-2xl hover:bg-primary-50 transition-colors shadow-lg">
            Send Us a Message <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[#F5F0E8]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-gray-900 mb-4">Ready to Experience My Wari?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Nigerians who've found their perfect home. It's free and takes just a minute.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-10 py-4">Get Started Free</Link>
            <Link to="/search" className="btn-secondary text-lg px-10 py-4">Browse Properties</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
