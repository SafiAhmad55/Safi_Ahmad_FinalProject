
import { useEffect, useState } from "react";
import "./ClientManagement.css";
import ConfirmDeleteModal from "../DeleteModal/ConfirmDeleteModal";

const API_URL = "http://localhost:5001/api/clients";

function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [actionError, setActionError] = useState("");
  useEffect(() => {
    if (!successMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);


  const emptyClient = {
    name: "",
    email: "",
    phone: "",
    company: "",
    status: "Active",
  };

  const [newClient, setNewClient] = useState(emptyClient);

  const getToken = () => localStorage.getItem("token");

  const fetchClients = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
      });

      const response = await fetch(`${API_URL}?${params}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load clients");
      }

      setClients(data.clients || []);
    } catch (err) {
      setError(err.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [search, statusFilter]);

  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(newClient),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add client");
      }

      setNewClient(emptyClient);
      setShowAddForm(false);
      await fetchClients();
      setActionError("");
      setSuccessMessage("Client added successfully!");
    } catch (err) {
      setActionError(err.message || "Unable to add client");
      setSuccessMessage("");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/${editingClient._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(editingClient),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update client");
      }

      setEditingClient(null);
      await fetchClients();
      setActionError("");
      setSuccessMessage("Client updated successfully!");
    } catch (err) {
      setActionError(err.message || "Unable to update client");
      setSuccessMessage("");
    }
  };


  const openDeleteModal = (client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
    setSuccessMessage("");
    setDeleteError("");
  };

  const confirmDelete = async () => {
    if (!clientToDelete || deleting) return;

    setDeleting(true);
    setDeleteError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${clientToDelete._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete client");
      }

      // Remove the deleted client from the current list.
      setClients((previousClients) =>
        previousClients.filter(
          (client) => client._id !== clientToDelete._id
        )
      );

      setShowDeleteModal(false);
      setClientToDelete(null);
      setSuccessMessage("Client deleted successfully!");
    } catch (err) {
      setDeleteError(err.message || "Unable to delete client");
    } finally {
      setDeleting(false);
    }
  };


  const renderClientForm = (client, setClient, onSubmit, title) => (
    <form className="client-form" onSubmit={onSubmit}>
      <h3>{title}</h3>

      <div className="client-form-grid">
        <input
          placeholder="Full name"
          value={client.name}
          onChange={(e) =>
            setClient({ ...client, name: e.target.value })
          }
          required
        />

        <input
          type="email"
          placeholder="Email address"
          value={client.email}
          onChange={(e) =>
            setClient({ ...client, email: e.target.value })
          }
          required
        />

        <input
          placeholder="Phone number"
          value={client.phone}
          onChange={(e) =>
            setClient({ ...client, phone: e.target.value })
          }
          required
        />

        <input
          placeholder="Company"
          value={client.company}
          onChange={(e) =>
            setClient({ ...client, company: e.target.value })
          }
          required
        />

        <select
          value={client.status}
          onChange={(e) =>
            setClient({ ...client, status: e.target.value })
          }
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="client-actions">
        <button type="submit" className="client-primary">
          {title === "Add New Client" ? "Add Client" : "Update Client"}
        </button>

        <button
          type="button"
          className="client-secondary"
          onClick={() => {
            setShowAddForm(false);
            setEditingClient(null);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  return (
    <section className="client-management ">
      <div className="client-heading">
        <div>
          <h2>Client Management</h2>
          <p>Manage your clients and their information.</p>
        </div>
        {successMessage && (
          <div className="file-alert-success" role="alert">
            {successMessage}
          </div>
        )}

        {deleteError && (
          <div className="file-alert-error" role="alert">
            {deleteError}
          </div>
        )}
        {actionError && (
          <div className="file-alert-error" role="alert">
            {actionError}
          </div>
        )}
        <button
          className="client-primary"
          onClick={() => {
            setEditingClient(null);
            setNewClient(emptyClient);
            setShowAddForm(!showAddForm);
          }}
        >
          + Add Client
        </button>
      </div>

      <div className="client-toolbar">
        <input
          placeholder="Search name, email, or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {showAddForm &&
        renderClientForm(
          newClient,
          setNewClient,
          handleAdd,
          "Add New Client"
        )}

      {editingClient &&
        renderClientForm(
          editingClient,
          setEditingClient,
          handleUpdate,
          "Edit Client"
        )}

      {loading && <p>Loading clients...</p>}
      {error && <p className="client-error">{error}</p>}

      {!loading && !error && (
        <div className="client-table-wrapper">
          <table className="client-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.phone}</td>
                  <td>{client.company}</td>
                  <td>
                    <span
                      className={
                        client.status === "Active"
                          ? "client-status active"
                          : "client-status inactive"
                      }
                    >
                      {client.status}
                    </span>
                  </td>
                  <td>
                    <div className="client-row-actions">
                      <button
                        className="client-edit"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingClient({ ...client });
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="client-delete"
                        onClick={() => openDeleteModal(client)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {clients.length === 0 && (
                <tr>
                  <td colSpan="6">No clients found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDeleteModal
        show={showDeleteModal}
        title="Delete Client"
        message="Are you sure you want to delete this client?"
        itemName={clientToDelete?.name}
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setShowDeleteModal(false);
          setClientToDelete(null);
          setDeleteError("");
        }}
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default ClientManagement;
