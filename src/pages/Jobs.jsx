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

  const handleSyncEmails = async () => {
    try {
      setError("");

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/email/sync`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      await loadJobs();
    } catch (err) {
      setError(err.message || "Email sync failed");
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
    <div className="min-h-screen bg-white text-black px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tight">Job Tracker</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Manage and track your job applications
            </p>
          </div>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");

              window.location.href =
                `${import.meta.env.VITE_BASE_URL}` +
                `/email/google/connect?token=${token}`;
            }}
            className="bg-black text-white px-6 py-3 rounded-2xl"
          >
            Connect Gmail
          </button>
          <button
            onClick={handleLogout}
            className="border border-black px-6 py-3 rounded-full hover:bg-black hover:text-white transition-all duration-200 font-medium"
          >
            Logout
          </button>
        </div>
        <button
          onClick={handleSyncEmails}
          className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition-all duration-200"
        >
          Sync Emails
        </button>
        {/* Add Job Form */}
        <form
          onSubmit={handleSubmitForm}
          className="border border-gray-200 rounded-3xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Add New Application</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="border border-gray-300 px-5 py-4 rounded-2xl outline-none focus:border-black transition-all duration-200"
            />

            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-gray-300 px-5 py-4 rounded-2xl outline-none focus:border-black transition-all duration-200"
            />
          </div>

          <button
            type="submit"
            className="mt-6 bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition-all duration-200 font-medium"
          >
            Add Job
          </button>
        </form>

        {/* Jobs Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8">My Applications</h2>

          {jobs.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-3xl p-10 text-center text-gray-500">
              No job applications found.
            </div>
          ) : (
            <ul className="space-y-5">
              {jobs.map((job) => (
                <li
                  key={job._id}
                  className="border border-gray-200 rounded-3xl p-6 hover:border-black transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    {/* Left Side */}
                    <div className="flex-1">
                      {editingJobId === job._id ? (
                        <div className="space-y-4">
                          <input
                            value={editCompany}
                            onChange={(e) => setEditCompany(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-2xl outline-none focus:border-black"
                          />

                          <input
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value)}
                            className="w-full border border-gray-300 px-4 py-3 rounded-2xl outline-none focus:border-black"
                          />

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleJobChange(job._id)}
                              className="bg-black text-white px-5 py-2 rounded-2xl"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => setEditingJobId(null)}
                              className="border border-black px-5 py-2 rounded-2xl"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-2xl font-semibold">
                            {job.company}
                          </h3>

                          <p className="text-gray-500 mt-2 text-lg">
                            {job.role}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <span className="border border-black px-4 py-2 rounded-full text-sm font-semibold text-center">
                        {job.status}
                      </span>

                      <select
                        value={job.status}
                        onChange={(e) =>
                          handleUpdateStatus(job._id, e.target.value)
                        }
                        disabled={
                          job.status === "Offer" || job.status === "Rejected"
                        }
                        className="border border-gray-300 rounded-2xl px-4 py-2 outline-none focus:border-black"
                      >
                        <option value="applied">Applied</option>
                        <option value="assessment">Assessment</option>
                        <option value="interview_scheduled">
                          Interview Scheduled
                        </option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() => {
                          setEditingJobId(job._id);
                          setEditCompany(job.company);
                          setEditRole(job.role);
                        }}
                        className="border border-black px-4 py-2 rounded-2xl hover:bg-black hover:text-white transition-all duration-200"
                      >
                        Edit
                      </button>

                      <button
                        className="border border-red-500 text-red-500 px-4 py-2 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-200"
                        onClick={() => handleDeleteJob(job._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
