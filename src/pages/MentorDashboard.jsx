// src/pages/MentorDashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../hooks/useCurrentUser";
import { 
  Users, 
  BookOpen, 
  MessageSquare, 
  Star,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  ArrowLeft,
  User,
  Eye,
  Edit
} from "lucide-react";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("students");
  const user = getCurrentUser();
  const profileRef = React.useRef(null);

  const [stats, setStats] = useState([
    {
      key: "assignedStudents",
      title: "Assigned Students",
      value: "-",
      change: "Based on applications",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
    },
    {
      key: "activeProjects",
      title: "Active Projects",
      value: "-",
      change: "Internships you own",
      icon: BookOpen,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
    },
    {
      key: "pendingReviews",
      title: "Pending Reviews",
      value: "-",
      change: "Applications with status pending",
      icon: AlertCircle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
    },
    {
      key: "averageRating",
      title: "Average Rating",
      value: "4.8",
      change: "+0.2 this month",
      icon: Star,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
    },
  ]);

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [studentsError, setStudentsError] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [projectTasks, setProjectTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user?.user_id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/mentor/${user.user_id}/summary`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load mentor summary");
        }

        setStats((prev) =>
          prev.map((item) => {
            if (item.key === "assignedStudents") {
              return { ...item, value: String(data.assignedStudents ?? 0) };
            }
            if (item.key === "activeProjects") {
              return { ...item, value: String(data.activeProjects ?? 0) };
            }
            if (item.key === "pendingReviews") {
              return { ...item, value: String(data.pendingReviews ?? 0) };
            }
            return item;
          })
        );
      } catch (err) {
        console.error("Error loading mentor summary", err);
      }
    };

    fetchSummary();
  }, [user?.user_id]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.user_id) return;

      try {
        setStudentsLoading(true);
        setStudentsError("");

        const response = await fetch(
          `http://localhost:5000/api/mentor/${user.user_id}/students`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load students");
        }

        const mapped = (Array.isArray(data) ? data : []).map((row, index) => ({
          id: row.user_id,
          name: row.name,
          project: row.internship_title || "Internship Project",
          progress: 70,
          status:
            row.application_status === "accepted"
              ? "Excellent"
              : row.application_status === "rejected"
              ? "Behind Schedule"
              : "On Track",
          lastActivity: "Recently",
          avatar: "👩‍💻",
        }));

        setStudents(mapped);
      } catch (err) {
        console.error("Error loading mentor students", err);
        setStudentsError(err.message || "Error loading students");
      } finally {
        setStudentsLoading(false);
      }
    };
    fetchStudents();
  }, [user?.user_id]);

  // Load projects owned by this mentor
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.user_id) return;

      try {
        setProjectsLoading(true);
        setProjectsError("");
        const response = await fetch(
          `http://localhost:5000/api/projects/mentor/${user.user_id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load projects");
        }

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading mentor projects", err);
        setProjectsError(err.message || "Error loading projects");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [user?.user_id]);

  // Load tasks for all mentor projects (for Reviews tab)
  useEffect(() => {
    const fetchTasksForProjects = async () => {
      if (!projects.length) {
        setProjectTasks([]);
        return;
      }

      try {
        setTasksLoading(true);
        setTasksError("");

        const results = await Promise.all(
          projects.map(async (project) => {
            const res = await fetch(
              `http://localhost:5000/api/tasks/project/${project.project_id}`
            );
            const data = await res.json();
            if (!res.ok) {
              throw new Error(data.message || "Failed to load project tasks");
            }
            return (Array.isArray(data) ? data : []).map((task) => ({
              ...task,
              project_title: project.title,
            }));
          })
        );

        setProjectTasks(results.flat());
      } catch (err) {
        console.error("Error loading project tasks", err);
        setTasksError(err.message || "Error loading tasks");
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasksForProjects();
  }, [projects]);

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "On Track": return "bg-green-100 text-green-800";
      case "Excellent": return "bg-blue-100 text-blue-800";
      case "Needs Review": return "bg-yellow-100 text-yellow-800";
      case "Behind Schedule": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Mentor Portal</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setActiveTab("students")}
                  className={`font-medium ${activeTab === "students" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Students
                </button>
                <button 
                  onClick={() => setActiveTab("projects")}
                  className={`font-medium ${activeTab === "projects" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Projects
                </button>
                <button 
                  onClick={() => setActiveTab("reviews")}
                  className={`font-medium ${activeTab === "reviews" ? "text-blue-600" : "text-gray-600 hover:text-gray-900"}`}
                >
                  Reviews
                </button>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Home</span>
              </button>
              
              <button className="text-gray-600 hover:text-gray-900">
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={() => scrollToSection(profileRef)}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <User className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {`Welcome back, ${user?.name || "Mentor"}! 👋`}
          </h1>
          <p className="text-gray-600">
            Here's an overview of your mentoring activities and student progress
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`${stat.bgColor} rounded-2xl p-6 border border-gray-200/50 group cursor-pointer`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">
                {stat.title}
              </h3>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                <span className="text-xs text-green-600 font-medium">
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Students Overview (Students tab) */}
        {activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Your Students
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            {studentsLoading && (
              <p className="text-gray-600 text-sm mb-4">Loading students...</p>
            )}

            {studentsError && (
              <p className="text-red-500 text-sm mb-4">{studentsError}</p>
            )}

            {!studentsLoading && students.length === 0 && !studentsError && (
              <p className="text-gray-600 text-sm mb-4">
                No students found yet for your internships.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {students.map((student, index) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{student.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.project}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{student.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {student.lastActivity}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 text-sm">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700 text-sm">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Projects tab */}
        {activeTab === "projects" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-green-500" />
                Your Projects
              </h2>
            </div>

            {projectsLoading && (
              <p className="text-gray-600 text-sm mb-4">Loading projects...</p>
            )}

            {projectsError && (
              <p className="text-red-500 text-sm mb-4">{projectsError}</p>
            )}

            {!projectsLoading && projects.length === 0 && !projectsError && (
              <p className="text-gray-600 text-sm mb-4">
                You do not own any projects yet.
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
              {projects.map((project) => (
                <div
                  key={project.project_id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-300"
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {project.description || "Project description"}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        {project.start_date || "Start"} - {project.end_date || "End"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews / Tasks tab */}
        {activeTab === "reviews" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                Project Tasks & Reviews
              </h2>
            </div>

            {tasksLoading && (
              <p className="text-gray-600 text-sm mb-4">Loading tasks...</p>
            )}

            {tasksError && (
              <p className="text-red-500 text-sm mb-4">{tasksError}</p>
            )}

            {!tasksLoading && projectTasks.length === 0 && !tasksError && (
              <p className="text-gray-600 text-sm mb-4">
                There are no tasks yet for your projects.
              </p>
            )}

            <div className="space-y-3 mt-2">
              {projectTasks.map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-start justify-between border border-gray-200 rounded-xl px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {task.project_title || "Project"}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {task.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>Deadline: {task.deadline || "N/A"}</span>
                    </div>
                    {task.assigned_to_name && (
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users className="w-3 h-3 mr-1" />
                        <span>Assigned to: {task.assigned_to_name}</span>
                      </div>
                    )}
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Schedule Meeting</h3>
                <p className="text-sm text-gray-600">Book 1-on-1 sessions</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Review Projects</h3>
                <p className="text-sm text-gray-600">5 pending reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Performance</h3>
                <p className="text-sm text-gray-600">View analytics</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          ref={profileRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-500" />
            Profile
          </h2>

          {user ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                  {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <p className="text-xs mt-1 inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    <Award className="w-3 h-3 mr-1" />
                    Mentor
                  </p>
                </div>
              </div>

              {user.skills && (
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {String(user.skills)
                    .split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">
              Please log in as a mentor to view your profile information.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
