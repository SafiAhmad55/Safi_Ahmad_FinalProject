
import { useEffect, useState } from "react";
import MeetingForm from "./MeetingForm";
import MeetingList from "./MeetingList";

function MeetingScheduler() {
  const [meetings, setMeetings] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [loading, setLoading] = useState(true);

  // Custom delete modal state
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {
    if (!success) return;

    const timer = setTimeout(() => {
      setSuccess("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [success]);


  const API_URL = "http://localhost:5001/api";



  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchMeetings = async () => {
    try {
      const response = await fetch(`${API_URL}/meetings`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch meetings.");
      }

      setMeetings(Array.isArray(data) ? data : data.meetings || []);
    } catch (err) {
      console.error("Error fetching meetings:", err);
      setError(err.message || "Unable to load meetings.");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch projects.");
      }

      setProjects(Array.isArray(data) ? data : data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.message || "Unable to load projects.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/employees`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch employees.");
      }

      setEmployees(Array.isArray(data) ? data : data.employees || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError(err.message || "Unable to load employees.");
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      await Promise.all([
        fetchMeetings(),
        fetchProjects(),
        fetchEmployees(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMeetingSaved = async (wasEditing) => {
    setEditingMeeting(null);
    setError("");

    await fetchMeetings();

    setSuccess(
      wasEditing
        ? "Meeting updated successfully."
        : "Meeting created successfully."
    );
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Step 1: Open the custom modal only.
  const handleDelete = (id) => {
    setMeetingToDelete(id);
    setError("");
    setSuccess("");
  };

  // Step 2: Delete only after the user confirms.
  const deleteMeeting = async (id) => {
    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/meetings/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete meeting.");
      }

      // Refresh the list after successful deletion.
      await fetchMeetings();

      setMeetingToDelete(null);
      setSuccess("Meeting deleted successfully.");
    } catch (err) {
      console.error("Error deleting meeting:", err);
      setError(err.message || "Unable to delete meeting.");
      // Keep the modal open so the user can retry or cancel.
    } finally {
      setDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Loading Meeting Scheduler...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Meeting Scheduler
        </h1>
        <p className="mt-1 text-gray-500">
          Schedule and manage project meetings.
        </p>
      </div>

      {/* Status messages */}
      {error && !meetingToDelete && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700"
        >
          {success}
        </div>
      )}

      {/* Meeting Form */}
      <MeetingForm
        projects={projects}
        employees={employees}
        onMeetingSaved={handleMeetingSaved}
        editingMeeting={editingMeeting}
        onCancelEdit={handleCancelEdit}
      />

      {/* Meeting List */}
      <MeetingList
        meetings={meetings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Custom Delete Confirmation Modal */}
      {meetingToDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-meeting-title"
            className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h3
                id="delete-meeting-title"
                className="text-lg font-semibold text-gray-900"
              >
                Delete Meeting
              </h3>

              <button
                type="button"
                onClick={() => setMeetingToDelete(null)}
                disabled={deleting}
                aria-label="Close"
                className="text-2xl text-gray-500 hover:text-gray-800 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="px-5 py-6 text-gray-700">
              Are you sure you want to delete this meeting?
            </div>

            {error && (
              <div
                role="alert"
                className="mx-5 mb-4 rounded bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3 border-t px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setMeetingToDelete(null);
                  setError("");
                }}
                disabled={deleting}
                className="rounded px-4 py-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteMeeting(meetingToDelete)}
                disabled={deleting}
                className="rounded bg-teal-800 px-5 py-2 font-medium text-white hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingScheduler;
