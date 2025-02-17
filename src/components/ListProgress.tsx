import React, { useState, useEffect } from "react";
// import Pagination from '../../../../components/Table/Pagination';
import SearchBar from '../components/Table/SearchBar';
import Pagination from "./Table/Pagination";

interface Invoice {
  invoiceNumber: string;
  supplierId: string;
  supplierName: string;
  docDate: string;
  poNumber: string;
  totalAmount: number;
  processStatus: "In Process" | "Rejected" | "Paid" | "Ready to Payment";
  paymentPlanDate: string;
}

const dummyData: Invoice[] = [
  { invoiceNumber: "INV001", supplierId: "SUP001", supplierName: "Supplier A", docDate: "2025-02-10", poNumber: "PO001", totalAmount: 500000, processStatus: "In Process", paymentPlanDate: "2025-02-20" },
  { invoiceNumber: "INV002", supplierId: "SUP002", supplierName: "Supplier B", docDate: "2025-02-11", poNumber: "PO002", totalAmount: 750000, processStatus: "Paid", paymentPlanDate: "2025-02-22" },
  { invoiceNumber: "INV003", supplierId: "SUP003", supplierName: "Supplier C", docDate: "2025-02-12", poNumber: "PO003", totalAmount: 600000, processStatus: "Ready to Payment", paymentPlanDate: "2025-02-25" },
  { invoiceNumber: "INV004", supplierId: "SUP004", supplierName: "Supplier D", docDate: "2025-02-13", poNumber: "PO004", totalAmount: 900000, processStatus: "Rejected", paymentPlanDate: "2025-02-28" },
  { invoiceNumber: "INV005", supplierId: "SUP005", supplierName: "Supplier E", docDate: "2025-02-14", poNumber: "PO005", totalAmount: 820000, processStatus: "In Process", paymentPlanDate: "2025-03-01" },
  { invoiceNumber: "INV006", supplierId: "SUP006", supplierName: "Supplier F", docDate: "2025-02-15", poNumber: "PO006", totalAmount: 650000, processStatus: "Paid", paymentPlanDate: "2025-03-02" },
];

const ListProgress: React.FC = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [searchSupplier, setSearchSupplier] = useState(""); // Tambahkan searchSupplier
  const [searchQuery, setSearchQuery] = useState(""); // Tambahkan searchQuery
  const [filteredData, setFilteredData] = useState<Invoice[]>(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 3;

  useEffect(() => {
    let filtered = dummyData;

    if (fromDate && toDate) {
      filtered = filtered.filter(
        (item) => item.docDate >= fromDate && item.docDate <= toDate
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (searchSupplier) {
      filtered = filtered.filter((row) =>
        row.supplierName.toLowerCase().includes(searchSupplier.toLowerCase()) ||
        row.supplierId.toLowerCase().includes(searchSupplier.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset ke halaman pertama setelah filter berubah
  }, [fromDate, toDate, searchSupplier, searchQuery]);

  const handleRefresh = () => {
    setFromDate("");
    setToDate("");
    setSearchSupplier("");
    setSearchQuery("");
    setFilteredData(dummyData);
    setCurrentPage(1);
  };

  // Hitung data yang akan ditampilkan dalam pagination
  const totalRows = filteredData.length;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-black mb-4">List Progress</h2>
  
      {/* Filter & Search Section & Refresh */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Bagian Date Filter */}
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
          {/* Tombol Refresh */}
          <button
            onClick={handleRefresh}
            className="bg-red-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 mt-1 "
          >
            Refresh
          </button>
        </div>
  
        {/* Bagian Search Filter */}
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
            {paginatedData.length > 0 ? (
                paginatedData.map((invoice) => (
                <tr key={invoice.invoiceNumber} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.invoiceNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.supplierId}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.supplierName}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.docDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.poNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.totalAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-white text-xs font-medium ${
                          invoice.processStatus === "In Process"
                          ? "bg-yellow-300"
                          : invoice.processStatus === "Rejected"
                          ? "bg-red-400"
                          : invoice.processStatus === "Paid"
                          ? "bg-green-500"
                          : "bg-blue-400"
                      }`}
                    >
                      {invoice.processStatus}
                    </span>
                  </td>
                    <td className="px-6 py-4 text-sm text-gray-800">{invoice.paymentPlanDate}</td>
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

      {/* Pagination Component */}
      <Pagination
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default ListProgress;
