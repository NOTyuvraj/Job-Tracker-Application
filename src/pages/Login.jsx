import { useState } from 'react'
import {login} from "../api/auth.js"
import { Link, useNavigate } from 'react-router-dom';


export const Login = () => {

  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try{
      const token = await login(email , password);
      localStorage.setItem("token" , token);
      navigate("/jobs");
    }catch{
      setError("Invalid Credentials");
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='w-80 p-6 border rounded space-y-4'
      >
        <h2 className='text-lg font-semibold'>Login</h2>

        <input 
          type='email'
          placeholder='Email'
          className='w-full border p-2'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type='password'
          placeholder='Password'
          className='w-full border p-2'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className='text-red-500 text-sm'>{error}</p>}

        <button className='w-full bg-black text-white py-2'>
          Login
        </button>
        <p>
          Don't have an account ?{" "}
          <Link
            to="/signup"
            className='text-blue-600 hover:underline'
          >
            Sign Up
          </Link>
        </p>

      </form>
    </div>
  )
}
