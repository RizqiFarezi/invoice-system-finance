import { useEffect, useState } from 'react';
import { toast} from 'react-toastify';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import SearchBar from '../components/Table/SearchBar';
import Pagination from '../components/Table/Pagination';
import { API_Inv_Line_Admin, API_List_Partner_Admin } from '../api/api';
import Select from "react-select";

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
    if (role === '3' && bpCode && bpName && bpAddress) {
      setSelectedSupplier(bpCode);
      setBusinessPartners([{
        bp_code: bpCode,
        bp_name: bpName,
        adr_line_1: bpAddress
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
      <Breadcrumb pageName="Good Receive Tracking Retrieval" />
      
      <div className="space-y-4">
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4">
          <label className="w-1/4 text-sm font-medium text-gray-700">Supplier Code</label>
          {userRole === "3" ? (
            // Read-only input for supplier role
            <input
              type="text"
              className="input w-2/3 border border-gray-200 p-2 rounded-md text-xs bg-gray-100"
              value={`${userBpCode} | ${businessPartners[0]?.bp_name || ""}`}
              readOnly
            />
          ) : (
            // React-Select untuk pemilihan supplier
            <div className="w-2/3">
              <Select
                options={businessPartners.map((partner) => ({
                  value: partner.bp_code,
                  label: `${partner.bp_code} | ${partner.bp_name}`,
                }))}
                value={
                  selectedSupplier
                    ? {
                        value: selectedSupplier,
                        label:
                          businessPartners.find((p) => p.bp_code === selectedSupplier)?.bp_name ||
                          "Select Supplier",
                      }
                    : null
                }
                onChange={(selectedOption) => setSelectedSupplier(selectedOption.value)}
                placeholder="Select Supplier"
                className="text-xs"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#E5E7EB", // Sama dengan border-gray-200
                    padding: "1px", // Sama dengan p-2
                    borderRadius: "6px", // Sama dengan rounded-md
                    fontSize: "13px", // Sama dengan text-xs
                  }),
                }}
              />
            </div>
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

      <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div></div> {/* Bagian kiri dibiarkan kosong agar tombol tetap di kanan */}
        <div className="flex justify-end gap-4 mr-4">
          <button className="bg-purple-900 text-sm text-white px-8 py-2 rounded hover:bg-purple-700">
            Search
          </button>
          <button
            className="bg-gray-200 text-sm text-black px-8 py-2 rounded hover:bg-gray-300"
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
        <div className="overflow-x-auto shadow-md border rounded-lg mb-6">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 uppercase">
              <tr>
                {/* Keep all existing table headers */}
                <th className="px-8 py-2 text-gray-700 text-center border">Supplier Code</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Supplier Name</th>
                <th className="px-8 py-2 text-gray-700 text-center border">GR/SA Number</th>
                <th className="px-8 py-2 text-gray-700 text-center border">GR/SA Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">GR/SA Item</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Number</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Category</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Item</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Invoice Number</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Tax Number</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Tax Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Payment Plan Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Payment Actual</th>
                <th className="px-8 py-2 text-gray-700 text-center border">DN Number</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Part No/Service Desc</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Material/Service Desc</th>
                <th className="px-8 py-2 text-gray-700 text-center border">UOM</th>
                <th className="px-8 py-2 text-gray-700 text-center border">GR QTY</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Price Per UOM</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Total Amount</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Vat Amount</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PPh22 Amount</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Currency</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Created by</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Created Date</th>
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
              <tr>
                <td colSpan={14} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
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