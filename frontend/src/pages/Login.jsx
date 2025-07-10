import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUserApi } from '../api/Api';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const { email, password } = loginData;

        if (!email || !password) {
            return toast.error("Please fill in all fields");
        }

        try {
            const data = {
                email: email, password: password
            };

            const response = await loginUserApi(data);

            if (response?.data?.success) {
                localStorage.setItem("token", response?.data?.token)
                toast.success(response?.data?.message)

                const decode = jwtDecode(response?.data?.token)

                if (decode.role === "user") {
                    setTimeout(() => navigate("/dashboard"), 1000);
                }
                else {
                    setTimeout(() => navigate("/admin"), 1000);
                }
                // it is safe checkout, though we dont do refresh in react.
                return
            }
            else {
                return toast.error(response?.data?.message)
            }
        }
        catch (err) {
            return toast.error(err?.response?.data?.message)
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-blue-100 to-white flex flex-col items-center justify-center">
            <form
                onSubmit={submit}
                className="backdrop-blur-xl bg-white/70 border border-blue-100 rounded-2xl p-10 shadow-2xl w-full max-w-md space-y-6"
            >
                <h2 className="text-3xl font-extrabold text-blue-900 text-center">Login</h2>

                <input
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
                />

                <input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white py-3 rounded-xl hover:bg-blue-800 font-semibold transition shadow-md"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login; 