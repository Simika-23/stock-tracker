import { useState } from "react";
import { toast } from "react-hot-toast";
import { createUserApi } from '../api/Api';

const Register = () => {
    const [registerData, setRegisterData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRegisterData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        const { name, email, password } = registerData;

        if (!name || !email || !password) {
            return toast.error("Please enter all fields");
        }

        try {
            const formData = new FormData();
            formData.append('userName', name);
            formData.append('email', email);
            formData.append('password', password);
            const response= await createUserApi(formData);
            if (response?.data?.success) {
                return toast.success(response?.data?.message)
            }
            else {
                return toast.error(response?.data?.message)
            }
        
        } catch (err) {
            console.error("Error creating user", err);
            toast.error(err?.response?.data?.message)
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
            <form 
                onSubmit={submit} 
                className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-gray-700">Register</h2>

                <input
                    name="name"
                    value={registerData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    name="email"
                    value={registerData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <input
                    name="password"
                    type="password"
                    value={registerData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition"
                >
                    Register
                </button>
            </form>

            
        </div>
    );
};

export default Register;
