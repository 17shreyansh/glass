import ring from '../assets/ring.jpg';

export const ashtaDhatuProducts = [
  {
    id: 1,
    slug: "traditional-ashta-dhatu-ring",
    name: "Traditional Ashta Dhatu Ring",
    description: "Handcrafted ring made from eight sacred metals",
    price: 2500,
    originalPrice: 3000,
    image: ring,
    category: "ashta-dhatu",
    productType: "ashta-dhatu",
    inStock: true,
    rating: 4.5,
    reviews: 23
  },
  {
    id: 2,
    slug: "ashta-dhatu-pendant",
    name: "Ashta Dhatu Pendant",
    description: "Sacred pendant with intricate designs",
    price: 1800,
    image: ring,
    category: "ashta-dhatu",
    productType: "ashta-dhatu",
    inStock: true,
    rating: 4.8,
    reviews: 15
  },
  {
    id: 3,
    name: "Ashta Dhatu Bracelet",
    description: "Elegant bracelet with traditional motifs",
    price: 3200,
    image: ring,
    category: "ashta-dhatu",
    inStock: true,
    rating: 4.6,
    reviews: 31
  },
  {
    id: 4,
    name: "Ashta Dhatu Earrings",
    description: "Beautiful earrings with ethnic design",
    price: 2200,
    originalPrice: 2800,
    image: ring,
    category: "ashta-dhatu",
    inStock: true,
    rating: 4.7,
    reviews: 18
  },
  {
    id: 5,
    name: "Ashta Dhatu Necklace Set",
    description: "Complete necklace set with matching earrings",
    price: 5500,
    image: ring,
    category: "ashta-dhatu",
    inStock: true,
    rating: 4.9,
    reviews: 42
  },
  {
    id: 6,
    name: "Ashta Dhatu Anklet",
    description: "Traditional anklet with bell charms",
    price: 1500,
    image: ring,
    category: "ashta-dhatu",
    inStock: false,
    rating: 4.4,
    reviews: 12
  }
];

export const fashionJewelryProducts = [
  {
    id: 7,
    slug: "diamond-stud-earrings",
    name: "Diamond Stud Earrings",
    description: "Classic diamond studs for everyday elegance",
    price: 8500,
    originalPrice: 10000,
    image: ring,
    category: "fashion-jewelry",
    productType: "fashion-jewelry",
    inStock: true,
    rating: 4.8,
    reviews: 67
  },
  {
    id: 8,
    name: "Pearl Necklace",
    description: "Elegant pearl necklace for special occasions",
    price: 4200,
    image: ring,
    category: "fashion-jewelry",
    inStock: true,
    rating: 4.6,
    reviews: 34
  },
  {
    id: 9,
    name: "Gold Chain Bracelet",
    description: "Delicate gold chain bracelet",
    price: 3800,
    image: ring,
    category: "fashion-jewelry",
    inStock: true,
    rating: 4.5,
    reviews: 28
  },
  {
    id: 10,
    name: "Silver Ring Set",
    description: "Set of three stackable silver rings",
    price: 2100,
    originalPrice: 2500,
    image: ring,
    category: "fashion-jewelry",
    inStock: true,
    rating: 4.7,
    reviews: 45
  },
  {
    id: 11,
    name: "Crystal Drop Earrings",
    description: "Sparkling crystal drop earrings",
    price: 1800,
    image: ring,
    category: "fashion-jewelry",
    inStock: true,
    rating: 4.4,
    reviews: 22
  },
  {
    id: 12,
    name: "Statement Choker",
    description: "Bold statement choker necklace",
    price: 3500,
    image: ring,
    category: "fashion-jewelry",
    inStock: true,
    rating: 4.6,
    reviews: 19
  }
];

export const allProducts = [...ashtaDhatuProducts, ...fashionJewelryProducts];

export const getProductById = (slug) => {
  return allProducts.find(product => product.slug === slug || product.id === parseInt(slug));
};

export const getRelatedProducts = (slug, category, limit = 4) => {
  const product = getProductById(slug);
  if (!product) return [];
  return allProducts
    .filter(p => p.id !== product.id && p.category === category)
    .slice(0, limit);
};