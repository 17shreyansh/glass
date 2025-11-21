import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Layout,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Space,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tag,
  Spin,
  Divider,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuOutlined,
  LinkOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

// Drag and Drop Types
const ItemTypes = {
  ROW: 'row',
};

// Draggable Table Row Component
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: ItemTypes.ROW,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveRow(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations, but it's okay here for the sake of performance
      // to avoid expensive copy operations in a tight loop.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.ROW,
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <tr
      ref={ref}
      className={`${className}`}
      style={{ ...style, opacity, cursor: 'grab' }} // Add grab cursor
      data-handler-id={handlerId}
      {...restProps}
    />
  );
};

const AdminMenuPage = () => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [form] = Form.useForm();

  // Fetch categories
  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/categories`);
      if (response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      message.error('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Fetch menus
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/menus/admin`);
      if (response.data && response.data.success) {
        // Sort menus by their 'order' property
        const sortedMenus = response.data.data.sort((a, b) => a.order - b.order);
        setMenus(sortedMenus);
      }
    } catch (error) {
      message.error('Failed to fetch menus');
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchMenus();
  }, []);

  // Generate category link automatically
  const generateCategoryLink = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    if (!category) return '';

    let path = '/category';

    // Add ancestor slugs
    if (category.ancestors && category.ancestors.length > 0) {
      category.ancestors.forEach((ancestorId) => {
        const ancestor = categories.find((cat) => cat._id === ancestorId);
        if (ancestor) {
          path += `/${ancestor.slug}`;
        }
      });
    }

    // Add current category slug
    path += `/${category.slug}`;

    return path;
  };

  // Build category tree for better visualization
  const buildCategoryTree = () => {
    const tree = [];
    const categoryMap = {};

    // Create map of categories
    categories.forEach((category) => {
      categoryMap[category._id] = {
        ...category,
        children: [],
      };
    });

    // Build tree structure
    categories.forEach((category) => {
      if (category.parent) {
        const parentId = category.parent._id || category.parent;
        if (categoryMap[parentId]) {
          categoryMap[parentId].children.push(categoryMap[category._id]);
        }
      } else {
        tree.push(categoryMap[category._id]);
      }
    });

    // Sort top-level categories and their children by name for consistent display
    tree.sort((a, b) => a.name.localeCompare(b.name));
    tree.forEach(node => {
      node.children.sort((a, b) => a.name.localeCompare(b.name));
    });

    return tree;
  };

  // Render category options with indentation
  const renderCategoryOptions = () => {
    const sortedCategories = [...categories].sort((a, b) => {
      if (a.level !== b.level) return a.level - b.level;
      return a.name.localeCompare(b.name);
    });

    return sortedCategories.map((category) => {
      const indent = '　'.repeat(category.level); // Use full-width space for better visual
      const displayName = `${indent}${category.name}`;

      return (
        <Option key={category._id} value={category._id}>
          <Space>
            <Text style={{ fontFamily: 'monospace' }}>{displayName}</Text>
            <Tag size="small" color="blue">
              Level {category.level}
            </Tag>
          </Space>
        </Option>
      );
    });
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const menuData = {
        name: values.name,
        categoryId: values.categoryId,
        isActive: values.isActive !== false,
      };

      if (editingMenu) {
        // When editing, send a PUT request to the specific menu ID
        await axios.put(`${API_BASE_URL}/api/menus/${editingMenu._id}`, menuData);
        message.success('Menu updated successfully');
      } else {
        // When adding a new menu, assign it the highest order + 1
        const maxOrder = menus.reduce((max, menu) => Math.max(max, menu.order), -1);
        menuData.order = maxOrder + 1; // Assign order for new menu
        await axios.post(`${API_BASE_URL}/api/menus`, menuData);
        message.success('Menu created successfully');
      }

      setModalVisible(false);
      setEditingMenu(null);
      form.resetFields();
      fetchMenus(); // Re-fetch menus to get the latest order
    } catch (error) {
      message.error('Failed to save menu');
      console.error('Error saving menu:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (menuId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/menus/${menuId}`);
      message.success('Menu deleted successfully');
      fetchMenus();
    } catch (error) {
      message.error('Failed to delete menu');
      console.error('Error deleting menu:', error);
    }
  };

  // Handle edit
  const handleEdit = (menu) => {
    setEditingMenu(menu);
    form.setFieldsValue({
      name: menu.name,
      categoryId: menu.category._id,
      isActive: menu.isActive,
    });
    setModalVisible(true);
  };

  // Handle category selection change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);

    // Auto-fill name if empty
    if (category && !form.getFieldValue('name')) {
      form.setFieldValue('name', category.name);
    }
  };

  // Drag and Drop row movement logic
  const moveRow = useCallback(
    async (dragIndex, hoverIndex) => {
      const draggedRow = menus[dragIndex];
      const newMenus = [...menus];
      newMenus.splice(dragIndex, 1);
      newMenus.splice(hoverIndex, 0, draggedRow);

      // Create a list of menus whose order might have changed
      // This is a simplified approach, a more optimized one would track only truly changed items
      const menusToUpdate = newMenus.map((menu, index) => ({
        _id: menu._id,
        order: index, // New order based on current position
      }));

      // Optimistic UI update
      setMenus(newMenus);

      try {
        // Send individual PUT requests for each menu item to update its order
        // This assumes your PUT /api/menus/:id endpoint can update the 'order' field.
        await Promise.all(
          menusToUpdate.map(async (menuItem) => {
            // Only update if the order has actually changed to minimize requests
            const originalMenu = menus.find(m => m._id === menuItem._id);
            if (!originalMenu || originalMenu.order !== menuItem.order) {
                await axios.put(`${API_BASE_URL}/api/menus/${menuItem._id}`, { order: menuItem.order });
            }
          })
        );
        message.success('Menu order updated successfully');
        // No need to fetchMenus again if optimistic update and individual updates are successful
      } catch (error) {
        message.error('Failed to update menu order. Reverting changes.');
        console.error('Error updating menu order:', error);
        fetchMenus(); // Revert to server state on error
      }
    },
    [menus, fetchMenus]
  );

  // Table columns
  const columns = [
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 80,
      render: (order) => <Tag color="blue">{order + 1}</Tag>, // Display 1-based order
    },
    {
      title: 'Menu Name',
      dataIndex: 'name',
      key: 'name',
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => (
        <Space direction="vertical" size="small">
          <Text>{category.name}</Text>
          <Tag size="small" color="green">
            Level {category.level}
          </Tag>
        </Space>
      ),
    },
    {
      title: 'Generated Link',
      dataIndex: 'link',
      key: 'link',
      render: (link) => (
        <Text code copyable style={{ fontSize: '12px' }}>
          {link}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'} icon={isActive ? <EyeOutlined /> : <EyeInvisibleOutlined />}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            ghost
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this menu?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Components for Ant Design Table to enable drag and drop
  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const onRow = (record, index) => ({
    index,
    moveRow,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        <Header style={{ backgroundColor: '#001529', padding: '0 24px' }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ color: 'white', margin: 0 }}>
                <MenuOutlined style={{ marginRight: 8 }} />
                Menu Management
              </Title>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditingMenu(null);
                  form.resetFields();
                  setModalVisible(true);
                }}
              >
                Add New Menu
              </Button>
            </Col>
          </Row>
        </Header>

        <Content style={{ padding: '24px', backgroundColor: '#f5f5f5' }}>
          <Row gutter={[24, 24]}>
            {/* Category Tree Preview */}
            <Col xs={24} lg={8}>
              <Card
                title={
                  <Space>
                    Category Structure
                  </Space>
                }
                style={{ height: 'fit-content' }}
              >
                <Spin spinning={categoriesLoading}>
                  {categories.length > 0 ? (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      {buildCategoryTree().map((category) => (
                        <div key={category._id} style={{ marginBottom: 16 }}>
                          <Text strong>{category.name}</Text>
                          <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                            /{category.slug}
                          </Text>
                          {category.children.length > 0 && (
                            <div style={{ marginLeft: 16, marginTop: 8 }}>
                              {category.children.map((child) => (
                                <div key={child._id} style={{ marginBottom: 8 }}>
                                  <Text>{child.name}</Text>
                                  <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                    /{category.slug}/{child.slug}
                                  </Text>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Text type="secondary">No categories found</Text>
                  )}
                </Spin>
              </Card>
            </Col>

            {/* Menu Management Table */}
            <Col xs={24} lg={16}>
              <Card
                title={
                  <Space>
                    <LinkOutlined />
                    Menu Links ({menus.length})
                  </Space>
                }
              >
                <Table
                  columns={columns}
                  dataSource={menus}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} items`,
                  }}
                  scroll={{ x: 800 }}
                  components={components} // Added for drag and drop
                  onRow={onRow} // Added for drag and drop
                />
              </Card>
            </Col>
          </Row>
        </Content>

        {/* Add/Edit Modal */}
        <Modal
          title={editingMenu ? 'Edit Menu' : 'Add New Menu'}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingMenu(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isActive: true,
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  label="Menu Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter menu name' }]}
                >
                  <Input placeholder="Enter menu name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label="Select Category"
              name="categoryId"
              rules={[{ required: true, message: 'Please select a category' }]}
            >
              <Select
                placeholder="Select category"
                showSearch
                filterOption={(input, option) =>
                  option.children.props.children[0].props.children.toLowerCase().includes(input.toLowerCase())
                }
                onChange={handleCategoryChange}
              >
                {renderCategoryOptions()}
              </Select>
            </Form.Item>

            {form.getFieldValue('categoryId') && (
              <Form.Item label="Generated Link">
                <Input
                  value={generateCategoryLink(form.getFieldValue('categoryId'))}
                  disabled
                  prefix={<LinkOutlined />}
                  style={{ backgroundColor: '#f6f6f6' }}
                />
              </Form.Item>
            )}

            <Form.Item label="Status" name="isActive" valuePropName="checked">
              <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
            </Form.Item>

            <Divider />

            <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
              <Space>
                <Button
                  onClick={() => {
                    setModalVisible(false);
                    setEditingMenu(null);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                  {editingMenu ? 'Update Menu' : 'Create Menu'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </DndProvider>
  );
};

export default AdminMenuPage;