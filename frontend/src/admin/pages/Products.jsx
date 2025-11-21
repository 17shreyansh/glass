import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Popconfirm,
  Switch,
  Upload,
  Space,
  Card,
  List,
  Typography,
  Tag,
  Segmented,
  Row,
  Col,
  Tabs,
  Divider,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
  StockOutlined,
  TagOutlined,
  ShopOutlined,
  AppstoreOutlined,
  TableOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  PictureOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import apiService from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;
const { Text } = Typography;

const ProductAdminPage = () => {
  const navigate = useNavigate();
  // State variables for products, loading status, modal visibility, and form
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm(); // Ant Design form instance
  const [editingProduct, setEditingProduct] = useState(null); // Stores the product being edited
  const [fileList, setFileList] = useState([]); // State for main image upload
  const [galleryFileList, setGalleryFileList] = useState([]); // State for gallery images upload
  const [viewMode, setViewMode] = useState("grid"); // Toggles between 'grid' and 'table' view

  // Function to fetch all products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      message.error("Failed to fetch products");
      console.error("Fetch products error:", error);
    }
    setLoading(false);
  };



  // useEffect hook to fetch initial data when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Handles form submission for creating or updating a product
  const onFinish = async (values) => {


    // Handle main image URL for submission
    let mainImageUrl = null;
    if (fileList.length > 0) {
      const mainFile = fileList[0];
      if (mainFile.status === "done" && mainFile.response?.url) {
        mainImageUrl = mainFile.response.url;
      } else if (mainFile.url) {
        mainImageUrl = mainFile.url.startsWith('http://localhost:3001')
          ? mainFile.url.substring('http://localhost:3001'.length)
          : mainFile.url;
      }
    }

    // Handle gallery image URLs for submission
    const galleryImageUrls = galleryFileList
      .filter((file) => file.status === "done" || file.url)
      .map((file) => {
        if (file.status === "done" && file.response?.url) {
          return file.response.url;
        } else if (file.url) {
          return file.url.startsWith('http://localhost:3001')
            ? file.url.substring('http://localhost:3001'.length)
            : file.url;
        }
        return null;
      })
      .filter(Boolean);

    // Construct the product data object to be sent to the backend
    const productData = {
      ...values,
      sizeVariants: values.sizeVariants || [],
      mainImage: mainImageUrl,
      image: mainImageUrl,
      galleryImages: galleryImageUrls,
    };

    // Remove temporary form fields that are not part of the schema
    delete productData.mainImageUpload;
    delete productData.galleryImagesUpload;
    // Remove rating and reviewsCount as they are user-generated, not admin-set
    delete productData.rating;
    delete productData.reviewsCount;


    try {
      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, productData);
        message.success("Product updated successfully!");
      } else {
        await apiService.createProduct(productData);
        message.success("Product created successfully!");
      }
      fetchProducts();
      handleModalClose();
    } catch (error) {
      console.error("Failed to save product:", error);
      message.error(`Failed to save product: ${error.message || "Unknown error"}`);
    }
  };

  // Closes the modal and resets form/state
  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields(); // Reset all form fields
    setEditingProduct(null); // Clear editing product state
    setFileList([]); // Clear main image file list
    setGalleryFileList([]); // Clear gallery image file list
  };

  // Navigate to dedicated edit page
  const handleEdit = (record) => {
    navigate(`/admin/products/edit/${record._id}`);
  };

  // Handles product deletion
  const handleDelete = async (id) => {
    try {
      await apiService.deleteProduct(id);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (error) {
      console.error("Delete failed:", error);
      message.error(`Delete failed: ${error.message || "Unknown error"}`);
    }
  };

  // Custom upload request for Ant Design Upload component
  const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const response = await apiService.uploadImage(file);
      onSuccess(response, file);
      message.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
      message.error(`${file.name} upload failed: ${error.message || "Unknown error"}`);
    }
  };

  // Custom upload request for gallery images
  const customGalleryRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      const response = await apiService.uploadImage(file);
      onSuccess(response, file);
      message.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
      message.error(`${file.name} upload failed: ${error.message || "Unknown error"}`);
    }
  };

  // Handles changes in the main image upload list
  const handleMainImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handles changes in the gallery images upload list
  const handleGalleryImageChange = ({ fileList: newFileList }) => {
    setGalleryFileList(newFileList);
  };

  // Handles previewing uploaded images (opens in new tab)
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj); // Generate base64 preview for new files
    }
    const previewUrl = file.url || file.preview;
    if (previewUrl) {
      window.open(previewUrl, "_blank"); // Open image in a new tab
    }
  };

  // Helper function to convert file to Base64 for preview
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Table columns definition
  const columns = [
    {
      title: "Image",
      dataIndex: "mainImage",
      key: "mainImage",
      render: (text) => (
        <img
          src={text ? `http://localhost:3001${text}` : "https://via.placeholder.com/50/0000FF/FFFFFF?text=No+Image"}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    { title: "Name", dataIndex: "name", key: "name", sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: "Slug", dataIndex: "slug", key: "slug" },

    { 
      title: "Type", 
      dataIndex: "productType", 
      key: "productType",
      render: (type) => type === 'ashta-dhatu' ? 'Ashta Dhatu' : 'Fashion Jewelry'
    },
    { 
      title: "Category", 
      dataIndex: "category", 
      key: "category"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `₹${price ? price.toFixed(2) : '0.00'}`, // Format price with currency
      sorter: (a, b) => a.price - b.price, // Numeric sort for price
    },
    { 
      title: "Total Stock", 
      dataIndex: "totalStock", 
      key: "totalStock", 
      sorter: (a, b) => a.totalStock - b.totalStock
    },
    {
      title: "Sizes",
      dataIndex: "sizeVariants",
      key: "sizeVariants",
      render: (variants) => variants?.map(v => v.size).join(", ") || "N/A",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating, record) => `${rating || 0}/5 (${record.reviewsCount || 0} reviews)`, // Display rating and review count
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      key: "isFeatured",
      render: (isFeatured) => (isFeatured ? <Tag color="gold"><CheckCircleOutlined /> Yes</Tag> : <Tag color="default"><CloseCircleOutlined /> No</Tag>),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? <Tag color="success"><CheckCircleOutlined /> Yes</Tag> : <Tag color="error"><CloseCircleOutlined /> No</Tag>),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Renders a product card for the grid view
  const renderProductCard = (product) => (
    <List.Item key={product._id} style={{ padding: 0 }}>
      <Card
        hoverable
        style={{ width: "100%", margin: "8px 0" }}
        cover={
          <img
            alt={product.name}
            src={
              product.mainImage
                ? `http://localhost:3001${product.mainImage}`
                : "https://via.placeholder.com/200x150/EEEEEE/888888?text=No+Image"
            }
            style={{
              height: 200,
              objectFit: "cover",
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8,
            }}
          />
        }
        actions={[
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(product)}
            key="edit"
          >
            Edit
          </Button>,
          <Popconfirm
            title={`Delete ${product.name}?`}
            description="Are you sure to delete this product? This action cannot be undone."
            onConfirm={() => handleDelete(product._id)}
            okText="Yes"
            cancelText="No"
            key="delete-confirm"
          >
            <Button type="text" danger icon={<DeleteOutlined />} key="delete">
              Delete
            </Button>
          </Popconfirm>,
        ]}
      >
        <Card.Meta
          title={<Text strong>{product.name}</Text>}
          description={
            <>
              <Text type="secondary" ellipsis={{ rows: 2 }}>
                {product.description || "No description provided."}
              </Text>
              <div style={{ marginTop: 8 }}>
                <Space wrap>                  {product.category && (
                    <Tag icon={<TagOutlined />} color="blue">
                      {product.category}
                    </Tag>
                  )}
                  <Tag icon={<DollarCircleOutlined />} color="green">
                    ₹{product.price ? product.price.toFixed(2) : "0.00"}
                  </Tag>
                  <Tag icon={<StockOutlined />} color="volcano">
                    Stock: {product.totalStock || 0}
                  </Tag>
                  <Tag color="purple">
                    Rating: {product.rating || 0}/5 ({product.reviewsCount || 0})
                  </Tag>
                  {product.isFeatured ? (
                    <Tag icon={<CheckCircleOutlined />} color="gold">
                      Featured
                    </Tag>
                  ) : null}
                  {product.isActive ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Active
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      Inactive
                    </Tag>
                  )}
                  {product.slug && (
                    <Tag color="purple">
                      Slug: {product.slug}
                    </Tag>
                  )}
                </Space>
              </div>
            </>
          }
        />
      </Card>
    </List.Item>
  );

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Header section with title, view mode toggle, and add product button */}
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 28, color: "#333" }}>
          <ShopOutlined style={{ marginRight: 10, color: "#faad14" }} />
          Product Management
        </h2>
        <Space>
          <Segmented
            options={[
              { label: "Grid View", value: "grid", icon: <AppstoreOutlined /> },
              { label: "Table View", value: "table", icon: <TableOutlined /> },
            ]}
            value={viewMode}
            onChange={setViewMode}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => {
              setModalVisible(true);
              setEditingProduct(null); // Clear editing state for new product
              form.resetFields(); // Reset form fields
              setFileList([]); // Clear image lists
              setGalleryFileList([]);
            }}
          >
            Add New Product
          </Button>
        </Space>
      </div>

      {/* Main content area for product list (grid or table) */}
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <span style={{ fontSize: 24, color: "#999" }}>Loading products...</span>
          </div>
        ) : products.length > 0 ? (
          viewMode === "grid" ? (
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={products}
              renderItem={renderProductCard}
              pagination={{ pageSize: 12 }}
            />
          ) : (
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={products}
              bordered
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }} // Enable horizontal scrolling for large tables
            />
          )
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <span style={{ fontSize: 20, color: "#999" }}>No products found. Start by adding one!</span>
          </div>
        )}
      </div>

      {/* Product Add/Edit Modal */}
      <Modal
        title={editingProduct ? "Edit Product" : "Add New Product"}
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={() => form.submit()} // Trigger form submission on OK button click
        okText={editingProduct ? "Update Product" : "Create Product"}
        width={900} // Wider modal for better form layout
        destroyOnClose={true} // Ensures form state is reset when modal closes
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish} // Callback when form is submitted and validated
          initialValues={{
            sizeVariants: [],
            price: 0,
            originalPrice: null,
            productType: 'ashta-dhatu',
            isFeatured: false,
            isActive: true,
            slug: "",
          }}
        >
          {/* Tabs for organizing form fields */}
          <Tabs defaultActiveKey="1" items={[
            {
              key: '1',
              label: (<span><InfoCircleOutlined /> Basic Info</span>),
              children: (
                <Row gutter={16}> {/* Responsive grid for form fields */}
                  <Col span={24}>
                    <Form.Item
                      label="Product Name"
                      name="name"
                      rules={[{ required: true, message: "Please enter product name" }]}
                    >
                      <Input placeholder="e.g., Running Shoes Alpha" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Product Slug"
                      name="slug"
                      // Regex for slug: lowercase alphanumeric, hyphens allowed, no leading/trailing hyphens
                      rules={[{ pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: "Slug must be lowercase alphanumeric with hyphens"}]}
                      extra="A unique, URL-friendly version of the product name (e.g., 'running-shoes-alpha'). Auto-generated if left blank on new product."
                    >
                      <Input placeholder="e.g., running-shoes-alpha" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Description" name="description">
                      <TextArea rows={4} placeholder="Detailed description of the product..." />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Price (₹)" 
                      name="price"
                      rules={[{ required: true, message: "Please enter product price" }]}
                    >
                      <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g., 99.99" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: "Please enter category" }]}
                    >
                      <Input placeholder="e.g., Rings, Necklaces, Earrings" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Product Type"
                      name="productType"
                      rules={[{ required: true, message: "Please select product type" }]}
                    >
                      <Select placeholder="Select product type">
                        <Option value="ashta-dhatu">Ashta Dhatu</Option>
                        <Option value="fashion-jewelry">Fashion Jewelry</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Original Price (₹)"
                      name="originalPrice"
                      extra="Optional: For showing discounts"
                    >
                      <InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="e.g., 149.99" />
                    </Form.Item>
                  </Col>

                </Row>
              ),
            },
            {
              key: '2',
              label: (<span><BulbOutlined /> Attributes & Stock</span>),
              children: (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item label="Material" name="material">
                      <Input placeholder="e.g., Gold, Silver, Ashta Dhatu" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Available Colors" name="availableColors">
                      <Select mode="tags" placeholder="Add colors (e.g., gold, silver, rose-gold)">
                        <Option value="gold">Gold</Option>
                        <Option value="silver">Silver</Option>
                        <Option value="rose-gold">Rose Gold</Option>
                        <Option value="black">Black</Option>
                        <Option value="white">White</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Metal Details" name="metalDetails">
                      <Select mode="tags" placeholder="Add metal details">
                        <Option value="Ashta Dhatu alloy base">Ashta Dhatu alloy base</Option>
                        <Option value="Precise gold plating">Precise gold plating</Option>
                        <Option value="Premium quality finish">Premium quality finish</Option>
                        <Option value="Hypoallergenic material">Hypoallergenic material</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Benefits" name="benefits">
                      <Select mode="tags" placeholder="Add product benefits">
                        <Option value="Hypoallergenic & skin-friendly">Hypoallergenic & skin-friendly</Option>
                        <Option value="Durable & long-lasting finish">Durable & long-lasting finish</Option>
                        <Option value="Lightweight & comfortable">Lightweight & comfortable</Option>
                        <Option value="Tarnish resistant">Tarnish resistant</Option>
                        <Option value="Spiritual significance">Spiritual significance</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Divider orientation="left">Size Variants</Divider>
                    <Form.List name="sizeVariants">
                      {(fields, { add, remove }) => (
                        <>
                          {fields.map(({ key, name, ...restField }) => (
                            <Row key={key} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                              <Col xs={24} sm={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'size']}
                                  label="Size"
                                  rules={[{ required: true, message: 'Size required' }]}
                                >
                                  <Input placeholder="e.g., Small, 7, One Size" style={{ width: "100%" }} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'stock']}
                                  label="Stock"
                                  rules={[{ required: true, message: 'Stock required' }]}
                                >
                                  <InputNumber min={0} placeholder="Stock" style={{ width: "100%" }} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={4}>
                                <Button
                                  type="text"
                                  danger
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => remove(name)}
                                  style={{ marginTop: 30 }}
                                />
                              </Col>
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => add()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Size Variant
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Col>
                  {/* Removed Rating and Reviews Count as they are user-generated */}

                  <Col xs={24} sm={12}>
                    <Form.Item label="Featured Product" name="isFeatured" valuePropName="checked">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item label="Product Active" name="isActive" valuePropName="checked">
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },
            {
              key: '3',
              label: (<span><PictureOutlined /> Images</span>),
              children: (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Main Product Image"
                      name="mainImageUpload"
                      extra="Upload or replace the main product image. Only one image is allowed."
                    >
                      <Upload
                        name="image"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleMainImageChange}
                        onPreview={handlePreview}
                        customRequest={customRequest} // Use custom request for Axios upload
                        maxCount={1} // Only one main image allowed
                        accept=".png,.jpeg,.jpg,.gif" // Allowed file types
                      >
                        {fileList.length < 1 && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload Main</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Gallery Images"
                      name="galleryImagesUpload"
                      extra="Upload multiple gallery images. You can remove existing images and add new ones. Maximum 5 images."
                    >
                      <Upload
                        name="image"
                        listType="picture-card"
                        fileList={galleryFileList}
                        onChange={handleGalleryImageChange}
                        onPreview={handlePreview}
                        customRequest={customGalleryRequest}
                        maxCount={5} // Maximum 5 gallery images
                        multiple // Allow multiple file selection
                        accept=".png,.jpeg,.jpg,.gif"
                      >
                        {galleryFileList.length < 5 && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload Gallery</div>
                          </div>
                        )}
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              ),
            },
          ]} />
        </Form>
      </Modal>
    </div>
  );
};

export default ProductAdminPage;
