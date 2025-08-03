import { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserApi } from "../api/Api";
import { EyeIcon, EyeSlashIcon, XMarkIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showTerms, setShowTerms] = useState(false); // Modal state

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
    const { name, email, password, confirmPassword } = registerData;

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      return toast.error("Please enter all fields");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!agree) {
      return toast.error("You must agree to the Terms & Conditions");
    }

    try {
      const payload = { userName: name.trim(), email: email.trim(), password };
      const response = await createUserApi(payload);
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
        className="backdrop-blur-xl bg-white/90 border border-blue-200 rounded-3xl p-8 shadow-lg max-w-md w-full space-y-6 mt-12"
      >
        <h2 className="text-3xl font-extrabold text-indigo-900 text-center tracking-wide">
          Create an Account
        </h2>

        <input
          name="name"
          value={registerData.name}
          onChange={handleChange}
          placeholder="Full Name"
          type="text"
          required
          className="w-full px-4 py-2.5 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900"
        />

        <input
          name="email"
          value={registerData.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          required
          className="w-full px-4 py-2.5 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900"
        />

        <div className="relative">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={registerData.password}
            onChange={handleChange}
            placeholder="Password"
            required
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

        <input
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          value={registerData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm Password"
          required
          className="w-full px-4 py-2.5 border border-blue-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-indigo-900"
        />

        {registerData.password && (
          <p
            className={`text-sm font-medium ${passwordStrength === "Strong" ? "text-green-600" : "text-red-600"}`}
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
          />
          <label htmlFor="agree" className="cursor-pointer">
            I agree to the{" "}
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              className="underline text-blue-700 hover:text-indigo-900"
            >
              Terms & Conditions
            </button>
          </label>
        </div>

        <button
          type="submit"
          disabled={!agree}
          className={`w-full py-2.5 rounded-2xl font-semibold shadow-md text-white transition ${agree
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            : "bg-blue-300 cursor-not-allowed"
            }`}
        >
          Register
        </button>
      </form>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative">
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h3 className="text-xl font-bold text-indigo-900 mb-4">Terms & Conditions</h3>
            <p className="text-sm text-gray-700">
              This is a placeholder for your Terms & Conditions. Add your content here regarding user
              agreements, data handling, and privacy policies.
            </p>
            <button
              onClick={() => setShowTerms(false)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
