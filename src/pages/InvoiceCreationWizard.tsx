import React, { useState, useRef } from 'react';
import { X, Plus } from 'lucide-react';

interface InvoiceCreationWizardProps {
  onClose: () => void;
  onFinish: () => void;
}

const InvoiceCreationWizard: React.FC<InvoiceCreationWizardProps> = ({ onClose, onFinish }) => {
  // Detail Information state
  const [poCategory, setPoCategory] = useState('GOODS');
  const [transactionType, setTransactionType] = useState('NOW');
  const [currency, setCurrency] = useState('IDR');
  const [totalGR, setTotalGR] = useState('11,250,000.00');
  const [paymentTo, setPaymentTo] = useState('PT. DELA CEMARA INDAH');
  const [address, setAddress] = useState('JL. Mangga Besar Raya 183 LT. II, Jakarta...');
  const [personInCharge, setPersonInCharge] = useState('--------- ----');
  const [email, setEmail] = useState('yames.ui@toyota.co.id');
  const [phoneNumber, setPhoneNumber] = useState('--------- ----');

  // Create Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState('SANOH 3.12.6');
  const [invoiceDate, setInvoiceDate] = useState('2025-01-10');
  const [taxCode, setTaxCode] = useState('I2 - VAT 11%');
  const [taxNumber, setTaxNumber] = useState('0100003204952412');
  const [taxBaseAmount, setTaxBaseAmount] = useState('11,250,000.00');
  const [eFakturVATAmount, setEFakturVATAmount] = useState('123,750.00');
  const [taxAmount, setTaxAmount] = useState('123,750.00');
  const [taxDate, setTaxDate] = useState('2025-01-20');
  const [whtCode, setWhtCode] = useState('35 - Payable PPh 23.2%');
  const [totalInvoiceAmount, setTotalInvoiceAmount] = useState('--------- ----');

  // Document state
  const [documents, setDocuments] = useState([
    { type: 'Invoice *', fileName: 'Invoice.pdf', required: true },
    { type: 'Tax Invoice *', fileName: 'Faktur Pajak.pdf', required: true },
    { type: 'Delivery Note *', fileName: 'Surat Jalan.pdf', required: true },
    { type: 'Purchase Order *', fileName: 'Purchase Order.pdf', required: true },
  ]);
  // Re-added checkbox state for the invoice submission disclaimer
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  // State for showing merged PrintReceipt view
  const [showPrintReceipt, setShowPrintReceipt] = useState(false);
  // State for showing the Terms and Conditions modal popup
  const [showTermsModal, setShowTermsModal] = useState(false);

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

  const renderMainForm = () => (
    <div className="space-y-8">
      {/* Detail Information Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">Detail Information</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">PO Category</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={poCategory}
                onChange={(e) => setPoCategory(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Transaction Type</span>
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value)}
              >
                <option value="NOW">NOW</option>
                <option value="LATER">LATER</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Currency</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Total GR / SA</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={totalGR}
                onChange={(e) => setTotalGR(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Payment to</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={paymentTo}
                onChange={(e) => setPaymentTo(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Address</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Person in Charge</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={personInCharge}
                onChange={(e) => setPersonInCharge(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Email</span>
            </div>
            <div>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Phone Number</span>
            </div>
            <div>
              <input
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      {/* Create Invoice Section */}
      <div className="space-y-4 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Create Invoice</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Invoice Number</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Invoice Date</span>
            </div>
            <div>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Tax Base Amount</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={taxBaseAmount}
                onChange={(e) => setTaxBaseAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Tax Amount</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">WHT Code</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={whtCode}
                onChange={(e) => setWhtCode(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Tax Code</span>
            </div>
            <div>
              <select
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={taxCode}
                onChange={(e) => setTaxCode(e.target.value)}
              >
                <option value="I2 - VAT 11%">I2 - VAT 11%</option>
              </select>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Tax Number</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">e-Faktur VAT Amount</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={eFakturVATAmount}
                onChange={(e) => setEFakturVATAmount(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Tax Date</span>
            </div>
            <div>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={taxDate}
                onChange={(e) => setTaxDate(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Total Invoice Amount</span>
            </div>
            <div>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={totalInvoiceAmount}
                onChange={(e) => setTotalInvoiceAmount(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Attach Documents section with checkbox added back
  const renderAttachDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Attach and Submit Document</h2>
      <div className="overflow-hidden rounded-lg border-y border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-24 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Document Type
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                  >
                    <Plus size={18} className="text-white font-bold stroke-[2.5]" />
                  </button>
                  <input
                    type="file"
                    ref={(el) => (fileInputRefs.current[index] = el)}
                    className="hidden"
                    onChange={(e) => handleFileUpload(index, e.target.files?.[0] || null)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm text-red-500 font-medium">{doc.type}</span>
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

  // Terms and Conditions modal popup (old disclaimer design)
  // This popup is only the white modal (no dark background overlay behind)
  const renderTermsAndConditions = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Terms and Conditions</h2>
          <button onClick={() => setShowTermsModal(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
            <X size={20} />
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
            onClick={() => {
              setShowTermsModal(false);
              setShowPrintReceipt(true);
            }}
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

  // Merged PrintReceipt view
  const renderPrintReceipt = () => (
    <div className="fixed inset-0 bg-white overflow-auto p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Invoice Receipt</h1>
          <button
            onClick={() => window.print()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
          >
            Print Receipt
          </button>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div>
              <p className="text-gray-600">Invoice Number</p>
              <p className="font-medium">{invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Invoice Date</p>
              <p className="font-medium">{invoiceDate}</p>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Payment Details</h2>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax Base Amount:</span>
                <span className="font-medium">{taxBaseAmount}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Tax Amount:</span>
                <span className="font-medium">{taxAmount}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Withholding Tax:</span>
                <span className="font-medium">{eFakturVATAmount}</span>
              </div>
              <div className="flex justify-between py-4 border-t-2 border-gray-900 text-lg font-bold">
                <span>Total Payment:</span>
                <span>{totalInvoiceAmount}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t">
            <p className="text-sm text-gray-500 text-center">
              This is a computer generated receipt and does not require a signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Handle save action (not used anymore since "I Agree" in T&C triggers it)
  const handleSaveInvoice = () => {
    setShowPrintReceipt(true);
    // Optionally call onFinish() if needed
    // onFinish();
  };

  if (showPrintReceipt) {
    return renderPrintReceipt();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-900">Invoice Preview</h1>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500 transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-red-50 p-6 rounded-lg">
            {renderCurrentStep()}
            <div className="mt-6 flex justify-end gap-2">
              {currentStep !== 3 && (
                <>
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    // In step 2, disable Next if any document is missing or checkbox is not checked
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
                  <button
                    onClick={onClose}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
              {currentStep === 3 && (
                <button
                  onClick={onClose}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {showTermsModal && renderTermsAndConditions()}
    </div>
  );
};

export default InvoiceCreationWizard;