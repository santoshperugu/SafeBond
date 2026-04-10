import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck, Users, FileText, CheckCircle, 
  ArrowRight, Lock, Heart, Award, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero-safe.png';

const GlassCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    whileHover={{ y: -10, transition: { duration: 0.2 } }}
    className="backdrop-blur-xl bg-white/60 p-8 rounded-[2.5rem] border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all group"
  >
    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
      <Icon size={32} />
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-600 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const StatItem = ({ number, label, suffix = "+" }) => (
  <div className="text-center group">
    <motion.div 
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter"
    >
      {number}{suffix}
    </motion.div>
    <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{label}</div>
    <div className="w-8 h-1 bg-primary-500 mx-auto mt-4 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
  </div>
);

const Home = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="min-h-screen bg-[#FDFEFE] selection:bg-primary-100 selection:text-primary-900">
      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary-100/40 blur-[120px] rounded-full"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[40%] -right-[10%] w-[50%] h-[50%] bg-accent-100/30 blur-[150px] rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center space-x-2 py-2 px-4 rounded-full bg-white/50 backdrop-blur-md border border-slate-200 text-primary-700 text-sm font-bold mb-8 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                <span>Trusted by 10,000+ Families Worldwide</span>
              </motion.span>
              
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-10">
                The Trust <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-accent-500 to-secondary-500 drop-shadow-sm">Verification</span> <br />
                Platform.
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 max-w-xl mb-12 leading-relaxed font-medium">
                SafeBond revolutionizes matrimony with high-fidelity background checks and secure family consent workflows. 
                <span className="text-slate-900 font-bold ml-1">Bonds built on truth.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/register" className="group relative px-8 py-5 bg-slate-900 text-white rounded-[2rem] font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/20">
                  <div className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative z-10 flex items-center">
                    Start Your Verification <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </span>
                </Link>
                <Link to="/login" className="px-8 py-5 bg-white border-2 border-slate-200 text-slate-900 rounded-[2rem] font-bold text-lg hover:border-slate-900 transition-all active:scale-95 text-center">
                  Sign In
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex items-center space-x-8 text-slate-400">
                <div className="flex items-center space-x-2"><Lock size={18} /> <span className="text-xs font-bold uppercase tracking-widest">End-to-End Encrypted</span></div>
                <div className="flex items-center space-x-2"><Award size={18} /> <span className="text-xs font-bold uppercase tracking-widest">ISO 27001 Certified</span></div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/30 to-accent-500/20 blur-[100px] rounded-full animate-pulse-slow"></div>
              <img 
                src={heroImage} 
                alt="SafeBond Security Illustration" 
                className="relative z-10 w-full drop-shadow-[0_50px_50px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-700"
              />
              
              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 -left-10 z-20 backdrop-blur-md bg-white/80 p-4 rounded-3xl border border-white/50 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-green-500 p-2 rounded-xl text-white"><CheckCircle size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Status</p>
                    <p className="text-sm font-bold text-slate-800">Identity Verified</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute bottom-20 -right-5 z-20 backdrop-blur-md bg-white/80 p-4 rounded-3xl border border-white/50 shadow-xl"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-500 p-2 rounded-xl text-white"><Heart size={20} /></div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Feedback</p>
                    <p className="text-sm font-bold text-slate-800">Family Appoved</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatItem number="10" label="Trusted Families" />
            <StatItem number="15" label="Verification Success" suffix="k+" />
            <StatItem number="99" label="Customer Satisfaction" suffix="%" />
            <StatItem number="24" label="Global Support" suffix="/7" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
            >
              Engineered for <br /><span className="text-primary-500 underline decoration-primary-200 underline-offset-8">Accountability.</span>
            </motion.h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              We've built a suite of tools that replace uncertainty with clarity and risk with safety.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <GlassCard 
              icon={ShieldCheck} 
              title="Identity Core" 
              desc="Military-grade verification protocols for government-issued credentials." 
              delay={0.1} 
            />
            <GlassCard 
              icon={FileText} 
              title="Audit Guard" 
              desc="Deep-layer screening of academic and professional history certifications." 
              delay={0.2} 
            />
            <GlassCard 
              icon={Users} 
              title="Circle Verify" 
              desc="A collaborative ecosystem for multi-family review and consensus." 
              delay={0.3} 
            />
            <GlassCard 
              icon={Star} 
              title="Bond Score" 
              desc="Proprietary trust measurement based on verified profile completeness." 
              delay={0.4} 
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[4rem] bg-slate-900 py-24 px-8 md:px-20 overflow-hidden text-center group">
            <div className="absolute top-0 right-0 w-[50%] h-full bg-primary-600/20 blur-[100px] group-hover:bg-primary-600/30 transition-colors"></div>
            <div className="absolute bottom-0 left-0 w-[50%] h-full bg-accent-600/10 blur-[100px] group-hover:bg-accent-600/20 transition-colors"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-7xl font-black text-white mb-10 tracking-tight leading-tight">
                Secure your future <br />with absolute certainty.
              </h2>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to="/register" className="px-12 py-6 bg-primary-500 text-white rounded-[2rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary-500/40">
                  Become a Verified Member
                </Link>
                <div className="flex items-center justify-center space-x-2 text-primary-200">
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <Star fill="currentColor" size={20} />
                  <span className="text-white font-bold ml-2">4.9/5 TrustScore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

