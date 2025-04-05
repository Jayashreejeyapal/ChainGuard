import React from 'react';
import { useStore } from './store/useStore';
import { ProductCard } from './components/ProductCard';
import { Role } from './types';

function App() {
  const { currentRole, setRole, products, addProduct } = useStore();

  // Add a sample product for testing
  const addSampleProduct = () => {
    addProduct({
      id: 'PROD-' + Date.now(),
      name: 'Sample Product',
      manufacturer: 'ABC Manufacturing',
      origin: 'Factory A',
      price: 99.99,
      currentStatus: 'manufactured',
      statusHistory: [{
        status: 'manufactured',
        timestamp: Date.now(),
        updatedBy: 'manufacturer'
      }],
      hash: 'sample-hash-' + Date.now(),
      paid: false
    });
  };

  const roles: Role[] = ['manufacturer', 'logistics', 'consumer'];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h1 className="text-2xl font-bold mb-4">Supply Chain Tracker</h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="font-semibold">Current Role:</span>
            <select
              value={currentRole}
              onChange={(e) => setRole(e.target.value as Role)}
              className="border rounded-md px-3 py-1"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
            
            {currentRole === 'manufacturer' && (
              <button
                onClick={addSampleProduct}
                className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"
              >
                Add Sample Product
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;