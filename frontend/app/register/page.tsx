"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/register", {
        name,
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
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
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
          Register
        </button>
        <button
          className="btn w-full"
          onClick={() => router.push("/login")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}
