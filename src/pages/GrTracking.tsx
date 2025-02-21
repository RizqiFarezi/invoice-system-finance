import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import SearchBar from '../components/Table/SearchBar';
import Pagination from '../components/Table/Pagination';
import { API_Inv_Line_Admin, API_List_Partner_Admin } from '../api/api';

interface BusinessPartner {
  bp_code: string;
  bp_name: string;
  adr_line_1: string;
}

interface GrTracking {
  grItem: string;
  poCategory: string;
  poItem: string;
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

const GrTracking = () => {
  const [data, setData] = useState<GrTracking[]>([]);
  const [filteredData, setFilteredData] = useState<GrTracking[]>([]);
  const [businessPartners, setBusinessPartners] = useState<BusinessPartner[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [searchSupplier, setSearchSupplier] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string>('');
  const [userBpCode, setUserBpCode] = useState<string>('');
  const rowsPerPage = 10;

  // Get user role and bp_code on mount
  useEffect(() => {
    const role = localStorage.getItem('role');
    const bpCode = localStorage.getItem('bp_code');
    const bpName = localStorage.getItem('bp_name');
    const bpAddress = localStorage.getItem('adr_line_1');

    setUserRole(role || '');
    setUserBpCode(bpCode || '');

    // If supplier role, set their bp_code as selected and add to business partners
    if (role === '3' && bpCode) {
      setSelectedSupplier(bpCode);
      setBusinessPartners([{
        bp_code: bpCode,
        bp_name: bpName || '',
        adr_line_1: bpAddress || ''
      }]);
    }
  }, []);

  // Fetch business partners
  useEffect(() => {
    const fetchBusinessPartners = async () => {
      if (userRole === '3') {
        return;
      }
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(API_List_Partner_Admin(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch business partners');
        }
    
        const result = await response.json();
        console.log('Raw Business Partners Response:', result);
    
        if (result && typeof result === 'object') {
          let partnersList = [];
    
          if (result.bp_code && result.bp_name && result.adr_line_1) {
            partnersList = [{
              bp_code: result.bp_code,
              bp_name: result.bp_name,
              adr_line_1: result.adr_line_1,
            }];
          }
          else if (Array.isArray(result.data)) {
            partnersList = result.data.map((partner: BusinessPartner) => ({
              bp_code: partner.bp_code,
              bp_name: partner.bp_name,
              adr_line_1: partner.adr_line_1,
            }));
          }
          else if (result.data && typeof result.data === 'object') {
            partnersList = Object.values(result.data).map((partner: any) => ({
              bp_code: partner.bp_code,
              bp_name: partner.bp_name,
              adr_line_1: partner.adr_line_1,
            }));
          }
          else if (Array.isArray(result)) {
            partnersList = result.map((partner: BusinessPartner) => ({
              bp_code: partner.bp_code,
              bp_name: partner.bp_name,
              adr_line_1: partner.adr_line_1,
            }));
          }
    
          if (partnersList.length > 0) {
            setBusinessPartners(partnersList);
          } else {
            toast.warn('No business partners found in the response');
          }
        } else {
          throw new Error('Invalid response structure from API');
        }
      } catch (error) {
        console.error('Error fetching business partners:', error);
        if (error instanceof Error) {
          toast.error(`Error fetching business partners: ${error.message}`);
        } else {
          toast.error('Error fetching business partners');
        }
      }
    };
  
    fetchBusinessPartners();
  }, [userRole]);

  // Fetch inv line data with improved error handling
  useEffect(() => {
    const fetchInvLineData = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const response = await fetch(API_Inv_Line_Admin(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch invoice line data');
        }
    
        const result = await response.json();
        console.log('Raw Invoice Line Response:', result);
    
        if (result && typeof result === 'object') {
          let invLineList = [];
    
          if (Array.isArray(result.data)) {
            invLineList = result.data;
          }
          else if (result.data && typeof result.data === 'object') {
            invLineList = Object.values(result.data);
          }
          else if (Array.isArray(result)) {
            invLineList = result;
          }
    
          if (invLineList.length > 0) {
            setData(invLineList);
            setFilteredData(invLineList);
          } else {
            toast.warn('No invoice line data found in the response');
          }
        } else {
          throw new Error('Invalid response structure from API');
        }
      } catch (error) {
        console.error('Error fetching invoice line data:', error);
        if (error instanceof Error) {
          toast.error(`Error fetching invoice line data: ${error.message}`);
        } else {
          toast.error('Error fetching invoice line data');
        }
      }
    };

    fetchInvLineData();

    const savedPage = localStorage.getItem('dn_current_page');
    if (savedPage) {
      setCurrentPage(Number(savedPage));
    }
  }, []);

  useEffect(() => {
    let filtered = [...data];

    if (searchSupplier) {
      filtered = filtered.filter(
        (row) =>
          row.supplierCode.toLowerCase().includes(searchSupplier.toLowerCase()) ||
          row.supplierName.toLowerCase().includes(searchSupplier.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.poNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSupplier) {
      filtered = filtered.filter(row => row.supplierCode === selectedSupplier);
    }

    setFilteredData(filtered);
  }, [searchSupplier, searchQuery, selectedSupplier, data]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    localStorage.setItem('dn_current_page', String(page));
  };

  const handleClear = () => {
    if (userRole !== '3') {
      setSelectedSupplier('');
    }
    setSearchSupplier('');
    setSearchQuery('');
  };

  return (
    <>
      <ToastContainer position="top-right" />
      <Breadcrumb pageName="Good Receive Tracking Retrieval" />
      
      <div className="space-y-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Supplier Code</label>
            {userRole === '3' ? (
              // Read-only input for supplier role
              <input
                type="text"
                className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs bg-gray-100"
                value={`${userBpCode} | ${businessPartners[0]?.bp_name || ''}`}
                readOnly
              />
            ) : (
              // Regular select for other roles
              <select
                className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <option value="">Select Supplier</option>
                {businessPartners.map((partner) => (
                  <option key={partner.bp_code} value={partner.bp_code}>
                    {partner.bp_code} | {partner.bp_name}
                  </option>
                ))}
              </select>
            )}
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
              value={businessPartners.find(p => p.bp_code === selectedSupplier)?.adr_line_1 || ''}
              readOnly
              placeholder="----------   ----"
            />
          </div>

          {/* Keep all existing form fields */}
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
            <label className="w-1/4 text-sm font-medium text-gray-700">DN Number</label>
            <input
              type="text"
              className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs"
              placeholder="----------   ----"
            />
          </div>
        </form>
      </div>

      <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between gap-100">
        <div className="flex gap-4 ml-auto">
          <button className="bg-purple-700 text-xs text-white px-8 py-2 rounded">Search</button>
          <button
            className="bg-white text-xs text-black px-8 py-2 rounded border border-gray-300"
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white p-6 space-y-6">
        <div className="w-70">
          <SearchBar
            placeholder="Search Supplier Code/Name..."
            onSearchChange={setSearchSupplier}
          />
        </div>
        <div className="overflow-x-auto shadow-md border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                {/* Keep all existing table headers */}
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
                  <td className="px-3 py-2 text-center">{item.partNumber}</td>
                  <td className="px-3 py-2 text-center">{item.materialDesc}</td>
                  <td className="px-3 py-2 text-center">{item.uom}</td>
                  <td className="px-3 py-2 text-center">{item.grQty}</td>
                  <td className="px-3 py-2 text-center">{item.pricePerUOM}</td>
                  <td className="px-3 py-2 text-center">{item.totalAmount}</td>
                  <td className="px-3 py-2 text-center">{item.vatAmount}</td>
                  <td className="px-3 py-2 text-center">{item.currency}</td>
                  <td className="px-3 py-2 text-center">{item.createdBy}</td>
                  <td className="px-3 py-2 text-center">{item.createdDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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