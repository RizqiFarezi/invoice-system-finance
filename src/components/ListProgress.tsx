import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import SearchBar from '../components/Table/SearchBar';
import Pagination from "./Table/Pagination";
import { API_Inv_Header_Admin } from '../api/api';

interface Invoice {
  inv_no: string;
  bp_code: string;
  bp_name: string;
  doc_date: string;
  po_number: string;
  total_amount: number;
  process_status: "In Process" | "Rejected" | "Paid" | "Ready to Payment" | "New";
  payment_plan_date: string;
}

const ListProgress: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchSupplier, setSearchSupplier] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState<Invoice[]>([]);
  const [filteredData, setFilteredData] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 5;

  // Fetch invoice header data
  const fetchInvoiceData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(API_Inv_Header_Admin(), {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice data');
      }

      const result = await response.json();
      console.log('Raw Invoice Data Response:', result);

      if (result && typeof result === 'object') {
        let invoiceList = [];

        if (Array.isArray(result.data)) {
          invoiceList = result.data;
        } else if (result.data && typeof result.data === 'object') {
          invoiceList = Object.values(result.data);
        } else if (Array.isArray(result)) {
          invoiceList = result;
        }

        if (invoiceList.length > 0) {
          setData(invoiceList);
          setFilteredData(invoiceList);
        } else {
          toast.warn('No invoice data found');
        }
      } else {
        throw new Error('Invalid response structure from API');
      }
    } catch (error) {
      console.error('Error fetching invoice data:', error);
      if (error instanceof Error) {
        toast.error(`Error fetching invoice data: ${error.message}`);
      } else {
        toast.error('Error fetching invoice data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchInvoiceData();
  }, []);

  // Filter data based on search and date inputs
  useEffect(() => {
    let filtered = [...data];

    if (fromDate && toDate) {
      filtered = filtered.filter(
        (item) => item.doc_date >= fromDate && item.doc_date <= toDate
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.po_number.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchSupplier) {
      filtered = filtered.filter((row) =>
        row.bp_name.toLowerCase().includes(searchSupplier.toLowerCase()) ||
        row.bp_code.toLowerCase().includes(searchSupplier.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  }, [fromDate, toDate, searchSupplier, searchQuery, data]);

  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    setSearchSupplier("");
    setSearchQuery("");
    fetchInvoiceData();
    setCurrentPage(1);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-black mb-4">List Progress</h2>
  
      {/* Filter & Search Section */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-end gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 w-48"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 w-48"
            />
          </div>
          <button
            onClick={handleRefresh}
            className="bg-purple-800 text-sm text-white px-6 py-2 rounded-lg hover:bg-blue-700 mt-1"
          >
            Refresh
          </button>
        </div>
  
        <div className="flex items-end gap-4 mt-6 w-80">
          <SearchBar
            placeholder="Search Supplier Code/Name..."
            onSearchChange={setSearchSupplier}
          />
        </div>
      </div>
  
      {/* Table Section */}
      <div className="overflow-x-auto shadow-md rounded-lg border">
        <table className="min-w-full divide-y divide-gray-200 text-center mx-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Invoice Number</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Supplier ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Supplier Name</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Doc Date</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">PO Number</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Total Amount</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Process Status</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-600">Payment Plan Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((invoice) => (
                <tr key={invoice.inv_no} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.inv_no}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.bp_code}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.bp_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.doc_date}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.po_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.total_amount.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-xs font-medium ${
                        invoice.process_status === "In Process"
                        ? "bg-yellow-200"
                        : invoice.process_status === "Rejected"
                        ? "bg-red-500"
                        : invoice.process_status === "Paid"
                        ? "bg-blue-900"
                        : invoice.process_status === "Ready to Payment"
                        ? "bg-green-400"
                        : "bg-blue-400"
                      }`}
                    >
                      {invoice.process_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{invoice.payment_plan_date}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        totalRows={filteredData.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListProgress;