// src/components/Sidebar.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  FolderOpen, 
  MessageSquare, 
  Settings, 
  Shield,
  Users,
  X
} from "lucide-react";

const iconMap = {
  "Dashboard": Home,
  "Projects": FolderOpen,
  "Messages": MessageSquare,
  "Settings": Settings,
  "Admin Dashboard": Shield,
  "Users": Users,
};

export default function Sidebar({ links }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isOpen ? "open" : "closed"}
        className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-50 lg:static lg:translate-x-0 lg:h-[calc(100vh-4rem)] lg:bg-white/80 lg:dark:bg-gray-900/80"
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-end p-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col p-6 space-y-2">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4"
          >
            Navigation
          </motion.h2>
          
          {links.map((link, index) => {
            const Icon = iconMap[link.name] || Home;
            const isActive = location.pathname === link.to;
            
            return (
              <motion.div
                key={link.name}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                <Link
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon 
                      size={20} 
                      className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-blue-500"}
                    />
                  </motion.div>
                  <span className="relative">
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white/50 rounded-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </span>
                  
                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    whileHover={{ scale: 1.02 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-6 left-6 right-6"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-500/20">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              Need Help?
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
              Contact our support team for assistance
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
            >
              Get Support
            </motion.button>
          </div>
        </motion.div>
      </motion.aside>

      {/* Mobile Toggle Button (floating) */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-50 p-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <Home size={20} />
      </motion.button>
    </>
  );
}
