import { create } from 'zustand';
import { Product, ProductStatus, Role } from '../types';

interface State {
  currentRole: Role;
  products: Product[];
  setRole: (role: Role) => void;
  addProduct: (product: Product) => void;
  updateProductStatus: (productId: string, newStatus: ProductStatus) => boolean;
  markAsPaid: (productId: string) => void;
}

// Define valid previous states for each status
const validPreviousStates: Record<ProductStatus, ProductStatus[]> = {
  manufactured: [],
  packed: ['manufactured'],
  shipped: ['packed'],
  out_for_delivery: ['shipped'],
  delivered: ['out_for_delivery']
};

export const useStore = create<State>((set) => ({
  currentRole: 'manufacturer',
  products: [],
  
  setRole: (role) => set({ currentRole: role }),
  
  addProduct: (product) => set((state) => ({
    products: [...state.products, product]
  })),
  
  updateProductStatus: (productId, newStatus) => {
    let success = false;
    
    set((state) => {
      const product = state.products.find(p => p.id === productId);
      
      if (!product) return state;
      
      // Check if the current status is a valid previous state
      if (!validPreviousStates[newStatus].includes(product.currentStatus)) {
        console.error('Invalid status transition');
        return state;
      }
      
      // If it's the consumer and the product is being delivered, ensure payment
      if (state.currentRole === 'consumer' && newStatus === 'delivered') {
        if (!product.paid) {
          console.error('Payment required before delivery confirmation');
          return state;
        }
      }
      
      success = true;
      
      const updatedProducts = state.products.map(p => {
        if (p.id === productId) {
          return {
            ...p,
            currentStatus: newStatus,
            statusHistory: [
              ...p.statusHistory,
              {
                status: newStatus,
                timestamp: Date.now(),
                updatedBy: state.currentRole
              }
            ]
          };
        }
        return p;
      });
      
      return { products: updatedProducts };
    });
    
    return success;
  },
  
  markAsPaid: (productId) => set((state) => ({
    products: state.products.map(p => 
      p.id === productId ? { ...p, paid: true } : p
    )
  }))
}));