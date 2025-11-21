import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Drawer,
  Tabs,
  Divider,
  Typography,
  Alert,
  Tooltip,
  Checkbox
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  BarChartOutlined,
  FilterOutlined,
  ContainerOutlined // Replaced BulkOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import adminApi from '../../services/adminApi';
import customParseFormat from 'dayjs/plugin/customParseFormat'; // Import customParseFormat plugin
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'; // Import isSameOrAfter plugin
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'; // Import isSameOrBefore plugin

// Dayjs setup - Ensure plugins are extended
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [stats, setStats] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [form] = Form.useForm();
  const [viewDrawerVisible, setViewDrawerVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null); // This will hold the detailed coupon info + stats
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [bulkModalVisible, setBulkModalVisible] = useState(false);
  const [analyticsVisible, setAnalyticsVisible] = useState(false);
  const [analytics, setAnalytics] = useState([]);



  // Fetch coupons
  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status, // Ensure filters are passed
        type: filters.type,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      }).toString();

      const data = await adminApi.getCoupons({
        page: pagination.current,
        limit: pagination.pageSize,
        status: filters.status,
        type: filters.type,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      });

      setCoupons(data.coupons);
      setPagination(prev => ({
        ...prev,
        total: data.total
      }));
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      message.error(error.response?.data?.message || 'Failed to fetch coupons');
    }
    setLoading(false);
  };

  // Create or update coupon
  const handleSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        validFrom: values.validPeriod[0].toISOString(),
        validUntil: values.validPeriod[1].toISOString()
      };
      delete payload.validPeriod;

      const url = editingCoupon
        ? `${API_BASE}/api/coupons/admin/${editingCoupon._id}`
        : `${API_BASE}/api/coupons/admin`;

      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          'Content-Type': 'application/json'
        },
      });

      message.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully`);
      setIsModalVisible(false);
      form.resetFields();
      setEditingCoupon(null);
      fetchCoupons(); // Re-fetch data after successful operation
    } catch (error) {
      console.error('Error saving coupon:', error);
      message.error(error.response?.data?.message || 'Error saving coupon');
    }
  };

  // Delete coupon
  const handleDelete = async (couponId) => {
    try {
      await axios.delete(`${API_BASE}/api/coupons/admin/${couponId}`);
      message.success('Coupon deleted successfully');
      fetchCoupons(); // Re-fetch data after successful deletion
    } catch (error) {
      console.error('Error deleting coupon:', error);
      message.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  };

  // Toggle coupon status
  const handleToggleStatus = async (couponId) => {
    try {
      await axios.patch(`${API_BASE}/api/coupons/admin/${couponId}/toggle-status`);
      message.success('Coupon status updated');
      fetchCoupons(); // Re-fetch data after status change
    } catch (error) {
      console.error('Error toggling coupon status:', error);
      message.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Bulk operations
  const handleBulkOperation = async (operation) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select coupons first');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE}/api/coupons/admin/bulk-operations`, {
        operation,
        couponIds: selectedRowKeys
      });

      message.success(`${response.data.message} (${response.data.modifiedCount} items affected)`);
      setSelectedRowKeys([]); // Clear selection after bulk operation
      setBulkModalVisible(false);
      fetchCoupons(); // Re-fetch data after bulk operation
    } catch (error) {
      console.error('Error performing bulk operation:', error);
      message.error(error.response?.data?.message || 'Bulk operation failed');
    }
  };

  // Fetch analytics
  const fetchAnalytics = async (period = '30d') => {
    try {
      const response = await axios.get(`${API_BASE}/api/coupons/admin/analytics?period=${period}`);
      setAnalytics(response.data.analytics); // Assuming analytics is an array of coupon stats
    } catch (error) {
      console.error('Error fetching analytics:', error);
      message.error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  };

  // View coupon details
  const viewCouponDetails = async (couponId) => {
    try {
      // Assuming your backend /api/coupons/admin/:id endpoint now returns both coupon and its usage stats
      const response = await axios.get(`${API_BASE}/api/coupons/admin/${couponId}`);
      // The response.data should contain the coupon details and usage stats.
      // E.g., { coupon: { ...couponData }, usageStats: { totalOrders: 5, totalDiscount: 100, ... } }
      setSelectedCoupon(response.data);
      setViewDrawerVisible(true);
    } catch (error) {
      console.error('Error fetching coupon details:', error);
      message.error(error.response?.data?.message || 'Failed to fetch coupon details');
    }
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const colors = {
          PERCENTAGE: 'green',
          FIXED_AMOUNT: 'orange',
          FREE_SHIPPING: 'purple'
        };
        return <Tag color={colors[type]}>{type.replace('_', ' ')}</Tag>;
      }
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value, record) => {
        return record.type === 'PERCENTAGE' ? `${value}%` : `₹${value}`;
      }
    },
    {
      title: 'Usage',
      key: 'usage',
      render: (_, record) => {
        const limit = record.usageLimit === 0 || record.usageLimit === null || record.usageLimit === undefined ? '∞' : record.usageLimit;
        return `${record.usageCount || 0}/${limit}`;
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const now = dayjs(); // Use dayjs for current time
        const validUntilDayjs = dayjs(record.validUntil);
        const isValidNow = now.isSameOrBefore(validUntilDayjs);
        const isExpired = !isValidNow;
        const isActive = record.isActive && isValidNow;

        return (
          <Tag color={isActive ? 'green' : isExpired ? 'red' : 'orange'}>
            {isExpired ? 'EXPIRED' : isActive ? 'ACTIVE' : 'INACTIVE'}
          </Tag>
        );
      }
    },
    {
      title: 'Valid Until',
      dataIndex: 'validUntil',
      key: 'validUntil',
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm') // Added HH:mm for consistency
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              size="small"
              onClick={() => viewCouponDetails(record._id)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingCoupon(record);
                form.setFieldsValue({
                  ...record,
                  // Ensure validPeriod is an array of dayjs objects
                  validPeriod: [dayjs(record.validFrom), dayjs(record.validUntil)]
                });
                setIsModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Toggle Status">
            <Button
              size="small"
              type={record.isActive ? 'default' : 'primary'}
              onClick={() => handleToggleStatus(record._id)}
            >
              {record.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this coupon? This cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                icon={<DeleteOutlined />}
                size="small"
                danger
                disabled={record.usageCount > 0} // Keep this for now, review business logic if needed
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // Fetch coupons on component mount and when pagination/filters change
  useEffect(() => {
    fetchCoupons();
  }, [
    pagination.current,
    pagination.pageSize,
    filters.status,
    filters.type,
    filters.search,
    filters.sortBy,
    filters.sortOrder,
  ]);


  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>Coupon Management</Title>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}> {/* Responsive columns */}
          <Card>
            <Statistic title="Total Coupons" value={stats.totalCoupons || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Active Coupons" value={stats.activeCoupons || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Expired Coupons" value={stats.expiredCoupons || 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Total Usage" value={stats.totalUsage || 0} />
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle"> {/* Added gutter for row and column */}
          <Col xs={24} sm={12} md={6} lg={4}>
            <Input.Search
              placeholder="Search coupons..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, current: 1 }))} // Reset page on search
              onSearch={() => fetchCoupons()} // Trigger fetch on explicit search
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6} lg={3}>
            <Select
              placeholder="Status"
              value={filters.status}
              onChange={(value) => setFilters(prev => ({ ...prev, status: value, current: 1 }))} // Reset page on filter
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
              <Option value="expired">Expired</Option>
              <Option value="valid">Valid</Option> {/* 'Valid' might imply active and not expired */}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={3}>
            <Select
              placeholder="Type"
              value={filters.type}
              onChange={(value) => setFilters(prev => ({ ...prev, type: value, current: 1 }))} // Reset page on filter
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="PERCENTAGE">Percentage</Option>
              <Option value="FIXED_AMOUNT">Fixed Amount</Option>
              <Option value="FREE_SHIPPING">Free Shipping</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={4}>
            <Select
              placeholder="Sort By"
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              }}
              style={{ width: '100%' }}
            >
              <Option value="createdAt-desc">Newest First</Option>
              <Option value="createdAt-asc">Oldest First</Option>
              <Option value="name-asc">Name A-Z</Option>
              <Option value="name-desc">Name Z-A</Option>
              <Option value="usageCount-desc">Most Used</Option>
            </Select>
          </Col>
          <Col xs={24} md={24} lg={10}> {/* Adjusted span for actions */}
            <Space wrap> {/* Use Space with wrap for responsiveness */}
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingCoupon(null);
                  form.resetFields();
                  setIsModalVisible(true);
                }}
              >
                Add Coupon
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setPagination(prev => ({ ...prev, current: 1 })); // Reset pagination on refresh
                  setFilters({ status: '', type: '', search: '', sortBy: 'createdAt', sortOrder: 'desc' }); // Clear all filters on refresh
                  fetchCoupons(); // Then fetch
                }}
              >
                Refresh
              </Button>
              <Button
                icon={<BarChartOutlined />}
                onClick={() => {
                  fetchAnalytics();
                  setAnalyticsVisible(true);
                }}
              >
                Analytics
              </Button>
              {selectedRowKeys.length > 0 && (
                <Button
                  icon={<ContainerOutlined />}
                  onClick={() => setBulkModalVisible(true)}
                >
                  Bulk Operations ({selectedRowKeys.length})
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Coupons Table */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={coupons}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={(paginationInfo) => {
            setPagination(prev => ({
              ...prev,
              current: paginationInfo.current,
              pageSize: paginationInfo.pageSize
            }));
          }}
        />
      </Card>

      {/* Add/Edit Coupon Modal */}
      <Modal
        title={editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCoupon(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isActive: true,
            isPublic: true,
            userUsageLimit: 1,
            minimumOrderAmount: 0,
            // Set default validPeriod for new coupons (e.g., next 30 days)
            validPeriod: editingCoupon ? [dayjs(editingCoupon.validFrom), dayjs(editingCoupon.validUntil)] : [dayjs(), dayjs().add(30, 'days')]
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Coupon Code"
                rules={[
                  { required: true, message: 'Please enter coupon code' },
                  { min: 3, max: 20, message: 'Code must be 3-20 characters' }
                ]}
              >
                <Input placeholder="e.g., SAVE20" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Coupon Name"
                rules={[{ required: true, message: 'Please enter coupon name' }]}
              >
                <Input placeholder="e.g., 20% Off Sale" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Description">
            <TextArea rows={2} placeholder="Coupon description..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="type"
                label="Discount Type"
                rules={[{ required: true, message: 'Please select type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="PERCENTAGE">Percentage</Option>
                  <Option value="FIXED_AMOUNT">Fixed Amount</Option>
                  <Option value="FREE_SHIPPING">Free Shipping</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="value"
                label="Value"
                rules={[{ required: true, message: 'Please enter value' }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="e.g., 20"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minimumOrderAmount" label="Minimum Order Amount">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="0"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="maximumDiscountAmount" label="Maximum Discount">
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="No limit"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="usageLimit" label="Total Usage Limit">
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="Unlimited"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="userUsageLimit" label="Per User Limit">
                <InputNumber
                  min={1}
                  style={{ width: '100%' }}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="validPeriod"
            label="Valid Period"
            rules={[{ required: true, message: 'Please select valid period' }]}
          >
            <RangePicker
              showTime={{ format: 'HH:mm' }} // Specify time format for showTime
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="isActive" label="Active" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="isPublic" label="Public" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCoupon ? 'Update' : 'Create'} Coupon
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                setEditingCoupon(null);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Operations Modal */}
      <Modal
        title="Bulk Operations"
        open={bulkModalVisible}
        onCancel={() => setBulkModalVisible(false)}
        footer={null}
      >
        <Alert
          message={`${selectedRowKeys.length} coupons selected`}
          type="info"
          style={{ marginBottom: '16px' }}
        />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Button
            block
            onClick={() => handleBulkOperation('activate')}
          >
            Activate Selected Coupons
          </Button>
          <Button
            block
            onClick={() => handleBulkOperation('deactivate')}
          >
            Deactivate Selected Coupons
          </Button>
          <Popconfirm
            title="Are you sure you want to delete selected coupons? This action cannot be undone."
            onConfirm={() => handleBulkOperation('delete')}
            okText="Yes, Delete"
            cancelText="Cancel"
          >
            <Button block danger>
              Delete Selected Coupons
            </Button>
          </Popconfirm>
        </Space>
      </Modal>

      {/* View Details Drawer */}
      <Drawer
        title="Coupon Details"
        open={viewDrawerVisible}
        onClose={() => setViewDrawerVisible(false)}
        width={600}
      >
        {selectedCoupon && (
          <div>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Basic Info" key="1">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div><strong>Code:</strong> <Tag color="blue">{selectedCoupon.coupon.code}</Tag></div>
                  <div><strong>Name:</strong> {selectedCoupon.coupon.name}</div>
                  <div><strong>Description:</strong> {selectedCoupon.coupon.description || 'N/A'}</div>
                  <div><strong>Type:</strong> <Tag color="green">{selectedCoupon.coupon.type}</Tag></div>
                  <div><strong>Value:</strong> {selectedCoupon.coupon.type === 'PERCENTAGE' ? `${selectedCoupon.coupon.value}%` : `₹${selectedCoupon.coupon.value}`}</div>
                  <div><strong>Minimum Order:</strong> ₹{selectedCoupon.coupon.minimumOrderAmount}</div>
                  <div><strong>Maximum Discount:</strong> {selectedCoupon.coupon.maximumDiscountAmount ? `₹${selectedCoupon.coupon.maximumDiscountAmount}` : 'No limit'}</div>
                  <div><strong>Valid From:</strong> {dayjs(selectedCoupon.coupon.validFrom).format('DD/MM/YYYY HH:mm')}</div>
                  <div><strong>Valid Until:</strong> {dayjs(selectedCoupon.coupon.validUntil).format('DD/MM/YYYY HH:mm')}</div>
                  <div><strong>Status:</strong> <Tag color={selectedCoupon.coupon.isActive ? 'green' : 'red'}>{selectedCoupon.coupon.isActive ? 'Active' : 'Inactive'}</Tag></div>
                </Space>
              </TabPane>
              <TabPane tab="Usage Stats" key="2">
                <Row gutter={16}>
                  <Col span={8}>
                    <Statistic title="Total Orders" value={selectedCoupon.usageStats.totalOrders || 0} />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Total Discount" value={selectedCoupon.usageStats.totalDiscount || 0} prefix="₹" />
                  </Col>
                  <Col span={8}>
                    <Statistic title="Average Discount" value={selectedCoupon.usageStats.averageDiscount || 0} prefix="₹" precision={2} />
                  </Col>
                </Row>
                <Divider />
                <Title level={5}>User Specific Usage</Title>
                {selectedCoupon.coupon.usedBy && selectedCoupon.coupon.usedBy.length > 0 ? (
                  <Table
                    dataSource={selectedCoupon.coupon.usedBy}
                    rowKey="userId"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: 'User ID',
                        dataIndex: 'userId',
                        key: 'userId',
                        render: (id) => <Text copyable>{id}</Text> // Allow copying user ID
                      },
                      {
                        title: 'Usage Count',
                        dataIndex: 'usageCount',
                        key: 'usageCount',
                      },
                      {
                        title: 'Last Used',
                        dataIndex: 'lastUsed',
                        key: 'lastUsed',
                        render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm')
                      }
                    ]}
                  />
                ) : (
                  <Alert message="No specific user usage data for this coupon yet." type="info" />
                )}
              </TabPane>
            </Tabs>
          </div>
        )}
      </Drawer>

      {/* Analytics Modal */}
      <Modal
        title="Coupon Analytics"
        open={analyticsVisible}
        onCancel={() => setAnalyticsVisible(false)}
        footer={null}
        width={800}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Select
            defaultValue="30d"
            onChange={fetchAnalytics}
            style={{ width: 200 }}
          >
            <Option value="7d">Last 7 days</Option>
            <Option value="30d">Last 30 days</Option>
            <Option value="90d">Last 90 days</Option>
            <Option value="all">All Time</Option> {/* Added 'all' option */}
          </Select>

          {analytics.length > 0 ? (
            <Table
              dataSource={analytics}
              rowKey="_id"
              pagination={false}
              size="small"
              columns={[
                {
                  title: 'Coupon',
                  dataIndex: ['coupon', 'name'],
                  key: 'name'
                },
                {
                  title: 'Code',
                  dataIndex: ['coupon', 'code'],
                  key: 'code',
                  render: (text) => <Tag>{text}</Tag>
                },
                {
                  title: 'Usage Count',
                  dataIndex: 'totalUsage',
                  key: 'totalUsage'
                },
                {
                  title: 'Total Discount',
                  dataIndex: 'totalDiscount',
                  key: 'totalDiscount',
                  render: (value) => `₹${value ? value.toFixed(2) : 0}`
                },
                {
                  title: 'Avg. Discount',
                  dataIndex: 'averageDiscount',
                  key: 'averageDiscount',
                  render: (value) => `₹${value ? value.toFixed(2) : 0}`
                }
              ]}
            />
          ) : (
            <Alert message="No analytics data available for the selected period" type="info" />
          )}
        </Space>
      </Modal>
    </div>
  );
};

export default CouponManagement;