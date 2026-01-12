import React, { useState } from 'react'
import { signup } from '../api/auth'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const Signup = () => {

  const[email , setEmail] = useState("");
  const[password , setPassword] = useState("");
  const[error , setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try{
      const token = await signup(email , password);
      localStorage.setItem("token" , token);
      navigate("/jobs");
    }catch{
      setError("Signup Failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='w-80 p-6 border rounded space-y-4'      
      >
        <h2 className='text-lg font-semibold'>Signup</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button className='w-full bg-black text-white py-2'>
          Signup
        </button>

        <p>
          Already have an account ?{" "}
          <Link
            to="/login"
            className='text-blue-600 hover:underline'
          >
            Login
          </Link>
        </p>

      </form>
    </div>
  )
}
