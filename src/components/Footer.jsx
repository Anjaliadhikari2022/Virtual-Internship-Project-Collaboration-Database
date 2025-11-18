import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-center py-4 mt-8 text-gray-600 dark:text-gray-300">
      <p>© {new Date().getFullYear()} Virtual Internship Portal</p>
      <p className="text-sm">Developed with 💙 by Anjali</p>
    </footer>
  );
}
