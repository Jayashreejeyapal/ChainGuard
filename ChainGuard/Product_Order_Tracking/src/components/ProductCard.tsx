import React from 'react';
import QRCode from 'react-qr-code';
import { Package, Truck, Home, CheckCircle } from 'lucide-react';
import { Product, ProductStatus } from '../types';
import { useStore } from '../store/useStore';

const statusColors: Record<ProductStatus, string> = {
  manufactured: 'bg-gray-200',
  packed: 'bg-blue-200',
  shipped: 'bg-yellow-200',
  out_for_delivery: 'bg-orange-200',
  delivered: 'bg-green-200'
};

const StatusIcon = ({ status }: { status: ProductStatus }) => {
  switch (status) {
    case 'manufactured':
    case 'packed':
      return <Package className="w-5 h-5" />;
    case 'shipped':
    case 'out_for_delivery':
      return <Truck className="w-5 h-5" />;
    case 'delivered':
      return <Home className="w-5 h-5" />;
    default:
      return null;
  }
};

// Define valid status transitions for each role
const roleTransitions: Record<Role, ProductStatus[]> = {
  manufacturer: ['packed'],
  logistics: ['packed', 'shipped', 'out_for_delivery'],
  consumer: ['delivered']
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { currentRole, updateProductStatus, markAsPaid } = useStore();
  
  const handleStatusUpdate = async (newStatus: ProductStatus) => {
    // Check if the current role can make this transition
    if (!roleTransitions[currentRole].includes(newStatus)) {
      alert(`Your role (${currentRole}) is not authorized to update the status to ${newStatus.replace('_', ' ')}`);
      return;
    }

    if (currentRole === 'consumer' && newStatus === 'delivered') {
      // Simulate payment process
      const confirmPayment = window.confirm(
        `Confirm payment of $${product.price} to complete delivery?`
      );
      
      if (confirmPayment) {
        markAsPaid(product.id);
        const success = updateProductStatus(product.id, newStatus);
        if (success) {
          alert('Payment successful and delivery confirmed!');
        }
      }
    } else {
      const success = updateProductStatus(product.id, newStatus);
      if (!success) {
        alert('Status update failed. Please check if the current status can transition to the new status.');
      }
    }
  };

  const getNextStatus = (): ProductStatus | null => {
    const statusSequence: ProductStatus[] = [
      'manufactured',
      'packed',
      'shipped',
      'out_for_delivery',
      'delivered'
    ];
    
    const currentIndex = statusSequence.indexOf(product.currentStatus);
    return currentIndex < statusSequence.length - 1 
      ? statusSequence[currentIndex + 1] 
      : null;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold">{product.name}</h3>
          <p className="text-gray-600">ID: {product.id}</p>
          <p className="text-gray-600">Manufacturer: {product.manufacturer}</p>
          <p className="text-gray-600">Origin: {product.origin}</p>
          <p className="text-gray-600">Price: ${product.price}</p>
        </div>
        <div className="w-24 h-24">
          <QRCode
            value={`${product.id}:${product.hash}`}
            size={96}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${statusColors[product.currentStatus]}`}>
          <div className="flex items-center space-x-2">
            <StatusIcon status={product.currentStatus} />
            <span className="font-semibold">
              Current Status: {product.currentStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {product.statusHistory.map((update, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 text-sm text-gray-600"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{update.status}</span>
              <span>by {update.updatedBy}</span>
              <span>{new Date(update.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {getNextStatus() && (
          <button
            onClick={() => handleStatusUpdate(getNextStatus()!)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Update to {getNextStatus()?.replace('_', ' ')}
          </button>
        )}
      </div>
    </div>
  );
};