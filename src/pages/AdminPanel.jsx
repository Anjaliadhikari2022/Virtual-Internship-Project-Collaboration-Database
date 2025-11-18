// AdminDashboard.jsx
import React from "react";
import Layout from "../components/Layout";

export default function AdminPanel() {
  return (
    <Layout isAdmin={true}>
      <div className="text-center mt-10">
        <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
        <p>Manage users, projects, and system settings here.</p>
      </div>
    </Layout>
  );
}
