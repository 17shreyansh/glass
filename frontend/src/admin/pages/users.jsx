import React, { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Menu,
  Card,
  Form,
  Input,
  Button,
  Table,
  Tag,
  Modal,
  message,
  Tabs,
  Space,
  Avatar,
  Descriptions,
  Popconfirm,
  Select,
  Row,
  Col,
  Statistic,
  Typography,
  Divider,
  Alert,
  App
} from 'antd';
import {
  UserOutlined,
  SettingOutlined,
  TeamOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Header, Sider, Content } = Layout;

const { Title, Text } = Typography;
const { Option } = Select;

// Use the correct API URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Initialize axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API URL:', API_URL);

const UserManagementSystem = () => {
  const { message: messageApi } = App.useApp();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTabKey, setActiveTabKey] = useState('profile'); // Controls active tab

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);
  const [deactivateLoading, setDeactivateLoading] = useState(false);

  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [deactivateForm] = Form.useForm();

  const [editProfileMode, setEditProfileMode] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // --- API Calls (Centralized) ---

  const fetchCurrentUserProfile = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching user profile...');
      const profileResponse = await axiosInstance.get('/auth/profile');
      console.log('Profile response:', profileResponse.data);
      const userData = profileResponse.data.data;
      setCurrentUser(userData);
      console.log('User data set:', userData);
      profileForm.setFieldsValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zipCode: userData.address?.zipCode || '',
        country: userData.address?.country || ''
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      messageApi.error(errorMessage);
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, [profileForm, messageApi]);



  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      console.log('Fetching users...');
      const response = await axiosInstance.get('/auth/users');
      console.log('Users response:', response.data);
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Users fetch error:', error);
      messageApi.error(error.response?.data?.message || 'Failed to fetch users');
    } finally {
      setUsersLoading(false);
    }
  }, [messageApi]);

  // --- Effects ---

  useEffect(() => {
    const initializeUserSession = async () => {
      setLoading(true);
      await fetchCurrentUserProfile();
      setLoading(false);
    };

    initializeUserSession();
  }, [fetchCurrentUserProfile]);

  useEffect(() => {
    console.log('Current user changed:', currentUser);
    if (currentUser) {
      if (currentUser.isAdmin) {
        console.log('User is admin, fetching users...');
        setIsAdmin(true);
        setActiveTabKey('admin');
        fetchUsers();
      } else {
        console.log('User is not admin');
        setIsAdmin(false);
        setActiveTabKey('profile');
      }
    }
  }, [currentUser, fetchUsers]);

  // --- Handlers ---

  const handleUpdateProfile = async (values) => {
    setProfileLoading(true);
    try {
      const { street, city, state, zipCode, country, ...otherValues } = values;
      const updateData = {
        ...otherValues,
        address: { street, city, state, zipCode, country }
      };
      const response = await axiosInstance.put('/auth/profile', updateData);
      setCurrentUser(response.data.data);
      setEditProfileMode(false);
      messageApi.success('Profile updated successfully!');
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setPasswordChangeLoading(true);
    try {
      await axiosInstance.put('/auth/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword
      });
      messageApi.success('Password changed successfully!');
      passwordForm.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  const handleDeactivateAccount = async (values) => {
    setDeactivateLoading(true);
    try {
      await axiosInstance.post('/auth/deactivate-account', { password: values.password });
      messageApi.success('Account deactivated successfully');
      setCurrentUser(null);
      // Optionally redirect to login page or show a deactivation message
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to deactivate account');
    } finally {
      setDeactivateLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      messageApi.success('Logged out successfully');
      setCurrentUser(null);
    } catch (error) {
      messageApi.error('Logout failed');
    }
  };

  const handleResendVerification = async (email) => {
    try {
      await axiosInstance.post('/auth/resend-verification', { email });
      messageApi.success('Verification email sent successfully');
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to send verification email');
    }
  };

  const handleReactivateAccount = async (email) => {
    try {
      await axiosInstance.post('/auth/reactivate-account', { email });
      messageApi.success('Account reactivated successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      messageApi.error(error.response?.data?.message || 'Failed to reactivate account');
    }
  };

  // --- Render Functions for Tabs ---

  const renderUserProfileTab = () => (
    <Card
      title="My Profile"
      extra={
        <Button
          icon={<EditOutlined />}
          onClick={() => setEditProfileMode(!editProfileMode)}
          type={editProfileMode ? "default" : "primary"}
        >
          {editProfileMode ? 'Cancel' : 'Edit Profile'}
        </Button>
      }
    >
      {!editProfileMode ? (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Name">
            <Space>
              <Avatar icon={<UserOutlined />} />
              {currentUser?.name}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            <Space>
              <MailOutlined />
              {currentUser?.email}
              {currentUser?.isEmailVerified ? (
                <Tag color="green">Verified</Tag>
              ) : (
                <Tag color="orange">Pending Verification</Tag>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            <Space>
              <PhoneOutlined />
              {currentUser?.phone || 'Not provided'}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            <Space>
              <HomeOutlined />
              {currentUser?.address ?
                `${currentUser.address.street}, ${currentUser.address.city}, ${currentUser.address.state} ${currentUser.address.zipCode}, ${currentUser.address.country}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',') || 'Not provided'
                : 'Not provided'
              }
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Account Status">
            <Tag color={currentUser?.accountStatus === 'active' ? 'green' : 'orange'}>
              {currentUser?.accountStatus?.toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Member Since">
            {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: 'Please enter your name' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phone"
                name="phone"
              >
                <Input prefix={<PhoneOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Address Information</Divider>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Street Address" name="street">
                <Input prefix={<HomeOutlined />} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="City" name="city">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="State" name="state">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="ZIP Code" name="zipCode">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Country" name="country">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={profileLoading}>
                Update Profile
              </Button>
              <Button onClick={() => setEditProfileMode(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Card>
  );

  const renderChangePasswordTab = () => (
    <Card title="Change Password">
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={handleChangePassword}
        style={{ maxWidth: 400 }}
      >
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={passwordChangeLoading}>
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  const renderAdminUserManagementTab = () => {
    const filteredUsers = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.accountStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <Space>
            <Avatar icon={<UserOutlined />} />
            <div>
              <div>{text}</div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {record.email}
              </Text>
            </div>
          </Space>
        ),
      },
      {
        title: 'Email Status',
        dataIndex: 'isEmailVerified',
        key: 'isEmailVerified',
        render: (verified, record) => (
          <Space direction="vertical" size="small">
            <Tag color={verified ? 'green' : 'orange'}>
              {verified ? 'Verified' : 'Pending'}
            </Tag>
            {!verified && (
              <Button
                size="small"
                type="link"
                onClick={() => handleResendVerification(record.email)}
              >
                Resend Verification
              </Button>
            )}
          </Space>
        ),
      },
      {
        title: 'Account Status',
        dataIndex: 'accountStatus',
        key: 'accountStatus',
        render: (status, record) => (
          <Space direction="vertical" size="small">
            <Tag color={
              status === 'active' ? 'green' :
                status === 'pending' ? 'orange' : 'red'
            }>
              {status?.toUpperCase()}
            </Tag>
            {status === 'deactivated' && (
              <Popconfirm
                title="Reactivate this account?"
                onConfirm={() => handleReactivateAccount(record.email)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" type="link">
                  Reactivate
                </Button>
              </Popconfirm>
            )}
          </Space>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'isAdmin',
        key: 'isAdmin',
        render: (isAdmin) => (
          <Tag color={isAdmin ? 'purple' : 'blue'}>
            {isAdmin ? 'Admin' : 'User'}
          </Tag>
        ),
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        render: (phone) => phone || 'Not provided',
      },
      {
        title: 'Last Login',
        dataIndex: 'lastLogin',
        key: 'lastLogin',
        render: (date) => date ? new Date(date).toLocaleDateString() : 'Never',
      },
      {
        title: 'Joined',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date) => new Date(date).toLocaleDateString(),
      },
    ];

    const userStats = {
      total: users.length,
      active: users.filter(u => u.accountStatus === 'active').length,
      pending: users.filter(u => u.accountStatus === 'pending').length,
      deactivated: users.filter(u => u.accountStatus === 'deactivated').length,
      verified: users.filter(u => u.isEmailVerified).length,
      admins: users.filter(u => u.isAdmin).length,
    };

    return (
      <div>
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={4}>
            <Card>
              <Statistic title="Total Users" value={userStats.total} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Active Users"
                value={userStats.active}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Pending Users"
                value={userStats.pending}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Deactivated"
                value={userStats.deactivated}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic title="Verified Emails" value={userStats.verified} />
            </Card>
          </Col>
          <Col span={4}>
            <Card>
              <Statistic
                title="Admins"
                value={userStats.admins}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>

        <Card
          title="User Management"
          extra={
            <Button icon={<ReloadOutlined />} onClick={fetchUsers} loading={usersLoading}>
              Refresh
            </Button>
          }
        >
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder="Search users..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="all">All Status</Option>
              <Option value="active">Active</Option>
              <Option value="pending">Pending</Option>
              <Option value="deactivated">Deactivated</Option>
            </Select>
          </Space>

          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="_id"
            loading={usersLoading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
            }}
          />
        </Card>
      </div>
    );
  };

  const renderAccountSettingsTab = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card title="Account Actions">
        <Space direction="vertical" size="middle">
          <Button type="primary" onClick={handleLogout}>
            Logout
          </Button>

          {!currentUser?.isEmailVerified && (
            <Button
              type="default"
              onClick={() => handleResendVerification(currentUser?.email)}
            >
              Resend Email Verification
            </Button>
          )}
        </Space>
      </Card>

      <Card title="Danger Zone" style={{ borderColor: '#ff4d4f' }}>
        <Alert
          message="Deactivate Account"
          description="Once you deactivate your account, you will be logged out and won't be able to access it until you reactivate it."
          type="warning"
          style={{ marginBottom: 16 }}
        />

        <Form
          form={deactivateForm}
          onFinish={handleDeactivateAccount}
          style={{ maxWidth: 400 }}
        >
          <Form.Item
            label="Enter your password to confirm"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item>
            <Popconfirm
              title="Are you sure you want to deactivate your account?"
              onConfirm={() => deactivateForm.submit()}
              okText="Yes, Deactivate"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button
                danger
                loading={deactivateLoading}
              >
                Deactivate Account
              </Button>
            </Popconfirm>
          </Form.Item>
        </Form>
      </Card>
    </Space>
  );


  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px', textAlign: 'center' }}>
          <Title level={3}>Loading...</Title>
        </Content>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '50px', textAlign: 'center' }}>
          <Title level={3}>Please log in to access this page</Title>
          {/* You might want to add a login button/link here */}
        </Content>
      </Layout>
    );
  }

  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <UserOutlined />
          My Profile
        </span>
      ),
      children: renderUserProfileTab(),
    },
    {
      key: 'password',
      label: (
        <span>
          <LockOutlined />
          Change Password
        </span>
      ),
      children: renderChangePasswordTab(),
    },
    {
      key: 'settings',
      label: (
        <span>
          <SettingOutlined />
          Account Settings
        </span>
      ),
      children: renderAccountSettingsTab(),
    },
  ];

  if (isAdmin) {
    tabItems.unshift({
      key: 'admin',
      label: (
        <span>
          <TeamOutlined />
          User Management
        </span>
      ),
      children: renderAdminUserManagementTab(),
    });
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={3} style={{ margin: 0 }}>
            {isAdmin ? 'Admin Dashboard' : 'My Account'}
          </Title>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{currentUser?.name}</Text>
            {isAdmin && <Tag color="purple">Admin</Tag>}
          </Space>
        </div>
      </Header>

      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: '24px', minHeight: 280 }}>
          <Tabs activeKey={activeTabKey} onChange={setActiveTabKey} items={tabItems} />
        </Content>
      </Layout>
    </Layout>
  );
};

export default UserManagementSystem;