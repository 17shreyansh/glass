import React from 'react';
import aboutImage from '../assets/aboutus.jpg'; // adjust the path as needed

const AboutUs = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', color: '#333', lineHeight: '1.7', fontFamily: 'Josefin Sans, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '36px', color: '#8E6A4E' }}>About us</h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: '40px' }}>
        
        {/* Left Side - Text */}
        <div style={{ flex: '1 1 600px', minWidth: '300px' }}>
          <h3 style={{ fontSize: '20px', color: '#8E6A4E', marginBottom: '15px' }}>Importance & Procedure for Wearing :</h3>
          <p>
            Importance of Ashtadhatu is deeply rooted in Indian culture, religious and ayurvedic traditions. 
            According to astrology, every metal has its inherent energy and has different effects on the human body, 
            in which Ashtadhatu is considered the most effective as it is made from a blend of eight sacred metals i.e. 
            gold, silver, copper, lead, zinc, tin, iron, and mercury.
          </p>
          <p>
            These metals come together to form a material that symbolizes strength, peace and positive energy. 
            Ashtadhatu is known for its spiritual and therapeutic properties. It is often used to craft religious idols, 
            jewelry, and other sacred items.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>1. Religious and Spiritual Significance:</h3>
          <p>
            Jewelry and idols made of Ashtadhatu are worshipped in religious places and homes. Wearing it is believed 
            to bring positive changes and protection from the evil eye.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>2. Therapeutic and Ayurvedic Importance:</h3>
          <p>
            Ashtadhatu contains metals like copper, silver, and gold — all known for their health benefits in Ayurveda.
            It is believed to enhance immunity and promote mental clarity.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>3. Protection from Negative Energy:</h3>
          <p>
            Ashtadhatu is said to protect individuals from evil eyes, negative energy, and planetary imbalances.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>4. Symbol of Wealth and Prosperity:</h3>
          <p>
            Associated with goddess Lakshmi, Ashtadhatu brings wealth, fortune, and harmony in life.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>5. Mental and Emotional Balance:</h3>
          <p>
            Wearing Ashtadhatu promotes focus, mental peace, and emotional stability — ideal for meditation and spiritual practices.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>6. Carrier of Powerful Energy:</h3>
          <p>
            The blend of eight metals activates chakras and purifies the aura, supporting overall spiritual development.
          </p>

          <h3 style={{ marginTop: '25px', color: '#8E6A4E' }}>7. Cultural and Traditional Significance:</h3>
          <p>
            Ashtadhatu is an integral part of Indian heritage. Its use preserves ancient customs while symbolizing strength and purity.
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

export default AboutUs;
