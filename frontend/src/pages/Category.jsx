import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryPage from '../components/CategoryPage';
import { Offer } from '../components';
import apiService from '../services/api';
import hero1 from '../assets/jewelleryImage.jpg';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const Category = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categories = await apiService.getCategories();
        const foundCategory = categories?.find(cat => cat.slug === slug);
        setCategory(foundCategory);
      } catch (error) {
        console.error('Failed to fetch category:', error);
      }
    };
    fetchCategory();
  }, [slug]);

  const getHeroImage = () => {
    if (category?.heroImage) {
      return `${API_BASE_URL.replace('/api', '')}${category.heroImage}`;
    }
    return hero1;
  };

  return (
    <div>
      <CategoryPage
        categorySlug={slug}
        categoryName={category?.name || slug?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Category'}
        heroImage={getHeroImage()}
        showFilters={true}
      />
    </div>
  );
};

export default Category;