import React from 'react';
import { Layout } from 'antd';
import { 
  Hero, 
  Slider, 
  Jewellery, 
  Collections, 
  Ring, 
  CTA, 
  JewellerySale, 
  FeaturedProducts,
  ServewareSection
} from '../components';
import GlassShowcase from '../components/GlassShowcase';
import GlassCollage from '../components/GlassCollage';
import { ProductCategories } from '../components/product';
import { Footer } from '../components/layout';
import TestConnection from '../components/TestConnection';
import MissionSection from '../components/MissionSection';
import NewArrivals from '../components/NewArrivals';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Collections />
      <FeaturedProducts limit={8} skip={0} title="Featured Collection" />
      <MissionSection />
      <NewArrivals limit={8} title="New Arrivals" />
      <ServewareSection />
      <GlassShowcase />
      <GlassCollage />
      <Footer />
    </Layout>
  );
};

export default Home;