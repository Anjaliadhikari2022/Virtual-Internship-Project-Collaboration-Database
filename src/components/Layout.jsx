// Layout.jsx
import React from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children, isAdmin = false }) {
  const links = isAdmin
    ? [
        { name: "Dashboard", to: "/admin" },
        { name: "Users", to: "/admin/users" },
        { name: "Projects", to: "/admin/projects" },
        { name: "Settings", to: "/admin/settings" },
      ]
    : [
        { name: "Dashboard", to: "/" },
        { name: "Projects", to: "/projects" },
        { name: "Messages", to: "/messages" },
        { name: "Settings", to: "/settings" },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar links={links} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
