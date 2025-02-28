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
  po_no: string;
  bp_id: string;
  bp_name: string;
  currency: string;
  po_type: string;
  po_reference: string;
  po_line: string;
  po_sequence: string;
  po_receipt_sequence: string;
  actual_receipt_date: string;
  actual_receipt_year: string;
  actual_receipt_period: string;
  receipt_no: string;
  receipt_line: string;
  gr_no: string;
  packing_slip: string;
  item_no: string;
  ics_code: string;
  ics_part: string;
  part_no: string;
  item_desc: string;
  item_group: string;
  item_type: string;
  item_type_desc: string;
  request_qty: number;
  actual_receipt_qty: number;
  approve_qty: number;
  unit: string;
  receipt_amount: number;
  receipt_unit_price: number;
  is_final_receipt: boolean;
  is_confirmed: boolean;
  inv_doc_no: string;
  inv_doc_date: string;
  inv_qty: number;
  inv_amount: number;
  inv_supplier_no: string;
  inv_due_date: string;
  payment_doc: string;
  payment_doc_date: string;
  created_at: string;
  updated_at: string;
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
          row.bp_id.toLowerCase().includes(searchSupplier.toLowerCase()) ||
          row.bp_name.toLowerCase().includes(searchSupplier.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((row) =>
        row.po_no.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSupplier) {
      filtered = filtered.filter(row => row.bp_id === selectedSupplier);
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
  <div className="space-y-6">
    <Breadcrumb pageName="Good Receive Tracking Retrieval" />
    <form className="space-y-4">
      {/* Row 1 */}
      <div className='flex space-x-4'>
        <div className="w-1/3 items-center">
          {userRole === "3" ? (
            <input
              type="text"
              className="input w-full border border-purple-200 p-2 rounded-md text-xs bg-gray-100"
              value={`${userBpCode} | ${businessPartners[0]?.bp_name || ""}`}
              readOnly
            />
          ) : (
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
              onChange={(selectedOption) => selectedOption && setSelectedSupplier(selectedOption.value)}
              placeholder="Select Supplier"
              className="w-full text-xs "
              styles={{
                control: (base) => ({
                  ...base,
                  borderColor: "#9867C5",
                  padding: "1px",
                  borderRadius: "6px",
                  fontSize: "14px",
                }),
              }}
            />
          )}
        </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Number</label>
          <input
            type="text"
            className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
            placeholder="---------- ----"
          />
        </div>

        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Tax Number</label>
          <input
            type="text"
            className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
            placeholder="---------- ----"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className='flex space-x-4'>
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Supplier Name</label>
          <input
            type="text"
            className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
            value={businessPartners.find(p => p.bp_code === selectedSupplier)?.adr_line_1 || ''}
            readOnly
          />
        </div>
        
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">GR / SA Date</label>
          <input type="date" className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs" />
        </div>
        
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Tax Date</label>
          <input type="date" className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs" />
        </div>
      </div>
      
      {/* Row 3 */}
      <div className='flex space-x-4'>
        <div className="flex w-1/3 items-center gap-2">
        <label className="w-1/4 text-sm font-medium text-gray-700">PO Number</label>
        <input
          type="text"
          placeholder="---------- ----"
          className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
        />
        </div>

        <div className="flex w-1/3 items-center gap-2">
        <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Number</label>
        <input
          type="text"
          placeholder="---------- ----"
          className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
        />
        </div>
        
        <div className="flex w-1/3 items-center gap-2">
        <label className="w-1/4 text-sm font-medium text-gray-700">Status</label>
        <input
          type="text"
          placeholder="---------- ----"
          className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
        />
        </div>
      </div>
      
      {/* Row 4 */}
      <div className='flex space-x-4'>
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">PO Date</label>
          <input type="date" className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs" />
        </div>
        
        <div className="flex w-1/3 items-center gap-2">
          <label className="w-1/4 text-sm font-medium text-gray-700">Invoice Date</label>
          <input type="date" className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs" />
        </div>
        
        <div className="flex w-1/3 items-center gap-2">
        <label className="w-1/4 text-sm font-medium text-gray-700">DN Number</label>
        <input
          type="text"
          placeholder="---------- ----"
          className="input w-3/4 border border-violet-200 p-2 rounded-md text-xs"
        />
        </div>
      </div>
    </form>

      <div className="my-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div></div> {/* Bagian kiri dibiarkan kosong agar tombol tetap di kanan */}
        <div className="flex justify-end gap-4">
          <button className="bg-purple-900 text-sm text-white px-8 py-2 rounded hover:bg-purple-800">
            Search
          </button>
          <button
            className="bg-white text-sm text-black px-8 py-2 rounded border border-purple-900 hover:bg-gray-100"
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
            <thead className="bg-gray-100 uppercase">
              <tr>
                {/* Keep all existing table headers */}
                <th className="px-8 py-2 text-gray-700 text-center border">PO No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">BP ID</th>
                <th className="px-8 py-2 text-gray-700 text-center border">BP Name</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Currency</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Type</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Reference</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Line</th>
                <th className="px-8 py-2 text-gray-700 text-center border">PO Sequence</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Sequence</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Year</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Period</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Line</th>
                <th className="px-8 py-2 text-gray-700 text-center border">GR No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Packing Slip</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Item No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">ICS Code</th>
                <th className="px-8 py-2 text-gray-700 text-center border">ICS Part</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Part No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Item Description</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Item Group</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Item Type</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Item Type Desc</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Request Qty</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Qty</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Approve Qty</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Unit</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Receipt Amount</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Unit Price</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Final Receipt</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Confirmed</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Invoice No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Invoice Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Invoice Qty</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Invoice Amount</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Supplier No</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Due Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Payment Doc</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Payment Date</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Created At</th>
                <th className="px-8 py-2 text-gray-700 text-center border">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2 text-center">{item.po_no}</td>
                  <td className="px-3 py-2 text-center">{item.bp_id}</td>
                  <td className="px-3 py-2 text-center">{item.bp_name}</td>
                  <td className="px-3 py-2 text-center">{item.currency}</td>
                  <td className="px-3 py-2 text-center">{item.po_type}</td>
                  <td className="px-3 py-2 text-center">{item.po_reference}</td>
                  <td className="px-3 py-2 text-center">{item.po_line}</td>
                  <td className="px-3 py-2 text-center">{item.po_sequence}</td>
                  <td className="px-3 py-2 text-center">{item.po_receipt_sequence}</td>
                  <td className="px-3 py-2 text-center">{item.actual_receipt_date}</td>
                  <td className="px-3 py-2 text-center">{item.actual_receipt_year}</td>
                  <td className="px-3 py-2 text-center">{item.actual_receipt_period}</td>
                  <td className="px-3 py-2 text-center">{item.receipt_no}</td>
                  <td className="px-3 py-2 text-center">{item.receipt_line}</td>
                  <td className="px-3 py-2 text-center">{item.gr_no}</td>
                  <td className="px-3 py-2 text-center">{item.packing_slip}</td>
                  <td className="px-3 py-2 text-center">{item.item_no}</td>
                  <td className="px-3 py-2 text-center">{item.ics_code}</td>
                  <td className="px-3 py-2 text-center">{item.ics_part}</td>
                  <td className="px-3 py-2 text-center">{item.part_no}</td>
                  <td className="px-3 py-2 text-center">{item.item_desc}</td>
                  <td className="px-3 py-2 text-center">{item.item_group}</td>
                  <td className="px-3 py-2 text-center">{item.item_type}</td>
                  <td className="px-3 py-2 text-center">{item.item_type_desc}</td>
                  <td className="px-3 py-2 text-center">{item.request_qty}</td>
                  <td className="px-3 py-2 text-center">{item.actual_receipt_qty}</td>
                  <td className="px-3 py-2 text-center">{item.approve_qty}</td>
                  <td className="px-3 py-2 text-center">{item.unit}</td>
                  <td className="px-3 py-2 text-center">{item.receipt_amount}</td>
                  <td className="px-3 py-2 text-center">{item.receipt_unit_price}</td>
                  <td className="px-3 py-2 text-center">{item.is_final_receipt ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-center">{item.is_confirmed ? 'Yes' : 'No'}</td>
                  <td className="px-3 py-2 text-center">{item.inv_doc_no}</td>
                  <td className="px-3 py-2 text-center">{item.inv_doc_date}</td>
                  <td className="px-3 py-2 text-center">{item.inv_qty}</td>
                  <td className="px-3 py-2 text-center">{item.inv_amount}</td>
                  <td className="px-3 py-2 text-center">{item.inv_supplier_no}</td>
                  <td className="px-3 py-2 text-center">{item.inv_due_date}</td>
                  <td className="px-3 py-2 text-center">{item.payment_doc}</td>
                  <td className="px-3 py-2 text-center">{item.payment_doc_date}</td>
                  <td className="px-3 py-2 text-center">{item.created_at}</td>
                  <td className="px-3 py-2 text-center">{item.updated_at}</td>
                </tr>
              ))}
             {data.length === 0 && (
              <tr>
                <td colSpan={14} className="px-6 py-4 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            )}
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
</div>
  );
};

export default GrTracking;