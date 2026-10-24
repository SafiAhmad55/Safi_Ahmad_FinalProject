
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "../DeleteModal/ConfirmDeleteModal";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

export default function ProjectManagement() {
    const [projects, setProjects] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [clientFilter, setClientFilter] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!successMessage) return;

        const timer = setTimeout(() => {
            setSuccessMessage("");
        }, 3000);

        return () => clearTimeout(timer);
    }, [successMessage]);

    const emptyForm = {
        name: "",
        description: "",
        client: "",
        startDate: "",
        deadline: "",
        status: "Planning",
    };

    const [form, setForm] = useState(emptyForm);

    const getHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    async function loadData() {
        setLoading(true);
        setError("");

        try {
            const [projectResponse, clientResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/projects`, {
                    headers: getHeaders(),
                }),
                fetch(`${API_BASE_URL}/clients`, {
                    headers: getHeaders(),
                }),
            ]);

            const projectData = await projectResponse.json();
            const clientData = await clientResponse.json();

            if (!projectResponse.ok) {
                throw new Error(projectData.message || "Could not load projects.");
            }

            if (!clientResponse.ok) {
                throw new Error(clientData.message || "Could not load clients.");
            }

            setProjects(
                Array.isArray(projectData)
                    ? projectData
                    : projectData.projects || []
            );

            setClients(
                Array.isArray(clientData)
                    ? clientData
                    : clientData.clients || []
            );
        } catch (err) {
            setError(err.message || "Unable to connect to the backend.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    function handleChange(event) {
        setForm({ ...form, [event.target.name]: event.target.value });
    }

    function resetForm() {
        setForm(emptyForm);
        setEditingId(null);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSaving(true);
        setError("");
        setSuccessMessage("");

        try {
            const url = editingId
                ? `${API_BASE_URL}/projects/${editingId}`
                : `${API_BASE_URL}/projects`;

            const response = await fetch(url, {
                method: editingId ? "PUT" : "POST",
                headers: getHeaders(),
                body: JSON.stringify(form),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Could not save project.");
            }

            const wasEditing = Boolean(editingId);

            resetForm();
            await loadData();

            setSuccessMessage(
                wasEditing
                    ? "Project updated successfully!"
                    : "Project created successfully!"
            );
        } catch (err) {
            setError(err.message || "Unable to save project.");
        } finally {
            setSaving(false);
        }
    }

    function editProject(project) {
        setEditingId(project._id);
        setForm({
            name: project.name || "",
            description: project.description || "",
            client: project.client?._id || project.client || "",
            startDate: project.startDate
                ? project.startDate.substring(0, 10)
                : "",
            deadline: project.deadline
                ? project.deadline.substring(0, 10)
                : "",
            status: project.status || "Planning",
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }


    async function deleteProject(id) {
        setError("");
        setSuccessMessage("");
        setDeleting(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/projects/${id}`,
                {
                    method: "DELETE",
                    headers: getHeaders(),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Could not delete project."
                );
            }

            setProjects((previousProjects) =>
                previousProjects.filter(
                    (project) => project._id !== id
                )
            );

            if (selectedProject?._id === id) {
                setSelectedProject(null);
            }

            setProjectToDelete(null);
            setSuccessMessage("Project deleted successfully!");
        } catch (err) {
            setError(err.message || "Unable to delete project.");
        } finally {
            setDeleting(false);
        }
    }


    const filteredProjects = projects.filter((project) => {
        const clientId = project.client?._id || project.client || "";

        const matchesSearch =
            (project.name || "").toLowerCase().includes(search.toLowerCase());

        return (
            matchesSearch &&
            (!statusFilter || project.status === statusFilter) &&
            (!clientFilter || clientId === clientFilter)
        );
    });

    const inputClass =
        "w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500";

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-gray-800">
                    Project Management
                </h2>
                <p className="mt-1 text-gray-500">
                    Create projects, link clients, and track progress.
                </p>
            </header>

            {error && (
                <div role="alert" className="rounded-lg bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}
            {successMessage && (
                <div
                    role="alert"
                    className="rounded-lg border border-green-200 bg-green-100 p-3 text-green-800"
                >
                    {successMessage}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-xl border bg-white p-6 shadow-sm"
                >
                    <h3 className="text-xl font-semibold">
                        {editingId ? "Edit Project" : "Create New Project"}
                    </h3>

                    <label className="block">
                        <span className="mb-1 block font-medium">Project Name *</span>
                        <input
                            className={inputClass}
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            maxLength={120}
                            placeholder="Name of your project"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block font-medium">Description *</span>
                        <textarea
                            className={inputClass}
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Describe your project"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block font-medium">Client *</span>
                        <select
                            className={inputClass}
                            name="client"
                            value={form.client}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Client</option>
                            {clients.map((client) => (
                                <option key={client._id} value={client._id}>
                                    {client.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="block">
                            <span className="mb-1 block font-medium">Start Date *</span>
                            <input
                                className={inputClass}
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label className="block">
                            <span className="mb-1 block font-medium">Deadline *</span>
                            <input
                                className={inputClass}
                                type="date"
                                name="deadline"
                                value={form.deadline}
                                onChange={handleChange}
                                required
                                min={form.startDate || undefined}
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-1 block font-medium">Status *</span>
                        <select
                            className={inputClass}
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                            <option>Planning</option>
                            <option>In Progress</option>
                            <option>On Hold</option>
                            <option>Completed</option>
                        </select>
                    </label>

                    <div className="flex flex-wrap gap-3">
                        <button
                            disabled={saving}
                            className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white disabled:opacity-50"
                        >
                            {saving ? "Saving..." : editingId ? "Update Project" : "Create Project"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="rounded-lg border px-5 py-3"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <section className="rounded-xl border bg-white p-6 shadow-sm">
                    <h3 className="mb-4 text-xl font-semibold">Projects</h3>

                    <input
                        className={`${inputClass} mb-3`}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects..."
                    />

                    <select
                        className={`${inputClass} mb-3`}
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option>Planning</option>
                        <option>In Progress</option>
                        <option>On Hold</option>
                        <option>Completed</option>
                    </select>

                    <select
                        className={`${inputClass} mb-5`}
                        value={clientFilter}
                        onChange={(e) => setClientFilter(e.target.value)}
                    >
                        <option value="">All Clients</option>
                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>

                    {loading ? (
                        <p className="text-gray-500">Loading projects...</p>
                    ) : filteredProjects.length === 0 ? (
                        <p className="rounded-lg bg-gray-50 p-5 text-gray-500">
                            No projects found.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {filteredProjects.map((project) => {
                                const clientId =
                                    project.client?._id || project.client || "";
                                const clientName =
                                    project.client?.name ||
                                    clients.find((client) => client._id === clientId)?.name ||
                                    "Unknown client";

                                return (
                                    <article
                                        key={project._id}
                                        onClick={() => setSelectedProject(project)}
                                        className={`rounded-lg border p-4 cursor-pointer transition hover:shadow-md ${selectedProject?._id === project._id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200"
                                            }`}
                                    >
                                        <h4 className="text-lg font-semibold">{project.name}</h4>
                                        <p className="mt-1 text-gray-600">
                                            {project.description}
                                        </p>
                                        <p className="mt-3 text-sm">
                                            <strong>Client:</strong> {clientName}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Status:</strong> {project.status}
                                        </p>
                                        <p className="text-sm">
                                            <strong>Deadline:</strong>{" "}
                                            {project.deadline
                                                ? new Date(project.deadline).toLocaleDateString()
                                                : "Not set"}
                                        </p>

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => editProject(project)}
                                                className="rounded bg-blue-600 px-4 py-2 text-white"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setProjectToDelete(project)}
                                                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>

            {selectedProject && (
                <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-5 text-xl font-bold text-gray-800">
                        Project Details
                    </h3>

                    <div className="space-y-3 text-sm text-gray-700">
                        <p>
                            <strong>Project:</strong> {selectedProject.name}
                        </p>

                        <p>
                            <strong>Description:</strong>{" "}
                            {selectedProject.description || "No description available"}
                        </p>

                        <p>
                            <strong>Client:</strong>{" "}
                            {selectedProject.client?.name ||
                                clients.find(
                                    (client) =>
                                        client._id ===
                                        (selectedProject.client?._id || selectedProject.client)
                                )?.name ||
                                "Unknown client"}
                        </p>

                        <p>
                            <strong>Start Date:</strong>{" "}
                            {selectedProject.startDate
                                ? new Date(selectedProject.startDate).toLocaleDateString()
                                : "Not set"}
                        </p>

                        <p>
                            <strong>Deadline:</strong>{" "}
                            {selectedProject.deadline
                                ? new Date(selectedProject.deadline).toLocaleDateString()
                                : "Not set"}
                        </p>

                        <p>
                            <strong>Status:</strong> {selectedProject.status}
                        </p>
                    </div>


                </section>
            )}


            <ConfirmDeleteModal
                show={Boolean(projectToDelete)}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
                itemName={projectToDelete?.name}
                loading={deleting}
                onCancel={() => {
                    if (deleting) return;
                    setProjectToDelete(null);
                }}
                onConfirm={async () => {
                    if (projectToDelete && !deleting) {
                        await deleteProject(projectToDelete._id);
                    }
                }}
            />


        </div>
    );
}
