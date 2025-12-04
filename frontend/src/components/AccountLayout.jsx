import React from 'react';
import { Layout, Row, Col, Typography } from 'antd';
import { Sidebar } from './common';
import '../styles/account.css';

const { Content } = Layout;
const { Title } = Typography;

const AccountLayout = ({ title, children, showTitle = true }) => {
  return (
    <Layout className="account-page" style={{ marginTop: '64px', background: '#fff' }}>
      <Content style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {showTitle && (
            <Title
              level={2}
              style={{
                textAlign: 'center',
                marginBottom: '40px',
                fontFamily: "'HK Grotesk', 'Hanken Grotesk', sans-serif",
                fontWeight: 500,
                color: '#8E6A4E',
              }}
            >
              {title}
            </Title>
          )}

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={6}>
              <Sidebar />
            </Col>
            <Col xs={24} lg={18}>
              <div style={{ minHeight: '400px' }}>
                {children}
              </div>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default AccountLayout;