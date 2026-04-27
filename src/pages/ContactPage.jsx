import { useState } from 'react';
import Navbar from '../components/Common/Navbar';
import Footer from '../components/Common/Footer';
import { MapPin, Phone, Mail, Instagram, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react';

const CONTACT_METHODS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+234 816 298 3569',
    subtext: 'Chat with us instantly',
    href: 'https://wa.me/2348162983569',
    color: 'bg-green-100 text-green-700',
    hoverBg: 'hover:border-green-300 hover:bg-green-50',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'hello.mywari@gmail.com',
    subtext: 'We reply within 24 hours',
    href: 'mailto:hello.mywari@gmail.com',
    color: 'bg-primary-100 text-primary-700',
    hoverBg: 'hover:border-primary-300 hover:bg-primary-50',
  },
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@mywariltd',
    subtext: 'Follow us for updates',
    href: 'https://www.instagram.com/mywariltd?igsh=cGJmNDZzZzNsY24y&utm_source=qr',
    color: 'bg-pink-100 text-pink-700',
    hoverBg: 'hover:border-pink-300 hover:bg-pink-50',
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending — wire up your backend/emailjs/firebase here
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-16 px-4 bg-[#F5F0E8] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] opacity-10 pointer-events-none">
          <div className="w-full h-full rounded-full bg-primary-600 translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-2 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary-600" />
            We're Here to Help
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto">
            Have a question, want to list a property, or just want to say hi? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_METHODS.map((m, i) => (
              <a
                key={i}
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`bg-white rounded-2xl p-6 border-2 border-gray-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${m.hoverBg} group`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${m.color}`}>
                  <m.icon size={22} />
                </div>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">{m.label}</p>
                <p className="font-semibold text-gray-900 mb-1 group-hover:text-primary-700 transition-colors">{m.value}</p>
                <p className="text-sm text-gray-500">{m.subtext}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FORM + INFO */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-500 text-sm mb-8">Fill the form and we'll get back to you within 24 hours.</p>

                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} className="text-green-600" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-500">Thank you for reaching out. We'll reply to your email within 24 hours.</p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                      className="mt-6 text-primary-600 font-semibold text-sm hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="e.g. Chidi Okafor"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="you@example.com"
                          className="input-field"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+234 800 000 0000"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                        <select
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          required
                          className="input-field"
                        >
                          <option value="">Select a topic</option>
                          <option value="booking">Booking Help</option>
                          <option value="listing">List My Property</option>
                          <option value="agent">Become an Agent</option>
                          <option value="payment">Payment Issue</option>
                          <option value="general">General Enquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us how we can help..."
                        className="input-field resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"/>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Location */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-primary-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Our Location</h4>
                    <p className="text-gray-500 text-sm">Victoria Island, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-amber-700" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Business Hours</h4>
                    <p className="text-gray-500 text-sm">Mon – Fri: 8am – 6pm WAT</p>
                    <p className="text-gray-500 text-sm">Saturday: 10am – 4pm WAT</p>
                    <p className="text-gray-400 text-xs mt-1">WhatsApp available 24/7</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/2348162983569"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-600 hover:bg-green-700 text-white rounded-2xl p-6 transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Quick Chat</h4>
                    <p className="text-green-100 text-sm">Message us on WhatsApp for instant help</p>
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/mywariltd?igsh=cGJmNDZzZzNsY24y&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-br from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl p-6 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Instagram size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Follow Us</h4>
                    <p className="text-pink-100 text-sm">@mywariltd — news, listings & more</p>
                  </div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:hello.mywari@gmail.com"
                className="block bg-white border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50 rounded-2xl p-5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-primary-600" />
                  <span className="text-sm text-gray-700 font-medium">hello.mywari@gmail.com</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
