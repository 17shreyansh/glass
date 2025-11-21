import React, { useState } from 'react';
import { Layout, Menu, Typography, Avatar, Dropdown, Space, Button } from 'antd';
import { useUser } from '../../context/UserContext';
import {
  AppstoreOutlined,
  TagsOutlined,
  ShoppingOutlined,
  AppleOutlined,
  CarOutlined,
  ProfileOutlined,
  PercentageOutlined,
  UserAddOutlined,
  HeartFilled,
  HomeFilled,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { Link, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Products from './Products';
import Categories from './Categories';
import Order from './Order';
import Users from './users';
import Coupon from './Coupon';
import Deleverycharges from './Deleverycharges';
import AdminSupport from './adminSupport';
import AdminMenu from './Menu';
import AshtaDhatuProducts from './AshtaDhatuProducts';
import FashionJewelryProducts from './FashionJewelryProducts';
import AshtaDhatuCategories from './AshtaDhatuCategories';
import FashionJewelryCategories from './FashionJewelryCategories';
import FileManager from './FileManager';
import EditProduct from './EditProduct';
import AddProduct from './AddProduct';
import './styles/layout.css'; // Import custom CSS for additional styling

const { Sider, Content, Header } = Layout;
const { Title, Text } = Typography;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedKey = location.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const { user, logout } = useUser();

  // Mock notifications - replace with actual notifications from API
  const notifications = [
    { id: 1, message: 'New order received', time: '5 min ago' },
    { id: 2, message: 'Payment confirmed', time: '1 hour ago' },
    { id: 3, message: 'New user registered', time: '2 hours ago' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/admin/profile">Profile</Link>
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Settings</Link>
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const notificationMenuItems = [
    {
      key: 'header',
      label: 'Notifications',
      disabled: true,
      style: { fontWeight: 'bold', cursor: 'default' }
    },
    { type: 'divider' },
    ...notifications.map(notification => ({
      key: notification.id,
      label: (
        <div>
          <div>{notification.message}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{notification.time}</div>
        </div>
      )
    })),
    { type: 'divider' },
    {
      key: 'viewall',
      label: <Link to="/admin/notifications">View All</Link>,
      style: { textAlign: 'center' }
    }
  ];

  return (
    // Main layout container, ensuring it takes at least the full viewport height.
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar for navigation */}
      <Sider
        className="admin-sider"
        breakpoint="lg"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0 }}
      >
        {/* Logo/title for the admin panel */}
        <div className="logo">
          {collapsed ? '💎' : '💎 Delicorn Admin'}
        </div>
        {/* Navigation Menu */}
        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[selectedKey]}
          items={[
            {
              key: '/admin',
              icon: <AppstoreOutlined />,
              label: <Link to="/admin">Dashboard</Link>
            },
            {
              key: 'products',
              icon: <ShoppingOutlined />,
              label: 'Products',
              children: [
                {
                  key: '/admin/ashta-dhatu-products',
                  label: <Link to="/admin/ashta-dhatu-products">Ashta Dhatu</Link>
                },
                {
                  key: '/admin/fashion-jewelry-products',
                  label: <Link to="/admin/fashion-jewelry-products">Fashion Jewelry</Link>
                }
              ]
            },
            {
              key: 'categories',
              icon: <TagsOutlined />,
              label: 'Categories',
              children: [
                {
                  key: '/admin/ashta-dhatu-categories',
                  label: <Link to="/admin/ashta-dhatu-categories">Ashta Dhatu</Link>
                },
                {
                  key: '/admin/fashion-jewelry-categories',
                  label: <Link to="/admin/fashion-jewelry-categories">Fashion Jewelry</Link>
                }
              ]
            },
            {
              key: '/admin/orders',
              icon: <ProfileOutlined />,
              label: <Link to="/admin/orders">Orders</Link>
            },
            {
              key: '/admin/delivery-charges',
              icon: <CarOutlined />,
              label: <Link to="/admin/delivery-charges">Delivery</Link>
            },
            {
              key: '/admin/coupon',
              icon: <PercentageOutlined />,
              label: <Link to="/admin/coupon">Coupons</Link>
            },
            {
              key: '/admin/support',
              icon: <HeartFilled />,
              label: <Link to="/admin/support">Support</Link>
            },
            {
              key: '/admin/users',
              icon: <UserAddOutlined />,
              label: <Link to="/admin/users">Users</Link>
            },

            {
              key: '/admin/file-manager',
              icon: <FolderOutlined />,
              label: <Link to="/admin/file-manager">File Manager</Link>
            }
          ]}
        />
      </Sider>
      {/* Right-side layout for header and content */}
      <Layout style={{ marginLeft: collapsed ? 80 : 250, transition: 'margin-left 0.2s' }}>
        {/* Header for the admin panel */}
        <Header className="admin-header">
          <Button 
            type="text" 
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} 
            onClick={() => setCollapsed(!collapsed)} 
            style={{ fontSize: '16px', marginRight: 16 }}
          />
          <Title level={4} style={{ margin: 0, flex: 1 }}>Delicorn Admin Panel</Title>
          <Space size="large">
            <Dropdown menu={{ items: notificationMenuItems, style: { width: 300 } }} trigger={['click']} placement="bottomRight">
              <Button type="text" icon={<BellOutlined style={{ fontSize: '18px' }} />} />
            </Dropdown>
            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar icon={<UserOutlined />} />
                {!collapsed && <Text strong>{user?.name || 'Admin'}</Text>}
              </Space>
            </Dropdown>
          </Space>
        </Header>
        {/* Content area where nested routes will be rendered */}
        <Content className="admin-content">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="ashta-dhatu-products" element={<AshtaDhatuProducts />} />
            <Route path="fashion-jewelry-products" element={<FashionJewelryProducts />} />
            <Route path="ashta-dhatu-categories" element={<AshtaDhatuCategories />} />
            <Route path="fashion-jewelry-categories" element={<FashionJewelryCategories />} />
            <Route path="orders" element={<Order />} />
            <Route path="users" element={<Users />} />
            <Route path="coupon" element={<Coupon />} />
            <Route path="delivery-charges" element={<Deleverycharges />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="file-manager" element={<FileManager />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
            <Route path="products/add" element={<AddProduct />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
