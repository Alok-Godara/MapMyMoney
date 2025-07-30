import React from "react";
import Modal from "./Modal";
import { X, Download } from "lucide-react";

const ReceiptModal = ({ isOpen, onClose, imageUrl }) => {
  if (!imageUrl) return null;

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `receipt-${Date.now()}.jpg`; // You can customize the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
      // Fallback: open image in new tab
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Receipt">
      <div className="relative">
        <img
          src={imageUrl}
          alt="Receipt"
          className="w-full h-auto max-h-96 object-contain rounded-lg"
          onError={(e) => {
            console.error("Error loading image:", imageUrl);
            e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjY2NjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=";
          }}
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <button
            onClick={handleDownload}
            className="bg-blue-600 bg-opacity-75 hover:bg-opacity-100 hover:cursor-pointer rounded-full p-2 transition-all"
            title="Download Receipt"
          >
            <Download className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ReceiptModal;
