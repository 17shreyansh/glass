import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const productId = action.payload._id || action.payload.id;
      const size = action.payload.size || action.payload.selectedSize || null;
      const color = action.payload.color || action.payload.selectedColor || null;
      
      // Check if same product with same variant exists
      const existingItem = state.items.find(item => 
        (item._id || item.id) === productId && 
        item.size === size && 
        item.color === color
      );
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            (item._id || item.id) === productId && item.size === size && item.color === color
              ? { ...item, quantity: (item.quantity || 0) + 1 }
              : item
          )
        };
      }
      
      return {
        ...state,
        items: [...state.items, { 
          ...action.payload, 
          _id: productId, 
          size,
          color,
          quantity: 1 
        }]
      };
    
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => 
          !((item._id || item.id) === action.payload.id && 
            item.size === action.payload.size && 
            item.color === action.payload.color)
        )
      };
    
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          (item._id || item.id) === action.payload.id && 
          item.size === action.payload.size && 
          item.color === action.payload.color
            ? { ...item, quantity: Number(action.payload.quantity) || 1 }
            : item
        )
      };
    
    case 'CLEAR_CART':
      return { ...state, items: [] };
    
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = (product, selectedSize, selectedColor) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { 
        ...product, 
        selectedSize, 
        selectedColor 
      } 
    });
  };

  const removeFromCart = (productId, size, color) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId, size, color } });
  };

  const updateQuantity = (productId, quantity, size, color) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity, size, color } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems: state.items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};