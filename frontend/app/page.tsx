'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { motion, Variants } from "framer-motion";
import { Zap, ShieldCheck, IndianRupee, MapPin, Search, Star, MessageCircle, Phone } from "lucide-react";
import React from "react";

// Animation Variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-black/95 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <div className="bg-yellow-400 p-1.5 rounded-lg">
              <Zap className="text-black w-6 h-6" fill="black" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">
              PUNCHER
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex space-x-4"
          >
            <Link href="/login/user">
              <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 hover:bg-white/5 font-semibold transition-colors">Login</Button>
            </Link>
            <Link href="/register/vendor">
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold border-none">
                Become a Partner
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-40 bg-black text-white selection:bg-yellow-400 selection:text-black">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left z-10"
            >
              <motion.div variants={fadeInUp} className="inline-block">
                <span className="bg-white/10 border border-white/10 text-yellow-400 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-sm">
                  🚀 #1 Roadside Assistance in India
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                STUCK ON <br />
                THE ROAD?
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200 mt-2">WE GOT YOU.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="text-xl text-gray-400 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                Connect with nearby mechanics instantly. From flat tires to breakdowns, help is just one tap away.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                <Link href="/register/user" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-14 text-lg font-bold bg-yellow-400 text-black hover:bg-yellow-500 hover:scale-105 transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)]">
                    Request Help Now
                  </Button>
                </Link>
                <Link href="/register/vendor" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 text-lg font-bold border-2 border-white/20 text-white hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-sm">
                    Join as Mechanic
                  </Button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-gray-400 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" /> Verified Pros
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" /> &lt; 15 Mins Arrival
                </div>
              </motion.div>
            </motion.div>

            {/* Visual Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 6 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative z-0"
            >
              {/* App Mockup Container */}
              <div className="relative w-[320px] mx-auto bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden aspect-[9/19]">
                {/* Mockup Screen Content */}
                <div className="h-full bg-gray-100 flex flex-col relative">
                  {/* Fake Map Background */}
                  <div className="absolute inset-0 bg-blue-100 opacity-50">
                    {/* Abstract map lines */}
                    <svg className="w-full h-full text-blue-200" fill="none">
                      <path d="M-10 100 L400 300" stroke="currentColor" strokeWidth="20" />
                      <path d="M100 -10 L200 600" stroke="currentColor" strokeWidth="20" />
                      <circle cx="200" cy="300" r="10" className="text-blue-500 fill-current" />
                    </svg>
                  </div>

                  {/* Fake UI Elements */}
                  <div className="relative z-10 p-6 pt-12 space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-lg animate-fade-in-up">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-2 w-24 bg-gray-200 rounded mb-1"></div>
                          <div className="h-2 w-16 bg-gray-100 rounded"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-6 right-6">
                      <div className="bg-black text-yellow-400 p-4 rounded-xl font-bold text-center shadow-xl">
                        Mechanic Arriving...
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-1/2 -right-8 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3"
              >
                <div className="bg-green-100 p-2 rounded-full">
                  <Phone className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold">Connecting...</p>
                  <p className="text-sm font-bold text-black">Mechanic Nearby</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 space-y-2"
          >
            <h2 className="text-4xl font-black tracking-tight text-black">WHY CHOOSE PUNCHER?</h2>
            <div className="w-24 h-1.5 bg-yellow-400 mx-auto rounded-full"></div>
            <p className="text-gray-500 max-w-2xl mx-auto pt-4 text-lg">
              We're revolutionizing roadside assistance with technology to make your journeys safer and smoother.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-yellow-600" />}
              title="Lightning Fast"
              description="Our advanced algorithm matches you with the nearest mechanic instantly. Assistance usually arrives within 15-30 minutes."
              delay={0}
            />
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-yellow-600" />}
              title="Verified & Safe"
              description="All our partners undergo rigorous background checks and skill assessments. Your vehicle is in safe, professional hands."
              delay={0.1}
            />
            <FeatureCard
              icon={<IndianRupee className="w-8 h-8 text-yellow-600" />}
              title="Transparent Pricing"
              description="Get upfront cost estimates before you book. No hidden charges, no haggling. Pay securely through the app."
              delay={0.2}
            />
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>

            <StepCard number="1" title="Request Help" desc="Choose your service and share your location." icon={<MapPin />} />
            <StepCard number="2" title="Get Matched" desc="Nearby mechanics accept your request instantly." icon={<Search />} />
            <StepCard number="3" title="Back on Track" desc="Pay securely and continue your journey." icon={<IndianRupee />} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight">
            READY TO RIDE WORRY-FREE?
          </h2>
          <p className="text-xl text-black/80 font-medium">
            Join thousands of happy users who trust Puncher for their roadside needs.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-black text-white hover:bg-gray-800 h-14 px-8 text-lg font-bold rounded-full transition-transform hover:scale-105">
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 p-1 rounded-md">
              <Zap className="w-4 h-4 text-black" fill="black" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">PUNCHER</span>
          </div>
          <div className="text-gray-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Puncher Technologies Pvt Ltd.
          </div>
          <div className="flex gap-4">
            <SocialIcon icon="fb" />
            <SocialIcon icon="tw" />
            <SocialIcon icon="in" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-shadow border border-gray-100"
    >
      <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-black mb-3">{title}</h3>
      <p className="text-gray-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: any }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 bg-white p-6">
      <div className="w-16 h-16 bg-black text-yellow-400 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10">
        {icon}
      </div>
      <h3 className="text-xl font-bold mt-4">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  )
}

function SocialIcon({ icon }: { icon: string }) {
  return (
    <span className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-yellow-400 hover:text-black cursor-pointer transition-colors font-bold text-xs uppercase">
      {icon}
    </span>
  )
}
