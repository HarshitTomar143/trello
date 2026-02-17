"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/boards");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-80 space-y-4 card p-4">
        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn btn-primary w-full"
          onClick={handleLogin}
        >
          Login
        </button>
        <button
          className="btn w-full"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
}
