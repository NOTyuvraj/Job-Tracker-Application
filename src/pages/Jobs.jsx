import React, { useEffect, useState } from "react";
import {
  createJobs,
  deleteJob,
  fetchJobs,
  updateNonStatusJob,
  updateStatusJob,
} from "../api/jobs.js";
export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [editingJobId, setEditingJobId] = useState(null);
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const loadJobs = async () => {
    try {
      const data = await fetchJobs();
      setJobs(data);
    } catch {
      setError("Failed to load Jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError("");
    if (!company || !role) {
      setError("No Company or Job role!");
      return;
    }
    try {
      await createJobs(company, role);
      loadJobs();
      setCompany("");
      setRole("");
    } catch {
      setError("Job Creation Failed!");
      return;
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      await updateStatusJob(jobId, newStatus);
      loadJobs();
      return;
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Status update failed");
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      loadJobs();
      return;
    } catch {
      setError("Delete Failed");
      return;
    }
  };

  const handleJobChange = async (jobId) => {
    try {
      await updateNonStatusJob(jobId, {
        company: editCompany,
        role: editRole,
      });
      setEditingJobId(null);
      setEditCompany("");
      setEditRole("");
      loadJobs();
    } catch {
      setError("Job Update Failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <form onSubmit={handleSubmitForm}>
        <div>
          <label>
            Enter Company:
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Enter Role:
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>
        <input type="submit" value="submit" />
      </form>

      <div className="p-6">
        <h1 className="text-xl font-semibold mb-4">My Job Applications</h1>

        <button
          onClick={handleLogout}
          className="text-sm text-red-600 border px-3 py-1 rounded"
        >
          Logout
        </button>
        {jobs.length === 0 ? (
          <p>No jobs found.</p>
        ) : (
          <ul className="space-y-3">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="border p-4 rounded flex justify-between"
              >
                <div>
                  <div>
                    {editingJobId === job._id ? (
                      <div>
                        <input
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                        />
                        <input
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                        />
                        <button onClick={() => handleJobChange(job._id)}>
                          Save
                        </button>
                        <button onClick={() => setEditingJobId(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p>{job.company}</p>
                        <p>{job.role}</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setEditingJobId(job._id);
                        setEditCompany(job.company);
                        setEditRole(job.role);
                      }}
                    >
                      ✏️ Edit
                    </button>
                  </div>
                </div>
                <span className="text-sm">{job.status}</span>
                <select
                  value={job.status}
                  onChange={(e) => handleUpdateStatus(job._id, e.target.value)}
                  disabled={job.status === "Offer" || job.status === "Rejected"}
                >
                  <option value="Applied">Applied</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
                <button onClick={() => handleDeleteJob(job._id)}>🗑️</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
