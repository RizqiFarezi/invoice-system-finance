import { useState } from 'react';
import Select from "react-select";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../../components/Forms/Button';
import { roles } from '../../Authentication/Role';

const AddUser = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<{ value: string; label: string } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);

  const handleSupplierChange = (selectedOption: { value: string; label: string } | null) => {
    setSelectedSupplier(selectedOption);
    if (selectedOption) {
      // Simulate fetching emails based on selected supplier
      setEmails([`${selectedOption.value}@example.com`, `${selectedOption.value}2@example.com`]);
    } else {
      setEmails([]); // Clear emails when supplier is cleared
    }
  };

  const generateRandomPassword = () => {
    if (selectedSupplier) {
      const bpCode = selectedSupplier.value;
      const codeAfterThree = bpCode.substring(3, 7);

      const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
      const randomChars = Array.from({ length: 6 }, () => 
        characters[Math.floor(Math.random() * characters.length)]
      ).join('');

      const finalPassword = codeAfterThree + randomChars;

      setPassword(finalPassword);
    } else {
      Swal.fire('Error', 'Please select a supplier first', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSupplier || !firstName || !role || !username || !password) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    // const payload = {
    //   bp_code: selectedSupplier?.value ?? "", // Default to empty string if null
    //   name: firstName,
    //   role,
    //   status: "1",
    //   username,
    //   password,
    //   email: emails.filter(email => email.trim() !== ""),
    // };

    try {
      // Simulate a successful user creation response
      toast.success('User successfully created!');
      resetForm();
    } catch (error) {
      toast.error('An error occurred while creating the user.');
    }
  };

  const resetForm = () => {
    setFirstName("");
    setUsername("");
    setPassword("");
    setRole("");
  };

  const EmailInput = () => {
    const [inputValue, setInputValue] = useState('');
    
    const handleEmailRemove = (index: number) => {
      setEmails(emails.filter((_, i) => i !== index));
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (value.includes('@') && (value.endsWith('.com') || value.endsWith('.co.id') || value.endsWith('.net') || value.endsWith('.org'))) {
        setEmails(prev => [...prev, value.trim()]);
        setInputValue('');
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (inputValue.includes('@') && (inputValue.endsWith('.com') || inputValue.endsWith('.co.id') || inputValue.endsWith('.net') || inputValue.endsWith('.org'))) {
          setEmails(prev => [...prev, inputValue.trim()]);
          setInputValue('');
        }
      }
    };

    const handleBlur = () => {
      if (inputValue.includes('@') && (inputValue.endsWith('.com') || inputValue.endsWith('.co.id') || inputValue.endsWith('.net') || inputValue.endsWith('.org'))) {
        setEmails(prev => [...prev, inputValue.trim()]);
        setInputValue('');
      }
    };

    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 p-2 mb-2 rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
          {emails.map((email, index) => (
            <span key={index} className="bg-blue-100 px-2 py-1 rounded-md flex items-center gap-2">
              {email}
              <button 
                type="button"
                onClick={() => handleEmailRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            id="email-input"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            placeholder="Type email ..."
            className="outline-none border-none flex-1 min-w-[200px]"
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Breadcrumb pageName="Add User" />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="max-w-[1024px] mx-auto">
          <div className="p-4 md:p-6.5">
            {/* Supplier Selection */}
            <div className="mb-4.5 w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Select Supplier <span className="text-meta-1">*</span>
              </label>
              <div className="w-full max-w-[600px]">
                <Select
                  id="supplier_id"
                  options={[
                    { value: 'SUP001', label: 'SUP001 | Supplier A' },
                    { value: 'SUP002', label: 'SUP002 | Supplier B' },
                    { value: 'SUP003', label: 'SUP003 | Supplier C' }
                  ]}
                  value={selectedSupplier}
                  onChange={handleSupplierChange}
                  placeholder="Search Supplier"
                  className="w-full"
                  isClearable
                />
              </div>
            </div>

            {/* Name and Role in one row */}
            <div className="mb-4.5 flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-[300px]">
                <label className="mb-2.5 block text-black dark:text-white">
                  Name <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter name"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="w-full md:w-[300px]">
                <label className="mb-2.5 block text-black dark:text-white">
                  Role <span className="text-meta-1">*</span>
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  required
                >
                  <option value="" disabled>Select a role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Username and Email in one row */}
            <div className="mb-4.5 flex flex-col md:flex-row gap-4 md:gap-6">
              <div className="w-full md:w-[300px]">
                <label className="mb-2.5 block text-black dark:text-white">
                  Username <span className="text-meta-1">*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>

              <div className="w-full md:w-[600px]">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email <span className="text-meta-1">*</span>
                </label>
                <EmailInput />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Password
              </label>
              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="relative w-full md:w-[300px]">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (min. 8 characters)"
                    required
                    minLength={8}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500" />
                    ) : (
                      <FaEye className="text-gray-500" />
                    )}
                  </button>
                  {password.length > 0 && password.length < 8 && (
                  <span className="text-meta-1 text-sm mt-1">Password must be at least 8 characters</span>
                  )}
                </div>
                
                <Button
                  title="Generate Password"
                  onClick={generateRandomPassword}
                  className="md:self-center"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              title="Create User"
              type="submit"
              className="w-full justify-center"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;
