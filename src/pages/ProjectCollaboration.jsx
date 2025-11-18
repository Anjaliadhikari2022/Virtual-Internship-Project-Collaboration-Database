import React from "react";
import Layout from "../components/Layout";
import KanbanBoard from "../components/KanbanBoard";
import ChatBoxComponent from "../components/ChatBoxComponent";

export default function ProjectCollaboration() {
  return (
    <Layout>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Kanban Board */}
        <section className="flex-1 bg-white dark:bg-gray-950 rounded-xl shadow-lg p-4">
          <KanbanBoard />
        </section>

        {/* Chatbox */}
        <aside className="w-full lg:w-1/3 bg-white dark:bg-gray-950 rounded-xl shadow-lg p-4">
          <ChatBoxComponent />
        </aside>
      </div>
    </Layout>
  );
}
