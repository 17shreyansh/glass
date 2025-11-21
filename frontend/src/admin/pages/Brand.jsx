import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Switch,
  Upload,
  Space,
  Card,
  Typography,
  Tag,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  TagOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Text, Title } = Typography;

// Define your backend base URL
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL; // Or your deployed backend URL

axios.defaults.withCredentials = true;

const BrandAdminPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingBrand, setEditingBrand] = useState(null);
  const [fileList, setFileList] = useState([]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}/api/brands`);
      setBrands(res.data);
    } catch (error) {
      message.error("Failed to fetch brands");
      console.error("Fetch brands error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const onFinish = async (values) => {
    // Handle logo upload
    let logoUrl = null;
    if (fileList.length > 0) {
      const logoFile = fileList[0];
      if (logoFile.status === "done" && logoFile.response?.url) {
        logoUrl = logoFile.response.url;
      } else if (logoFile.url && !logoFile.originFileObj) {
        if (logoFile.url.startsWith(BACKEND_BASE_URL)) {
          logoUrl = logoFile.url.substring(BACKEND_BASE_URL.length);
        } else {
          logoUrl = logoFile.url;
        }
      }
    }

    const brandData = {
      ...values,
      logo: logoUrl,
    };

    delete brandData.logoUpload;

    try {
      if (editingBrand) {
        await axios.put(
          `${BACKEND_BASE_URL}/api/brands/${editingBrand._id}`,
          brandData
        );
        message.success("Brand updated successfully!");
      } else {
        await axios.post(`${BACKEND_BASE_URL}/api/brands`, brandData);
        message.success("Brand created successfully!");
      }
      fetchBrands();
      handleModalClose();
    } catch (error) {
      console.error("Failed to save brand:", error.response?.data || error.message);
      message.error(
        `Failed to save brand: ${error.response?.data?.error || "Unknown error"}`
      );
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingBrand(null);
    setFileList([]);
  };

  const handleEdit = (record) => {
    setEditingBrand(record);
    form.setFieldsValue(record);

    if (record.logo) {
      const logoFile = {
        uid: "logo-existing",
        name: record.logo.split("/").pop() || "logo.png",
        status: "done",
        url: `${BACKEND_BASE_URL}${record.logo}`,
        response: { url: record.logo },
        thumbUrl: `${BACKEND_BASE_URL}${record.logo}`,
      };
      setFileList([logoFile]);
    } else {
      setFileList([]);
    }

    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BACKEND_BASE_URL}/api/brands/${id}`);
      message.success("Brand deleted successfully!");
      fetchBrands();
    } catch (error) {
      console.error("Delete failed:", error.response?.data || error.message);
      message.error(
        `Delete failed: ${error.response?.data?.error || "Unknown error"}`
      );
    }
  };

  const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${BACKEND_BASE_URL}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      onSuccess(res.data, file);
      message.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      console.error("Upload error:", error.response?.data || error.message);
      onError(error);
      message.error(
        `${file.name} upload failed: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    }
  };

  const handleLogoChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const previewUrl = file.url || file.preview;
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo, record) => (
        <Avatar
          size={50}
          src={logo ? `${BACKEND_BASE_URL}${logo}` : null}
          style={{ backgroundColor: logo ? 'transparent' : '#f56a00' }}
        >
          {!logo && record.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    { 
      title: "Name", 
      dataIndex: "name", 
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        isActive ? (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            Active
          </Tag>
        ) : (
          <Tag color="error" icon={<CloseCircleOutlined />}>
            Inactive
          </Tag>
        )
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
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
            title="Are you sure to delete this brand?"
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

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
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
        <Title level={2} style={{ margin: 0, color: "#333" }}>
          <TagOutlined style={{ marginRight: 10, color: "#faad14" }} />
          Brand Management
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setModalVisible(true);
            setEditingBrand(null);
            form.resetFields();
            setFileList([]);
          }}
        >
          Add New Brand
        </Button>
      </div>

      <Card
        style={{
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Text style={{ fontSize: 18, color: "#999" }}>Loading brands...</Text>
          </div>
        ) : brands.length > 0 ? (
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={brands}
            bordered
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Text style={{ fontSize: 18, color: "#999" }}>
              No brands found. Start by adding one!
            </Text>
          </div>
        )}
      </Card>

      <Modal
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={() => form.submit()}
        okText={editingBrand ? "Update Brand" : "Create Brand"}
        width={600}
        destroyOnClose={true}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            label="Brand Name"
            name="name"
            rules={[{ required: true, message: "Please enter brand name" }]}
          >
            <Input placeholder="e.g., Nike, Adidas, Puma" />
          </Form.Item>

          <Form.Item
            label="Brand Logo"
            name="logoUpload"
            extra="Upload brand logo. Recommended size: 200x200px"
          >
            <Upload
              name="image"
              listType="picture-card"
              fileList={fileList}
              onChange={handleLogoChange}
              onPreview={handlePreview}
              customRequest={customRequest}
              maxCount={1}
              accept=".png,.jpeg,.jpg,.gif"
            >
              {fileList.length < 1 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload Logo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ max: 500, message: "Description cannot exceed 500 characters" }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="Enter brand description (optional)"
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            label="Website"
            name="website"
            rules={[
              { type: "url", message: "Please enter a valid URL" },
            ]}
          >
            <Input placeholder="https://www.brandwebsite.com" />
          </Form.Item>

          <Form.Item
            label="Active Status"
            name="isActive"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="Inactive"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandAdminPage;