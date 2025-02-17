import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import SearchBar from '../components/Table/SearchBar';
import Pagination from '../components/Table/Pagination';

const GrTracking = () => {
  interface GrTracking {
    transactionType: string;
    supplierCode: string;
    supplierName: string;
    grNumber: string;
    grDate: string;
    poNumber: string;
    invoiceNumber: string;
    taxNumber: string;
    taxDate: string;
    paymentPlanDate: string;
    paymentActual: string;
    dnNumber: string;
    partNumber: string;
    materialDesc: string;
    uom: string;
    grQty: number;
    pricePerUOM: number;
    totalAmount: number;
    vatAmount: number;
    currency: string;
    createdBy: string;
    createdDate: string;
  }

  const dummyData: GrTracking[] = [
    {
      transactionType: 'Purchase',
      supplierCode: 'SUP001',
      supplierName: 'Supplier One',
      grNumber: 'GR12345',
      grDate: '2025-02-10',
      poNumber: 'PO98765',
      invoiceNumber: 'INV0001',
      taxNumber: 'TAX1001',
      taxDate: '2025-02-12',
      paymentPlanDate: '2025-02-20',
      paymentActual: '2025-02-25',
      dnNumber: 'DN67890',
      partNumber: 'P001',
      materialDesc: 'Steel Plate',
      uom: 'KG',
      grQty: 50,
      pricePerUOM: 20,
      totalAmount: 1000,
      vatAmount: 100,
      currency: 'USD',
      createdBy: 'Admin',
      createdDate: '2025-02-05',
    },
    {
      transactionType: 'Purchase',
      supplierCode: 'SUP002',
      supplierName: 'Supplier Two',
      grNumber: 'GR67890',
      grDate: '2025-03-05',
      poNumber: 'PO54321',
      invoiceNumber: 'INV0002',
      taxNumber: 'TAX2002',
      taxDate: '2025-03-07',
      paymentPlanDate: '2025-03-15',
      paymentActual: '2025-03-18',
      dnNumber: 'DN23456',
      partNumber: 'P002',
      materialDesc: 'Aluminum Rod',
      uom: 'Meter',
      grQty: 100,
      pricePerUOM: 15,
      totalAmount: 1500,
      vatAmount: 150,
      currency: 'USD',
      createdBy: 'User1',
      createdDate: '2025-03-01',
    },
    {
      transactionType: 'Return',
      supplierCode: 'SUP003',
      supplierName: 'Supplier Three',
      grNumber: 'GR11223',
      grDate: '2025-04-01',
      poNumber: 'PO24680',
      invoiceNumber: 'INV0003',
      taxNumber: 'TAX3003',
      taxDate: '2025-04-03',
      paymentPlanDate: '2025-04-10',
      paymentActual: '2025-04-12',
      dnNumber: 'DN76543',
      partNumber: 'P003',
      materialDesc: 'Copper Wire',
      uom: 'Roll',
      grQty: 20,
      pricePerUOM: 50,
      totalAmount: 1000,
      vatAmount: 100,
      currency: 'USD',
      createdBy: 'User2',
      createdDate: '2025-04-01',
    },
    {
      transactionType: 'Purchase',
      supplierCode: 'SUP004',
      supplierName: 'Supplier Four',
      grNumber: 'GR33445',
      grDate: '2025-05-15',
      poNumber: 'PO13579',
      invoiceNumber: 'INV0004',
      taxNumber: 'TAX4004',
      taxDate: '2025-05-17',
      paymentPlanDate: '2025-05-25',
      paymentActual: '2025-05-28',
      dnNumber: 'DN98765',
      partNumber: 'P004',
      materialDesc: 'Plastic Resin',
      uom: 'KG',
      grQty: 200,
      pricePerUOM: 5,
      totalAmount: 1000,
      vatAmount: 100,
      currency: 'USD',
      createdBy: 'User3',
      createdDate: '2025-05-10',
    }
  ];
  
  const [data, setData] = useState<GrTracking[]>([]);
  const [filteredData, setFilteredData] = useState<GrTracking[]>([]);
  const [searchSupplier, setSearchSupplier] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10; // Set the number of rows per page

  // Fetch current page from localStorage on page load
  useEffect(() => {
    const savedPage = localStorage.getItem('dn_current_page');
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }
  }, []);

  useEffect(() => {
    setData(dummyData);
}, []);


  useEffect(() => {
    let filtered = [...data];

    // Filter based on supplier search
    if (searchSupplier) {
      filtered = filtered.filter(
        (row) =>
          row.supplierCode.toLowerCase().includes(searchSupplier.toLowerCase()) ||
          row.supplierName.toLowerCase().includes(searchSupplier.toLowerCase())
      );
    }
    

    // Additional query-based filtering
    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

  setFilteredData(filtered); // Set filtered data after search
  }, [searchSupplier, searchQuery, data]);

  // Paginate data based on current page and rows per page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('dn_current_page', String(page)); // Save page number to localStorage
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Breadcrumb pageName="Good Receive Tracking Retrieval" />
      
      {/* Good Receive Tracking Retrieval Form */}
      <div className="space-y-4">
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Supplier Code</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs" // Add rounded-md class for rounded corners
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Tax Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="PO Date"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Tax Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder=""
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Status</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="PO Date"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Date</label>
          <input
            type="date"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="PO Date"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Transaction Type</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">DN Number</label>
          <input
            type="text"
            className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
            placeholder="----------   ----"
          />
        </div>
      </form>
    </div>


      {/* Buttons */}
      <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-100">
        <div className="flex gap-4 ml-auto"> {/* Adjusted gap to 4 for more space */}
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
      </div>

      {/* Search dan Table */}
      <div className="bg-white p-6 space-y-6">
      <div className="w-70">
        <SearchBar
          placeholder="Search Supplier Code/Name..."
          onSearchChange={setSearchSupplier}
          className="w-full px-3 py-2 text-sm border rounded-lg"
        />
      </div>
        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-left">
          <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-3.5 text-center">Transaction Type</th>
            <th className="px-3 py-3.5 text-center">Supplier Code</th>
            <th className="px-3 py-3.5 text-center">Supplier Name</th>
            <th className="px-3 py-3.5 text-center">GR/SA Number</th>
            <th className="px-3 py-3.5 text-center">GR/SA Date</th>
            <th className="px-3 py-3.5 text-center">GR/SA Item</th>
            <th className="px-3 py-3.5 text-center">PO Number</th>
            <th className="px-3 py-3.5 text-center">PO Category</th>
            <th className="px-3 py-3.5 text-center">PO Item</th>
            <th className="px-3 py-3.5 text-center">Invoice Number</th>
            <th className="px-3 py-3.5 text-center">Tax Number</th>
            <th className="px-3 py-3.5 text-center">Tax Date</th>
            <th className="px-3 py-3.5 text-center">Payment Plan Date</th>
            <th className="px-3 py-3.5 text-center">Payment Actual</th>
            <th className="px-3 py-3.5 text-center">DN Number</th>
            <th className="px-3 py-3.5 text-center">Part No/Service Desc</th>
            <th className="px-3 py-3.5 text-center">Material/Service Desc</th>
            <th className="px-3 py-3.5 text-center">UOM</th>
            <th className="px-3 py-3.5 text-center">GR QTY</th>
            <th className="px-3 py-3.5 text-center">Price Per UOM</th>
            <th className="px-3 py-3.5 text-center">Total Amount</th>
            <th className="px-3 py-3.5 text-center">Vat Amount</th>
            <th className="px-3 py-3.5 text-center">PPh22 Amount</th>
            <th className="px-3 py-3.5 text-center">Currency</th>
            <th className="px-3 py-3.5 text-center">Created by</th>
            <th className="px-3 py-3.5 text-center">Created Date</th>
      </tr>
          </thead>

          <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2 text-center">{item.transactionType}</td>
              <td className="px-3 py-2 text-center">{item.supplierCode}</td>
              <td className="px-3 py-2 text-center">{item.supplierName}</td>
              <td className="px-3 py-2 text-center">{item.grNumber}</td>
              <td className="px-3 py-2 text-center">{item.grDate}</td>
              <td className="px-3 py-2 text-center">{item.grItem}</td>
              <td className="px-3 py-2 text-center">{item.poNumber}</td>
              <td className="px-3 py-2 text-center">{item.poCategory}</td>
              <td className="px-3 py-2 text-center">{item.poItem}</td>
              <td className="px-3 py-2 text-center">{item.invoiceNumber}</td>
              <td className="px-3 py-2 text-center">{item.taxNumber}</td>
              <td className="px-3 py-2 text-center">{item.taxDate}</td>
              <td className="px-3 py-2 text-center">{item.paymentPlanDate}</td>
              <td className="px-3 py-2 text-center">{item.paymentActual}</td>
              <td className="px-3 py-2 text-center">{item.dnNumber}</td>
              <td className="px-3 py-2 text-center">{item.partNoServiceDesc}</td>
              <td className="px-3 py-2 text-center">{item.materialServiceDesc}</td>
              <td className="px-3 py-2 text-center">{item.uom}</td>
              <td className="px-3 py-2 text-center">{item.grQty}</td>
              <td className="px-3 py-2 text-center">{item.pricePerUom}</td>
              <td className="px-3 py-2 text-center">{item.totalAmount}</td>
              <td className="px-3 py-2 text-center">{item.vatAmount}</td>
              <td className="px-3 py-2 text-center">{item.pph22Amount}</td>
              <td className="px-3 py-2 text-center">{item.currency}</td>
              <td className="px-3 py-2 text-center">{item.createdBy}</td>
              <td className="px-3 py-2 text-center">{item.createdDate}</td>
            </tr>
          ))}
        </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalRows={filteredData.length}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default GrTracking;