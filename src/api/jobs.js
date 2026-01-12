import api from "./api";

export const fetchJobs = async () => {
  const res = await api.get("/jobs");
  return res.data.jobs;
}

export const createJobs = async (company , role) =>{
  const res = await api.post("/jobs" , {company , role});
  return res.data.jobs;
}

export const updateStatusJob = async (jobId , status) => {
  await api.patch(`/jobs/${jobId}/status` , {status});
  return ;
}

export const deleteJob = async (jobId) => {
  await api.delete(`/jobs/${jobId}`);
  return ;
}

export const updateNonStatusJob = async (jobId , {company , role}) =>{
  await api.patch(`/jobs/${jobId}` , {company , role});
  return;
}