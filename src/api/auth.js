import api from "./api";

export const signup = async (email , password) => {
  const res = await api.post("/auth/signup" , {email , password});
  return res.data.token;
}

export const login = async (email , password) => {
  const res = await api.post("/auth/login" , {email , password});
  return res.data.token;
}