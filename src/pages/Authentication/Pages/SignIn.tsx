import FotoSanoh from '../../../images/cover/cover.png';
import Logo from '../../../images/logo-sanoh.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // import useAuth
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignIn: React.FC<{ onLoginSuccess?: () => void }> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { login, isLoading } = useAuth(); // use login and isLoading from AuthContext
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation for empty fields
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }

    try {
      // Attempt login using the login function from useAuth
      const success = await login(username, password);

      if (success) {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        navigate('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('An error occurred during login');
      console.error(error); // Log error for debugging
    }
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <div className="">
        <section className="flex h-screen w-screen overflow-y-auto flex-col p-5 bg-white max-md:pr-12 max-sm:flex max-sm:flex-col max-sm:mx-5 max-sm:mt-5">
          <div className="flex gap-5 max-md:flex-col my-auto mx-auto">
          <div className="flex-col ml-auto w-6/12 max-md:ml-0 max-md:w-full hidden md:flex">
            <img
              loading="lazy"
              src={FotoSanoh}
              alt="Login illustration"
              className="object-contain grow w-full h-auto aspect-[0.71] max-w-[500px] max-md:mt-10 max-md:max-w-[200px] max-sm:self-stretch max-sm:m-auto max-sm:w-full max-sm:max-w-[250px]"
            />
          </div>
            <div className="flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full my-auto">
              <div className="flex flex-col mr-auto w-full max-w-[500px] max-md:mt-10 max-md:ml-0 max-sm:mt-5 max-sm:ml-auto max-sm:max-w-[301px]">
                <img
                  loading="lazy"
                  src={Logo} // Pastikan Logo diimpor dengan benar
                  alt="Company logo"
                  className="object-contain max-w-full aspect-[2.79] w-[120px] max-md:ml-1"
                />
                {/* Tambahkan teks di sini */}
                
                <h2 className="text-lg text-slate-800 mt-2">Welcome to our platform, please sign in to create your account.</h2>
                <h2 className="text-2xl font-semibold text-slate-800 mt-2">Sign in to your account</h2>
                <form className="flex flex-col mt-6 w-full" onSubmit={onSubmit} autoComplete="off">
                  <div className="flex flex-col">
                    <label htmlFor="username" className="text-base text-slate-800 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      autoFocus
                      placeholder="Enter Username"
                      className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-indigo-600 border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col mt-4">
                    <label htmlFor="password" className="text-base text-slate-800 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter Password"
                      className="px-4 py-3.5 w-full bg-white rounded-lg border border-solid border-indigo-600 border-opacity-40 min-h-[48px] shadow-[0px_4px_8px_rgba(70,95,241,0.1)] text-base text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-red-600 text-white py-2 rounded-lg mt-4"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Sign In'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        
        </section>
      </div>
    </>
  );
};

export default SignIn;