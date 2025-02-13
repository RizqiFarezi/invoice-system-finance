import { useEffect, useState } from "react";
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb";
import Swal from "sweetalert2";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import Button from "../../../components/Forms/Button";
import { roles } from "../../Authentication/Role";

const EditUser = () => {
  const [suppliers, setSuppliers] = useState<{ value: string; label: string }[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<{ value: string; label: string } | null>(null);
  const [firstName, setFirstName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [emails, setEmails] = useState<string[]>([""]);
  const [originalUsername, setOriginalUsername] = useState('');

  // Dummy data for suppliers and user info
  const dummySuppliers = [
    { value: "SUP123", label: "SUP123 | Supplier One" },
    { value: "SUP456", label: "SUP456 | Supplier Two" },
  ];

  const dummyUserData = {
    bp_code: "SUP123",
    name: "John Doe",
    role: "admin",
    username: "johndoe123",
    email: ["johndoe@example.com"]
  };

  useEffect(() => {
    setSuppliers(dummySuppliers);
  }, []);

  useEffect(() => {
    if (dummyUserData && suppliers.length > 0) {
      populateForm(dummyUserData);
    }
  }, [suppliers]);

  const populateForm = (data: { bp_code: string; name: string; role: string; username: string; email: string[] }) => {
    const matchedSupplier = suppliers.find((sup) => sup.value === data.bp_code);
    setSelectedSupplier(matchedSupplier || null);
    setFirstName(data.name || "");
    setRole(data.role || "");
    setOriginalUsername(data.username || "");
    setUsername(data.username || "");
    setEmails(Array.isArray(data.email) ? data.email : [data.email || ""]);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedSupplier) {
      Swal.fire('Error', 'Please fill all required fields correctly.', 'error');
      return;
    }

    // const payload = {
    //   bp_code: selectedSupplier.value,
    //   username: username === originalUsername ? "" : username,
    //   name: firstName,
    //   role,
    //   password: password || "",
    //   email: emails.filter(email => email.trim() !== ""),
    // };

    // Simulating an update with dummy response
    toast.success('User successfully updated!');
    setTimeout(() => {
      navigate('/list-user');
    }, 1000);
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
        setTimeout(() => {
          document.getElementById('email-input')?.focus();
        }, 0);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (inputValue.includes('@') && (inputValue.endsWith('.com') || inputValue.endsWith('.co.id') || inputValue.endsWith('.net') || inputValue.endsWith('.org') || inputValue.endsWith('.edu') || inputValue.endsWith('.gov') || inputValue.endsWith('.io') || inputValue.endsWith('.tech'))) {
          setEmails(prev => [...prev, inputValue.trim()]);
          setInputValue('');
          setTimeout(() => {
            document.getElementById('email-input')?.focus();
          }, 0);
        }
      }
    };

    const handleBlur = () => {
      if (inputValue.includes('@') && (inputValue.endsWith('.com') || inputValue.endsWith('.co.id') || inputValue.endsWith('.net') || inputValue.endsWith('.org') || inputValue.endsWith('.edu') || inputValue.endsWith('.gov') || inputValue.endsWith('.io') || inputValue.endsWith('.tech'))) {
      setEmails(prev => [...prev, inputValue.trim()]);
      setInputValue('');
      setTimeout(() => {
        document.getElementById('email-input')?.focus();
      }, 0);
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
      <Breadcrumb 
        pageName="Edit User" 
        isSubMenu={true}
        parentMenu={{
          name: "Manage User",
          link: "/list-user"
        }}
      />
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <form onSubmit={handleSubmit} className="max-w-[1024px] mx-auto">
          <div className="p-4 md:p-6.5">
            {/* Supplier Selection */}
            <div className="mb-4.5 w-full">
              <label className="mb-2.5 block text-black dark:text-white">
                Select Supplier <span className="text-meta-1">*</span>
              </label>
              <div className="w-full">
                <Select
                  id="supplier_id"
                  options={suppliers}
                  value={selectedSupplier}
                  onChange={setSelectedSupplier}
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
                  Name
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
                  Role
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
                  Username
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

              {/* Email Fields */}
              <div className="w-full md:w-[600px]">
                <label className="mb-2.5 block text-black dark:text-white">
                  Email 
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
                    placeholder="Leave blank to keep current"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </button>
                </div>
                <Button type="button" onClick={generateRandomPassword} title="Generate Random Password" />
              </div>
            </div>
            <Button type="submit" title="Save Changes" />
          </div>
        </form>
      </div>
    </>
  );
};

export default EditUser;
