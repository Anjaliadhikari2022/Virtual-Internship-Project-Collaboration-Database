// src/pages/StudentDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getCurrentUser } from "../hooks/useCurrentUser";
import { 
  BookOpen, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Clock,
  Star,
  Target,
  Award,
  Activity,
  Search,
  Filter,
  MapPin,
  Building,
  Users,
  DollarSign,
  ChevronDown,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  User
} from "lucide-react";

export default function StudentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [isGuest, setIsGuest] = useState(false);
  const [internships, setInternships] = useState([]);
  const [internshipsLoading, setInternshipsLoading] = useState(false);
  const [internshipsError, setInternshipsError] = useState("");
  const [applications, setApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [applicationsError, setApplicationsError] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState("");
  const [applyingId, setApplyingId] = useState(null);
  const internshipsRef = useRef(null);
  const applicationsRef = useRef(null);
  const profileRef = useRef(null);

  const user = getCurrentUser();

  useEffect(() => {
    if (location.state?.isGuest) {
      setIsGuest(true);
    }
  }, [location.state]);

  // When in guest mode, clear any user-specific data so we don't show the previous user's info
  useEffect(() => {
    if (isGuest) {
      setApplications([]);
      setProjects([]);
      setTasks([]);
    }
  }, [isGuest]);

  const effectiveUser = isGuest ? null : user;

  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setInternshipsLoading(true);
        setInternshipsError("");
        const response = await fetch("http://localhost:5000/api/internships");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load internships");
        }

        const mapped = (Array.isArray(data) ? data : []).map((item) => ({
          id: item.id ?? item.internship_id,
          title: item.title || "Internship",
          company: item.company || item.company_name || "Company",
          location: item.location || "Remote",
          type: item.type || "Full-time",
          duration: item.duration || "3 months",
          stipend: item.stipend || "Unpaid",
          status: item.status || "Open",
          description: item.description || "Exciting internship opportunity",
          skills: item.skills
            ? String(item.skills)
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          applicants: item.applicants || 0,
          posted: item.posted || "Recently",
          logo: item.logo || "🏢",
        }));

        setInternships(mapped);
      } catch (err) {
        console.error("Error loading internships", err);
        setInternshipsError(err.message || "Error loading internships");
      } finally {
        setInternshipsLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const loadApplications = async () => {
    if (!effectiveUser?.user_id) return;

    try {
      setApplicationsLoading(true);
      setApplicationsError("");
      const response = await fetch(
        `http://localhost:5000/api/applications?student_id=${effectiveUser.user_id}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load applications");
      }

      setApplications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error loading applications", err);
      setApplicationsError(err.message || "Error loading applications");
    } finally {
      setApplicationsLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveUser?.user_id]);

  // Load projects for the logged-in student
  useEffect(() => {
    const fetchProjects = async () => {
      if (!effectiveUser?.user_id) return;

      try {
        setProjectsLoading(true);
        setProjectsError("");
        const response = await fetch(
          `http://localhost:5000/api/projects/student/${effectiveUser.user_id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load projects");
        }

        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading projects", err);
        setProjectsError(err.message || "Error loading projects");
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, [effectiveUser?.user_id]);

  // Load tasks assigned to the student
  useEffect(() => {
    const fetchTasks = async () => {
      if (!effectiveUser?.user_id) return;

      try {
        setTasksLoading(true);
        setTasksError("");
        const response = await fetch(
          `http://localhost:5000/api/tasks/student/${effectiveUser.user_id}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load tasks");
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading tasks", err);
        setTasksError(err.message || "Error loading tasks");
      } finally {
        setTasksLoading(false);
      }
    };

    fetchTasks();
  }, [effectiveUser?.user_id]);

  const filteredInternships = internships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "All Status" || internship.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Closed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleApply = async (internshipId) => {
    if (isGuest || !effectiveUser?.user_id) {
      alert("Please log in as a student to apply for internships.");
      if (!isGuest && !effectiveUser) {
        navigate("/login");
      }
      return;
    }

    try {
      setApplyingId(internshipId);
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: effectiveUser.user_id,
          internship_id: internshipId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      alert("Application submitted successfully!");
      loadApplications();
    } catch (err) {
      console.error("Error applying to internship", err);
      alert(err.message || "Error submitting application");
    } finally {
      setApplyingId(null);
    }
  };

  const displayName = effectiveUser?.name || (isGuest ? "Guest" : "Student");

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
                <span className="text-xl font-bold text-gray-900">Virtual Internship Platform</span>
              </div>
              
              <nav className="hidden md:flex space-x-6">
                <button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="text-blue-600 font-medium"
                >
                  Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(internshipsRef)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Internships
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(applicationsRef)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Applications
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(profileRef)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  Profile
                </button>
              </nav>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isGuest && (
                <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  <User className="w-4 h-4" />
                  <span>Guest Mode</span>
                </div>
              )}
              
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
            {`Welcome${isGuest ? "" : " back"}, ${displayName}! 👋`}
          </h1>
          <p className="text-gray-600">
            {isGuest 
              ? "Explore internship opportunities and discover your next career step" 
              : "Here's what's happening with your internship journey today"
            }
          </p>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-8"
          ref={internshipsRef}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Search className="w-5 h-5 mr-2 text-blue-500" />
            Internships
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search internships..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>All Status</option>
                <option>Open</option>
                <option>In Progress</option>
                <option>Closed</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredInternships.length} of {internships.length} internships
          </div>
        </motion.div>

        {/* Internships Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredInternships.map((internship, index) => (
            <motion.div
              key={internship.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{internship.logo}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {internship.title}
                    </h3>
                    <p className="text-sm text-gray-600">{internship.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(internship.status)}`}>
                  {internship.status}
                </span>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {internship.location}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    {internship.duration}
                  </div>
                  <div className="flex items-center text-green-600 font-medium">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {internship.stipend}
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {internship.applicants} applicants
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {internship.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {internship.skills.slice(0, 3).map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {internship.skills.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                    +{internship.skills.length - 3} more
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button className="text-gray-400 hover:text-red-500 transition-colors" type="button">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-blue-500 transition-colors" type="button">
                    <Share2 className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500">{internship.posted}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>
                  {internship.status === "Open" && (
                    <button
                      type="button"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                      onClick={() => handleApply(internship.id)}
                      disabled={applyingId === internship.id}
                    >
                      {applyingId === internship.id ? "Applying..." : "Apply Now"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredInternships.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </motion.div>
        )}

        {/* Applications Section */}
        <motion.div
          ref={applicationsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
            Your Applications
          </h2>

          {applicationsLoading && (
            <p className="text-gray-600 text-sm">Loading applications...</p>
          )}

          {applicationsError && (
            <p className="text-red-500 text-sm mb-2">{applicationsError}</p>
          )}

          {!applicationsLoading && applications.length === 0 && !applicationsError && (
            <p className="text-gray-600 text-sm">
              You have not applied to any internships yet. Browse internships above and click "Apply Now".
            </p>
          )}

          <div className="space-y-3 mt-2">
            {applications.map((app) => (
              <div
                key={app.application_id}
                className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {app.internship_title || "Internship"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {app.company_name && <span>{app.company_name} · </span>}
                    Application ID: {app.application_id}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                  {app.status || "applied"}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* My Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-indigo-500" />
            My Projects
          </h2>

          {projectsLoading && (
            <p className="text-gray-600 text-sm">Loading projects...</p>
          )}

          {projectsError && (
            <p className="text-red-500 text-sm mb-2">{projectsError}</p>
          )}

          {!projectsLoading && projects.length === 0 && !projectsError && (
            <p className="text-gray-600 text-sm">
              You are not part of any project yet.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {projects.map((project) => (
              <div
                key={project.project_id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200/50 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description || "Project description"}
                    </p>
                  </div>
                  {project.role_in_team && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {project.role_in_team}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>
                      {project.start_date || "Start"} - {project.end_date || "End"}
                    </span>
                  </div>
                  <div className="inline-flex items-center px-2 py-1 rounded-full bg-purple-50 text-purple-700">
                    <Activity className="w-3 h-3 mr-1" />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* My Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-green-500" />
            My Tasks
          </h2>

          {tasksLoading && (
            <p className="text-gray-600 text-sm">Loading tasks...</p>
          )}

          {tasksError && (
            <p className="text-red-500 text-sm mb-2">{tasksError}</p>
          )}

          {!tasksLoading && tasks.length === 0 && !tasksError && (
            <p className="text-gray-600 text-sm">
              You don't have any assigned tasks yet.
            </p>
          )}

          <div className="space-y-3 mt-2">
            {tasks.map((task) => (
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
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Profile Section */}
        <motion.div
          ref={profileRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 mb-8 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-purple-500" />
            Profile
          </h2>

          {effectiveUser ? (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-semibold">
                  {effectiveUser.name ? effectiveUser.name.charAt(0).toUpperCase() : "S"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{effectiveUser.name}</p>
                  <p className="text-sm text-gray-600">{effectiveUser.email}</p>
                  <p className="text-xs mt-1 inline-flex items-center px-2 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    <Award className="w-3 h-3 mr-1" />
                    {effectiveUser.role === "mentor" ? "Mentor" : "Student"}
                  </p>
                </div>
              </div>

              {effectiveUser.skills && (
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  {String(effectiveUser.skills)
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
              You are browsing as a guest. Log in or sign up to view and manage your full profile.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
