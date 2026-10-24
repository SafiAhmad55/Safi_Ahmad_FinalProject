
import { useEffect, useState } from "react";
import ConfirmDeleteModal from "../DeleteModal/ConfirmDeleteModal";

const API_URL = "http://localhost:5001/api/files";
const PROJECTS_URL = "http://localhost:5001/api/projects";

function FileManagement() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");


  const token = localStorage.getItem("token");

  // Automatically hide success messages after 3 seconds.
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // Fetch projects.
  const fetchProjects = async () => {
    try {
      const response = await fetch(PROJECTS_URL, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects.");
      }

      setProjects(data.projects || []);
    } catch (error) {
      setMessage(error.message || "Failed to connect to the server.");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch files belonging to the selected project.
  const fetchFiles = async (projectId) => {
    if (!projectId) {
      setFiles([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/project/${projectId}`,
        { headers: getHeaders() }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch files.");
      }

      setFiles(data.files || []);
    } catch (error) {
      setMessage(error.message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  const handleProjectChange = async (e) => {
    const projectId = e.target.value;

    setSelectedProject(projectId);
    setSelectedFile(null);
    setMessage("");
    setSuccessMessage("");

    await fetchFiles(projectId);
  };

  // Validate the selected file.
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setMessage("");
    setSuccessMessage("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf", ".doc", ".docx", ".txt",
      ".jpg", ".jpeg", ".png", ".zip",
    ];

    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setSelectedFile(null);
      setMessage(
        "Invalid file type. Select PDF, DOC, DOCX, TXT, JPG, JPEG, PNG, or ZIP."
      );
      e.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setSelectedFile(null);
      setMessage("File size cannot exceed 10 MB.");
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // Upload a file.
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedProject) {
      setMessage("Please select a project.");
      return;
    }

    if (!selectedFile) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("project", selectedProject);
    formData.append("file", selectedFile);

    setUploading(true);
    setMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: getHeaders(),
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload file.");
      }

      setSelectedFile(null);

      const input = document.getElementById("fileInput");
      if (input) input.value = "";

      await fetchFiles(selectedProject);
      setSuccessMessage("File uploaded successfully.");
    } catch (error) {
      setMessage(error.message || "Failed to upload file.");
    } finally {
      setUploading(false);
    }
  };

  // View a file in a new browser tab.
  const handleView = async (fileId) => {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/view/${fileId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to view file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const newTab = window.open(url, "_blank");

      if (!newTab) {
        window.URL.revokeObjectURL(url);
        setMessage("Your browser blocked the file tab. Allow pop-ups and try again.");
        return;
      }

      // Allow the new tab time to load before releasing the URL.
      setTimeout(() => window.URL.revokeObjectURL(url), 60000);
    } catch (error) {
      setMessage(error.message || "Failed to view file.");
    }
  };

  // Download a file.
  const handleDownload = async (fileId, fileName) => {
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/download/${fileId}`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to download file.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      setMessage(error.message || "Failed to download file.");
    }
  };

  // Delete only after confirmation in the reusable modal.

  // Open the reusable confirmation modal
  const handleDelete = (file) => {
    setFileToDelete(file);
    setDeleteError("");
    setDeleteSuccess("");
    setShowDeleteModal(true);
  };

  // Delete only after the user confirms
  const confirmDelete = async () => {
    if (!fileToDelete) return;

    setDeleting(true);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      const response = await fetch(`${API_URL}/${fileToDelete._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete file.");
      }

      setShowDeleteModal(false);
      setFileToDelete(null);

      setDeleteSuccess("File deleted successfully.");

      setTimeout(() => {
        setDeleteSuccess("");
      }, 3000);

      await fetchFiles(selectedProject);
    } catch (error) {
      setDeleteError(error.message || "Failed to delete file.");
    } finally {
      setDeleting(false);
    }
  };
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Project File Management
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Upload, view, download, and delete project files.
        </p>
      </div>

      {/* Project selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Project
        </label>

        <select
          value={selectedProject}
          onChange={handleProjectChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a Project --</option>
          {projects.map((project) => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {/* Upload form */}
      {selectedProject && (
        <form
          onSubmit={handleUpload}
          className="border border-gray-200 rounded-lg p-5 mb-6 bg-gray-50"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload File
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label
                htmlFor="fileInput"
                className="inline-block bg-gray-700 text-white px-5 py-2.5 rounded-lg cursor-pointer hover:bg-gray-800"
              >
                Choose File
              </label>

              <input
                id="fileInput"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip"
                onChange={handleFileChange}
                className="hidden"
              />

              <span className="ml-4 text-sm text-gray-600">
                {selectedFile ? selectedFile.name : "No file chosen"}
              </span>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Maximum file size: 10 MB
          </p>
        </form>
      )}

      {/* One success message and one error/info message */}

      {/* General message */}
      {message && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {message}
        </div>
      )}

      {/* Delete success message */}
      {successMessage && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-200 bg-green-100 px-4 py-3 text-green-800"
        >
          {successMessage}
        </div>
      )}

      {/* Delete error message */}
      {deleteError && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700"
        >
          {deleteError}
        </div>
      )}

      {deleteSuccess && (
        <div className="mb-4 rounded-lg bg-green-100 px-4 py-3 text-green-800">
          {deleteSuccess}
        </div>
      )}

      {/* Project files */}
      {selectedProject && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Project Files
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading files...</p>
          ) : files.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              No files uploaded for this project.
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file._id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {file.fileName}
                    </p>

                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-500">
                        Project:{" "}
                        <span className="font-medium text-gray-700">
                          {file.project?.name || "Unknown"}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        Uploaded by:{" "}
                        <span className="font-medium text-gray-700">
                          {file.uploadedBy?.username || "Unknown"}
                        </span>
                      </p>

                      <p className="text-sm text-gray-500">
                        Upload date:{" "}
                        <span className="font-medium text-gray-700">
                          {file.uploadDate
                            ? new Date(file.uploadDate).toLocaleString()
                            : "Unknown"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleView(file._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(file._id, file.fileName)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(file)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Reusable confirmation modal */}

      <ConfirmDeleteModal
        show={showDeleteModal}
        title="Delete File"
        message={`Are you sure you want to delete "${fileToDelete?.fileName || "this file"
          }"?`}
        loading={deleting}
        onCancel={() => {
          if (!deleting) {
            setShowDeleteModal(false);
            setFileToDelete(null);
            setDeleteError("");
          }
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

export default FileManagement;
