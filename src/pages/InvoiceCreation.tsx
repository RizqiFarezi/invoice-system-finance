import { useEffect, useState } from 'react';
import { FaSortDown, FaSortUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Pagination from '../components/Table/Pagination';
import SearchBar from '../components/Table/SearchBar';
import SearchMonth from '../components/Table/SearchMonth';

const InvoiceCreation = () => {
  interface InvoiceCreation {
    noDN: string;
    noPO: string;
    createdDate: string;
    planDNDate: string;
    statusDN: string;
    progress: string;
  }

  const [data, setData] = useState<InvoiceCreation[]>([]);
  const [filteredData, setFilteredData] = useState<InvoiceCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  
  const navigate = useNavigate();

  // Dummy data
  const dummyData: InvoiceCreation[] = [
    { noDN: 'DN001', noPO: 'PO001', createdDate: '2025-01-01', planDNDate: '2025-01-05', statusDN: 'Delivered', progress: 'Completed' },
    { noDN: 'DN002', noPO: 'PO002', createdDate: '2025-01-02', planDNDate: '2025-01-06', statusDN: 'Pending', progress: 'In Progress' },
    { noDN: 'DN003', noPO: 'PO003', createdDate: '2025-01-03', planDNDate: '2025-01-07', statusDN: 'Delivered', progress: 'Completed' },
    { noDN: 'DN004', noPO: 'PO004', createdDate: '2025-01-04', planDNDate: '2025-01-08', statusDN: 'Shipped', progress: 'In Progress' },
  ];

  // Simulate fetching data
  const fetchInvoiceCreation = () => {
    setData(dummyData);
    setFilteredData(dummyData);
    setLoading(false);
  };

  useEffect(() => {
    fetchInvoiceCreation();

    const savedPage = localStorage.getItem('dn_current_page');
    if (savedPage) {
      setCurrentPage(parseInt(savedPage));
    }
  }, []);

  useEffect(() => {
    let filtered = [...data];

    // Filter by month using PO date
    if (selectedMonth) {
      filtered = filtered.filter((row) => row.createdDate.startsWith(selectedMonth));
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.noDN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.noPO.toLowerCase().includes(searchQuery.toLowerCase()) ||
        row.statusDN.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key as keyof InvoiceCreation];
        let bValue = b[sortConfig.key as keyof InvoiceCreation];

        if (typeof aValue === 'string') aValue = aValue.toLowerCase();
        if (typeof bValue === 'string') bValue = bValue.toLowerCase();

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [searchQuery, sortConfig, data, selectedMonth]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('dn_current_page', page.toString());
  };

  const handleSort = (key: keyof InvoiceCreation) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

    function handleDNNavigate(noDN: string): void {
        throw new Error('Function not implemented.');
    }

    function handlePONavigate(noPO: string): void {
        throw new Error('Function not implemented.');
    }

  return (
    <>
      <ToastContainer position="top-right" />
      <Breadcrumb pageName="Invoice Creation" />
      <div className="font-poppins bg-white text-black p-2 md:p-4 lg:p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Month</label>
            <SearchMonth selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
          </div>
          <div className="w-full md:w-1/3">
            <SearchBar
              placeholder="Search Invoice Creation here..."
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="relative overflow-hidden shadow-md rounded-lg border border-gray-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 w-[15%]">No. DN</th>
                  <th className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 w-[15%]">No. PO</th>
                  <th
                    className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 cursor-pointer w-[20%]"
                    onClick={() => handleSort('createdDate')}
                  >
                    <span className="flex items-center justify-center">
                      {sortConfig.key === 'createdDate' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="mr-1" /> : <FaSortDown className="mr-1" />
                      ) : (
                        <FaSortDown className="opacity-50 mr-1" />
                      )}
                      Created Date
                    </span>
                  </th>
                  <th
                    className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 cursor-pointer w-[20%]"
                    onClick={() => handleSort('planDNDate')}
                  >
                    <span className="flex items-center justify-center">
                      {sortConfig.key === 'planDNDate' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="mr-1" /> : <FaSortDown className="mr-1" />
                      ) : (
                        <FaSortDown className="opacity-50 mr-1" />
                      )}
                      Plan Delivery Date
                    </span>
                  </th>
                  <th
                    className="px-3 py-3.5 text-sm font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 cursor-pointer w-[15%]"
                    onClick={() => handleSort('statusDN')}
                  >
                    <span className="flex items-center justify-center">
                      {sortConfig.key === 'statusDN' ? (
                        sortConfig.direction === 'asc' ? <FaSortUp className="mr-1" /> : <FaSortDown className="mr-1" />
                      ) : (
                        <FaSortDown className="opacity-50 mr-1" />
                      )}
                      Status DN
                    </span>
                  </th>
                  <th className="px-3 py-3.5 text-xs font-bold text-gray-700 uppercase tracking-wider text-center border-x border-b border-gray-200 w-[15%]">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  Array.from({ length: rowsPerPage }).map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </td>
                    </tr>
                  ))
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleDNNavigate(row.noDN)}
                          className="text-blue-600 underline"
                        >
                          {row.noDN}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handlePONavigate(row.noPO)}
                          className="text-blue-600 underline"
                        >
                          {row.noPO}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">{row.createdDate}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">{row.planDNDate}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">{row.statusDN}</td>
                      <td className="px-3 py-3 text-center whitespace-nowrap">{row.progress}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-4 text-center text-gray-500">
                      No Invoice Creation available for now
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          totalRows={filteredData.length}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default InvoiceCreation;
