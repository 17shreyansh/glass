import React, { useState, useEffect } from 'react';
import {
  Card,
  Statistic,
  Row,
  Col,
  Typography,
  Space,
  Table,
  Tag,
  Progress,
  List,
  Avatar,
  Spin,
  Alert,
  Divider,
  Button
} from 'antd';
import {
  ShoppingCartOutlined,
  UserOutlined,
  GiftOutlined,
  TagsOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  ShoppingOutlined, // Changed from TrophyOutlined for products
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  AuditOutlined, // For categories
  PieChartOutlined, // For charts section title
  LineChartOutlined,
  TableOutlined 
} from '@ant-design/icons';
import apiService from '../../services/api';


const { Title, Text } = Typography;

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalBrands: 0,
      totalCategories: 0,
      totalCoupons: 0,
      activeUsers: 0,
    },
    recentOrders: [],
    topProducts: [], // Will now include 'revenue' for better display
    orderStats: {
      pending: 0,
      confirmed: 0, // Added confirmed as per schema
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    },
    couponStats: {
      active: 0,
      expired: 0,
      used: 0
    },
    revenueGrowth: 0, // Placeholder, needs backend calculation
    orderGrowth: 0,   // Placeholder, needs backend calculation
    revenueOverTime: [],
    productCategoryDistribution: []
  });
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data concurrently using apiService
      const [
        ordersRes,
        categoriesRes,
        couponsRes,
        productsRes,
      ] = await Promise.allSettled([
        apiService.getAdminOrders(),
        apiService.getCategories(),
        apiService.getAdminCoupons(),
        apiService.getProducts(),
      ]);

      // Helper to extract data or null
       const extractData = (res) => {
        if (res.status === 'fulfilled' && res.value) {
          // Handle different response structures
          return res.value.data || res.value.orders || res.value.coupons || res.value.products || res.value;
        }
        return [];
      };

      const orders = extractData(ordersRes) || [];
      const categories = extractData(categoriesRes) || [];
      const coupons = extractData(couponsRes) || [];
      const products = extractData(productsRes) || [];
      const users = []; // Placeholder for users data

      // Ensure arrays are actually arrays
      const safeOrders = Array.isArray(orders) ? orders : [];
      const safeCategories = Array.isArray(categories) ? categories : [];
      const safeCoupons = Array.isArray(coupons) ? coupons : [];
      const safeProducts = Array.isArray(products) ? products : [];

      // --- Process Orders Data ---
      let totalRevenue = 0;
      let orderStats = { pending: 0, confirmed: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
      const revenueOverTimeMap = new Map(); // Stores {date: revenue}
      const productSalesMap = new Map(); // Stores {productId: {name, totalSales, totalRevenue}}

      safeOrders.forEach(order => {
        // Calculate total revenue, excluding cancelled orders
        if (order.status !== 'CANCELLED') { // Use 'status' from order schema
          totalRevenue += order.totalAmount || 0;
        }

        // Aggregate order status counts
        const status = order.status?.toLowerCase() || 'pending'; // Use 'status'
        if (orderStats.hasOwnProperty(status)) {
          orderStats[status]++;
        }

        // Prepare data for Revenue Over Time chart
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
        revenueOverTimeMap.set(orderDate, (revenueOverTimeMap.get(orderDate) || 0) + (order.totalAmount || 0));

        // Prepare data for Top Selling Products
        order.items.forEach(item => { // 'items' as per orderItemSchema
          const { productId, name, quantity, price } = item;
          if (productSalesMap.has(productId)) {
            const existing = productSalesMap.get(productId);
            existing.totalSales += quantity;
            existing.totalRevenue += (quantity * price);
          } else {
            productSalesMap.set(productId, {
              name: name,
              totalSales: quantity,
              totalRevenue: (quantity * price)
            });
          }
        });
      });

      const revenueOverTime = Array.from(revenueOverTimeMap).map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const topProducts = Array.from(productSalesMap.values())
        .sort((a, b) => b.totalSales - a.totalSales) // Sort by total sales quantity
        .slice(0, 5)
        .map(p => ({ name: p.name, sales: p.totalSales, revenue: p.totalRevenue }));


      // --- Process Coupon Data ---
      let couponStats = { active: 0, expired: 0, used: 0 };
      const now = new Date();

      safeCoupons.forEach(coupon => {
        const validFrom = new Date(coupon.validFrom);
        const validUntil = new Date(coupon.validUntil);

        if (coupon.isActive && now >= validFrom && now <= validUntil) {
          couponStats.active++;
        } else if (now > validUntil) {
          couponStats.expired++;
        }
        // Summing up usageCount from 'usedBy' array for total usage
        // Or if 'usageCount' at the top level of coupon model is total usage, use that.
        // Based on schema, 'usageCount' is total usage, 'usedBy' tracks per-user usage.
        couponStats.used += coupon.usageCount || 0;
      });

      // --- Process Product Category Distribution ---
      const categoryCounts = {};
      safeProducts.forEach(product => {
        // Assuming categories is an array of ObjectId or populated objects
        if (product.categories && product.categories.length > 0) {
          // If categories are populated, use category.name
          if (typeof product.categories[0] === 'object' && product.categories[0] !== null) {
            product.categories.forEach(cat => {
              const categoryName = cat.name || 'Uncategorized';
              categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
            });
          } else {
            // If categories are just IDs, you might need to map them to names
            // For now, let's assume either they are populated or you can get names from the 'categories' array fetched.
            // This part might need further refinement based on how your /api/products returns categories
            // For simplicity, I'll use the fetched categories array to map IDs to names.
            product.categories.forEach(catId => {
                const matchedCategory = safeCategories.find(c => c._id === catId);
                const categoryName = matchedCategory ? matchedCategory.name : 'Uncategorized';
                categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;
            });
          }
        } else {
          categoryCounts['Uncategorized'] = (categoryCounts['Uncategorized'] || 0) + 1;
        }
      });
      const productCategoryDistribution = Object.entries(categoryCounts).map(([type, value]) => ({ type, value }));

      // --- Construct Recent Orders Table Data ---
      const recentOrders = safeOrders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(order => ({
          key: order._id,
          id: order.orderNumber?.slice(-8) || order._id?.slice(-8) || 'N/A', // Use orderNumber if available
          customer: order.shippingAddress?.fullName || 'Unknown',
          amount: order.totalAmount || 0,
          status: order.status || 'PENDING', // Use 'status' from schema
          date: new Date(order.createdAt).toLocaleDateString()
        }));

      // Dummy growth data for demonstration, replace with real calculation from backend if available
      const revenueGrowth = 12.5; // Example: (Current month revenue - Last month revenue) / Last month revenue * 100
      const orderGrowth = 8.3;   // Example: (Current month orders - Last month orders) / Last month orders * 100

      setDashboardData({
        stats: {
          totalOrders: safeOrders.length,
          totalRevenue,
          totalProducts: safeProducts.length,
          totalBrands: 0,
          totalCategories: safeCategories.length,
          totalCoupons: safeCoupons.length,
          activeUsers: 0, // Placeholder for active users
        },
        recentOrders,
        topProducts,
        orderStats,
        couponStats,
        revenueGrowth,
        orderGrowth,
        revenueOverTime,
        productCategoryDistribution
      });

    } catch (err) {
      console.error('Dashboard fetch error:', err);
      // More specific error message if a particular endpoint failed
      setError('Failed to load dashboard data. Some information might be missing. Please ensure backend services are running and accessible.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'orange',
      confirmed: 'blue',
      processing: 'geekblue', // A slightly different blue
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red'
    };
    return colors[status.toLowerCase()] || 'default'; // Ensure lowercase matching
  };

  const recentOrderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => <Text strong>₹{amount.toLocaleString()}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={
          status.toLowerCase() === 'delivered' ? <CheckCircleOutlined /> :
            status.toLowerCase() === 'cancelled' ? <ExclamationCircleOutlined /> :
              <ClockCircleOutlined />
        }>
          {status.toUpperCase()}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];




  if (loading && dashboardData.stats.totalOrders === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>
          Admin Dashboard
        </Title>
        <Button 
          onClick={fetchDashboardData} 
          loading={loading} 
          type="primary"
          className="admin-btn-primary"
          icon={<LineChartOutlined />}
        >
          Refresh Data
        </Button>
      </div>

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          closable
          showIcon
          style={{ marginBottom: '20px' }}
        />
      )}

      {/* Main Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="stats-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>Total Orders</span>}
              value={dashboardData.stats.totalOrders}
              prefix={<ShoppingCartOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white' }}
              suffix={
                <Space>
                  {dashboardData.orderGrowth >= 0 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#f5222d' }} />}
                  <span style={{ fontSize: '14px', color: dashboardData.orderGrowth >= 0 ? '#52c41a' : '#f5222d' }}>{dashboardData.orderGrowth.toFixed(1)}%</span>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="stats-card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>Total Revenue</span>}
              value={dashboardData.stats.totalRevenue}
              prefix={<DollarOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white' }}
              formatter={(value) => `₹${value.toLocaleString()}`}
              suffix={
                <Space>
                  {dashboardData.revenueGrowth >= 0 ? <RiseOutlined style={{ color: '#52c41a' }} /> : <FallOutlined style={{ color: '#f5222d' }} />}
                  <span style={{ fontSize: '14px', color: dashboardData.revenueGrowth >= 0 ? '#52c41a' : '#f5222d' }}>{dashboardData.revenueGrowth.toFixed(1)}%</span>
                </Space>
              }
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="stats-card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>Total Products</span>}
              value={dashboardData.stats.totalProducts}
              prefix={<ShoppingOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="outlined" className="stats-card" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'white' }}>Active Users</span>}
              value={dashboardData.stats.activeUsers}
              prefix={<UserOutlined style={{ color: 'white' }} />}
              valueStyle={{ color: 'white' }}
            />
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '30px 0 20px' }} />

      <Title level={4} style={{ marginTop: '10px' }}><PieChartOutlined /> Key Metrics & Distribution</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} lg={8}>
          <Card variant="outlined" title="Brand & Category Overview" className="admin-card" style={{ border: 'none' }}>
            <Statistic
              title="Total Brands"
              value={dashboardData.stats.totalBrands}
              prefix={<TagsOutlined />}
              valueStyle={{ fontSize: '24px' }}
            />
            <Divider />
            <Statistic
              title="Total Categories"
              value={dashboardData.stats.totalCategories}
              prefix={<AuditOutlined />}
              valueStyle={{ fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card variant="outlined" title="Coupon Statistics" className="admin-card" style={{ border: 'none' }}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Statistic
                  title="Active"
                  value={dashboardData.couponStats.active}
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Expired"
                  value={dashboardData.couponStats.expired}
                  prefix={<ExclamationCircleOutlined style={{ color: '#f5222d' }} />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Used"
                  value={dashboardData.couponStats.used}
                  prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Order Status Distribution" variant="outlined" className="admin-card" style={{ border: 'none' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(dashboardData.orderStats).map(([statusKey, count]) => {
                const totalOrders = dashboardData.stats.totalOrders;
                const percent = totalOrders > 0 ? (count / totalOrders) * 100 : 0;
                let color;
                switch (statusKey) {
                  case 'pending': color = '#faad14'; break;
                  case 'confirmed': color = '#1890ff'; break;
                  case 'processing': color = '#13c2c2'; break;
                  case 'shipped': color = '#722ed1'; break; // Purple for shipped
                  case 'delivered': color = '#52c41a'; break;
                  case 'cancelled': color = '#f5222d'; break;
                  default: color = '#d9d9d9';
                }
                return (
                  <div key={statusKey}>
                    <Text>{statusKey.charAt(0).toUpperCase() + statusKey.slice(1)} ({count})</Text>
                    <Progress
                      percent={percent}
                      status="active"
                      strokeColor={color}
                      showInfo={false}
                    />
                  </div>
                );
              })}
            </Space>
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '30px 0 20px' }} />

      <Title level={4} style={{ marginTop: '10px' }}><LineChartOutlined /> Trends & Performance</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: '20px' }}>
        <Col xs={24} lg={12}>
          <Card title="Revenue Over Time" variant="outlined" className="admin-card" style={{ border: 'none' }}>
            <Alert message="Revenue chart will be available soon." type="info" showIcon />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Product Category Distribution" variant="outlined" className="admin-card" style={{ border: 'none' }}>
            <Alert message="Category distribution chart will be available soon." type="info" showIcon />
          </Card>
        </Col>
      </Row>

      <Divider style={{ margin: '30px 0 20px' }} />

      <Title level={4} style={{ marginTop: '10px' }}><TableOutlined /> Latest Activities</Title>
      <Row gutter={[16, 16]}>
        {/* Top Selling Products */}
        <Col xs={24} lg={12}>
          <Card title="Top Selling Products" variant="outlined" className="admin-card" style={{ border: 'none' }}>
            {dashboardData.topProducts.length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={dashboardData.topProducts}
                renderItem={(item, index) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#87d068'][index % 5]
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      }
                      title={<Text strong>{item.name}</Text>}
                      description={
                        <Space>
                          <Text type="secondary">Sold: {item.sales}</Text>
                          <Divider type="vertical" />
                          <Text strong>Revenue: ₹{item.revenue.toLocaleString()}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Alert message="No top selling products data available." type="info" showIcon />
            )}
          </Card>
        </Col>

        {/* Recent Orders Table */}
        <Col xs={24} lg={12}>
          <Card title="Recent Orders" variant="outlined" className="admin-card" style={{ border: 'none' }}>
            {dashboardData.recentOrders.length > 0 ? (
              <Table
                columns={recentOrderColumns}
                dataSource={dashboardData.recentOrders}
                pagination={false}
                size="middle"
                scroll={{ x: 'max-content' }}
                className="admin-table"
              />
            ) : (
              <Alert message="No recent orders data available." type="info" showIcon />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;