import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/Table/Pagination';
import SearchBar from '../../../components/Table/SearchBar';
import { FaSortDown, FaSortUp, FaToggleOff, FaToggleOn, FaUserEdit, FaUserPlus } from 'react-icons/fa';
import MultiSelect from '../../../components/Forms/MultiSelect';
import { toast, ToastContainer } from 'react-toastify';
import Button from '../../../components/Forms/Button';
import { getRoleName } from '../../Authentication/Role';

interface User {
    UserID: string;
    SupplierCode: string;
    Username: string;
    Name: string;
    Role: string;
    Status: string;
    RoleCode: string;
    isLoading?: boolean;
}

interface Option {
    value: string;
    text: string;
}

const ManageUser: React.FC = () => {
    const [data, setData] = useState<User[]>([]);
    const [filteredData, setFilteredData] = useState<User[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [roleOptions, setRoleOptions] = useState<Option[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchListUser();
        const savedPage = localStorage.getItem('list_user_current_page');
        if (savedPage) {
            setCurrentPage(parseInt(savedPage));
        }
    }, []);

    const fetchListUser = async () => {
        setLoading(true);

        // Dummy data for users
        const dummyData = [
            { UserID: '1', SupplierCode: 'S001', Username: 'john_doe', Name: 'John Doe', Role: 'Admin Purchasing', RoleCode: '2', Status: 'Active' },
            { UserID: '2', SupplierCode: 'S002', Username: 'jane_smith', Name: 'Jane Smith', Role: 'Admin Warehouse', RoleCode: '3', Status: 'Deactive' },
            { UserID: '3', SupplierCode: 'S003', Username: 'mary_jones', Name: 'Mary Jones', Role: 'Admin Subcont', RoleCode: '4', Status: 'Active' },
            { UserID: '4', SupplierCode: 'S004', Username: 'alex_brown', Name: 'Alex Brown', Role: 'Supplier Marketing', RoleCode: '5', Status: 'Deactive' },
            // Add more dummy users here
        ];

        // Simulate network delay
        setTimeout(() => {
            setData(dummyData);
            setFilteredData(dummyData);
            setLoading(false);

            // Extract unique roles for MultiSelect options
            const uniqueRoles = Array.from(new Set(dummyData.map((user: any) => user.RoleCode)))
                .map((roleCode) => ({
                    value: roleCode,
                    text: getRoleName(roleCode),
                }));

            setRoleOptions(uniqueRoles);
        }, 1000);
    };

    const handleStatusChange = async (userId: string, status: number, username: string) => {
        try {
            const updatedData = data.map((item) =>
                item.UserID === userId ? { ...item, Status: status === 1 ? 'Active' : 'Deactive', isLoading: false } : item
            );
            setData(updatedData);
            setFilteredData(updatedData);

            // Simulate status update success
            toast.success(`Status for "${username}" Successfully Updated to ${status === 1 ? 'Active' : 'Deactive'}`);
        } catch (error) {
            toast.error(`Failed to update status for "${username}": ${error}`);
        }
    };

    useEffect(() => {
        let filtered = [...data];

        if (selectedRoles.length > 0) {
            filtered = filtered.filter((row) => selectedRoles.includes(row.RoleCode));
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter((row) =>
                row.Username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.Name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof User];
                const bValue = b[sortConfig.key as keyof User];

                if (!aValue || !bValue) return 0;

                if (sortConfig.key === 'Status') {
                    return sortConfig.direction === 'asc'
                        ? aValue.toString().localeCompare(bValue.toString())
                        : bValue.toString().localeCompare(aValue.toString());
                }

                return sortConfig.direction === 'asc'
                    ? aValue.toString().localeCompare(bValue.toString())
                    : bValue.toString().localeCompare(aValue.toString());
            });
        }

        setFilteredData(filtered);
    }, [searchQuery, selectedRoles, sortConfig, data]);

    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        localStorage.setItem('list_user_current_page', page.toString());
    };

    const handleSort = (key: keyof User) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleEditPage = (UserId: string) => {
        navigate(`/edit-user?userId=${UserId}`);
    };

    return (
        <>
            <ToastContainer position="top-right" />
            <Breadcrumb pageName="Manage User" />
            <div className="bg-white">
                <div className="p-2 md:p-4 lg:p-6 space-y-6">

                    {/* Header Section */}
                    <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                        <div className='flex flex-col sm:flex-row gap-4 w-full lg:w-1/2'>
                            <Button
                                title="Add User"
                                onClick={() => navigate('/add-user')}
                                icon={FaUserPlus}
                                className='transition-colors whitespace-nowrap flex items-center justify-center'
                            />

                            {/* Search Bar */}
                            <div className="w-full">
                                <SearchBar
                                    placeholder="Search user here..."
                                    onSearchChange={setSearchQuery}
                                />
                            </div>
                        </div>
                        
                        {/* Filters */}
                        <div className="w-full lg:w-1/3">
                            <MultiSelect
                                label="Filter by Role"
                                options={roleOptions}
                                selectedOptions={selectedRoles}
                                onChange={setSelectedRoles}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w[20%]">Username</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w[10%]">Supplier Code</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w[25%]">Name</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w-[15%]">Role</th>
                                        <th
                                            className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w-[10%] cursor-pointer"
                                            onClick={() => handleSort('Status')}
                                        >
                                            <span className="flex items-center justify-center">
                                                {sortConfig.key === 'Status' ? (
                                                    sortConfig.direction === 'asc' ? (
                                                        <FaSortUp className="mr-1" />
                                                    ) : (
                                                        <FaSortDown className="mr-1" />
                                                    )
                                                ) : (
                                                    <FaSortDown className="opacity-50 mr-1" />
                                                )}
                                                Status
                                            </span>
                                        </th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b w-[10%]">Action</th>
                                        <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-b">Status</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                Loading...
                                            </td>
                                        </tr>
                                    ) : paginatedData.length > 0 ? (
                                        paginatedData.map((user, index) => (
                                            <tr key={index} className="text-gray-700">
                                                <td className="px-3 py-2 text-center">{user.Username}</td>
                                                <td className="px-3 py-2 text-center">{user.SupplierCode}</td>
                                                <td className="px-3 py-2 text-center">{user.Name}</td>
                                                <td className="px-3 py-2 text-center">{user.Role}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <Button
                                                        title={user.Status === 'Active' ? 'Deactivate' : 'Activate'}
                                                        icon={user.Status === 'Active' ? FaToggleOn : FaToggleOff}
                                                        onClick={() => handleStatusChange(user.UserID, user.Status === 'Active' ? 2 : 1, user.Username)}
                                                    />
                                                </td>
                                                <td className="px-3 py-2 text-center">
                                                    <Button
                                                        title="Edit"
                                                        icon={FaUserEdit}
                                                        onClick={() => handleEditPage(user.UserID)}
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="text-center py-4">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    <Pagination
                        totalRows={filteredData.length}  
                        rowsPerPage={rowsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />

                </div>
            </div>
        </>
    );
};

export default ManageUser;
