import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Modal,
  Form,
  Row,
  Col,
  Statistic,
  Drawer,
  Typography,
  Descriptions,
  List,
  Avatar,
  Switch,
  message,
  Spin,
  Pagination,
  DatePicker,
  Divider
} from 'antd';
import {
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  EditOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  UserOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  TruckOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;



const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetailVisible, setOrderDetailVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [codEnabled, setCodEnabled] = useState(true);
  const [statusForm] = Form.useForm();

  // Order status configurations
  const statusConfig = {
    PENDING: { color: 'orange', text: 'Pending' },
    CONFIRMED: { color: 'blue', text: 'Confirmed' },
    PROCESSING: { color: 'purple', text: 'Processing' },
    SHIPPED: { color: 'cyan', text: 'Shipped' },
    DELIVERED: { color: 'green', text: 'Delivered' },
    CANCELLED: { color: 'red', text: 'Cancelled' }
  };

  const statusOptions = Object.entries(statusConfig).map(([value, config]) => ({
    value,
    label: config.text
  }));

  // Fetch orders
  const fetchOrders = async (page = 1, pageSize = 20) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        ...filters
      };

      const data = await adminApi.getOrders(params);

      if (data.success) {
        setOrders(data.orders || []);
        setStats(data.stats || []);
        setPagination({
          current: data.pagination?.page || page,
          pageSize: data.pagination?.limit || pageSize,
          total: data.pagination?.total || 0
        });
      }
    } catch (error) {
      message.error('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch COD status
  const fetchCODStatus = async () => {
    try {
      const data = await adminApi.getCODStatus();
      if (data.success) {
        setCodEnabled(data.codEnabled);
      }
    } catch (error) {
      console.error('Error fetching COD status:', error);
    }
  };

  // Toggle COD
  const handleToggleCOD = async () => {
    try {
      const data = await adminApi.toggleCOD(!codEnabled);

      if (data.success) {
        setCodEnabled(!codEnabled);
        message.success(data.message);
      }
    } catch (error) {
      message.error('Failed to update COD settings');
      console.error('Error toggling COD:', error);
    }
  };

  // Update order status
  const handleUpdateStatus = async (values) => {
    try {
      const data = await adminApi.updateOrderStatus(selectedOrder._id, values);

      if (data.success) {
        message.success('Order status updated successfully');
        setStatusModalVisible(false);
        setSelectedOrder(null);
        statusForm.resetFields();
        fetchOrders(pagination.current, pagination.pageSize);
      }
    } catch (error) {
      message.error('Failed to update order status');
      console.error('Error updating status:', error);
    }
  };

  // Handle table change (pagination, filters, sorting)
  const handleTableChange = (paginationInfo, filtersInfo, sorter) => {
    fetchOrders(paginationInfo.current, paginationInfo.pageSize);
  };

  // Search handler
  const handleSearch = (value) => {
    setFilters({ ...filters, search: value });
    fetchOrders(1, pagination.pageSize);
  };

  // Filter by status
  const handleStatusFilter = (value) => {
    setFilters({ ...filters, status: value });
    fetchOrders(1, pagination.pageSize);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-IN');
  };

  // --- Client-side Invoice Generation Function ---
  const generateInvoiceHtml = (order) => {
    if (!order) return '<div>No order selected.</div>';

    const itemsHtml = order.items.map(item => `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px 0;">${item.name}</td>
        <td style="padding: 8px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 0; text-align: right;">${formatCurrency(item.price)}</td>
        <td style="padding: 8px 0; text-align: right;">${formatCurrency(item.price * item.quantity)}</td>
      </tr>
    `).join('');

    return `
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Invoice #${order.orderNumber}</title>
          <style>
              body { font-family: 'Arial', sans-serif; margin: 20px; color: #333; }
              .container { width: 800px; margin: 0 auto; border: 1px solid #eee; padding: 30px; box-shadow: 0 0 10px rgba(0,0,0,0.05); }
              .header, .footer { text-align: center; margin-bottom: 30px; }
              .header h1 { margin: 0; color: #555; }
              .invoice-details, .customer-details, .summary-details { margin-bottom: 20px; }
              .invoice-details table, .customer-details table, .summary-details table { width: 100%; border-collapse: collapse; }
              .invoice-details td, .customer-details td, .summary-details td { padding: 5px; vertical-align: top; }
              .invoice-details .label, .customer-details .label, .summary-details .label { font-weight: bold; width: 150px; }
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              .items-table th, .items-table td { border: 1px solid #eee; padding: 8px; text-align: left; }
              .items-table th { background-color: #f9f9f9; }
              .total-row { font-weight: bold; background-color: #f0f0f0; }
              .text-right { text-align: right; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Invoice</h1>
                  <p>Order Number: <strong>${order.orderNumber}</strong></p>
                  <p>Date: ${formatDate(order.createdAt)}</p>
              </div>

              <div class="customer-details">
                  <table style="width: 100%;">
                      <tr>
                          <td style="width: 50%;">
                              <strong>Bill To:</strong><br/>
                              ${order.userId?.name || 'N/A'}<br/>
                              ${order.userId?.email || 'N/A'}<br/>
                              ${order.shippingAddress?.phone || 'N/A'}
                          </td>
                          <td style="width: 50%;">
                              <strong>Ship To:</strong><br/>
                              ${order.shippingAddress?.name || order.userId?.name || 'N/A'}<br/>
                              ${order.shippingAddress?.address || 'N/A'}<br/>
                              ${order.shippingAddress?.city || 'N/A'}, ${order.shippingAddress?.state || 'N/A'} - ${order.shippingAddress?.pincode || 'N/A'}
                          </td>
                      </tr>
                  </table>
              </div>

              <table class="items-table">
                  <thead>
                      <tr>
                          <th>Item</th>
                          <th style="text-align: center;">Qty</th>
                          <th style="text-align: right;">Unit Price</th>
                          <th style="text-align: right;">Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${itemsHtml}
                  </tbody>
              </table>

              <div class="summary-details" style="width: 100%; text-align: right;">
                  <table style="width: 50%; float: right;">
                      <tr>
                          <td>Subtotal:</td>
                          <td class="text-right">${formatCurrency(order.subtotal)}</td>
                      </tr>
                      <tr>
                          <td>Delivery Charge:</td>
                          <td class="text-right">${formatCurrency(order.deliveryCharge)}</td>
                      </tr>
                      ${order.discountAmount > 0 ? `
                      <tr>
                          <td>Discount:</td>
                          <td class="text-right">-${formatCurrency(order.discountAmount)}</td>
                      </tr>` : ''}
                      <tr class="total-row">
                          <td>Grand Total:</td>
                          <td class="text-right">${formatCurrency(order.totalAmount)}</td>
                      </tr>
                      <tr>
                          <td>Payment Method:</td>
                          <td class="text-right">${order.payment?.method || 'N/A'} (${order.payment?.status || 'N/A'})</td>
                      </tr>
                  </table>
                  <div style="clear: both;"></div>
              </div>

              <div class="footer" style="margin-top: 50px;">
                  <p>Thank you for your business!</p>
              </div>
          </div>
      </body>
      </html>
    `;
  };

  const handleDownloadInvoice = (order) => {
    if (!order) {
      message.error('No order selected to generate invoice.');
      return;
    }
    const invoiceHtml = generateInvoiceHtml(order);
    const newWindow = window.open('', '_blank', 'width=800,height=700');
    if (newWindow) {
      newWindow.document.write(invoiceHtml);
      newWindow.document.close();
      newWindow.focus();
      // Optional: Automatically trigger print dialog
      // newWindow.print();
    } else {
      message.error('Failed to open new window for invoice. Please allow pop-ups.');
    }
  };


  // --- New Functionality: Export All Data ---
  const handleExportData = async () => {
    setLoading(true); // You can use a separate loading state for export if needed
    try {
      // Fetch all orders, or potentially just the filtered ones without pagination limit
      // For simplicity, we'll fetch all orders with a large limit.
      // In a real application, consider a dedicated export endpoint on the backend.
      const data = await adminApi.getOrders({
        limit: 10000, // Fetch a large number of orders for export
        ...filters // Apply current filters to the export
      });

      if (data.success && data.orders.length > 0) {
        const ordersToExport = data.orders;
        const csv = convertOrdersToCsv(ordersToExport);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'orders_export.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('Order data exported successfully!');
      } else {
        message.info('No orders to export based on current filters.');
      }
    } catch (error) {
      message.error('Failed to export order data');
      console.error('Error exporting orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert order data to CSV format
  const convertOrdersToCsv = (data) => {
    if (!data || data.length === 0) return '';

    const headers = [
      'Order Number', 'Customer Name', 'Customer Email', 'Customer Phone',
      'Shipping Address', 'Total Items', 'Total Amount', 'Payment Method',
      'Payment Status', 'Order Status', 'Order Date', 'Tracking Number', 'Notes',
      'Items Details (Name | Quantity | Price | Size | Color)'
    ];

    const rows = data.map(order => {
      const customerName = order.userId?.name || 'N/A';
      const customerEmail = order.userId?.email || 'N/A';
      const customerPhone = order.shippingAddress?.phone || 'N/A';
      const shippingAddress = `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`;
      const totalItems = order.items?.length || 0;
      const totalAmount = order.totalAmount || 0;
      const paymentMethod = order.payment?.method || 'N/A';
      const paymentStatus = order.payment?.status || 'N/A';
      const orderStatus = statusConfig[order.status]?.text || order.status;
      const orderDate = formatDate(order.createdAt);
      const trackingNumber = order.trackingNumber || 'N/A';
      const notes = order.notes || 'N/A';

      const itemDetails = order.items.map(item =>
        `${item.name} | Qty: ${item.quantity} | Price: ${item.price} | Size: ${item.size || 'N/A'} | Color: ${item.color || 'N/A'}`
      ).join('; '); // Use semicolon to separate multiple items

      return [
        `"${order.orderNumber}"`, // Enclose to handle potential commas
        `"${customerName}"`,
        `"${customerEmail}"`,
        `"${customerPhone}"`,
        `"${shippingAddress.replace(/"/g, '""')}"`, // Handle quotes in address
        totalItems,
        totalAmount,
        `"${paymentMethod}"`,
        `"${paymentStatus}"`,
        `"${orderStatus}"`,
        `"${orderDate}"`,
        `"${trackingNumber}"`,
        `"${notes.replace(/"/g, '""')}"`, // Handle quotes in notes
        `"${itemDetails.replace(/"/g, '""')}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };


  // Table columns
  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 180,
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 200,
      render: (_, record) => (
        <div>
          <div><Text strong>{record.userId?.name}</Text></div>
          <div><Text type="secondary" style={{ fontSize: '12px' }}>{record.userId?.email}</Text></div>
        </div>
      )
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      width: 80,
      render: (items) => (
        <Tag color="blue">{items?.length || 0} items</Tag>
      )
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => <Text strong>{formatCurrency(amount)}</Text>
    },
    {
      title: 'Payment',
      key: 'payment',
      width: 120,
      render: (_, record) => (
        <div>
          <Tag color={record.payment?.method === 'COD' ? 'orange' : 'blue'}>
            {record.payment?.method}
          </Tag>
          <div>
            <Tag color={record.payment?.status === 'PAID' ? 'green' : 'orange'} style={{ marginTop: 4 }}>
              {record.payment?.status}
            </Tag>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={statusConfig[status]?.color}>
          {statusConfig[status]?.text || status}
        </Tag>
      )
    },
    {
      title: 'Order Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date) => formatDate(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150, // Increased width to accommodate new button
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              setOrderDetailVisible(true);
            }}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedOrder(record);
              statusForm.setFieldsValue({
                status: record.status,
                trackingNumber: record.trackingNumber || '',
                notes: record.notes || ''
              });
              setStatusModalVisible(true);
            }}
            title="Update Status"
          />
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => handleDownloadInvoice(record)} // Pass the whole record
            title="View/Print Invoice"
          />
        </Space>
      )
    }
  ];

  // Calculate stats summary
  const getStatsSummary = () => {
    const totalOrders = stats.reduce((sum, stat) => sum + stat.count, 0);
    const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);
    const pendingOrders = stats.find(s => s._id === 'PENDING')?.count || 0;
    const deliveredOrders = stats.find(s => s._id === 'DELIVERED')?.count || 0;

    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
  };

  const statsSummary = getStatsSummary();

  useEffect(() => {
    fetchOrders();
    fetchCODStatus();
  }, []);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <ShoppingCartOutlined /> Order Management
            </Title>
            <Text type="secondary">Manage and track all customer orders</Text>
          </Col>
          <Col>
            <Space>
              <Switch
                checked={codEnabled}
                onChange={handleToggleCOD}
                checkedChildren="COD ON"
                unCheckedChildren="COD OFF"
              />
              <Button type="primary" icon={<ReloadOutlined />} onClick={() => fetchOrders()}>
                Refresh
              </Button>
              <Button icon={<FileExcelOutlined />} onClick={handleExportData}>
                Export All Data
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={statsSummary.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={statsSummary.totalRevenue}
              precision={0}
              prefix={<DollarOutlined />}
              formatter={(value) => formatCurrency(value)}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Pending Orders"
              value={statsSummary.pendingOrders}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Delivered Orders"
              value={statsSummary.deliveredOrders}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Search by order number, customer name, or phone..."
              allowClear
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              placeholder="Filter by status"
              allowClear
              style={{ width: '100%' }}
              onChange={handleStatusFilter}
            >
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} orders`
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* Order Detail Drawer */}
      <Drawer
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        placement="right"
        size="large"
        onClose={() => setOrderDetailVisible(false)}
        open={orderDetailVisible}
        extra={
          selectedOrder && (
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadInvoice(selectedOrder)} // Pass the whole record
            >
              View/Print Invoice
            </Button>
          )
        }
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Order Information" bordered column={1}>
              <Descriptions.Item label="Order Number">{selectedOrder.orderNumber}</Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={statusConfig[selectedOrder.status]?.color}>
                  {statusConfig[selectedOrder.status]?.text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">{formatCurrency(selectedOrder.totalAmount)}</Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color={selectedOrder.payment?.method === 'COD' ? 'orange' : 'blue'}>
                  {selectedOrder.payment?.method}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Payment Status">
                <Tag color={selectedOrder.payment?.status === 'PAID' ? 'green' : 'orange'}>
                  {selectedOrder.payment?.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">{formatDate(selectedOrder.createdAt)}</Descriptions.Item>
              {selectedOrder.trackingNumber && (
                <Descriptions.Item label="Tracking Number">{selectedOrder.trackingNumber}</Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Title level={4}>Customer Information</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Name">{selectedOrder.userId?.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedOrder.userId?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">{selectedOrder.shippingAddress?.phone}</Descriptions.Item>
              <Descriptions.Item label="Address">
                {`${selectedOrder.shippingAddress?.address}, ${selectedOrder.shippingAddress?.city}, ${selectedOrder.shippingAddress?.state} - ${selectedOrder.shippingAddress?.pincode}`}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Title level={4}>Order Items</Title>
            <List
              dataSource={selectedOrder.items}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image} />}
                    title={item.name}
                    description={`Size: ${item.size}, Color: ${item.color}, Qty: ${item.quantity}`}
                  />
                  <div>{formatCurrency(item.price * item.quantity)}</div>
                </List.Item>
              )}
            />

            <Divider />

            <Descriptions title="Order Summary" bordered column={1}>
              <Descriptions.Item label="Subtotal">{formatCurrency(selectedOrder.subtotal)}</Descriptions.Item>
              <Descriptions.Item label="Delivery Charge">{formatCurrency(selectedOrder.deliveryCharge)}</Descriptions.Item>
              {selectedOrder.discountAmount > 0 && (
                <Descriptions.Item label="Discount">-{formatCurrency(selectedOrder.discountAmount)}</Descriptions.Item>
              )}
              <Descriptions.Item label="Total Amount" contentStyle={{ fontWeight: 'bold' }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Drawer>

      {/* Update Status Modal */}
      <Modal
        title="Update Order Status"
        open={statusModalVisible}
        onCancel={() => {
          setStatusModalVisible(false);
          setSelectedOrder(null);
          statusForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={statusForm}
          layout="vertical"
          onFinish={handleUpdateStatus}
        >
          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              {statusOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="trackingNumber" label="Tracking Number">
            <Input placeholder="Enter tracking number" />
          </Form.Item>

          <Form.Item name="notes" label="Notes">
            <TextArea rows={3} placeholder="Add notes (optional)" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Status
              </Button>
              <Button onClick={() => setStatusModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;