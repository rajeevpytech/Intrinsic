import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { api, setToken, errMsg } from "../lib/api";
import { Logo } from "../components/common";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setToken(data.access_token);
      navigate("/admin");
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "radial-gradient(120% 90% at 78% 8%, #2f6fc0 0%, #1a5fa8 32%, #0d4ea0 58%, #00388e 100%)" }}>
      <div className="w-full max-w-[420px] bg-white p-9 shadow-2xl" data-testid="admin-login-card">
        <div className="mb-8"><Logo size={22} /></div>
        <div className="inline-flex items-center justify-center w-12 h-12 bg-navy text-white mb-5"><Lock size={22} /></div>
        <h1 className="font-serif text-midnight text-[28px] font-semibold">Admin Login</h1>
        <p className="text-slatesage text-[14px] mt-2 mb-6">Sign in to manage site content.</p>
        <form onSubmit={submit} className="space-y-4">
          <input data-testid="login-email" type="text" autoComplete="username" required placeholder="Username" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-powder px-4 py-3 text-[15px] focus:outline-none focus:border-navy" />
          <input data-testid="login-password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-powder px-4 py-3 text-[15px] focus:outline-none focus:border-navy" />
          {error && <p className="text-red-600 text-[13px]" data-testid="login-error">{error}</p>}
          <button data-testid="login-submit" disabled={loading} className="btn-amber w-full justify-center">
            <span>{loading ? "Signing in..." : "Sign In"}</span>
            <span className="btn-arrow"><ArrowRight size={14} strokeWidth={2.5} /></span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
