import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import PrintReceipt from './PrintReceipt';
import LogoIcon from '../images/Logo-sanoh.png';
import { GrSaRecord } from './InvoiceCreation';
import { API_Create_Inv_Header_Admin, API_Ppn, API_Pph } from '../api/api';
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InvoiceCreationWizardProps {
  selectedRecords: GrSaRecord[];
  onClose: () => void;
  onFinish: () => void;
}

const InvoiceCreationWizard: React.FC<InvoiceCreationWizardProps> = ({ selectedRecords, onClose, onFinish }) => {
  // Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  // States for preview (computed later)
  const [taxBaseAmount, setTaxBaseAmount] = useState('');
  const [taxAmount, setTaxAmount] = useState('');
  const [taxDate, setTaxDate] = useState('');
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState('');

  // Document state
  const [documents, setDocuments] = useState([
    { type: 'invoice', fileName: '', required: true },
    { type: 'fakturpajak', fileName: '', required: true },
    { type: 'suratjalan', fileName: '', required: true },
    { type: 'po', fileName: '', required: true },
  ]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // New state for PPN and PPH lists
  const [ppnList, setPpnList] = useState<any[]>([]);

  // Pagination for selected records table
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const totalPages = Math.ceil(selectedRecords.length / rowsPerPage);

  // File input refs
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileUpload = (index: number, file: File | null) => {
    if (file) {
      const updatedDocuments = [...documents];
      updatedDocuments[index] = { ...updatedDocuments[index], fileName: file.name };
      setDocuments(updatedDocuments);
    }
  };

  const handlePlusClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const formatToIDR = (value: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Load PPN and PPH options (with token)
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const loadPPN = async () => {
      try {
        const res = await fetch(API_Ppn(), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPpnList(data);
        console.log('ppnList:', data); // Log the ppnList
      } catch (error) {
        console.error('Error loading PPN', error);
      }
    };
    loadPPN();
  }, []);

  const handleTaxCodeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPpnId = e.target.value;
    setTaxCode(selectedPpnId);
    console.log('taxCode:', selectedPpnId); // Log the taxCode
  };

  // Render the selected records table with pagination.
  const renderSelectedRecords = () => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const displayedRecords = selectedRecords.slice(startIndex, startIndex + rowsPerPage);

    return (
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Items</h3>
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-purple-800 text-white">
                <th className="border px-2 py-3">Gr No</th>
                <th className="border px-2 py-3">Item Description</th>
                <th className="border px-2 py-3">Receipt Amount</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.map((record, index) => (
                <tr key={index}>
                  <td className="border px-3 py-2 text-center">{record.gr_no}</td>
                  <td className="border px-3 py-2 text-center">{record.item_desc}</td>
                  <td className="border px-3 py-2 text-center">{formatToIDR(record.receipt_amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-2 mb-2">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <span className="text-gray-700 font-medium text-sm">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-white border border-gray-300 rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Compute preview values for Tax Base Amount and Tax Amount.
  const computedTaxBase = selectedRecords.reduce((acc, record) => acc + Number(record.receipt_amount), 0);
  const computedTaxAmount = computedTaxBase * 0.11;

  const renderMainForm = () => (
    <div className="space-y-4">
      {currentStep === 1 && selectedRecords.length > 0 && renderSelectedRecords()}
      <div className="space-y-4 pt-2 border-t border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Create Invoice</h2>
        <hr className="my-6 border-t-1 border-blue-900" />
        {/* Row 1 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Invoice Number</label>
            <input
              type="text"
              placeholder="Enter Invoice Number"
              className="w-full p-2 border border-blue-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tax Code (PPN)</label>
            <select
              className="w-full p-2 border border-blue-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={taxCode}
              onChange={handleTaxCodeChange}
            >
              <option value="">Select PPN</option>
              {ppnList.map((ppn) => (
                <option key={ppn.ppn_id} value={ppn.ppn_id}>
                  {ppn.ppn_description}
                </option>
              ))}
            </select>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              className="w-full p-2 border border-blue-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tax Number</label>
            <input
              type="text"
              placeholder="Enter Tax Number"
              className="w-full p-2 border border-blue-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
            />
          </div>
        </div>
        {/* Row 3 - Preview fields */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tax Base Amount</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 border border-blue-900 text-blue-900 rounded-md shadow-sm bg-blue-200"
              value={formatToIDR(computedTaxBase)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tax Date</label>
            <input
              type="date"
              className="w-full p-2 border border-blue-900 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={taxDate}
              onChange={(e) => setTaxDate(e.target.value)}
            />
          </div>
        </div>
        {/* Row 4 */}
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Tax Amount</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 border border-blue-900 text-blue-900 rounded-md shadow-sm bg-blue-200"
              value={taxCode ? formatToIDR(computedTaxAmount) : ''}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Total Invoice Amount</label>
            <input
              type="text"
              readOnly
              className="w-full p-2 border border-blue-900 text-blue-900 rounded-md shadow-sm bg-blue-200"
              value={totalInvoiceAmount}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const getDocumentDisplayName = (type: string) => {
    switch (type) {
      case 'invoice': return 'Invoice *';
      case 'fakturpajak': return 'Tax Invoice *';
      case 'suratjalan': return 'Delivery Note *';
      case 'po': return 'Purchase Order *';
      default: return type;
    }
  };

  const renderAttachDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Attach and Submit Document</h2>
      <div className="overflow-hidden rounded-lg border-y border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-purple-800">
            <tr>
              <th className="w-24 px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                File Name
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((doc, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => handlePlusClick(index)}
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-800 hover:bg-purple-600 transition-colors"
                  >
                    <Plus size={18} className="text-white font-bold stroke-[2.5]" />
                  </button>
                  <input
                    type="file"
                    accept="application/pdf" // Only accept PDF files
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                      console.log(`Set fileInputRef[${index}] to:`, el);
                    }}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        console.log(`File selected for ${doc.type}:`, file.name, file.type, file.size);
                        handleFileUpload(index, file);
                      } else {
                        console.log(`No file selected for ${doc.type}`);
                      }
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-purple-800 font-medium">{getDocumentDisplayName(doc.type)}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-gray-500">
                      {doc.fileName || 'No file selected'}
                    </span>
                    {doc.fileName && (
                      <button
                        onClick={() => {
                          const updatedDocuments = [...documents];
                          updatedDocuments[index] = { ...updatedDocuments[index], fileName: '' };
                          setDocuments(updatedDocuments);
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Invoice Submission Disclaimer Statement</span>
        </label>
      </div>
    </div>
  );

  const renderTermsAndConditions = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Attach and Submit Document</h2>
          <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <ol className="list-decimal pl-4 space-y-2 text-sm text-gray-600">
            {Array(9)
              .fill(null)
              .map((_, index) => (
                <li key={index}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
                </li>
              ))}
          </ol>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={submitInvoice} // Changed onClick handler to submitInvoice
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            I Agree
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderMainForm();
      case 2:
        return renderAttachDocuments();
      case 3:
        return renderTermsAndConditions();
      default:
        return null;
    }
  };

  // Invoice submission handled via API_Create_Inv_Header_Admin
  const submitInvoice = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        console.error('No access token found');
        alert('Please log in to create an invoice.');
        return;
      }
  
      // Compute values based on selected records
      const computedTaxBase = selectedRecords.reduce(
        (acc, record) => acc + Number(record.receipt_amount),
        0
      );
      const ppnRate = 0.11; // Fixed rate; the backend looks it up by ppn_id.
      const computedTaxAmount = computedTaxBase * ppnRate;
      const computedTotalInvoiceAmount = computedTaxBase + computedTaxAmount;
  
      // Create FormData object without Content-Type header to allow browser to set it
      const formData = new FormData();
      formData.append('inv_no', invoiceNumber);
      formData.append('inv_date', invoiceDate);
      formData.append('inv_faktur', taxNumber);
      formData.append('inv_faktur_date', taxDate);
      formData.append('total_dpp', computedTaxBase.toString());
      formData.append('ppn_id', taxCode);
      formData.append('tax_base_amount', computedTaxBase.toString());
      formData.append('tax_amount', computedTaxAmount.toString());
      formData.append('total_amount', computedTotalInvoiceAmount.toString());
      formData.append('status', 'New');
      formData.append('created_by', '');
  
      // Add invoice line details
      selectedRecords.forEach(record => {
        if (record.inv_line_id) {
          formData.append('inv_line_detail[]', record.inv_line_id);
        }
      });
  
      // Debug: check file refs before adding to FormData
      console.log('File input refs count:', fileInputRefs.current.length);
      fileInputRefs.current.forEach((ref, idx) => {
        if (ref) {
          console.log(`Ref ${idx} exists, has files:`, (ref.files?.length ?? 0) > 0);
        } else {
          console.log(`Ref ${idx} is null`);
        }
      });
  
      // Directly add files from input elements to avoid any possible mapping issues
      const invoiceFile = fileInputRefs.current[0]?.files?.[0];
      if (invoiceFile) {
        console.log('Adding invoice_file:', invoiceFile.name, invoiceFile.size, invoiceFile.type);
        formData.append('invoice_file', invoiceFile);
      }
  
      const fakturFile = fileInputRefs.current[1]?.files?.[0];
      if (fakturFile) {
        console.log('Adding fakturpajak_file:', fakturFile.name, fakturFile.size, fakturFile.type);
        formData.append('fakturpajak_file', fakturFile);
      }
  
      const suratJalanFile = fileInputRefs.current[2]?.files?.[0];
      if (suratJalanFile) {
        console.log('Adding suratjalan_file:', suratJalanFile.name, suratJalanFile.size, suratJalanFile.type);
        formData.append('suratjalan_file', suratJalanFile);
      }
  
      const poFile = fileInputRefs.current[3]?.files?.[0];
      if (poFile) {
        console.log('Adding po_file:', poFile.name, poFile.size, poFile.type);
        formData.append('po_file', poFile);
      }
  
      // Debug: Log all form data entries
      console.log('--- FormData contents ---');
      for (const pair of formData.entries()) {
        if (pair[1] instanceof File) {
          console.log(`${pair[0]}: File - ${(pair[1] as File).name}, size: ${(pair[1] as File).size}`);
        } else {
          console.log(`${pair[0]}: ${pair[1]}`);
        }
      }
  
      // Make API request WITHOUT setting Content-Type header
      console.log('Making API request to:', API_Create_Inv_Header_Admin());
      const response = await fetch(API_Create_Inv_Header_Admin(), {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
          // DO NOT set Content-Type here, browser will set it automatically for multipart/form-data
        },
      });
  
      // Get raw response text for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      // Parse the JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response:', responseData);
      } catch (e) {
        console.error('Could not parse response as JSON:', e);
      }
      
      if (!response.ok) {
        throw new Error(`Invoice creation failed: ${response.status} ${responseData ? JSON.stringify(responseData) : responseText}`);
      }
  
      alert("Invoice created successfully!");
      onFinish();
    } catch (error) {
      console.error('Error creating invoice:', error);
      if (error instanceof Error) {
        alert(`Failed to create invoice: ${error.message}`);
      } else {
        alert(`Failed to create invoice: ${String(error)}`);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
        <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
            <div className="flex items-center gap-4">
              <img src={LogoIcon} alt="Sanoh Logo" className="h-8" />
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>
          {/* Content */}
          <div className="p-6 bg-violet-100 rounded-lg">
            {currentStep < 3 ? (
              <>
                {renderCurrentStep()}
                <div className="mt-6 flex justify-end gap-2">
                  {currentStep > 1 && (
                    <button
                      onClick={() => setCurrentStep((prev) => prev - 1)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-md transition-colors"
                    >
                      Previous
                    </button>
                  )}
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={
                      currentStep === 2 &&
                      (documents.some((doc) => !doc.fileName) || !disclaimerAccepted)
                    }
                    className={`px-6 py-2 rounded-md transition-colors ${
                      currentStep === 2 &&
                      (documents.some((doc) => !doc.fileName) || !disclaimerAccepted)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-900 hover:bg-blue-800 text-white'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Terms & Condition</h2>
                <ul className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                  <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</li>
                </ul>
                <div className="mt-2 mb-2 flex justify-end gap-2">
                  <button
                    onClick={submitInvoice}
                    className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    I Agree
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceCreationWizard;