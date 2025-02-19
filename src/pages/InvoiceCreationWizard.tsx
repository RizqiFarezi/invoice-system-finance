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
  const [personInCharge, setPersonInCharge] = useState('');
  const [email, setEmail] = useState('yames.ui@toyota.co.id');
  const [phoneNumber, setPhoneNumber] = useState('');

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
    { type: 'Invoice *', fileName: 'Invoice 3.12.pdf', required: true },
    { type: 'Tax Invoice *', fileName: 'FP SANOH 3.12.6.pdf', required: true },
    { type: 'Delivery Note *', fileName: 'Surat Jalan.pdf', required: true },
  ]);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
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
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
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
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-right"
              value={totalInvoiceAmount}
              onChange={(e) => setTotalInvoiceAmount(e.target.value)}
            />
          </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAttachDocuments = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Attach and Submit Document</h2>
      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <button onClick={() => handlePlusClick(index)} className="text-red-500"><Plus size={20} /></button>
            <span className="text-red-500">{doc.type}</span>
            <input type="file" ref={(el) => fileInputRefs.current[index] = el} className="hidden" onChange={(e) => handleFileUpload(index, e.target.files?.[0] || null)} />
            {doc.fileName && <span className="text-sm text-gray-500">{doc.fileName}</span>}
          </div>
        ))}
      </div>
      <div className="mt-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={disclaimerAccepted}
            onChange={(e) => setDisclaimerAccepted(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">
            Invoice Submission Disclaimer Statement
          </span>
        </label>
      </div>
    </div>
  );

  const renderDisclaimer = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Invoice Submission Disclaimer Statement</h2>
            <button 
              onClick={() => setShowDisclaimer(false)}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <ol className="list-decimal pl-4 space-y-2">
              {Array(9).fill(null).map((_, index) => (
                <li key={index} className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setDisclaimerAccepted(true);
                setShowDisclaimer(false);
              }}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTermsAndConditions = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Terms and Conditions</h2>
      <div className="space-y-4">
        {/* Add your terms and conditions content here */}
        <p className="text-sm text-gray-700">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.
        </p>
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
        return renderTermsAndConditions(); // Terms and Conditions
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-medium text-gray-900">Invoice Preview</h1>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-pink-50 p-6 rounded-lg">
            {renderCurrentStep()}
            <div className="mt-6 flex justify-end gap-2">
              {currentStep === 3 ? ( // Modified condition
                <button
                  onClick={onFinish}
                  disabled={!disclaimerAccepted}
                  className={`px-6 py-2 rounded-md transition-colors ${
                    disclaimerAccepted
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Save Invoice
                </button>
              ) : (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Next
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {showDisclaimer && renderDisclaimer()}
    </div>
  );
};

export default InvoiceCreationWizard;
