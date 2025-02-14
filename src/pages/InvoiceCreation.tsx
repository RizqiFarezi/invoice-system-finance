import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify'; // Ensure react-toastify is installed
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb'; // Check path if necessary
import SearchBar from '../components/Table/SearchBar';

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

const InvoiceCreation = () => {
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

  const grSaList: GrSaRecord[] = [
    {
      transactionType: 'Purchase',
      dnNumber: 'DN001',
      grSaNumber: 'GRSA001',
      poNumber: 'PO001',
      poCategory: 'Category A',
      poDate: '2025-02-01',
      currency: 'USD',
      totalAmount: 500,
      invoiceNumber: 'INV001',
      supplier: 'Supplier A',
      createdBy: 'Admin',
      createdDate: '2025-02-01',
      updatedBy: 'Admin',
      updatedDate: '2025-02-01',
    },
    {
      transactionType: 'Return',
      dnNumber: 'DN002',
      grSaNumber: 'GRSA002',
      poNumber: 'PO002',
      poCategory: 'Category B',
      poDate: '2025-02-10',
      currency: 'EUR',
      totalAmount: 250,
      invoiceNumber: 'INV002',
      supplier: 'Supplier B',
      createdBy: 'Admin',
      createdDate: '2025-02-10',
      updatedBy: 'Admin',
      updatedDate: '2025-02-10',
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

  return (
    <div className="space-y-4">
      <Breadcrumb pageName="Invoice Creation" />
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
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Date</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="GR/SA Date"
            value={grSaDate}
            onChange={(e) => setGrSaDate(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="Invoice Number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="PO Number"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
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
          <label className="w-1/4 text-sm font-medium text-gray-700">Transaction Type</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="Transaction Type"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>
      </form>

      <div className="flex justify-end items-center gap-4 mt-2">
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

      {/* Section for GR/SA Outstanding */}
      <h3 className="text-xl font-medium text-gray-700 mt-4">GR / SA Outstanding</h3>
      <div className="bg-white p-6 space-y-2">
        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-center border">Transaction Type</th>
                <th className="px-3 py-3.5 text-center border">Supplier Code</th>
                <th className="px-3 py-3.5 text-center border">Supplier Name</th>
                <th className="px-3 py-3.5 text-center border">GR/SA Number</th>
                <th className="px-3 py-3.5 text-center border">Total Amount</th>
                <th className="px-3 py-3.5 text-center border">Currency</th>
              </tr>
            </thead>
            <tbody>
              {grSaList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">{item.transactionType}</td>
                  <td className="px-3 py-2 text-center">{item.supplier}</td>
                  <td className="px-3 py-2 text-center">{item.supplier}</td>
                  <td className="px-3 py-2 text-center">{item.grSaNumber}</td>
                  <td className="px-3 py-2 text-center">{item.totalAmount}</td>
                  <td className="px-3 py-2 text-center">{item.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Separate Section for GR/SA List */}
      <h3 className="text-xl font-medium text-gray-700">GR / SA List</h3>
      <div className="bg-white p-6 space-y-6 mt-8">
        <div className="flex justify-between mb-8">
          <div>
            <button className="bg-red-500 text-white px-6 py-2 rounded">Invoice Upload</button>
            <button className="bg-red-500 text-white px-6 py-2 rounded ml-4">Download GR/SA</button>
          </div>
          <div>
            <button
              className="bg-blue-900 text-white px-6 py-2 rounded"
              onClick={handleInvoiceCreation}
            >
              Invoice Creation
            </button>
            <button
              className="bg-red-600 text-white px-6 py-2 rounded ml-4"
              onClick={handleCancelInvoice}
            >
              Cancel Invoice
            </button>
          </div>
        </div>
        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-center">Transaction Type</th>
              <th className="px-3 py-2 text-center">DN Number</th>
              <th className="px-3 py-2 text-center">GR/SA Number</th>
              <th className="px-3 py-2 text-center">PO Number</th>
              <th className="px-3 py-2 text-center">PO Category</th>
              <th className="px-3 py-2 text-center">PO Date</th>
              <th className="px-3 py-2 text-center">Currency</th>
              <th className="px-3 py-2 text-center">Total Amount</th>
              <th className="px-3 py-2 text-center">Invoice Number</th>
              <th className="px-3 py-2 text-center">Supplier</th>
              <th className="px-3 py-2 text-center">Created By</th>
              <th className="px-3 py-2 text-center">Created Date</th>
              <th className="px-3 py-2 text-center">Updated By</th>
              <th className="px-3 py-2 text-center">Updated Date</th>
            </tr>
          </thead>

            <tbody>
              {grSaList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">{item.transactionType}</td>
                  <td className="px-3 py-2 text-center">{item.dnNumber}</td>
                  <td className="px-3 py-2 text-center">{item.grSaNumber}</td>
                  <td className="px-3 py-2 text-center">{item.poNumber}</td>
                  <td className="px-3 py-2 text-center">{item.poCategory}</td>
                  <td className="px-3 py-2 text-center">{item.poDate}</td>
                  <td className="px-3 py-2 text-center">{item.currency}</td>
                  <td className="px-3 py-2 text-center">{item.totalAmount}</td>
                  <td className="px-3 py-2 text-center">{item.invoiceNumber}</td>
                  <td className="px-3 py-2 text-center">{item.supplier}</td>
                  <td className="px-3 py-2 text-center">{item.createdBy}</td>
                  <td className="px-3 py-2 text-center">{item.createdDate}</td>
                  <td className="px-3 py-2 text-center">{item.updatedBy}</td>
                  <td className="px-3 py-2 text-center">{item.updatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceCreation;
