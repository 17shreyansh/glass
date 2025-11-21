import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only check localStorage for cached user data
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    fetchWishlist();
  };

  const logout = async () => {
    setUser(null);
    setWishlist([]);
    localStorage.removeItem('user');
    try {
      await apiService.logout();
    } catch (error) {
      // Ignore logout errors - user is already being logged out
      console.log('Logout request failed, but continuing with local logout');
    }
  };

  const addToWishlist = async (product) => {
    try {
      if (user) {
        await apiService.addToWishlist(product._id || product.id);
      }
      setWishlist(prev => {
        const productId = product._id || product.id;
        if (prev.find(item => (item._id || item.id) === productId)) {
          return prev;
        }
        return [...prev, product];
      });
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      if (user) {
        await apiService.removeFromWishlist(productId);
      }
      setWishlist(prev => prev.filter(item => (item._id || item.id) !== productId));
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => (item._id || item.id) === productId);
  };

  const fetchWishlist = async () => {
    if (user) {
      try {
        const response = await apiService.getWishlist();
        setWishlist(response.data || []);
      } catch (error) {
        // If token is invalid, logout user
        if (error.message.includes('Invalid token') || error.message.includes('Not authorized')) {
          logout();
        } else {
          console.error('Failed to fetch wishlist:', error);
        }
      }
    }
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.isAdmin === true;
  };

  return (
    <UserContext.Provider value={{
      user,
      wishlist,
      loading,
      login,
      logout,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      fetchWishlist,
      isAuthenticated,
      isAdmin
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};