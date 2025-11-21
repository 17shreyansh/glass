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
import { ProductCategories } from '../components/product';
import { Footer } from '../components/layout';
import TestConnection from '../components/TestConnection';
import MissionSection from '../components/MissionSection';

const Home = () => {
  return (
    <Layout>
      <Hero />
      <Collections />
      {/* <TestConnection /> */}
      {/* <ProductCategories /> */}
      {/* <Jewellery/> */}
      {/* <CTA /> */}
      {/* <JewellerySale /> */}
      <FeaturedProducts />
      <MissionSection />
      <FeaturedProducts />
      <ServewareSection />
      <GlassShowcase />
      {/* <Ring /> */}
      {/* <Slider /> */}
      <Footer />
    </Layout>
  );
};

export default Home;