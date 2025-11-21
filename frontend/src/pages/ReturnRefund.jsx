import React from 'react';
import aboutImage from '../assets/rr.jpg'; // adjust the path as needed

const ReturnRefund = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', color: '#333', lineHeight: '1.7', fontFamily: 'Josefin Sans, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', color: '#0b3b3b' }}>Return & Refund Policy</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '40px' }}>
        
        {/* Left Side - Text */}
        <div style={{ flex: '1 1 600px', minWidth: '300px' }}>
          <h3 style={{ fontSize: '20px', color: '#1a4c4c', marginBottom: '15px' }}>Importance & Procedure for Wearing :</h3>
          <p>
            Importance of Ashtadhatu is deeply rooted in Indian culture, religious and
            ayurvedic traditions. According to astrology, every metal has its inherent energy
            and has different effects on the human body, in which Ashtadhatu is considered
            the most effective as it is made from a blend of eight sacred metals i.e. gold,
            silver, copper, lead, zinc, tin, iron, and mercury.
          </p>
          <p>
            These metals come together to form a material that symbolizes strength, peace
            and positive energy. Ashtadhatu is known for its spiritual and therapeutic
            properties. Ashtadhatu is often used to craft religious idols, jewellery, and other
            sacred items. Its importance can be understood through the following points:
          </p>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>1. Religious and Spiritual Significance:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Jewellery and idols made of Ashtadhatu are worshiped in religious places and homes.</li>
            <li>Wearing an Ashtadhatu ring itself is enough to bring about positive changes in a person & life.</li>
            <li>Wearing a tabeez protects a person from repeated influence of the evil eye.</li>
            <li>Its highly recommended for babies.</li>
            <li>It is believed that worshiping deities made from Ashtadhatu brings positive energy, peace, and prosperity to the devotee.</li>
            <li>Deity idols crafted from Ashtadhatu are seen as auspicious and a source of spiritual advancement.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>2. Therapeutic and Ayurvedic Importance:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Ashtadhatu contains metals like copper, silver, and gold, which have known health benefits in Ayurveda.</li>
            <li>Copper is used for purification and silver helps boost the body's immunity.</li>
            <li>Wearing Ashtadhatu is believed to have a positive effect on both physical and mental health, offering protection against various diseases.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>3. Protection from Negative Energy:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Ashtadhatu is believed to protect individuals from evil eyes, negative energy, and physical harm.</li>
            <li>In astrology, it is considered highly effective in neutralizing planetary doshas (faults) and reducing the negative impact of unfavourable planetary alignments.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>4. Symbol of Wealth and Prosperity:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Ashtadhatu is associated with the goddess Lakshmi, symbolizing wealth, prosperity, and good fortune.</li>
            <li>It is believed that wearing or keeping Ashtadhatu items in the house brings financial success and overall well-being.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>5. Mental and Emotional Balance:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Wearing Ashtadhatu promotes mental peace and improves focus and concentration.</li>
            <li>It helps in stabilizing the mind and maintaining emotional balance, making it beneficial for meditation and spiritual practices.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>6. Carrier of Powerful Energy:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>The combination of the eight metals in Ashtadhatu creates a unique energy that activates and balances the body's chakras.</li>
            <li>Wearing Ashtadhatu purifies and strengthens one's aura, helping in overall spiritual development.</li>
          </ul>

          <h3 style={{ marginTop: '25px', color: '#1a4c4c' }}>7. Cultural and Traditional Significance:</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Ashtadhatu is an integral part of Indian culture and traditions. Its use helps preserve religious and social customs.</li>
            <li>It is not only spiritually significant but also symbolizes strength and prosperity in society.</li>
          </ul>

          <p style={{ marginTop: '25px' }}>
            Wearing Ashtadhatu or worshiping items made from it brings about positive
            changes and spiritual growth. It works to balance both the material and spiritual
            aspects of life, enhancing well-being and harmony in a person's life.
          </p>
        </div>

        {/* Right Side - Image */}
        <div style={{ flex: '1 1 400px', minWidth: '280px', alignSelf: 'stretch' }}>
          <img
            src={aboutImage}
            alt="Ashtadhatu Jewelry"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReturnRefund;