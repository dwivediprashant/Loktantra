"use client";

import { useMemo, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";

type ElectionStatus = "Active" | "Draft" | "Ended";

type Election = {
  id: number;
  name: string;
  status: ElectionStatus;
  startDate: string;
  endDate: string;
  totalVotes: number;
};

type CandidateStatus = "Valid" | "Invalid";

type Candidate = {
  id: number;
  name: string;
  party: string;
  image: string;
  status: CandidateStatus;
};

export default function Admin() {
  const [elections, setElections] = useState<Election[]>([
    {
      id: 1,
      name: "Student Council 2024",
      status: "Active",
      startDate: "2024-10-20",
      endDate: "2024-10-21",
      totalVotes: 1245,
    },
    {
      id: 2,
      name: "Local Council",
      status: "Draft",
      startDate: "2024-11-01",
      endDate: "2024-11-02",
      totalVotes: 0,
    },
    {
      id: 3,
      name: "Community Board",
      status: "Ended",
      startDate: "2024-09-15",
      endDate: "2024-09-16",
      totalVotes: 850,
    },
  ]);

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: "Priya Sharma",
      party: "Unity Party",
      image: "/rahulji.png",
      status: "Valid",
    },
    {
      id: 2,
      name: "Vivek Kumar",
      party: "Progress Alliance",
      image: "/modiji.png",
      status: "Valid",
    },
    {
      id: 3,
      name: "Aditi Rao",
      party: "Independent",
      image: "/rahulji.png",
      status: "Invalid",
    },
    {
      id: 4,
      name: "Rahul Verma",
      party: "Future Vision",
      image: "/modiji.png",
      status: "Valid",
    },
  ]);

  const [openElectionMenuId, setOpenElectionMenuId] = useState<number | null>(
    null,
  );
  const [isElectionModalOpen, setIsElectionModalOpen] = useState(false);
  const [electionForm, setElectionForm] = useState({
    name: "",
    status: "Active" as ElectionStatus,
    startDate: "",
    endDate: "",
  });
  const [electionErrors, setElectionErrors] = useState<{
    name?: string;
    date?: string;
  }>({});

  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    id: 0,
    name: "",
    party: "",
    image: "",
    status: "Valid" as CandidateStatus,
  });
  const [candidateErrors, setCandidateErrors] = useState<{ name?: string }>({});
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(
    null,
  );
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const nextElectionId = useMemo(
    () =>
      elections.length
        ? Math.max(...elections.map((election) => election.id)) + 1
        : 1,
    [elections],
  );

  const nextCandidateId = useMemo(
    () =>
      candidates.length
        ? Math.max(...candidates.map((candidate) => candidate.id)) + 1
        : 1,
    [candidates],
  );

  const getStatusBadge = (status: ElectionStatus) => {
    const statusConfig = {
      Active: "bg-green-100 text-green-700",
      Draft: "bg-gray-200 text-gray-600",
      Ended: "bg-red-100 text-red-600",
    };

    return (
      <span
        className={`px-2 py-1 text-xs rounded ${statusConfig[status as keyof typeof statusConfig]}`}
      >
        {status}
      </span>
    );
  };

  const getCandidateStatusBadge = (status: CandidateStatus) => (
    <span
      className={`px-2 py-1 text-xs rounded ${
        status === "Valid"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-600"
      }`}
    >
      {status}
    </span>
  );

  const formatDateForDisplay = (value: string) => {
    if (!value) return "-";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const resetElectionForm = () => {
    setElectionForm({ name: "", status: "Active", startDate: "", endDate: "" });
    setElectionErrors({});
  };

  const openCreateElectionModal = () => {
    resetElectionForm();
    setIsElectionModalOpen(true);
  };

  const validateElectionForm = () => {
    const errors: { name?: string; date?: string } = {};
    if (!electionForm.name.trim()) {
      errors.name = "Election name is required.";
    }
    if (!electionForm.startDate || !electionForm.endDate) {
      errors.date = "Start and end dates are required.";
    } else {
      const start = new Date(electionForm.startDate);
      const end = new Date(electionForm.endDate);
      if (start > end) {
        errors.date = "Start date must be before or equal to the end date.";
      }
    }
    setElectionErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveElection = () => {
    if (!validateElectionForm()) return;

    const newElection: Election = {
      id: nextElectionId,
      name: electionForm.name.trim(),
      status: electionForm.status,
      startDate: electionForm.startDate,
      endDate: electionForm.endDate,
      totalVotes: 0,
    };

    setElections((prev) => [newElection, ...prev]);
    setIsElectionModalOpen(false);
    resetElectionForm();
  };

  const updateElectionStatus = (id: number, status: ElectionStatus) => {
    setElections((prev) =>
      prev.map((election) =>
        election.id === id ? { ...election, status } : election,
      ),
    );
    setOpenElectionMenuId(null);
  };

  const handleDownloadReport = (name: string) => {
    window.alert(`Report for "${name}" downloaded (mock).`);
    setOpenElectionMenuId(null);
  };

  const resetCandidateForm = () => {
    setCandidateForm({
      id: 0,
      name: "",
      party: "",
      image: "",
      status: "Valid",
    });
    setCandidateErrors({});
    setImagePreviewUrl("");
  };

  const openCreateCandidateModal = () => {
    resetCandidateForm();
    setIsCandidateModalOpen(true);
  };

  const openEditCandidateModal = (candidate: Candidate) => {
    setCandidateForm(candidate);
    setCandidateErrors({});
    setImagePreviewUrl(candidate.image);
    setIsCandidateModalOpen(true);
  };

  const validateCandidateForm = () => {
    const errors: { name?: string } = {};
    if (!candidateForm.name.trim()) {
      errors.name = "Candidate name is required.";
    }
    setCandidateErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveCandidate = () => {
    if (!validateCandidateForm()) return;

    const payload: Candidate = {
      ...candidateForm,
      id: candidateForm.id || nextCandidateId,
      name: candidateForm.name.trim(),
      party: candidateForm.party.trim(),
      image: imagePreviewUrl || candidateForm.image || "/modiji.png",
    };

    setCandidates((prev) => {
      const exists = prev.some((candidate) => candidate.id === payload.id);
      if (exists) {
        return prev.map((candidate) =>
          candidate.id === payload.id ? payload : candidate,
        );
      }
      return [payload, ...prev];
    });

    setIsCandidateModalOpen(false);
    resetCandidateForm();
  };

  const handleToggleCandidateStatus = (id: number) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? {
              ...candidate,
              status: candidate.status === "Valid" ? "Invalid" : "Valid",
            }
          : candidate,
      ),
    );
  };

  const handleDeleteCandidate = () => {
    if (deleteCandidateId === null) return;
    setCandidates((prev) =>
      prev.filter((candidate) => candidate.id !== deleteCandidateId),
    );
    setDeleteCandidateId(null);
  };

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Top Navbar */}
      <AdminNavbar />

      {/* Page Content */}
      <main className="max-w-[1400px] mx-auto p-6 flex gap-6">
        {/* Left Main Section */}
        <section className="flex-1 space-y-6">
          {/* Manage Elections */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Manage Elections</h2>
              <button
                onClick={openCreateElectionModal}
                className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Create Election
              </button>
            </div>

            <table className="w-full text-sm text-left">
              <thead className="text-gray-500 border-b">
                <tr>
                  <th className="py-2">Election Name</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Total Votes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {elections.map((election) => (
                  <tr key={election.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 font-medium">{election.name}</td>
                    <td>{getStatusBadge(election.status)}</td>
                    <td>{formatDateForDisplay(election.startDate)}</td>
                    <td>{formatDateForDisplay(election.endDate)}</td>
                    <td className="font-semibold">
                      {election.totalVotes.toLocaleString()}
                    </td>
                    <td>
                      <div className="relative flex items-center gap-2">
                        <button
                          onClick={() =>
                            setOpenElectionMenuId((prev) =>
                              prev === election.id ? null : election.id,
                            )
                          }
                          className="text-gray-400 hover:text-gray-600"
                          aria-label={`Open actions for ${election.name}`}
                        >
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                        {openElectionMenuId === election.id && (
                          <div
                            className="absolute right-0 top-8 z-10 w-44 rounded-md border bg-white shadow-lg"
                            role="menu"
                          >
                            <button
                              onClick={() =>
                                updateElectionStatus(election.id, "Draft")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              ⏸ Pause Election
                            </button>
                            <button
                              onClick={() =>
                                updateElectionStatus(election.id, "Ended")
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              ⛔ End Election
                            </button>
                            <button
                              onClick={() =>
                                handleDownloadReport(election.name)
                              }
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              📄 Download Report
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Manage Candidates */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Manage Candidates</h2>
              <button
                onClick={openCreateCandidateModal}
                className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                <i className="fas fa-plus mr-2"></i>
                Add Candidate
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className="border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {candidate.name}
                      </p>
                      <p className="text-sm text-gray-500">{candidate.party}</p>
                      <div className="mt-1">
                        {getCandidateStatusBadge(candidate.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-5">
                    <button
                      onClick={() => handleToggleCandidateStatus(candidate.id)}
                      className={`text-[1.5rem] ml-2 ${
                        candidate.status === "Valid"
                          ? "text-green-700"
                          : "text-gray-400"
                      }`}
                      aria-label={`Toggle status for ${candidate.name}`}
                    >
                      <i
                        className={`fas ${candidate.status === "Valid" ? "fa-toggle-on" : "fa-toggle-off"}`}
                      ></i>
                    </button>
                    <button
                      onClick={() => openEditCandidateModal(candidate)}
                      className="text-blue-600 text-xl ml-2"
                      aria-label={`Edit ${candidate.name}`}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => setDeleteCandidateId(candidate.id)}
                      className="text-red-500 text-xl ml-2"
                      aria-label={`Delete ${candidate.name}`}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="w-[300px] space-y-6">
          {/* Real-time Stats */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <h3 className="font-semibold text-gray-800 text-sm">
                Real-Time Stats
              </h3>
            </div>
            <div className="space-y-4">
              {/* Active Voters */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <div className="text-lg font-semibold text-gray-800">
                      452
                    </div>
                    <div className="text-xs text-gray-500">Active Voters</div>
                  </div>
                </div>
              </div>

              {/* Votes Cast */}
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🗳️</span>
                  <div>
                    <div className="text-lg font-semibold text-blue-600">
                      1,245
                    </div>
                    <div className="text-xs text-gray-500">Votes Cast</div>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium text-green-600">
                      Operational
                    </div>
                    <div className="text-xs text-gray-500">System Status</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <h3 className="font-semibold text-gray-800 mb-3">
              <i className="fas fa-bolt mr-2 text-purple-600"></i>
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full bg-green-100 text-green-700 py-2 rounded hover:bg-green-200 transition-colors">
                <i className="fas fa-play mr-2"></i>
                Start Election
              </button>
              <button className="w-full bg-red-100 text-red-700 py-2 rounded hover:bg-red-200 transition-colors">
                <i className="fas fa-stop mr-2"></i>
                End Election
              </button>
              <button className="w-full bg-purple-100 text-purple-700 py-2 rounded hover:bg-purple-200 transition-colors">
                <i className="fas fa-chart-bar mr-2"></i>
                Publish Results
              </button>
            </div>
          </div>

          {/* Admin Guide */}
          <div className="bg-purple-50 rounded-lg p-5 text-sm text-purple-700">
            <div className="flex items-start gap-2 mb-2">
              <i className="fas fa-info-circle mt-0.5"></i>
              <p className="font-medium">Admin Guide</p>
            </div>
            <p className="text-purple-600">
              Need help managing elections? Check documentation for best
              practices.
            </p>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-500 py-4 border-t bg-white">
        <i className="fas fa-shield-alt mr-1"></i>
        Active actions are logged on blockchain for transparency
      </footer>

      {openElectionMenuId !== null && (
        <button
          className="fixed inset-0 z-0 cursor-default"
          onClick={() => setOpenElectionMenuId(null)}
          aria-hidden="true"
        />
      )}

      {isElectionModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Create Election
              </h3>
              <button
                onClick={() => setIsElectionModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close create election modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="election-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Election Name
                </label>
                <input
                  id="election-name"
                  type="text"
                  value={electionForm.name}
                  onChange={(event) =>
                    setElectionForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  required
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter election name"
                />
                {electionErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {electionErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="election-status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="election-status"
                  value={electionForm.status}
                  onChange={(event) =>
                    setElectionForm((prev) => ({
                      ...prev,
                      status: event.target.value as ElectionStatus,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="start-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={electionForm.startDate}
                    onChange={(event) =>
                      setElectionForm((prev) => ({
                        ...prev,
                        startDate: event.target.value,
                      }))
                    }
                    required
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="end-date"
                    className="block text-sm font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={electionForm.endDate}
                    onChange={(event) =>
                      setElectionForm((prev) => ({
                        ...prev,
                        endDate: event.target.value,
                      }))
                    }
                    required
                    className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
              {electionErrors.date && (
                <p className="text-xs text-red-500">{electionErrors.date}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsElectionModalOpen(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveElection}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {candidateForm.id ? "Edit Candidate" : "Add Candidate"}
              </h3>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close candidate modal"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="candidate-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Candidate Name
                </label>
                <input
                  id="candidate-name"
                  type="text"
                  value={candidateForm.name}
                  onChange={(event) =>
                    setCandidateForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter candidate name"
                />
                {candidateErrors.name && (
                  <p className="mt-1 text-xs text-red-500">
                    {candidateErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="candidate-party"
                  className="block text-sm font-medium text-gray-700"
                >
                  Party / Affiliation
                </label>
                <input
                  id="candidate-party"
                  type="text"
                  value={candidateForm.party}
                  onChange={(event) =>
                    setCandidateForm((prev) => ({
                      ...prev,
                      party: event.target.value,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-purple-500 focus:outline-none"
                  placeholder="Enter party or affiliation"
                />
              </div>

              <div>
                <label
                  htmlFor="candidate-status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Candidate Status
                </label>
                <select
                  id="candidate-status"
                  value={candidateForm.status}
                  onChange={(event) =>
                    setCandidateForm((prev) => ({
                      ...prev,
                      status: event.target.value as CandidateStatus,
                    }))
                  }
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:border-purple-500 focus:outline-none"
                >
                  <option value="Valid">Valid</option>
                  <option value="Invalid">Invalid</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="candidate-image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Profile Picture
                </label>
                <input
                  id="candidate-image"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setImagePreviewUrl(url);
                    }
                  }}
                  className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                />
                {imagePreviewUrl && (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={imagePreviewUrl}
                      alt="Candidate preview"
                      className="h-12 w-12 rounded-full object-cover border"
                    />
                    <span className="text-xs text-gray-500">Preview</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCandidate}
                className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteCandidateId !== null && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              Delete Candidate
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to remove this candidate?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteCandidateId(null)}
                className="rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCandidate}
                className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
