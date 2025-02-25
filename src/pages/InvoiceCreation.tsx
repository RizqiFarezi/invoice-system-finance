import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Pagination from '../components/Table/Pagination';
import InvoiceCreationWizard from './InvoiceCreationWizard';
import Select from "react-select";

interface GrSaRecord {
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

const InvoiceCreation = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState<GrSaRecord[]>([]);
  const [searchSupplier, setSearchSupplier] = useState('');
  const [grSaDate, setGrSaDate] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [poNumber, setPoNumber] = useState('');
  const [filteredData] = useState<GrSaRecord[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const grSaList: GrSaRecord[] = [
    {
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

  const handleRecordSelection = (record: GrSaRecord) => {
    setSelectedRecords((prev) => {
      const found = prev.find((r) => r.grSaNumber === record.grSaNumber);
      if (found) {
        return prev.filter((r) => r.grSaNumber !== record.grSaNumber);
      }
      return [...prev, record];
    });
  };

  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedRecords(grSaList);
    } else {
      setSelectedRecords([]);
    }
  };

  const handleInvoiceCreation = () => {
    if (selectedRecords.length === 0) {
      toast.error('Please select at least one record before continuing.');
      return;
    }
    setShowWizard(true);
  };

  const handleCancelInvoice = () => {
    toast.error('Invoice Cancelled');
  };

  const handleWizardClose = () => {
    setShowWizard(false);
  };

  const handleWizardFinish = () => {
    setShowWizard(false);
    toast.success('Invoice process completed!');
  };

  function setSearchQuery(_p0: string) {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="space-y-6">
      <Breadcrumb pageName="Invoice Creation" />
      <ToastContainer />
      <form className="space-y-4">

        <div className='flex space-x-4'>
        <div className="w-1/3 items-center">
        <Select
          options={[
            { value: "", label: "Select Supplier" },
            { value: "Supplier A", label: "Supplier A" },
            { value: "Supplier B", label: "Supplier B" },
            { value: "Supplier C", label: "Supplier C" },
          ]}
          value={{ value: searchSupplier, label: searchSupplier || "Select Supplier" }}
          onChange={(selectedOption) => setSearchSupplier(selectedOption.value)}
          className="w-full text-xs"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#E5E7EB", // Sama dengan border-gray-200
              padding: "1px", // Sama dengan p-2
              borderRadius: "6px", // Sama dengan rounded-md
              fontSize: "14px", // Sama dengan text-xs
              
            }),
          }}
        />
      </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Date</label>
          <input
            type="date"
            className="input w-3/4 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Date</label>
          <input
            type="date"
            className="input w-3/4 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        </div>

        <div className='flex space-x-4'>
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            className="input w-3/4 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----  ---------"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Number</label>
          <input
            type="text"
            className="input w-3/4 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----  ---------"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
          />
        </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            className="input w-3/4 border border-gray-200 p-2 rounded-md text-xs"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        </div>
      </form>

      <div className="flex justify-end items-center gap-4 ">
        <button className="bg-purple-900 text-sm text-white px-8 py-2 rounded hover:bg-purple-800">Search</button>
        <button
          className="bg-gray-200 text-sm text-black px-8 py-2 rounded border border-gray-200 hover:bg-gray-100"
          onClick={() => {
            setSearchSupplier('');
            setSearchQuery('');
          }}
        >
          Clear
        </button>
      </div>

      {/* Section for GR/SA Outstanding */}
      <h3 className="text-xl font-semibold text-gray-700 mb-2">GR / SA Outstanding</h3>
      <div className="bg-white p-6 flex flex-wrap md:flex-nowrap justify-between gap-4">
        {/* Table Section */}
        <div className="overflow-x-auto shadow-md border rounded-lg w-full md:w-2/3">
          <table className="w-full text-md text-left">
            <thead className="bg-purple-200">
              <tr>
                <th className="px-4 py-3 text-gray-700 text-center border">Total Record(s)</th>
                <th className="px-4 py-3 text-gray-700 text-center border">Currency</th>
                <th className="px-4 py-3 text-gray-700 text-center border">Total Amount</th>
                <th className="px-4 py-3 text-gray-700 text-center border">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 text-center">{grSaList.length}</td>
                <td className="px-3 py-2 text-center">{grSaList[0]?.currency || '-'}</td>
                <td className="px-3 py-2 text-center">
                  {grSaList.reduce((sum, item) => sum + (item.totalAmount || 0), 0)}
                </td>
                <td className="px-3 py-2 text-center">Status message here</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Input Section */}
        <div className="flex flex-col gap-4 w-full md:w-1/3">
          <div className="flex items-center gap-3">
            <label className="w-1/3 text-sm md:text-md font-medium text-gray-700">Selected Record(s)</label>
            <input
              type="text"
              className="w-2/3 border border-gray-300 p-2 rounded-md text-xs md:text-sm text-center"
              readOnly
              value={(Array.isArray(selectedRecords) ? selectedRecords.length : 0)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-1/3 text-sm md:text-md font-medium text-gray-700">Total Amount</label>
            <input
              type="text"
              className="w-2/3 border border-gray-300 p-2 rounded-md text-xs md:text-sm text-center"
              readOnly
              value={(Array.isArray(selectedRecords) ? selectedRecords.reduce((sum, item) => sum + (item.totalAmount || 0), 0) : 0)}
            />
          </div>
        </div>
      </div>

      {/* Separate Section for GR/SA List */}
      <h3 className="text-xl font-semibold text-gray-700">GR / SA List</h3>
      <div className="bg-white p-6 space-y-6">
        <div className="flex justify-between">
          <div>
            <button className="bg-purple-900 text-sm text-white px-6 py-2 rounded hover:bg-purple-800">Invoice Upload</button>
            <button className="bg-purple-900 text-sm text-white px-6 py-2 rounded hover:bg-purple-800 ml-4">Download GR/SA</button>
          </div>
          <div>
            <button
              className="bg-blue-900 text-sm text-white px-6 py-2 rounded hover:bg-blue-800"
              onClick={handleInvoiceCreation}
            >
              Invoice Creation
            </button>
            <button
              className="bg-red-600 text-sm text-white px-6 py-2 rounded hover:bg-red-500 ml-4"
              onClick={handleCancelInvoice}
            >
              Cancel Invoice
            </button>
          </div>
        </div>

        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 uppercase">
              <tr>
                <th className="px-3 py-2 text-center border">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
                <th className="px-6 py-2 text-gray-700 text-center border">DN Number</th>
                <th className="px-6 py-2 text-gray-700 text-center border">GR/SA Number</th>
                <th className="px-6 py-2 text-gray-700 text-center border">PO Number</th>
                <th className="px-6 py-2 text-gray-700 text-center border">PO Category</th>
                <th className="px-6 py-2 text-gray-700 text-center border">PO Date</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Currency</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Total Amount</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Invoice Number</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Supplier</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Created By</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Created Date</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Updated By</th>
                <th className="px-6 py-2 text-gray-700 text-center border">Updated Date</th>
              </tr>
            </thead>
            <tbody>
              {grSaList.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRecords.some(r => r.grSaNumber === item.grSaNumber)}
                      onChange={() => handleRecordSelection(item)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.dnNumber}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.grSaNumber}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.poNumber}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.poCategory}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.poDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.currency}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.totalAmount}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.invoiceNumber}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.supplier}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.createdBy}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.createdDate}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.updatedBy}</td>
                  <td className="px-3 py-2 text-sm text-gray-600 text-center">{item.updatedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalRows={filteredData.length}
          rowsPerPage={rowsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {showWizard && (
        <InvoiceCreationWizard
          onClose={handleWizardClose}
          onFinish={handleWizardFinish}
        />
      )}
    </div>
  );
};

export default InvoiceCreation;