import React, { useState, useEffect } from 'react';
import {
  Table,
  Modal,
  Button,
  Form,
  Input,
  InputNumber,
  Switch,
  Space,
  message,
  Card,
  Row,
  Col,
  Select,
  Divider,
  Tag,
  Popconfirm,
  Tooltip,
  Alert,
  Pagination
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  ReloadOutlined,
  SettingOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import adminApi from '../../services/adminApi';

const { Option } = Select;
const { TextArea } = Input;

const DeliveryChargesPage = () => {
  // Initialize defaultCharge with an empty object or null, it will be fetched from backend
  const [defaultCharge, setDefaultCharge] = useState(null); 
  const [charges, setCharges] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isBulkModalVisible, setIsBulkModalVisible] = useState(false);
  const [isDefaultModalVisible, setIsDefaultModalVisible] = useState(false);
  const [editingCharge, setEditingCharge] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    isActive: undefined
  });

  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();
  const [defaultForm] = Form.useForm();



  // Set default charge values
  const setDefaultChargeValues = () => {
    setDefaultCharge({
      charge: 50,
      minimumOrderValue: 0,
      freeDeliveryThreshold: 500,
      estimatedDays: 3
    });
  };

  // Handle Save Default Settings (local only)
  const handleSaveDefaultSettings = async (values) => {
    setDefaultCharge(values);
    setIsDefaultModalVisible(false);
    message.success('Default settings updated locally!');
  };


  // Fetch delivery charges with pagination and filters
  const fetchDeliveryCharges = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const params = {
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters
      };

      const data = await adminApi.getDeliveryCharges(params);

      setCharges(data.deliveryCharges);
      setPagination({
        current: data.currentPage,
        pageSize: pageSize,
        total: data.total
      });
    } catch (error) {
      message.error('Failed to fetch delivery charges');
      console.error('Fetch charges error:', error);
    }
    setLoading(false);
  };

  // Fetch locations for dropdown
  const fetchLocations = async () => {
    try {
      const data = await adminApi.getDeliveryCharges({ limit: 10000, isActive: 'true' });
      const allCharges = data.deliveryCharges || [];

      const uniqueStates = new Set();
      const stateCityMap = new Map();

      allCharges.forEach(charge => {
        uniqueStates.add(charge.state);
        if (!stateCityMap.has(charge.state)) {
          stateCityMap.set(charge.state, new Set());
        }
        stateCityMap.get(charge.state).add(charge.city);
      });

      const formattedLocations = Array.from(uniqueStates).sort().map(state => ({
        state: state,
        cities: Array.from(stateCityMap.get(state)).sort()
      }));

      setLocations(formattedLocations);
    } catch (error) {
      console.error('Fetch locations error:', error);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    setDefaultChargeValues(); // Set default values
    fetchDeliveryCharges();
    fetchLocations();
  }, []);

  // Refetch charges when filters change (resets to page 1)
  useEffect(() => {
    fetchDeliveryCharges(1, pagination.pageSize);
  }, [filters]);

  // Shows the add/edit modal, populating form if editing
  const showModal = (charge = null) => {
    setEditingCharge(charge);
    if (charge) {
      form.setFieldsValue(charge);
    } else {
      // Use fetched defaultCharge if available, otherwise fallback
      form.setFieldsValue({
        state: '',
        city: '',
        charge: defaultCharge?.charge || 50,
        minimumOrderValue: defaultCharge?.minimumOrderValue || 0,
        freeDeliveryThreshold: defaultCharge?.freeDeliveryThreshold || 500,
        estimatedDays: defaultCharge?.estimatedDays || 3,
        isActive: true
      });
    }
    setIsModalVisible(true);
  };

  // Closes the add/edit modal and resets form
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingCharge(null);
    form.resetFields();
  };

  // Handles form submission for adding or editing a delivery charge
  const handleFormSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingCharge) {
        await adminApi.updateDeliveryCharge(editingCharge._id, values);
      } else {
        await adminApi.createDeliveryCharge(values);
      }

      message.success(`Delivery charge for ${values.city}, ${values.state} ${editingCharge ? 'updated' : 'created'} successfully!`);
      handleCancel();
      fetchDeliveryCharges(pagination.current, pagination.pageSize);
      fetchLocations();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to save delivery charge');
      console.error('Save charge error:', error);
    }
    setLoading(false);
  };

  // Handles deletion of a delivery charge
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await adminApi.deleteDeliveryCharge(id);
      message.success('Delivery charge deleted successfully!');
      fetchDeliveryCharges(pagination.current, pagination.pageSize);
      fetchLocations();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete delivery charge');
      console.error('Delete charge error:', error);
    }
    setLoading(false);
  };

  // Handles bulk upload of delivery charges from CSV data
  const handleBulkUpload = async (values) => {
    setLoading(true);
    try {
      const bulkData = values.bulkData.split('\n').map(line => {
        const [state, city, charge, minimumOrderValue, freeDeliveryThreshold, estimatedDays, isActive] = line.split(',');
        return {
          state: state?.trim(),
          city: city?.trim(),
          charge: parseFloat(charge?.trim()) || 0,
          minimumOrderValue: parseFloat(minimumOrderValue?.trim()) || 0,
          freeDeliveryThreshold: parseFloat(freeDeliveryThreshold?.trim()) || 0,
          estimatedDays: parseInt(estimatedDays?.trim()) || 3,
          isActive: isActive?.trim().toLowerCase() !== 'false'
        };
      }).filter(item => item.state && item.city);

      const result = await adminApi.bulkUploadDeliveryCharges({ deliveryCharges: bulkData });

      message.success(`Bulk upload completed! ${result.data.success.length} records processed successfully`);

      if (result.data.errors.length > 0) {
        message.warning(`${result.data.errors.length} errors occurred during upload. Check console for details.`);
        console.error("Bulk upload errors:", result.data.errors);
      }

      setIsBulkModalVisible(false);
      bulkForm.resetFields();
      fetchDeliveryCharges(pagination.current, pagination.pageSize);
      fetchLocations();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to bulk upload delivery charges');
      console.error('Bulk upload error:', error);
    }
    setLoading(false);
  };

  // Handles changes in filter dropdowns
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clears all active filters
  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      isActive: undefined
    });
  };

  // Handles pagination changes (page number or page size)
  const handlePaginationChange = (page, pageSize) => {
    setPagination(prev => ({ ...prev, current: page, pageSize: pageSize }));
    fetchDeliveryCharges(page, pageSize);
  };

  // Exports current table data to a CSV file
  const exportToCSV = () => {
    const csvContent = [
      ['State', 'City', 'Charge', 'Minimum Order Value', 'Free Delivery Threshold', 'Estimated Days', 'Active'],
      ...charges.map(charge => [
        charge.state,
        charge.city,
        charge.charge,
        charge.minimumOrderValue || 0,
        charge.freeDeliveryThreshold || 0,
        charge.estimatedDays || 3,
        charge.isActive ? 'Yes' : 'No'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'delivery-charges.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Table columns definition
  const columns = [
    {
      title: 'State',
      dataIndex: 'state',
      key: 'state',
      sorter: true,
      width: 120,
    },
    {
      title: 'City',
      dataIndex: 'city',
      key: 'city',
      sorter: true,
      width: 120,
    },
    {
      title: 'Charge',
      dataIndex: 'charge',
      key: 'charge',
      render: (val) => `₹${val}`,
      sorter: true,
      width: 100,
    },
    {
      title: 'Min Order',
      dataIndex: 'minimumOrderValue',
      key: 'minimumOrderValue',
      render: (val) => `₹${val || 0}`,
      width: 100,
    },
    {
      title: 'Free Delivery Over',
      dataIndex: 'freeDeliveryThreshold',
      key: 'freeDeliveryThreshold',
      render: (val) => val ? `₹${val}` : 'No free delivery',
      width: 150,
    },
    {
      title: 'Est. Days',
      dataIndex: 'estimatedDays',
      key: 'estimatedDays',
      render: (val) => `${val || 3} days`,
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this delivery charge?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
      width: 100,
      fixed: 'right',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
            Delivery Charges Management
          </h1>
          <p style={{ color: '#666', margin: '4px 0 0 0' }}>
            Manage delivery charges for different cities and states
          </p>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<SettingOutlined />}
              onClick={() => {
                setIsDefaultModalVisible(true);
                // Set form values immediately when modal opens
                if (defaultCharge) {
                  defaultForm.setFieldsValue(defaultCharge);
                }
              }}
            >
              Default Settings
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={() => setIsBulkModalVisible(true)}
            >
              Bulk Upload
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Charge
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Select
              placeholder="Filter by State"
              value={filters.state}
              onChange={(value) => handleFilterChange('state', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {locations.map(location => (
                <Option key={location.state} value={location.state}>
                  {location.state}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filter by City"
              value={filters.city}
              onChange={(value) => handleFilterChange('city', value)}
              allowClear
              style={{ width: '100%' }}
            >
              {filters.state && locations
                .find(l => l.state === filters.state)
                ?.cities.map(city => (
                  <Option key={city} value={city}>
                    {city}
                  </Option>
                ))}
            </Select>
          </Col>
          <Col span={6}>
            <Select
              placeholder="Filter by Status"
              value={filters.isActive}
              onChange={(value) => handleFilterChange('isActive', value)}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="true">Active</Option>
              <Option value="false">Inactive</Option>
            </Select>
          </Col>
          <Col span={6}>
            <Space>
              <Button onClick={clearFilters}>Clear Filters</Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchDeliveryCharges(pagination.current, pagination.pageSize)}
              >
                Refresh
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Default Charge Alert */}
      {defaultCharge && ( // Only show if defaultCharge is loaded
        <Alert
          message="Default Charge Information"
          description={`Cities not configured will use default charge: ₹${defaultCharge.charge} | Free delivery over: ₹${defaultCharge.freeDeliveryThreshold} | Estimated days: ${defaultCharge.estimatedDays}`}
          type="info"
          icon={<InfoCircleOutlined />}
          style={{ marginBottom: '24px' }}
          action={
            <Button size="small" onClick={() => {
              setIsDefaultModalVisible(true);
              defaultForm.setFieldsValue(defaultCharge); // Set values when button is clicked
            }}>
              Configure
            </Button>
          }
        />
      )}

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={charges}
          rowKey="_id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1000 }}
        />
        <div style={{ marginTop: '16px', textAlign: 'right' }}>
          <Pagination
            current={pagination.current}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onChange={handlePaginationChange}
            onShowSizeChange={handlePaginationChange}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} of ${total} items`
            }
          />
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingCharge ? 'Edit Delivery Charge' : 'Add New Delivery Charge'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="state"
                label="State"
                rules={[{ required: true, message: 'Please select the state!' }]}
              >
                <Input placeholder="Enter state name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="City"
                rules={[{ required: true, message: 'Please enter the city!' }]}
              >
                <Input placeholder="Enter city name" disabled={!!editingCharge} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="charge"
                label="Delivery Charge (₹)"
                rules={[{ required: true, type: 'number', min: 0, message: 'Please enter a valid charge!' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter delivery charge"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="minimumOrderValue"
                label="Minimum Order Value (₹)"
                tooltip="Minimum order value required for delivery"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter minimum order value"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="freeDeliveryThreshold"
                label="Free Delivery Threshold (₹)"
                tooltip="Order value above which delivery is free"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter free delivery threshold"
                  min={0}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedDays"
                label="Estimated Delivery Days"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter estimated days"
                  min={1}
                  max={30}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="isActive"
            label="Status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editingCharge ? 'Update' : 'Create'} Charge
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Bulk Upload Modal */}
      <Modal
        title="Bulk Upload Delivery Charges"
        open={isBulkModalVisible}
        onCancel={() => setIsBulkModalVisible(false)}
        footer={null}
        width={700}
      >
        <Alert
          message="CSV Format"
          description="Format: State,City,Charge,MinOrderValue,FreeDeliveryThreshold,EstimatedDays,IsActive. Example: MAHARASHTRA,MUMBAI,60,500,1000,2,true"
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Form form={bulkForm} layout="vertical" onFinish={handleBulkUpload}>
          <Form.Item
            name="bulkData"
            label="CSV Data"
            rules={[{ required: true, message: 'Please enter CSV data!' }]}
          >
            <TextArea
              rows={10}
              placeholder="MAHARASHTRA,MUMBAI,60,500,1000,2,true
KARNATAKA,BANGALORE,50,400,800,3,true
DELHI,NEW DELHI,40,300,600,1,true"
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsBulkModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Upload Charges
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Default Settings Modal */}
      <Modal
        title="Default Delivery Charge Settings"
        open={isDefaultModalVisible}
        onCancel={() => setIsDefaultModalVisible(false)}
        footer={null}
        width={500}
      >
        <Alert
          message="Default Configuration"
          description="These settings will be used as default values for new cities you add."
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
        <Form
          form={defaultForm}
          layout="vertical"
          // Set initial values from the defaultCharge state
          initialValues={defaultCharge}
          onFinish={handleSaveDefaultSettings} // <-- Use the new handler
        >
          <Form.Item
            name="charge"
            label="Default Delivery Charge (₹)"
            rules={[{ required: true, type: 'number', min: 0 }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="minimumOrderValue"
            label="Default Minimum Order Value (₹)"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="freeDeliveryThreshold"
            label="Default Free Delivery Threshold (₹)"
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <Form.Item
            name="estimatedDays"
            label="Default Estimated Days"
          >
            <InputNumber style={{ width: '100%' }} min={1} max={30} />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setIsDefaultModalVisible(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Default Settings
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeliveryChargesPage;