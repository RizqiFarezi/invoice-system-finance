import React, { useEffect } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Document, Page, StyleSheet, View, Text } from '@react-pdf/renderer';

interface PrintReceiptProps {
  paymentTo: string;
  invoiceNumber: string;
  taxNumber: string;
  invoiceDate: string;
  taxDate: string;
  taxBaseAmount: string;
  taxAmount: string;
  eFakturVATAmount: string;
  totalInvoiceAmount: string;
  transactionType: string;
  onClose: () => void;
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '5px 0',
  },
  label: {
    fontSize: 10,
    color: '#666',
  },
  value: {
    fontSize: 10,
    textAlign: 'right',
  },
  border: {
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
});

const ReceiptPDF = (props: Omit<PrintReceiptProps, 'onClose'>) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Invoice Receipt</Text>
        
        <View style={[styles.section, styles.border]}>
          <Text style={styles.label}>Supplier</Text>
          <Text style={styles.value}>{props.paymentTo}</Text>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Invoice Number</Text>
            <Text style={styles.value}>{props.invoiceNumber}</Text>
          </View>
          <View>
            <Text style={styles.label}>Invoice Tax Number</Text>
            <Text style={styles.value}>{props.taxNumber}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Invoice Date</Text>
            <Text style={styles.value}>{props.invoiceDate}</Text>
          </View>
          <View>
            <Text style={styles.label}>Invoice Tax Date</Text>
            <Text style={styles.value}>{props.taxDate}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.border]}>
          <View style={styles.row}>
            <Text style={styles.label}>Tax Base Amount</Text>
            <Text style={styles.value}>IDR {props.taxBaseAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax Amount (VAT)</Text>
            <Text style={styles.value}>IDR {props.taxAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Total Amount + VAT</Text>
            <Text style={styles.value}>
              IDR {(parseFloat(props.taxBaseAmount.replace(/,/g, '')) + 
              parseFloat(props.taxAmount.replace(/,/g, ''))).toLocaleString('en-US', 
              { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Luxury Tax Amount</Text>
            <Text style={styles.value}>IDR 0.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax Art.22 Amount</Text>
            <Text style={styles.value}>IDR 0.00</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Withholding Tax Base Amount</Text>
            <Text style={styles.value}>IDR {props.taxBaseAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Withholding Tax Amount</Text>
            <Text style={styles.value}>IDR ({props.eFakturVATAmount})</Text>
          </View>
          <View style={[styles.row, styles.border]}>
            <Text style={styles.label}>Total Payment</Text>
            <Text style={styles.value}>IDR {props.totalInvoiceAmount}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Transaction Type</Text>
          <Text style={styles.value}>{props.transactionType}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const PrintReceipt: React.FC<PrintReceiptProps> = (props) => {
    useEffect(() => {
      let isGenerating = false;
  
      const generatePDF = async () => {
        if (isGenerating) return;
        
        try {
          isGenerating = true;
          const blob = await pdf(<ReceiptPDF {...props} />).toBlob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `invoice_${props.invoiceNumber}.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          setTimeout(() => {
            props.onClose();
          }, 1000);
        } catch (error) {
          console.error('Error generating PDF:', error);
        } finally {
          isGenerating = false;
        }
      };
  
      generatePDF();
  
      // Cleanup function
      return () => {
        isGenerating = true; // Prevent any pending operations
      };
    }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[70]">
      <div className="bg-white rounded-lg w-full max-w-4xl p-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Invoice Receipt</h2>
        </div>
        
        <div className="border rounded-lg p-6 space-y-4">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-4">Supplier</h3>
              <p className="text-xl font-semibold">{props.paymentTo}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-600">Invoice Number</p>
                <p className="font-medium">{props.invoiceNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Invoice Tax Number</p>
                <p className="font-medium">{props.taxNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Invoice Date</p>
                <p className="font-medium">{props.invoiceDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Invoice Tax Date</p>
                <p className="font-medium">{props.taxDate}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax Base Amount</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">{props.taxBaseAmount}</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax Amount (VAT)</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">{props.taxAmount}</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Total Amount + VAT</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">
                    {(parseFloat(props.taxBaseAmount.replace(/,/g, '')) + 
                    parseFloat(props.taxAmount.replace(/,/g, ''))).toLocaleString('en-US', 
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Luxury Tax Amount</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">0.00</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax Art.22 Amount</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">0.00</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Withholding Tax Base Amount</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">{props.taxBaseAmount}</span>
                </div>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Withholding Tax Amount</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">({props.eFakturVATAmount})</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-t mt-2">
                <span className="text-sm font-medium">Total Payment</span>
                <div className="flex gap-4">
                  <span className="text-gray-600">IDR</span>
                  <span className="font-medium w-32 text-right">{props.totalInvoiceAmount}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Transaction Type</span>
                <span className="font-medium">{props.transactionType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintReceipt;