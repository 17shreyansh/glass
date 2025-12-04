import React from 'react';
import { Link } from 'react-router-dom';
import CategoryPage from '../components/CategoryPage';
import glassHero from '../assets/glass1.jpg';

const GlassCategory = ({ categoryType = 'all' }) => {
  const getCategoryConfig = () => {
    switch (categoryType) {
      case 'serveware':
        return {
          name: 'Glass Serveware',
          slug: 'serveware',
          filters: { category: 'serveware', productType: 'glass' }
        };
      case 'drinkware':
        return {
          name: 'Glass Drinkware',
          slug: 'drinkware',
          filters: { category: 'drinkware', productType: 'glass' }
        };
      case 'decorative':
        return {
          name: 'Decorative Glass',
          slug: 'decorative',
          filters: { category: 'decorative', productType: 'glass' }
        };
      default:
        return {
          name: 'Glass Collection',
          slug: 'glass',
          filters: { productType: 'glass' }
        };
    }
  };

  const config = getCategoryConfig();

  const breadcrumbItems = [
    { title: <Link to="/">Home</Link> },
    { title: <Link to="/shop">Shop</Link> },
    { title: <Link to="/glass">Glass</Link> },
    ...(categoryType !== 'all' ? [{ title: config.name }] : [])
  ];

  return (
    <CategoryPage
      categorySlug={config.slug}
      categoryName={config.name}
      heroImage={glassHero}
      breadcrumbItems={breadcrumbItems}
      filters={config.filters}
      showFilters={true}
      pageSize={16}
    />
  );
};

export default GlassCategory;