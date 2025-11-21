import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select, Upload, Image } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import apiService from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

const AshtaDhatuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);
  const [imageFileList, setImageFileList] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await apiService.request('/categories?productType=ashta-dhatu');
      setCategories(response.data || []);
    } catch (error) {
      message.error('Failed to load categories');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      let categoryData = {
        ...values,
        productType: 'ashta-dhatu'
      };

      // Handle image upload if present
      if (values.image && values.image.file) {
        try {
          const uploadResponse = await apiService.uploadImage(values.image.file, 'categories');
          categoryData.image = uploadResponse.data.url;
        } catch (uploadError) {
          message.error('Failed to upload image');
          return;
        }
      }

      if (editingCategory) {
        await apiService.updateCategory(editingCategory._id, categoryData);
        message.success('Category updated successfully');
      } else {
        await apiService.createCategory(categoryData);
        message.success('Category created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingCategory(null);
      setImageFileList([]);
      fetchCategories();
    } catch (error) {
      message.error(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteCategory(id);
      message.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      message.error('Failed to delete category');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 80,
      render: (image) => (
        image ? (
          <Image
            src={`http://localhost:3001${image}`}
            alt="Category"
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#999', fontSize: 12 }}>No Image</span>
          </div>
        )
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record._id)}
          >
            <Button type="link" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h2>Ashta Dhatu Categories</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setModalVisible(true);
            setEditingCategory(null);
            form.resetFields();
          }}
        >
          Add Category
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingCategory(null);
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[{ required: true, message: 'Please enter slug' }]}
          >
            <Input placeholder="Enter slug (URL-friendly)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={4} placeholder="Enter category description" />
          </Form.Item>

          <Form.Item
            name="image"
            label="Category Image"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
              fileList={imageFileList}
              onChange={({ fileList }) => {
                setImageFileList(fileList);
                const file = fileList[0];
                if (file) {
                  form.setFieldsValue({ image: file });
                }
              }}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AshtaDhatuCategories;