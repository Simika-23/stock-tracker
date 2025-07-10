import { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserApi } from "../api/Api";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [agree, setAgree] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Too short";
    else if (!/[A-Z]/.test(password)) return "Add an uppercase letter";
    else if (!/[0-9]/.test(password)) return "Add a number";
    else if (!/[!@#$%^&*]/.test(password)) return "Add a special character";
    else return "Strong";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const { name, email, password } = registerData;

    if (!name.trim() || !email.trim() || !password) {
      return toast.error("Please enter all fields");
    }

    if (!agree) {
      return toast.error("You must agree to the Terms & Conditions");
    }

    try {
      const payload = {
        userName: name.trim(),
        email: email.trim(),
        password,
      };

      const response = await createUserApi(payload);
      
      console.log("Register Payload:", payload);

      if (response?.data?.success) {
        toast.success(response.data.message);
        setTimeout(() => (window.location.href = "/login"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="backdrop-blur-xl bg-white/80 border border-blue-200 rounded-3xl p-10 shadow-xl max-w-md w-full space-y-8"
        aria-label="Register form"
      >
        <h2 className="text-4xl font-extrabold text-indigo-900 text-center tracking-wide">
          Create an Account
        </h2>

        <input
          name="name"
          value={registerData.name}
          onChange={handleChange}
          placeholder="Full Name"
          type="text"
          required
          autoComplete="name"
          className="w-full px-5 py-3 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900 transition"
          aria-label="Full name"
        />

        <input
          name="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-5 py-3 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900 transition"
          aria-label="Email address"
        />

        <input
          name="password"
          type="password"
          value={registerData.password}
          onChange={handleChange}
          placeholder="Password"
          required
          autoComplete="new-password"
          className="w-full px-5 py-3 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900 transition"
          aria-label="Password"
        />

        {registerData.password && (
          <p
            className={`text-sm font-medium ${passwordStrength === "Strong"
                ? "text-indigo-600"
                : "text-red-600"
              }`}
            aria-live="polite"
          >
            {passwordStrength}
          </p>
        )}

        <div className="flex items-center text-sm text-indigo-900">
          <input
            type="checkbox"
            id="agree"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mr-3 accent-blue-600"
            aria-required="true"
          />
          <label htmlFor="agree" className="cursor-pointer">
            I agree to the{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-blue-700 hover:text-indigo-900"
            >
              Terms & Conditions
            </a>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agree}
          className={`w-full py-3 rounded-2xl font-semibold shadow-md text-white transition ${agree
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              : "bg-blue-300 cursor-not-allowed"
            }`}
          aria-label="Submit registration"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
