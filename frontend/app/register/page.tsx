"use client";

import { RegisterRequestDto } from "@/models/auth/auth";
import authService from "@/service/authService";
import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    if (!username || !password || !displayName || !phone) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const registerDto: RegisterRequestDto = {
        username,
        password,
        displayName,
        phone,
      };

      await authService.register(registerDto);
      window.location.href = "/login";
    } catch {
      setError("Không thể kết nối đến server");
    } finally {
      console.log("chạy xong");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex items-center justify-center px-4">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-white text-xl font-bold">💬</span>
          </div>
          <h1 className="text-2xl font-semibold text-slate-800">Tạo tài khoản</h1>
          <p className="text-sm text-slate-500 mt-1">Bắt đầu trò chuyện ngay 🚀</p>
        </div>

        {/* Form */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-100 border border-red-200 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-500 mb-2">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="yourname"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Display Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-500 mb-2">Tên hiển thị</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Tên của bạn"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-500 mb-2">Số điện thoại</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0123456789"
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-500 mb-2">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={(e) => e.key === "Enter" && handleRegister()}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-xl text-sm flex justify-center items-center gap-2"
          >
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </div>

        {/* Login */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Đã có tài khoản?{" "}
          <a href="/login" className="text-indigo-500 hover:text-indigo-400 font-medium">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}