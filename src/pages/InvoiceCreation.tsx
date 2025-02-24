import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Pagination from '../components/Table/Pagination';
import InvoiceCreationWizard from './InvoiceCreationWizard';

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
    <div className="space-y-4">
      <Breadcrumb pageName="Invoice Creation" />
      <ToastContainer />
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center">
          <select
            className="w-full border border-gray-200 p-2 rounded-md text-xs"
            value={searchSupplier}
            onChange={(e) => setSearchSupplier(e.target.value)}
          >
            <option value="">Select Supplier</option>
            <option value="Supplier A">Supplier A</option>
            <option value="Supplier B">Supplier B</option>
            <option value="Supplier C">Supplier C</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Date</label>
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
      </form>

      <div className="flex justify-end items-center gap-4 mt-2">
        <button className="bg-purple-900 text-xs text-white px-8 py-2 rounded">Search</button>
        <button
          className="bg-white text-xs text-black px-8 py-2 rounded border border-gray-300"
          onClick={() => {
            setSearchSupplier('');
            setSearchQuery('');
          }}
        >
          Clear
        </button>
      </div>

      {/* Section for GR/SA Outstanding */}
      <h3 className="text-xl font-medium text-gray-700 mt-2">GR / SA Outstanding</h3>
      <div className="bg-white p-4 space-y-2 flex justify-between">
        <div className="overflow-x-auto shadow-md border rounded-lg w-2/3">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3.5 text-center border">Total Record(s)</th>
                <th className="px-3 py-3.5 text-center border">Currency</th>
                <th className="px-3 py-3.5 text-center border">Total Amount</th>
                <th className="px-3 py-3.5 text-center border">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-3 py-2 text-center">{grSaList.length}</td>
                <td className="px-3 py-2 text-center">{grSaList[0]?.currency || '-'}</td>
                <td className="px-3 py-2 text-center">{grSaList.reduce((sum, item) => sum + (item.totalAmount || 0), 0)}</td>
                <td className="px-3 py-2 text-center">Status message here</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-4 mr-20">
            <label className="w-1/4 text-sm font-medium text-gray-700">Selected Record(s)</label>
            <input
              type="text"
              className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs text-center"
              readOnly
              value={(Array.isArray(selectedRecords) ? selectedRecords.length : 0)}
            />
          </div>
          <div className="flex items-center gap-4 mr-20">
            <label className="w-1/4 text-sm font-medium text-gray-700">Total Amount</label>
            <input
              type="text"
              className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs text-center"
              readOnly
              value={(Array.isArray(selectedRecords) ? selectedRecords.reduce((sum, item) => sum + (item.totalAmount || 0), 0) : 0)}
            />
          </div>
        </div>
      </div>

      {/* Separate Section for GR/SA List */}
      <h3 className="text-xl font-medium text-gray-700">GR / SA List</h3>
      <div className="bg-white p-6 space-y-6 mt-8">
        <div className="flex justify-between mb-8">
          <div>
            <button className="bg-purple-900 text-white px-6 py-2 rounded">Invoice Upload</button>
            <button className="bg-purple-900 text-white px-6 py-2 rounded ml-4">Download GR/SA</button>
          </div>
          <div>
            <button
              className="bg-blue-800 text-white px-6 py-2 rounded"
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
                <th className="px-3 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                </th>
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
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedRecords.some(r => r.grSaNumber === item.grSaNumber)}
                      onChange={() => handleRecordSelection(item)}
                      className="cursor-pointer"
                    />
                  </td>
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