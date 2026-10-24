import { useEffect, useState } from "react";
import TaskForm from "./components/tasks/TaskForm";
import TaskFilters from "./components/tasks/TaskFilters";
import KanbanBoard from "./components/tasks/KanbanBoard";
import TaskEditForm from "./components/tasks/TaskEditForm";
import FileManagement from "./components/files/FileManagement";
import Login from "./components/auth/Login";
import MeetingScheduler from "./components/meetings/MeetingScheduler";
import Reports from "./components/reports/Reports";
import InvoiceList from "./components/invoices/InvoiceList";
import ProjectManagement from "./components/projeccts/ProjectManagement";
import ClientManagement from "./components/clientsmanagement/ClientManagement";
import './App.css'

function App() {
  const API_BASE_URL = "http://localhost:5001/api";
  const API_URL = `${API_BASE_URL}/tasks`;

  const emptyForm = {
    title: "",
    description: "",
    project: "",
    assignedEmployee: "",
    priority: "Medium",
    dueDate: "",
    status: "To Do",
  };
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deletingTask, setDeletingTask] = useState(false);
  const [taskDeleteError, setTaskDeleteError] = useState("");
  const [taskDeleteSuccess, setTaskDeleteSuccess] = useState("");
  const [meetings, setMeetings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [dashboardClients, setDashboardClients] = useState(0);
  const [taskSuccess, setTaskSuccess] = useState("");
  const [taskError, setTaskError] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!taskDeleteSuccess) return;

    const timer = setTimeout(() => {
      setTaskDeleteSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [taskDeleteSuccess]);


  useEffect(() => {
    if (!taskSuccess && !taskError) return;

    const timer = setTimeout(() => {
      setTaskSuccess("");
      setTaskError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [taskSuccess, taskError]);



  const clearFilters = () => {
    setSearch("");
    setProjectFilter("");
    setEmployeeFilter("");
    setPriorityFilter("");
    setStatusFilter("");
  };
  const [editingTask, setEditingTask] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return Boolean(
      localStorage.getItem("token") &&
      localStorage.getItem("user")
    );
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [activePage, setActivePage] = useState("dashboard");
  // Get authentication token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch tasks

  const fetchTasks = async () => {
    setTasksLoading(true);
    setTaskError("");

    try {
      const token = getToken();

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch tasks.");
      }

      setTasks(
        Array.isArray(data) ? data : data.tasks || []
      );
    } catch (error) {
      setTaskError(
        error.message || "Unable to connect to the backend server."
      );
    } finally {
      setTasksLoading(false);
    }
  };


  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetchTasks();
    fetchProjectsAndEmployees();
  }, [isLoggedIn]);
  const fetchProjectsAndEmployees = async () => {
    try {
      const token = getToken();

      const [projectsResponse, employeesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch(`${API_BASE_URL}/auth/employees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      const projectsData = await projectsResponse.json();
      const employeesData = await employeesResponse.json();

      if (projectsResponse.ok) {
        setProjects(projectsData.projects);
      } else {
        alert(projectsData.message || "Failed to fetch projects.");
      }

      if (employeesResponse.ok) {
        setEmployees(employeesData.employees);
      } else {
        alert(employeesData.message || "Failed to fetch employees.");
      }
    } catch (error) {

      alert("Unable to load projects and employees.");
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    setFormData((previousForm) => ({
      ...previousForm,
      [e.target.name]: e.target.value,
    }));
  };
  // Create or update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    setTaskSuccess("");
    setTaskError("");

    try {
      const token = getToken();
      const wasEditing = Boolean(editingTask);

      const url = wasEditing
        ? `${API_URL}/${editingTask._id}`
        : API_URL;

      const method = wasEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed.");
      }

      setFormData(emptyForm);
      setEditingTask(null);

      setTaskSuccess(
        wasEditing
          ? "Task updated successfully."
          : "Task created successfully."
      );

      await fetchTasks();
    } catch (error) {
      setTaskError(
        error.message || "Unable to connect to the backend server."
      );
    }
  };


  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description,
      project: task.project?._id || "",
      assignedEmployee: task.assignedEmployee?._id || "",
      priority: task.priority,
      dueDate: task.dueDate
        ? task.dueDate.substring(0, 10)
        : "",
      status: task.status,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingTask(null);
    setFormData(emptyForm);
  };


  // Open the custom confirmation modal
  const handleDelete = (taskId) => {
    setTaskDeleteError("");
    setTaskDeleteSuccess("");
    setTaskToDelete(taskId);
  };

  // Delete only after the user confirms
  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    setDeletingTask(true);
    setTaskDeleteError("");

    try {
      const token = getToken();

      const response = await fetch(`${API_URL}/${taskToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete task.");
      }

      setTaskToDelete(null);
      setTaskDeleteSuccess("Task deleted successfully.");
      await fetchTasks();
    } catch (error) {
      setTaskDeleteError(
        error.message || "Unable to connect to the backend server."
      );
    } finally {
      setDeletingTask(false);
    }
  };

  // Update task status from Kanban Board

  const handleStatusChange = async (taskId, newStatus) => {
    setTaskSuccess("");
    setTaskError("");

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update task status."
        );
      }

      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task._id === taskId
            ? { ...task, ...data.task }
            : task
        )
      );

      setTaskSuccess("Task status updated successfully.");
    } catch (error) {
      setTaskError(
        error.message || "Unable to connect to the backend server."
      );
    }
  };

  // Filter tasks on frontend
  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter(
      (task) =>
        !projectFilter ||
        task.project?._id === projectFilter
    )
    .filter(
      (task) =>
        !employeeFilter ||
        task.assignedEmployee?._id === employeeFilter
    )
    .filter(
      (task) =>
        !priorityFilter ||
        task.priority === priorityFilter
    )
    .filter(
      (task) =>
        !statusFilter ||
        task.status === statusFilter
    );

  const handleLogin = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
    setCurrentUser(data.user);
    setIsLoggedIn(true);
    setActivePage("dashboard");
  };



  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const fetchDashboardClients = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/clients",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        setDashboardClients((data.clients || []).length);
      } catch (error) {
        console.error("Failed to fetch dashboard clients:", error);
      }
    };

    if (isLoggedIn) {
      fetchDashboardClients();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [meetingsResponse, invoicesResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/meetings`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            fetch(`${API_BASE_URL}/invoices`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        const meetingsData = await meetingsResponse.json();
        const invoicesData = await invoicesResponse.json();

        if (meetingsResponse.ok) {
          setMeetings(
            Array.isArray(meetingsData)
              ? meetingsData
              : meetingsData.meetings || []
          );
        }

        if (invoicesResponse.ok) {
          setInvoices(
            Array.isArray(invoicesData)
              ? invoicesData
              : invoicesData.invoices || []
          );
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn]);
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="h-dvh bg-gray-100 flex overflow-hidden">


      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40
             w-64 bg-white border-r border-gray-200
             flex flex-col overflow-hidden
             transition-transform duration-300
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
              lg:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="shrink-0 px-4 py-3 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">
            Task Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Task management system
          </p>
        </div>

        {/* Scrollable Navigation */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain p-3 space-y-2 max-h-[300px] lg:max-h-none">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActivePage("dashboard");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "dashboard"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>🏠</span>
            <span className="font-medium">Dashboard</span>
          </button>

          {/* Client Management */}
          <button
            onClick={() => {
              setActivePage("clients");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "clients"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>👥</span>
            <span className="font-medium">Client Management</span>
          </button>

          {/* Project Management */}
          <button
            onClick={() => {
              setActivePage("projects");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "projects"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>📁</span>
            <span className="font-medium">Project Management</span>
          </button>

          {/* Meetings */}
          <button
            onClick={() => {
              setActivePage("meetings");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "meetings"
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>🗓️</span>
            <span>Meetings</span>
          </button>

          {/* Create Task */}
          <button
            onClick={() => {
              setActivePage("create");
              setEditingTask(null);
              setFormData(emptyForm);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "create"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>➕</span>
            <span className="font-medium">Create Task</span>
          </button>

          {/* Filters */}
          <button
            onClick={() => {
              setActivePage("filters");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "filters"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>🔍</span>
            <span className="font-medium">Filters</span>
          </button>

          {/* Kanban Board */}
          <button
            onClick={() => {
              setActivePage("kanban");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "kanban"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>📋</span>
            <span className="font-medium">Kanban Board</span>
          </button>

          {/* File Management */}
          <button
            onClick={() => {
              setActivePage("files");
              setEditingTask(null);
              setFormData(emptyForm);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "files"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>📁</span>
            <span className="font-medium">File Management</span>
          </button>

          {/* Reports */}
          <button
            onClick={() => {
              setActivePage("reports");
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "reports"
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>📊</span>
            <span>Reports</span>
          </button>

          {/* Invoices */}
          <button
            onClick={() => {
              setActivePage("invoices");
              setEditingTask(null);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition ${activePage === "invoices"
              ? "bg-blue-600 text-white font-semibold"
              : "text-gray-700 hover:bg-gray-100"
              }`}
          >
            <span>🧾</span>
            <span>Invoices</span>
          </button>
        </nav>

        {/* Fixed Sidebar Bottom */}
        <div className="shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-white">
          {currentUser && (
            <div className="mb-2">
              <p className="text-base font-bold text-gray-800 break-words">
                {currentUser.username}
              </p>
              <p className="text-sm font-medium text-gray-600 mt-1">
                Role: {currentUser.role}
              </p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 transition"
          >
            <span>🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>


      {/* MAIN CONTENT */}
<main className="ml-0 min-w-0 min-h-0 flex-1 h-[500px] lg:h-dvh lg:max-h-dvh overflow-y-auto overscroll-y-auto p-4 sm:p-6 lg:ml-64 lg:p-8">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mb-4 rounded-lg bg-blue-600 px-4 py-2 text-white lg:hidden"
        >
          ☰ Menu
        </button>


        {taskSuccess && (
          <div
            role="status"
            className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3 text-green-700"
          >
            {taskSuccess}
          </div>
        )}

        {taskError && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
          >
            {taskError}
          </div>
        )}


        {/* CLIENT MANAGEMENT PAGE */}
        {activePage === "clients" && (
          <ClientManagement />
        )}



        {/* Dashboard */}
        {activePage === "dashboard" && (
          <div className="min-h-full pb-20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Dashboard
              </h2>
              <p className="text-gray-500 mt-1">
                Overview of clients, projects, tasks, meetings, and invoices
              </p>
            </div>

            {/* Dashboard Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 pb-40 mb-32">

              {/* Clients */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Total Clients</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {dashboardClients}
                </h3>
              </div>

              {/* Total Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Total Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {projects.length}
                </h3>
              </div>

              {/* Active Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Active Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {projects.filter(p =>
                    p.status === "In Progress"
                  ).length}
                </h3>
              </div>

              {/* Completed Projects */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Completed Projects</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {projects.filter(p =>
                    p.status === "Completed"
                  ).length}
                </h3>
              </div>

              {/* Total Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Total Tasks</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {tasks.length}
                </h3>
              </div>

              {/* Completed Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Completed Tasks</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {tasks.filter(t => t.status === "Completed").length}
                </h3>
              </div>

              {/* Pending Tasks */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Pending Tasks</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {tasks.filter(t => t.status !== "Completed").length}
                </h3>
              </div>

              {/* Upcoming Meetings */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Upcoming Meetings</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {meetings.filter(m =>
                    new Date(m.date || m.meetingDate) >= new Date()
                  ).length}
                </h3>
              </div>

              {/* Invoice Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Total Invoices</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {invoices.length}
                </h3>
              </div>

              {/* Paid Invoices */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Paid Invoices</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {invoices.filter(i => i.status === "Paid").length}
                </h3>
              </div>

              {/* Overdue Invoices */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 min-w-0">
                <p className="text-sm text-gray-500">Overdue Invoices</p>
                <h3 className="text-3xl font-bold text-gray-800 mt-2">
                  {invoices.filter(i => i.status === "Overdue").length}
                </h3>
              </div>

            </div>
          </div>
        )}



        {/* FILE MANAGEMENT PAGE */}
        {activePage === "files" && !editingTask && (
          <div>
            <FileManagement />
          </div>
        )}

        {/* Meeting Scheduler */}
        {activePage === "meetings" && (
          <MeetingScheduler />
        )}
        {/* Project Management */}
        {activePage === "projects" && (
          <ProjectManagement />
        )}

        {activePage === "reports" && (
          <Reports />
        )}
        {activePage === "invoices" && (
          <InvoiceList />
        )}
        {/* CREATE TASK */}
        {activePage === "create" && !editingTask && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Task
              </h2>

              <p className="text-gray-500 mt-1">
                Create a new task and assign it to an employee.
              </p>
            </div>

            <TaskForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              projects={projects}
              employees={employees}
            />
          </div>
        )}


        {/* UPDATE TASK */}
        {editingTask && (
          <div>
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Update Task
              </h2>

              <p className="text-gray-500 mt-1">
                Modify the selected task.
              </p>
            </div>

            <TaskEditForm
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
              projects={projects}
              employees={employees}
            />
          </div>
        )}


        {/* FILTERS PAGE */}
        {activePage === "filters" && !editingTask && (
          <div>

            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Search & Filter Tasks
              </h2>

              <p className="text-gray-500 mt-1">
                Find tasks using different filters.
              </p>
            </div>

            {/* Search & Filters */}
            <TaskFilters
              search={search}
              setSearch={setSearch}
              projectFilter={projectFilter}
              setProjectFilter={setProjectFilter}
              employeeFilter={employeeFilter}
              setEmployeeFilter={setEmployeeFilter}
              priorityFilter={priorityFilter}
              setPriorityFilter={setPriorityFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              projects={projects}
              employees={employees}
            />

            {/* Matching Tasks */}
            <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-5">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    Matching Tasks
                  </p>

                  <p className="text-3xl font-bold text-gray-800 mt-2">
                    {filteredTasks.length}
                  </p>
                </div>

                <button
                  onClick={clearFilters}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-700"
                >
                  Clear Filters
                </button>

              </div>

            </div>

            {/* Task Results */}
            <div className="mt-6">

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Task Results
              </h3>

              {filteredTasks.length === 0 ? (

                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">
                    No tasks match your filters.
                  </p>
                </div>

              ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                  {filteredTasks.map((task) => (

                    <div
                      key={task._id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
                    >

                      {/* Title */}
                      <h3 className="font-semibold text-gray-800">
                        {task.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {task.description}
                      </p>

                      {/* Priority */}
                      <div className="mt-4">

                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${task.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : task.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                            }`}
                        >
                          {task.priority}
                        </span>

                      </div>

                      {/* Status */}
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">
                          Status:
                        </span>{" "}
                        <span className="font-medium text-gray-700">
                          {task.status}
                        </span>
                      </div>

                      {/* Employee */}
                      <div className="mt-3 text-sm">
                        <span className="text-gray-500">
                          Employee:
                        </span>{" "}
                        <span className="font-medium text-gray-700">
                          {task.assignedEmployee?.username || "Unassigned"}
                        </span>
                      </div>

                      {/* Due Date */}
                      <div className="mt-3 text-sm text-gray-500">
                        📅{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </div>


                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>
        )}


        {/* KANBAN */}
        {activePage === "kanban" && !editingTask && (
          <div>

            {tasksLoading && (
              <p className="mb-4 text-sm text-gray-500" role="status">
                Loading tasks...
              </p>
            )}

            {taskDeleteSuccess && (
              <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700"
              >
                {taskDeleteSuccess}
              </div>
            )}
            <KanbanBoard
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onEdit={(task) => {
                handleEdit(task);
                setActivePage("kanban");
              }}
              onDelete={handleDelete}
              canManageTasks={currentUser?.role === "Admin"}
            />

          </div>
        )}

      </main>

      {taskToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-task-title"
            className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3
                id="delete-task-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Task
              </h3>

              <button
                type="button"
                onClick={() => {
                  setTaskToDelete(null);
                  setTaskDeleteError("");
                  setMobileMenuOpen(false);
                }}
                disabled={deletingTask}
                aria-label="Close"
                className="text-2xl text-gray-500 hover:text-gray-800 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-6 text-gray-700">
              Are you sure you want to delete this task?
              <p className="mt-2 text-sm text-gray-500">
                This action cannot be undone.
              </p>
            </div>

            {taskDeleteError && (
              <div
                role="alert"
                className="mx-5 mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
              >
                {taskDeleteError}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setTaskToDelete(null);
                  setTaskDeleteError("");
                  setMobileMenuOpen(false);
                }}
                disabled={deletingTask}
                className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteTask}
                disabled={deletingTask}
                className="rounded bg-teal-800 px-5 py-2 font-medium text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingTask ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default App;