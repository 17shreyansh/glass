import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Tree, // Import Tree component
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FolderOutlined,
  FileOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
axios.defaults.withCredentials = true;

const CategoryAdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]); // For controlled tree expansion

  const generateSlug = (name) => {
    if (!name) return "";
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      // No need for client-side sorting by level and name if the backend handles it or we build the tree
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to load categories:", err.response?.data || err.message);
      message.error("Failed to load categories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    try {
      const dataToSend = {
        ...values,
        slug: values.slug || generateSlug(values.name),
      };

      if (dataToSend.parent === "") {
        dataToSend.parent = null;
      }

      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/api/categories/${editingCategory._id}`,
          dataToSend
        );
        message.success("Category updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/categories`, dataToSend);
        message.success("Category created successfully!");
      }
      fetchCategories();
      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.error
          ? err.response.data.error
          : "Failed to save category.";
      console.error("Save category failed:", err.response?.data || err.message);
      message.error(errorMessage);
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      parent: record.parent ? record.parent._id : "",
      slug: record.slug,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/categories/${id}`);
      message.success("Category deleted successfully!");
      fetchCategories();
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Failed to delete category.";
      console.error("Delete category failed:", err.response?.data || err.message);
      message.error(errorMessage);
    }
  };

  // --- Tree Data Transformation ---
  // This memoized function builds the hierarchical data for the Ant Design Tree
  const treeData = useMemo(() => {
    const map = new Map(categories.map((cat) => [cat._id, { ...cat, children: [] }]));
    const rootNodes = [];

    categories.forEach((cat) => {
      if (cat.parent) {
        const parent = map.get(cat.parent._id);
        if (parent) {
          parent.children.push(map.get(cat._id));
        } else {
          // Handle cases where a parent might not be in the current categories list
          // (e.g., if filtered or parent was deleted) - treat as root
          rootNodes.push(map.get(cat._id));
        }
      } else {
        rootNodes.push(map.get(cat._id));
      }
    });

    // Sort children for consistent display
    const sortChildren = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(node => {
        if (node.children) {
          sortChildren(node.children);
        }
      });
    };

    sortChildren(rootNodes);

    // Transform to Ant Design Tree format with key, title, and data
    const transformToTreeNodes = (nodes) => {
      return nodes.map((node) => ({
        key: node._id,
        title: node.name,
        // Store original data in a property for easy access
        data: node,
        icon: node.children && node.children.length > 0 ? <FolderOutlined /> : <FileOutlined />,
        children: node.children.length > 0 ? transformToTreeNodes(node.children) : undefined,
      }));
    };

    return transformToTreeNodes(rootNodes);
  }, [categories]);

  // --- Tree Node Rendering and Actions ---
  const renderTreeTitle = (nodeData) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 8 }}>
      <span>{nodeData.title}</span>
      <div style={{ marginLeft: 16 }}>
        <Tooltip title="Edit Category">
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={(e) => {
              e.stopPropagation(); // Prevent tree node collapse/expand
              handleEdit(nodeData.data);
            }}
            style={{ color: "#1890ff" }}
          />
        </Tooltip>
        <Popconfirm
          title="Are you sure to delete this category? This will also unassign products from it."
          onConfirm={(e) => {
            e.stopPropagation(); // Prevent tree node collapse/expand
            handleDelete(nodeData.data._id);
          }}
          okText="Yes"
          cancelText="No"
        >
          <Tooltip title="Delete Category">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={(e) => e.stopPropagation()} // Prevent tree node collapse/expand
            />
          </Tooltip>
        </Popconfirm>
      </div>
    </div>
  );

  const getParentOptions = () => {
    if (!editingCategory) {
      return categories.filter(cat => cat.level !== undefined && cat.level >= 0);
    }

    const editingCategoryAncestors = editingCategory.ancestors || [];

    return categories.filter(cat =>
      cat._id !== editingCategory._id &&
      !(cat.ancestors && cat.ancestors.includes(editingCategory._id)) &&
      !editingCategoryAncestors.includes(cat._id) &&
      cat.level !== undefined && cat.level >= 0
    );
  };

  const handleExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

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
        <h2 style={{ margin: 0, fontSize: 28, color: "#333" }}>
          <FolderOutlined style={{ marginRight: 10, color: "#faad14" }} />
          Category Management
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setModalVisible(true);
            setEditingCategory(null);
            form.resetFields();
            form.setFieldsValue({ slug: "" });
          }}
        >
          Add New Category
        </Button>
      </div>

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
            <span style={{ fontSize: 24, color: "#999" }}>Loading categories...</span>
          </div>
        ) : treeData.length > 0 ? (
          <Tree
            showIcon
            defaultExpandAll // Or use expandedKeys for controlled expansion
            expandedKeys={expandedKeys}
            onExpand={handleExpand}
            treeData={treeData}
            titleRender={renderTreeTitle} // Custom rendering for titles with buttons
            style={{ fontSize: 16 }}
          />
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <span style={{ fontSize: 20, color: "#999" }}>No categories found. Start by adding one!</span>
          </div>
        )}
      </div>

      <Modal
        title={editingCategory ? "Edit Category" : "Add New Category"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={() => form.submit()}
        okText={editingCategory ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ description: "", parent: "", slug: "" }}
        >
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input
              placeholder="e.g. Sneakers, Boots"
              onChange={(e) => {
                const name = e.target.value;
                const generatedSlug = generateSlug(name);
                form.setFieldsValue({ slug: generatedSlug });
              }}
            />
          </Form.Item>

          <Form.Item
            label="Category Slug"
            name="slug"
            rules={[
              { required: true, message: "Please enter category slug" },
              {
                pattern: /^[a-z0-9-]+$/,
                message:
                  "Slug can only contain lowercase letters, numbers, and hyphens.",
              },
            ]}
            tooltip="This is used in URLs (e.g., /categories/shoes-sneakers). Auto-generated from name."
          >
            <Input placeholder="e.g. sneakers-boots" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <TextArea rows={3} placeholder="Optional description" />
          </Form.Item>

          <Form.Item label="Parent Category" name="parent">
            <Select allowClear placeholder="Select a parent category (optional)">
              <Option value="">None (Top Level Category)</Option>
              {getParentOptions().map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {`${"– ".repeat(cat.level || 0)}${cat.name}`}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryAdminPage;