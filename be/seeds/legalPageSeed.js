const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const LegalPage = require('../models/LegalPage');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const legalPages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    content: `<h2>Privacy Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Information We Collect</h3>
<p>We collect information you provide directly to us, including name, email address, shipping address, and payment information.</p>

<h3>2. How We Use Your Information</h3>
<p>We use the information we collect to process orders, communicate with you, and improve our services.</p>

<h3>3. Information Sharing</h3>
<p>We do not sell or share your personal information with third parties except as necessary to fulfill orders.</p>

<h3>4. Data Security</h3>
<p>We implement appropriate security measures to protect your personal information.</p>

<h3>5. Your Rights</h3>
<p>You have the right to access, update, or delete your personal information at any time.</p>

<h3>6. Contact Us</h3>
<p>If you have questions about this Privacy Policy, please contact us.</p>`
  },
  {
    slug: 'terms-conditions',
    title: 'Terms & Conditions',
    content: `<h2>Terms & Conditions</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Acceptance of Terms</h3>
<p>By accessing and using this website, you accept and agree to be bound by these Terms and Conditions.</p>

<h3>2. Use of Website</h3>
<p>You agree to use this website only for lawful purposes and in a way that does not infringe the rights of others.</p>

<h3>3. Product Information</h3>
<p>We strive to provide accurate product information, but we do not warrant that product descriptions are error-free.</p>

<h3>4. Pricing</h3>
<p>All prices are subject to change without notice. We reserve the right to modify or discontinue products at any time.</p>

<h3>5. Orders and Payment</h3>
<p>All orders are subject to acceptance and availability. Payment must be received before order processing.</p>

<h3>6. Limitation of Liability</h3>
<p>We shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>`
  },
  {
    slug: 'shipping-policy',
    title: 'Shipping Policy',
    content: `<h2>Shipping Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Shipping Methods</h3>
<p>We offer standard and express shipping options. Shipping costs are calculated at checkout based on your location.</p>

<h3>2. Processing Time</h3>
<p>Orders are typically processed within 1-2 business days. You will receive a tracking number once your order ships.</p>

<h3>3. Delivery Time</h3>
<p>Standard shipping: 5-7 business days<br>Express shipping: 2-3 business days</p>

<h3>4. International Shipping</h3>
<p>We currently ship within India only. International shipping may be available in the future.</p>

<h3>5. Shipping Restrictions</h3>
<p>Some products may have shipping restrictions. These will be noted on the product page.</p>

<h3>6. Lost or Damaged Packages</h3>
<p>If your package is lost or damaged during shipping, please contact us immediately for assistance.</p>`
  },
  {
    slug: 'return-refund-policy',
    title: 'Return & Refund Policy',
    content: `<h2>Return & Refund Policy</h2>
<p>Last updated: ${new Date().toLocaleDateString()}</p>

<h3>1. Return Window</h3>
<p>You may return most items within 7 days of delivery for a full refund or exchange.</p>

<h3>2. Return Conditions</h3>
<p>Items must be unused, in original packaging, and in the same condition as received.</p>

<h3>3. Non-Returnable Items</h3>
<p>Customized or personalized items cannot be returned unless defective.</p>

<h3>4. Return Process</h3>
<p>Contact our customer service to initiate a return. We will provide return instructions and a return label if applicable.</p>

<h3>5. Refund Processing</h3>
<p>Refunds are processed within 5-7 business days after we receive your return. The refund will be issued to your original payment method.</p>

<h3>6. Exchanges</h3>
<p>If you need to exchange an item, please contact us to arrange the exchange.</p>`
  }
];

const seedLegalPages = async () => {
  try {
    await connectDB();
    
    console.log('\nClearing existing legal pages...\n');
    await LegalPage.deleteMany({});
    
    console.log('Seeding legal pages...\n');
    await LegalPage.insertMany(legalPages);
    
    console.log('✅ Legal pages seeded successfully!');
    console.log(`Created ${legalPages.length} legal pages\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding legal pages:', error);
    process.exit(1);
  }
};

seedLegalPages();
