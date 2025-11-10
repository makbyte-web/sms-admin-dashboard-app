"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserContext } from "@/context/UserContext";
import Logo from "../logo";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const { login } = useUserContext();
  const router = useRouter();

  const [inputEmail, setInputEmail] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(inputEmail, inputPassword);
      router.push("/dashboard");
    } catch (err) {
      setError("Invalid Email or Password!");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-[--bg]">
      <div className="pb-12 mb-8">
        <Link
          href="/"
          className="flex w-fit justify-center rounded-md bg-indigo-500 px-6 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 transition"
        >
          &larr; Back
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <Logo />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Log in to your account
        </h2>

        {error && (
          <p className="mt-3 text-sm text-red-400 bg-red-500/10 py-2 rounded-md">
            {error}
          </p>
        )}
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmitLogin}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={(e) => setInputEmail(e.target.value)}
              required
              className="mt-2 px-2 block w-full rounded-md border-0 bg-white/10 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>
              <Link
                href="#"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-2 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setInputPassword(e.target.value)}
                required
                className="px-2 block w-full rounded-md border-0 bg-white/10 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm
              ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-400"
              }
              transition`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Logging in...
              </div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
