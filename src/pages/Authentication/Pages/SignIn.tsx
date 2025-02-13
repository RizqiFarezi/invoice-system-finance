import FotoSanoh from '../../../images/cover/cover.png';
import Logo from '../../../images/logo-sanoh.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      const success = await login(username, password);
      if (success) {
        if (onLoginSuccess) onLoginSuccess();
        const role = localStorage.getItem('role');
        
        switch (role) {
          case 'super-admin':
          case 'admin-accounting':
            navigate('/dashboard');
            break;
          case 'supplier':
            navigate('/tables');
            break;
          default:
            navigate('/');
        }
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <section className="flex h-screen w-screen overflow-y-auto flex-col p-5 bg-white max-md:pr-12 max-sm:mx-5">
        <div className="flex gap-5 max-md:flex-col my-auto mx-auto">
          <div className="hidden md:flex w-6/12">
            <img loading="lazy" src={FotoSanoh} alt="Login illustration" className="object-contain w-full max-w-[500px]" />
          </div>
          <div className="flex flex-col w-6/12 my-auto max-md:w-full">
            <div className="flex flex-col w-full max-w-[500px]">
              <img loading="lazy" src={Logo} alt="Company logo" className="object-contain w-[120px]" />
              <h2 className="text-lg text-slate-800 mt-2">Welcome to our platform, please sign in to access your account.</h2>
              <h2 className="text-2xl font-semibold text-slate-800 mt-2">Sign in to your account</h2>
              <form className="flex flex-col mt-6 w-full" onSubmit={onSubmit} autoComplete="off">
                <div className="flex flex-col">
                  <label htmlFor="username" className="text-base text-slate-800 mb-2">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder="Enter Username"
                    className="px-4 py-3.5 w-full bg-white rounded-lg border border-indigo-600 shadow-sm text-base text-black"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    aria-label="Username"
                  />
                </div>
                <div className="flex flex-col mt-4">
                  <label htmlFor="password" className="text-base text-slate-800 mb-2">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter Password"
                    className="px-4 py-3.5 w-full bg-white rounded-lg border border-indigo-600 shadow-sm text-base text-black"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    aria-label="Password"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-600 text-white py-2 rounded-lg mt-4 hover:bg-red-700 transition"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Sign In'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
