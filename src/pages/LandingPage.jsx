import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  StarIcon,
  ArrowRightIcon,
  GlobeAltIcon
} from "@heroicons/react/24/outline";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleGuestMode = () => {
    // Navigate to student dashboard in guest mode
    navigate("/student-dashboard", { state: { isGuest: true } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Navigation Header */}
      <nav className="absolute top-0 w-full z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <GlobeAltIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">VIP</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:flex space-x-6 text-white/80"
          >
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-6xl mx-auto text-center space-y-8"
        >
          {/* Logo and Title */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <GlobeAltIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Virtual Internship
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}Platform
              </span>
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Connect with industry mentors, work on real-world projects, and accelerate your career growth through our comprehensive virtual internship platform.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
          >
            <button
              onClick={() => navigate("/login")}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2"
            >
              <span>Sign In</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40"
            >
              Create Account
            </button>
            
            <button
              onClick={handleGuestMode}
              className="px-6 py-3 text-white/80 hover:text-white transition-colors underline underline-offset-4 decoration-2 decoration-white/40 hover:decoration-white/80"
            >
              Continue as Guest
            </button>
          </motion.div>

          {/* Features Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <UserGroupIcon className="w-12 h-12 text-blue-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Expert Mentors</h3>
              <p className="text-white/70">Connect with industry professionals and get personalized guidance</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <BriefcaseIcon className="w-12 h-12 text-purple-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Real Projects</h3>
              <p className="text-white/70">Work on actual industry projects and build your portfolio</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <AcademicCapIcon className="w-12 h-12 text-pink-400 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold text-white mb-2">Skill Development</h3>
              <p className="text-white/70">Learn in-demand skills and advance your career</p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-12 pt-12 text-white/80"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-white">500+</div>
              <div className="text-sm">Active Internships</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">1000+</div>
              <div className="text-sm">Students Placed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">200+</div>
              <div className="text-sm">Industry Partners</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 right-1/4 w-6 h-6 bg-purple-400/30 rounded-full"
          />
          <motion.div
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-pink-400/30 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
