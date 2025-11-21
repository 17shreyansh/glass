import React from 'react';
import { Menu } from 'antd';
import {
  UserOutlined,
  ShoppingOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  UndoOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/account',
      icon: <UserOutlined />,
      label: 'Profile Details',
    },
    {
      key: '/account/orders',
      icon: <ShoppingOutlined />,
      label: 'My Orders',
    },
    {
      key: '/account/wishlist',
      icon: <HeartOutlined />,
      label: 'Wishlist',
    },
    {
      key: '/account/addresses',
      icon: <EnvironmentOutlined />,
      label: 'Addresses',
    },
    {
      key: '/account/returns',
      icon: <UndoOutlined />,
      label: 'Returns & Refunds',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <div className="account-sidebar">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
      />
    </div>
  );
};

export default Sidebar;
