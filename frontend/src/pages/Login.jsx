import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUserApi } from "../api/Api";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      return toast.error("Please fill in all fields");
    }

    try {
      const response = await loginUserApi({ email, password });

      if (response?.data?.success) {
        localStorage.setItem("token", response?.data?.token);
        toast.success(response?.data?.message);

        const decode = jwtDecode(response?.data?.token);

        setTimeout(() => {
          if (decode.role === "user") navigate("/dashboard");
          else navigate("/admin");
        }, 1000);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="backdrop-blur-xl bg-white/90 border border-blue-200 rounded-3xl p-8 shadow-lg max-w-md w-full space-y-6 mt-12"
      >
        <h2 className="text-3xl font-extrabold text-indigo-900 text-center tracking-wide">
          Welcome Back
        </h2>

        <input
          name="email"
          value={loginData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="w-full px-4 py-2.5 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2.5 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-4 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex justify-between items-center text-sm text-indigo-900">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="mr-2 accent-blue-600"
            />
            <label htmlFor="remember" className="cursor-pointer">
              Remember me
            </label>
          </div>
          <a
            href="/forgot-password"
            className="text-blue-700 hover:text-indigo-900 underline"
          >
            Forgot Password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-2xl font-semibold shadow-md text-white transition bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
