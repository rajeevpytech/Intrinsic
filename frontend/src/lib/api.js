import axios from "axios";

export const BACKEND = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND}/api`;

export const imgUrl = (v) => (!v ? "" : v.startsWith("http") || v.startsWith("/") ? v : `${API}/files/${v}`);

export const getToken = () => localStorage.getItem("intr_token");
export const setToken = (t) => localStorage.setItem("intr_token", t);
export const clearToken = () => localStorage.removeItem("intr_token");

export const api = axios.create({ baseURL: API });
api.interceptors.request.use((c) => {
  const t = getToken();
  if (t) c.headers.Authorization = `Bearer ${t}`;
  return c;
});

export const errMsg = (e) => {
  const d = e?.response?.data?.detail;
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x.msg || JSON.stringify(x)).join(" ");
  return e.message || "Something went wrong";
};
