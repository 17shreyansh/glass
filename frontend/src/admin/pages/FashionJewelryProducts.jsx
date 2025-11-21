import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Form, Input, InputNumber, Select, message, Popconfirm, Upload, Image, Row, Col } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import apiService from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

const FashionJewelryProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getProductsByType('fashion-jewelry');
      setProducts(response.data || []);
    } catch (error) {
      message.error('Failed to load products');
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    try {
      const response = await apiService.request('/categories?productType=fashion-jewelry');
      setCategories(response.data || []);
    } catch (error) {
      message.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (values) => {
    try {
      let productData = {
        ...values,
        productType: 'fashion-jewelry'
      };

      // Handle main image upload
      if (values.mainImage && values.mainImage.file) {
        try {
          const uploadResponse = await apiService.uploadImage(values.mainImage.file, 'products');
          productData.mainImage = uploadResponse.data.url;
          productData.image = uploadResponse.data.url; // For compatibility
        } catch (uploadError) {
          message.error('Failed to upload main image');
          return;
        }
      }

      // Handle gallery images upload
      if (values.galleryImages && values.galleryImages.length > 0) {
        try {
          const galleryUrls = [];
          for (const imageFile of values.galleryImages) {
            if (imageFile.file) {
              const uploadResponse = await apiService.uploadImage(imageFile.file, 'products');
              galleryUrls.push(uploadResponse.data.url);
            }
          }
          productData.galleryImages = galleryUrls;
        } catch (uploadError) {
          message.error('Failed to upload gallery images');
          return;
        }
      }

      if (editingProduct) {
        await apiService.updateProduct(editingProduct._id, productData);
        message.success('Product updated successfully');
      } else {
        await apiService.createProduct(productData);
        message.success('Product created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      message.error(error.message || 'Failed to save product');
    }
  };

  const handleEdit = (record) => {
    navigate(`/admin/products/edit/${record._id}`);
  };

  const handleAdd = () => {
    navigate('/admin/products/add?type=fashion-jewelry');
  };

  const handleDelete = async (id) => {
    try {
      await apiService.deleteProduct(id);
      message.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      message.error('Failed to delete product');
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'mainImage',
      key: 'mainImage',
      width: 80,
      render: (image) => (
        image ? (
          <Image
            src={`http://localhost:3001${image}`}
            alt="Product"
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
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => isActive ? 'Active' : 'Inactive',
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
            title="Are you sure to delete this product?"
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
        <h2>Fashion Jewelry Products</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="_id"
        pagination={{ pageSize: 10 }}
      />


    </div>
  );
};

export default FashionJewelryProducts;