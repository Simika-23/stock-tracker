import { useState } from "react";
import { toast } from "react-hot-toast";
import { loginUserApi } from '../api/Api';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
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
            const data ={
                email:email, password: password
            }
            const response = await loginUserApi(data);
            if (response?.data?.success) {
                localStorage.setItem("token", response?.data?.token)
                toast.success(response?.data?.message)
                const decode = jwtDecode(response?.data?.token)
                if (decode.role==="user") {
                    setTimeout(() => {
                        return window.location.href="/homepage"
                    }, 1000);
                }
                else {
                    setTimeout(() => {
                        return window.location.href="/dashboard"
                    }, 1000);
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
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <form 
                onSubmit={submit} 
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-700">Login</h2>

                <input
                    name="email"
                    value={loginData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    name="password"
                    type="password"
                    value={loginData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
