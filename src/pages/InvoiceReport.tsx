import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify'; // Ensure react-toastify is installed
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'; // Check path if necessary
import SearchBar from '../components/Table/SearchBar';
import Pagination from '../components/Table/Pagination';

interface GrSaRecord {
  transactionType: string;
  dnNumber: string;
  grSaNumber: string;
  poNumber: string;
  poCategory: string;
  poDate: string;
  currency: string;
  totalAmount: number;
  invoiceNumber: string;
  supplier: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
}

interface SearchBarProps {
  placeholder: string;
  onSearchChange: (value: string) => void;
}

const InvoiceReport = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [poDate, setPoDate] = useState<string>('');
  const [poNumber, setPoNumber] = useState<string>('');
  const [grSaDate, setGrSaDate] = useState<string>('');
  const [selectedRecords, setSelectedRecords] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [searchSupplier, setSearchSupplier] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoPosting, setAutoPosting] = useState(false);
  const [filteredData, setFilteredData] = useState<GrSaRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const grSaOutstanding: GrSaRecord[] = [
    {
      transactionType: 'Purchase',
      invoiceNumber: 'INV001',
      invoiceDate: '2025-02-02',
      supplierCode: 'SUP001',
      supplierName: 'Supplier A',
      currency: 'USD',
      totalInvoiceAmount: 500,
      amountBeforeTax: 450,
      invoiceStatus: 'Approved',
      progressStatus: 'Processing',
      paymentDatePlan: '2025-02-15',
      paymentDateActual: '2025-02-16',
      taxNumber: 'TAX001',
      taxAmount: 50,
    },
    {
      transactionType: 'Return',
      invoiceNumber: 'INV002',
      invoiceDate: '2025-02-11',
      supplierCode: 'SUP002',
      supplierName: 'Supplier B',
      currency: 'EUR',
      totalInvoiceAmount: 250,
      amountBeforeTax: 225,
      invoiceStatus: 'Pending',
      progressStatus: 'Awaiting Approval',
      paymentDatePlan: '2025-02-20',
      paymentDateActual: '2025-02-21',
      taxNumber: 'TAX002',
      taxAmount: 25,
    },
  ];  

  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions, (option) => option.value);
    setSelectedSuppliers(selectedOptions);
  };

  const handleTransactionTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.selectedOptions;
    const values = Array.from(options, (option) => option.value);
    setTransactionTypes(values);
  };

  const handleRecordSelection = (record: GrSaRecord) => {
    setSelectedRecords((prev) => prev + 1);
    setTotalAmount((prev) => prev + record.totalAmount);
  };

  const handleInvoiceCreation = () => {
    // Logic for invoice creation
    alert('Invoice Created');
  };

  const handleCancelInvoice = () => {
    // Logic for canceling invoice
    alert('Invoice Cancelled');
  };

  const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onSearchChange }) => {
    return (
      <input
        type="text"
        className="w-full border border-gray-200 p-2 rounded-md text-xs"
        placeholder={placeholder}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    );
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('dn_current_page', String(page)); // Save page number to localStorage
  };
  
  return (
    <div className="space-y-4">
      <Breadcrumb pageName="Invoice Report" />
      <ToastContainer />
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Select Supplier */}
          <div className="flex gap-4 w-full">
            <select
              className="w-full border border-gray-200 p-2 rounded-md text-xs"
              value={searchSupplier}
              onChange={(e) => setSearchSupplier(e.target.value)}
            >
              <option value="">Select Supplier</option>
              {/* Replace these with actual supplier options */}
              <option value="Supplier A">Supplier A</option>
              <option value="Supplier B">Supplier B</option>
              <option value="Supplier C">Supplier C</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Creation Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="------------  ----"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Verification Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Status</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="------------  ----"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Transaction Type</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="------------  ----"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Payment Planning Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-4">
        <label className="w-1/4 text-sm font-medium text-gray-700">Auto Posting</label>
        <button
          type="button"
          className={`w-5 h-5 flex items-center justify-center border rounded-md text-gray-700 ${
            autoPosting ? "bg-blue-600 text-white" : "bg-white"
          }`}
          onClick={() => setAutoPosting(!autoPosting)}
        >
          {autoPosting ? "✔" : ""}
        </button>
      </div>
      </form>

      <div className="flex justify-end items-center gap-4 mt-6 mb-2">          
          <button className="bg-red-600 text-xs text-white px-8 py-2 rounded">Search</button>
          <button
            className="bg-white text-xs text-black px-8 py-2 rounded border border-gray-300"
            onClick={() => {
              setSearchSupplier('');
              setSearchQuery(''); // Clear both search fields
            }}
          >
            Clear
          </button>
      </div>

      {/* Separate Section for GR/SA Outstanding */}
      <h3 className="text-xl font-medium text-gray-700">GR / SA Outstanding</h3>
      <div className="bg-white p-6 space-y-6 mt-8">
        <div className="flex justify-between mb-8">
          <div>
            <button className="bg-red-600 text-white px-6 py-2 rounded">Cancel Invoice</button>
          </div>
          <div>
            <button
              className="bg-red-500 text-white px-6 py-2 rounded"
              onClick={handleInvoiceCreation}
            >
              Download Attachement
            </button>
            <button
              className="bg-green-600 text-white px-6 py-2 rounded ml-4"
              onClick={handleCancelInvoice}
            >
              Verify
            </button>
            <button
              className="bg-blue-900 text-white px-6 py-2 rounded ml-4"
              onClick={handleCancelInvoice}
            >
              Post Invoice
            </button>
          </div>
        </div>
        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-center">
              </th>
              <th className="px-3 py-2 text-center">Transaction Type</th>
              <th className="px-3 py-2 text-center">Invoice Number</th>
              <th className="px-3 py-2 text-center">Invoice Date</th>
              <th className="px-3 py-2 text-center">Supplier Code</th>
              <th className="px-3 py-2 text-center">Supplier Name</th>
              <th className="px-3 py-2 text-center">Currency</th>
              <th className="px-3 py-2 text-center">Total Invoice Amount</th>
              <th className="px-3 py-2 text-center">Amount Before Tax</th>
              <th className="px-3 py-2 text-center">Invoice Status</th>
              <th className="px-3 py-2 text-center">Progress Status</th>
              <th className="px-3 py-2 text-center" colSpan="2">Payment Date</th>
              <th className="px-3 py-2 text-center">Tax Number</th>
              <th className="px-3 py-2 text-center">Tax Amount</th>
            </tr>
            <tr className="bg-gray-50">
              <th colSpan="11"></th>
              <th className="px-3 py-2 text-center">Plan </th>
              <th className="px-3 py-2 text-center">Actual</th>
              <th colSpan="2"></th>
            </tr>
          </thead>

            <tbody>
              {grSaOutstanding.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">
                    <input type="checkbox" />
                    </td>
                    <td className="px-3 py-2 text-center">{item.transactionType}</td>
                    <td className="px-3 py-2 text-center">{item.invoiceNumber}</td>
                    <td className="px-3 py-2 text-center">{item.invoiceDate}</td>
                    <td className="px-3 py-2 text-center">{item.supplierCode}</td>
                    <td className="px-3 py-2 text-center">{item.supplierName}</td>
                    <td className="px-3 py-2 text-center">{item.currency}</td>
                    <td className="px-3 py-2 text-center">{item.totalInvoiceAmount}</td>
                    <td className="px-3 py-2 text-center">{item.amountBeforeTax}</td>
                    <td className="px-3 py-2 text-center">{item.invoiceStatus}</td>
                    <td className="px-3 py-2 text-center">{item.progressStatus}</td>
                    <td className="px-3 py-2 text-center">{item.paymentDatePlan}</td>
                    <td className="px-3 py-2 text-center">{item.paymentDateActual}</td>
                    <td className="px-3 py-2 text-center">{item.taxNumber}</td>
                    <td className="px-3 py-2 text-center">{item.taxAmount}</td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default InvoiceReport;