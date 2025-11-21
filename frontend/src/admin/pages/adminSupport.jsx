import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Table,
  Modal,
  Form,
  Input,
  Select,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Tabs,
  List,
  Avatar,
  Pagination,
  message,
  Spin, // Import Spin component for loading indicators
  Tooltip,
  Badge,
  Statistic,
  Divider,
  Alert,
  Empty // Import Empty component for table empty state
} from 'antd';
import {
  EyeOutlined,
  SendOutlined,
  UserOutlined,
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
  ReloadOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import adminApi from '../../services/adminApi';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

const AdminSupportPage = () => {
  // State variables for managing ticket data, UI visibility, and filters
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false); // Controls loading state for ticket fetching
  const [viewModalVisible, setViewModalVisible] = useState(false); // Controls visibility of ticket details modal
  const [assignModalVisible, setAssignModalVisible] = useState(false); // Controls visibility of assign ticket modal
  const [selectedTicket, setSelectedTicket] = useState(null); // Stores the currently selected ticket for viewing/editing
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalTickets, setTotalTickets] = useState(0); // Total number of tickets for pagination
  const [messageText, setMessageText] = useState(''); // Text for new messages in ticket conversation
  const [sendingMessage, setSendingMessage] = useState(false); // Controls loading state for sending messages
  const [activeTab, setActiveTab] = useState('all'); // Active tab for filtering tickets by status
  const [searchText, setSearchText] = useState(''); // Search text for filtering tickets
  const [stats, setStats] = useState({}); // Stores ticket statistics (e.g., count by status)
  const [admins, setAdmins] = useState([]); // Stores list of admin users for assignment
  const [filters, setFilters] = useState({ // Stores additional filters for tickets
    status: '',
    priority: '',
    category: ''
  });
  // Form instances for Ant Design forms
  const [assignForm] = Form.useForm();

  const pageSize = 10; // Number of tickets per page

  // Function to fetch tickets from the API
  const fetchTickets = async (page = 1, status = '', search = '') => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const params = {
        page,
        limit: pageSize,
        ...(status && status !== 'all' && { status }), // Add status filter if not 'all'
        ...(search && { search }), // Add search query if present
        ...(filters.priority && { priority: filters.priority }), // Add priority filter
        ...(filters.category && { category: filters.category }) // Add category filter
      };

      const data = await adminApi.getTickets(params);
      setTickets(data.data); // Update tickets state
      setTotalTickets(data.pagination.total); // Update total tickets for pagination
      setStats(data.stats); // Update ticket statistics
    } catch (error) {
      // Display error message if fetching fails
      message.error(error.response?.data?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false); // Set loading to false after fetching (success or failure)
    }
  };

  // Function to fetch admin users from the API
  const fetchAdmins = async () => {
    try {
      const data = await adminApi.getUsers();
      setAdmins(data.data || []); // Update admins state
    } catch (error) {
      console.error('Failed to fetch admins:', error); // Log error for debugging
    }
  };

  // useEffect hook to fetch data when dependencies change
  useEffect(() => {
    fetchTickets(currentPage, activeTab, searchText); // Fetch tickets based on current page, tab, and search
    fetchAdmins(); // Fetch admin users
  }, [currentPage, activeTab, searchText, filters]); // Dependencies: re-run when these change

  // Function to handle viewing ticket details
  const handleViewTicket = async (ticketId) => {
    try {
      const data = await adminApi.getTicket(ticketId);
      setSelectedTicket(data.data); // Set the selected ticket
      setViewModalVisible(true); // Show the view ticket modal
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to fetch ticket details');
    }
  };

  // Function to handle sending a message to the ticket
  const handleSendMessage = async () => {
    if (!messageText.trim()) return; // Prevent sending empty messages

    setSendingMessage(true); // Set sending message loading state
    try {
      await adminApi.addTicketMessage(selectedTicket._id, messageText);
      setMessageText(''); // Clear message input
      // Refresh ticket data to show the new message
      const data = await adminApi.getTicket(selectedTicket._id);
      setSelectedTicket(data.data);
      message.success('Message sent successfully');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingMessage(false); // Reset sending message loading state
    }
  };

  // Function to handle updating ticket status
  const handleUpdateStatus = async (ticketId, status) => {
    try {
      await adminApi.updateTicket(ticketId, { status });
      message.success('Ticket status updated successfully');
      fetchTickets(currentPage, activeTab, searchText); // Refresh ticket list
      // Update selected ticket if it's currently viewed
      if (selectedTicket && selectedTicket._id === ticketId) {
        const data = await adminApi.getTicket(ticketId);
        setSelectedTicket(data.data);
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update ticket status');
    }
  };

  // Function to handle assigning a ticket to an admin
  const handleAssignTicket = async (values) => {
    try {
      await adminApi.assignTicket(selectedTicket._id, values);
      message.success('Ticket assigned successfully');
      setAssignModalVisible(false); // Hide assign modal
      assignForm.resetFields(); // Reset assign form fields
      fetchTickets(currentPage, activeTab, searchText); // Refresh ticket list

      // Refresh ticket details in the view modal
      const data = await adminApi.getTicket(selectedTicket._id);
      setSelectedTicket(data.data);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to assign ticket');
    }
  };

  // Function to handle deleting a ticket
  const handleDeleteTicket = async (ticketId) => {
    // Use Ant Design's Modal.confirm for user confirmation
    Modal.confirm({
      title: 'Are you sure you want to delete this ticket?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => { // Callback when user confirms deletion
        try {
          await adminApi.deleteTicket(ticketId);
          message.success('Ticket deleted successfully');
          fetchTickets(currentPage, activeTab, searchText); // Refresh ticket list
          if (viewModalVisible) {
            setViewModalVisible(false); // Close view modal if open
          }
        } catch (error) {
          message.error(error.response?.data?.message || 'Failed to delete ticket');
        }
      }
    });
  };

  // Function to handle search input
  const handleSearch = (value) => {
    setSearchText(value); // Update search text state
    setCurrentPage(1); // Reset to first page on new search
  };

  // Function to handle filter changes (priority, category)
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Helper function to get status tag color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'blue';
      case 'In Progress': return 'orange';
      case 'Resolved': return 'green';
      case 'Closed': return 'default';
      default: return 'default';
    }
  };

  // Helper function to get priority tag color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'red';
      case 'High': return 'orange';
      case 'Medium': return 'blue';
      case 'Low': return 'green';
      default: return 'default';
    }
  };

  // Table columns definition
  const columns = [
    {
      title: 'Ticket ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
      render: (text) => <Text strong>{text}</Text>,
      width: 120
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true, // Truncate long titles with ellipsis
      width: 200
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (user) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <Text>{user.name}</Text>
        </Space>
      ),
      width: 150
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag>{category}</Tag>,
      width: 120
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag color={getPriorityColor(priority)}>{priority}</Tag>
      ),
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Select
          value={status}
          size="small"
          style={{ width: 120 }}
          onChange={(value) => handleUpdateStatus(record._id, value)}
          // Disable status change for closed tickets
          disabled={record.status === 'Closed'}
        >
          <Option value="Open">
            <Tag color="blue">Open</Tag>
          </Option>
          <Option value="In Progress">
            <Tag color="orange">In Progress</Tag>
          </Option>
          <Option value="Resolved">
            <Tag color="green">Resolved</Tag>
          </Option>
          <Option value="Closed">
            <Tag color="default">Closed</Tag>
          </Option>
        </Select>
      ),
      width: 140
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      render: (assignedTo) => (
        assignedTo ? (
          <Space>
            <Avatar size="small" icon={<UserOutlined />} />
            <Text>{assignedTo.name}</Text>
          </Space>
        ) : (
          <Text type="secondary">Unassigned</Text>
        )
      ),
      width: 150
    },
    {
      title: 'Messages',
      dataIndex: 'messages',
      key: 'messages',
      render: (messages) => (
        <Badge count={messages.length} showZero>
          <SendOutlined />
        </Badge>
      ),
      width: 80
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
      width: 100
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTicket(record._id)}
            />
          </Tooltip>
          {record.status !== 'Closed' && ( // Only show assign for non-closed tickets
            <Tooltip title="Assign Ticket">
              <Button
                type="default"
                ghost
                size="small"
                icon={<UserOutlined />}
                onClick={() => {
                  setSelectedTicket(record);
                  setAssignModalVisible(true);
                }}
              />
            </Tooltip>
          )}
          <Tooltip title="Delete Ticket">
            <Button
              type="danger"
              ghost
              size="small"
              icon={<CloseOutlined />}
              onClick={() => handleDeleteTicket(record._id)}
            />
          </Tooltip>
        </Space>
      ),
      width: 120,
      fixed: 'right' // Fix actions column to the right for better UX on scroll
    }
  ];

  return (
    // Wrap the entire content with Spin for a full-page loading indicator
    <Spin spinning={loading} size="large" tip="Loading Tickets..." style={{ maxHeight: '100vh' }}>
      <div style={{ padding: '24px' }}>
        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Open Tickets"
                value={stats.Open || 0}
                valueStyle={{ color: '#1890ff' }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="In Progress"
                value={stats['In Progress'] || 0}
                valueStyle={{ color: '#fa8c16' }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Resolved"
                value={stats.Resolved || 0}
                valueStyle={{ color: '#52c41a' }}
                prefix={<CheckOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="Closed"
                value={stats.Closed || 0}
                valueStyle={{ color: '#8c8c8c' }}
                prefix={<CloseOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Title level={2}>Support Tickets Management</Title>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => fetchTickets(currentPage, activeTab, searchText)}
                  loading={loading}
                >
                  Refresh
                </Button>
              </div>

              {/* Search and Filters */}
              <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
                <Col xs={24} sm={12} md={8}>
                  <Search
                    placeholder="Search tickets by ID, title, or description..."
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: '100%' }}
                  />
                </Col>
                <Col xs={24} sm={12} md={4}>
                  <Select
                    placeholder="Filter by Priority"
                    allowClear
                    style={{ width: '100%' }}
                    onChange={(value) => handleFilterChange('priority', value)}
                  >
                    <Option value="Critical">Critical</Option>
                    <Option value="High">High</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Low">Low</Option>
                  </Select>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Select
                    placeholder="Filter by Category"
                    allowClear
                    style={{ width: '100%' }}
                    onChange={(value) => handleFilterChange('category', value)}
                  >
                    <Option value="Order Issue">Order Issue</Option>
                    <Option value="Payment Problem">Payment Problem</Option>
                    <Option value="Product Query">Product Query</Option>
                    <Option value="Account Issue">Account Issue</Option>
                    <Option value="Technical Support">Technical Support</Option>
                    <Option value="General Inquiry">General Inquiry</Option>
                  </Select>
                </Col>
              </Row>

              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="All Tickets" key="all" />
                <TabPane tab="Open" key="Open" />
                <TabPane tab="In Progress" key="In Progress" />
                <TabPane tab="Resolved" key="Resolved" />
                <TabPane tab="Closed" key="Closed" />
              </Tabs>

              <Table
                columns={columns}
                dataSource={tickets}
                rowKey="_id"
                loading={loading}
                pagination={false} // Pagination is handled by custom Pagination component
                scroll={{ x: 1200 }} // Enable horizontal scrolling for smaller screens
                size="small"
                // Display a custom empty state when no data is available
                locale={{ emptyText: <Empty description="No tickets found matching current criteria." /> }}
              />

              <div style={{ marginTop: '16px', textAlign: 'right' }}>
                <Pagination
                  current={currentPage}
                  total={totalTickets}
                  pageSize={pageSize}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false} // Hide size changer for simplicity
                  showQuickJumper // Allow jumping to a specific page
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} tickets`
                  }
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* View Ticket Modal */}
        <Modal
          title={`Ticket Details - ${selectedTicket?.ticketId}`}
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={null}
          width={900}
        >
          {selectedTicket && (
            <div>
              <Alert
                message={`Priority: ${selectedTicket.priority} | Status: ${selectedTicket.status}`}
                type={selectedTicket.priority === 'Critical' ? 'error' : 'info'}
                showIcon
                style={{ marginBottom: '16px' }}
              />

              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Customer: </Text>
                  <Text>{selectedTicket.user.name} ({selectedTicket.user.email})</Text>
                </Col>
                <Col span={12}>
                  <Text strong>Category: </Text>
                  <Tag>{selectedTicket.category}</Tag>
                </Col>
                <Col span={24}>
                  <Text strong>Title: </Text>
                  <Text>{selectedTicket.title}</Text>
                </Col>
                <Col span={24}>
                  <Text strong>Description: </Text>
                  <Paragraph>{selectedTicket.description}</Paragraph>
                </Col>
                {selectedTicket.assignedTo && (
                  <Col span={12}>
                    <Text strong>Assigned To: </Text>
                    <Text>{selectedTicket.assignedTo.name}</Text>
                  </Col>
                )}
                <Col span={12}>
                  <Text strong>Created: </Text>
                  <Text>{new Date(selectedTicket.createdAt).toLocaleString()}</Text>
                </Col>
              </Row>

              <Divider />

              <div style={{ marginTop: '24px' }}>
                <Title level={4}>Conversation</Title>
                <List
                  dataSource={selectedTicket.messages}
                  renderItem={(msg) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar style={{ backgroundColor: msg.isAdminReply ? '#1890ff' : '#87d068' }}>
                            {msg.sender.name.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={
                          <Space>
                            <Text strong>{msg.sender.name}</Text>
                            {msg.isAdminReply && (
                              <Tag color="blue">Admin</Tag>
                            )}
                            <Text type="secondary">
                              {new Date(msg.timestamp).toLocaleString()}
                            </Text>
                          </Space>
                        }
                        description={
                          <div style={{
                            padding: '8px 12px',
                            backgroundColor: msg.isAdminReply ? '#f0f8ff' : '#f6ffed',
                            borderRadius: '8px',
                            marginTop: '8px'
                          }}>
                            {msg.message}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />

                {selectedTicket.status !== 'Closed' && ( // Only show reply input for non-closed tickets
                  <div style={{ marginTop: '16px' }}>
                    <Input.Group compact>
                      <Input
                        style={{ width: 'calc(100% - 100px)' }}
                        placeholder="Type your reply..."
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onPressEnter={handleSendMessage}
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        loading={sendingMessage}
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                      >
                        Reply
                      </Button>
                    </Input.Group>
                  </div>
                )}
              </div>

              {selectedTicket.rating && ( // Display feedback only if rating exists
                <div style={{ marginTop: '24px' }}>
                  <Divider />
                  <Title level={5}>Customer Feedback</Title>
                  <div>
                    <Text strong>Rating: </Text>
                    <span style={{ marginLeft: '8px' }}>
                      {'★'.repeat(selectedTicket.rating)}{'☆'.repeat(5 - selectedTicket.rating)}
                    </span>
                  </div>
                  {selectedTicket.feedback && (
                    <Paragraph style={{ marginTop: '8px' }}>
                      <Text strong>Feedback: </Text>
                      {selectedTicket.feedback}
                    </Paragraph>
                  )}
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Assign Ticket Modal */}
        <Modal
          title="Assign Ticket"
          open={assignModalVisible}
          onCancel={() => {
            setAssignModalVisible(false);
            assignForm.resetFields();
          }}
          footer={null}
        >
          <Form
            form={assignForm}
            layout="vertical"
            onFinish={handleAssignTicket}
            initialValues={{
              assignedTo: selectedTicket?.assignedTo?._id || null // Pre-fill with current assignee if any
            }}
          >
            <Form.Item
              name="assignedTo"
              label="Assign to Admin"
            >
              <Select
                placeholder="Select admin to assign"
                allowClear
              >
                {admins.map(admin => (
                  <Option key={admin._id} value={admin._id}>
                    {admin.name} ({admin.email})
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Assign Ticket
                </Button>
                <Button onClick={() => {
                  setAssignModalVisible(false);
                  assignForm.resetFields();
                }}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Spin>
  );
};

export default AdminSupportPage;
    