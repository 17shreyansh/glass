// Example usage of the reusable CategoryPage component

import React from 'react';
import { Link } from 'react-router-dom';
import CategoryPage from '../components/CategoryPage';
import heroImage from '../assets/hero1.jpg';

// Example 1: Basic category page
const BasicCategoryExample = () => (
  <CategoryPage
    categorySlug="jewelry"
    categoryName="Jewelry Collection"
    heroImage={heroImage}
  />
);

// Example 2: Category with custom filters
const FilteredCategoryExample = () => (
  <CategoryPage
    categorySlug="rings"
    categoryName="Ring Collection"
    heroImage={heroImage}
    filters={{ 
      category: 'rings',
      material: 'gold',
      priceRange: '10000-50000'
    }}
    showFilters={true}
    pageSize={8}
  />
);

// Example 3: Category with custom breadcrumbs
const CustomBreadcrumbExample = () => {
  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to="/jewelry">Jewelry</Link> },
    { title: <Link to="/jewelry/rings">Rings</Link> },
    { title: 'Gold Rings' }
  ];

  return (
    <CategoryPage
      categorySlug="gold-rings"
      categoryName="Gold Ring Collection"
      heroImage={heroImage}
      breadcrumbItems={breadcrumbItems}
      filters={{ category: 'rings', material: 'gold' }}
    />
  );
};

// Example 4: Category without hero image
const SimpleListExample = () => (
  <CategoryPage
    categorySlug="earrings"
    categoryName="Earring Collection"
    showFilters={false}
    pageSize={16}
  />
);

// Example 5: Glass category variations
const GlassServewareExample = () => (
  <CategoryPage
    categorySlug="serveware"
    categoryName="Glass Serveware"
    heroImage={heroImage}
    filters={{ 
      productType: 'glass',
      category: 'serveware'
    }}
    breadcrumbItems={[
      { title: <Link to="/">Home</Link> },
      { title: <Link to="/glass">Glass</Link> },
      { title: 'Serveware' }
    ]}
  />
);

const GlassDrinkwareExample = () => (
  <CategoryPage
    categorySlug="drinkware"
    categoryName="Glass Drinkware"
    heroImage={heroImage}
    filters={{ 
      productType: 'glass',
      category: 'drinkware'
    }}
  />
);

export {
  BasicCategoryExample,
  FilteredCategoryExample,
  CustomBreadcrumbExample,
  SimpleListExample,
  GlassServewareExample,
  GlassDrinkwareExample
};