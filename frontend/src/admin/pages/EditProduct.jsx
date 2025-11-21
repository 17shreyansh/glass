import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Upload,
  Switch,
  Row,
  Col,
  Card,
  message,
  Spin,
  Divider,
  Space,
  Tabs,
  Alert,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  InfoCircleOutlined,
  BulbOutlined,
  PictureOutlined,
  StarOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import apiService from '../../services/api';

const { TextArea } = Input;
const { Option } = Select;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [galleryFileList, setGalleryFileList] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await apiService.request(`/products/${id}`);
      const productData = response.data;
      setProduct(productData);
      
      setSelectedProductType(productData.productType);
      form.setFieldsValue({
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice,
        category: productData.category,
        productType: productData.productType,
        material: productData.material,
        availableColors: productData.availableColors || [],
        metalDetails: productData.metalDetails || [],
        benefits: productData.benefits || [],
        spiritualBenefits: productData.spiritualBenefits || [],
        fashionStyle: productData.fashionStyle || [],
        occasion: productData.occasion || [],
        sizeVariants: productData.sizeVariants || [],
        isFeatured: productData.isFeatured,
        isActive: productData.isActive,
      });

      if (productData.mainImage) {
        setFileList([{
          uid: 'main-image',
          name: productData.mainImage.split('/').pop(),
          status: 'done',
          url: `http://localhost:3001${productData.mainImage}`,
          response: { url: productData.mainImage }
        }]);
      }

      if (productData.galleryImages?.length > 0) {
        setGalleryFileList(productData.galleryImages.map((url, index) => ({
          uid: `gallery-${index}`,
          name: url.split('/').pop(),
          status: 'done',
          url: `http://localhost:3001${url}`,
          response: { url }
        })));
      }
    } catch (error) {
      message.error('Failed to fetch product');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setSaving(true);
    try {
      let mainImageUrl = null;
      if (fileList.length > 0) {
        const mainFile = fileList[0];
        if (mainFile.response?.url) {
          mainImageUrl = mainFile.response.url;
        } else if (mainFile.url) {
          mainImageUrl = mainFile.url.startsWith('http://localhost:3001')
            ? mainFile.url.substring('http://localhost:3001'.length)
            : mainFile.url;
        }
      }

      const galleryImageUrls = galleryFileList
        .filter(file => file.response?.url || file.url)
        .map(file => {
          if (file.response?.url) {
            return file.response.url;
          } else if (file.url) {
            return file.url.startsWith('http://localhost:3001')
              ? file.url.substring('http://localhost:3001'.length)
              : file.url;
          }
          return null;
        })
        .filter(Boolean);

      const productData = {
        ...values,
        mainImage: mainImageUrl,
        image: mainImageUrl,
        galleryImages: galleryImageUrls,
      };

      await apiService.updateProduct(id, productData);
      message.success('Product updated successfully!');
      navigate('/admin/products');
    } catch (error) {
      message.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;
    try {
      const response = await apiService.uploadImage(file);
      // Ensure response has the correct structure
      const result = response.data ? response : { url: response.url };
      onSuccess(result, file);
      message.success(`${file.name} uploaded successfully!`);
    } catch (error) {
      onError(error);
      message.error(`${file.name} upload failed`);
    }
  };

  const handleMainImageChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleGalleryImageChange = ({ fileList: newFileList }) => {
    setGalleryFileList(newFileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    const previewUrl = file.url || file.preview;
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Card>
        <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/admin/products')}
          >
            Back to Products
          </Button>
          <h2 style={{ margin: 0 }}>Edit Product: {product?.name}</h2>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          size="large"
        >
          <Tabs defaultActiveKey="1" items={[
            {
              key: '1',
              label: (<span><InfoCircleOutlined /> Basic Info</span>),
              children: (
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      label="Product Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                      <Input placeholder="e.g., Gold Plated Ring" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Product Slug"
                      name="slug"
                      rules={[{ pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/, message: 'Slug must be lowercase alphanumeric with hyphens'}]}
                    >
                      <Input placeholder="e.g., gold-plated-ring" />
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
                      rules={[{ required: true, message: 'Please enter price' }]}
                    >
                      <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="e.g., 99.99" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Original Price (₹)"
                      name="originalPrice"
                    >
                      <InputNumber min={0} step={0.01} style={{ width: '100%' }} placeholder="e.g., 149.99" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: 'Please enter category' }]}
                    >
                      <Input placeholder="e.g., Rings, Necklaces, Earrings" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Product Type"
                      name="productType"
                      rules={[{ required: true, message: 'Please select product type' }]}
                    >
                      <Select 
                        placeholder="Select product type"
                        onChange={(value) => setSelectedProductType(value)}
                      >
                        <Option value="ashta-dhatu">Ashta Dhatu</Option>
                        <Option value="fashion-jewelry">Fashion Jewelry</Option>
                      </Select>
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
                  {selectedProductType && (
                    <Col span={24}>
                      <Alert
                        message={selectedProductType === 'ashta-dhatu' ? 'Ashta Dhatu Product' : 'Fashion Jewelry Product'}
                        description={selectedProductType === 'ashta-dhatu' 
                          ? 'Configure spiritual and traditional jewelry attributes'
                          : 'Configure modern fashion jewelry attributes'
                        }
                        type="info"
                        showIcon
                        icon={selectedProductType === 'ashta-dhatu' ? <StarOutlined /> : <HeartOutlined />}
                        style={{ marginBottom: 16 }}
                      />
                    </Col>
                  )}
                  <Col span={24}>
                    <Form.Item label="Material" name="material">
                      <Input placeholder={selectedProductType === 'ashta-dhatu' 
                        ? "e.g., Ashta Dhatu Alloy, Gold Plated" 
                        : "e.g., Stainless Steel, Brass, Alloy"
                      } />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Available Colors" name="availableColors">
                      <Select mode="tags" placeholder="Add colors">
                        <Option value="gold">Gold</Option>
                        <Option value="silver">Silver</Option>
                        <Option value="rose-gold">Rose Gold</Option>
                        <Option value="antique-gold">Antique Gold</Option>
                        <Option value="black">Black</Option>
                        <Option value="white">White</Option>
                        <Option value="copper">Copper</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Metal Details" name="metalDetails">
                      <Select mode="tags" placeholder="Add metal details">
                        {selectedProductType === 'ashta-dhatu' ? (
                          <>
                            <Option value="Ashta Dhatu alloy base">Ashta Dhatu alloy base</Option>
                            <Option value="Eight sacred metals blend">Eight sacred metals blend</Option>
                            <Option value="Traditional craftsmanship">Traditional craftsmanship</Option>
                            <Option value="Spiritual significance">Spiritual significance</Option>
                            <Option value="Vedic metal composition">Vedic metal composition</Option>
                          </>
                        ) : (
                          <>
                            <Option value="Premium quality finish">Premium quality finish</Option>
                            <Option value="Hypoallergenic material">Hypoallergenic material</Option>
                            <Option value="Tarnish resistant coating">Tarnish resistant coating</Option>
                            <Option value="Nickel-free">Nickel-free</Option>
                            <Option value="Lead-free">Lead-free</Option>
                          </>
                        )}
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
                        <Option value="Water resistant">Water resistant</Option>
                        <Option value="Easy maintenance">Easy maintenance</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {selectedProductType === 'ashta-dhatu' && (
                    <Col span={24}>
                      <Form.Item label="Spiritual Benefits" name="spiritualBenefits">
                        <Select mode="tags" placeholder="Add spiritual benefits">
                          <Option value="Positive energy enhancement">Positive energy enhancement</Option>
                          <Option value="Chakra balancing properties">Chakra balancing properties</Option>
                          <Option value="Astrological significance">Astrological significance</Option>
                          <Option value="Spiritual protection">Spiritual protection</Option>
                          <Option value="Meditation aid">Meditation aid</Option>
                          <Option value="Vedic healing properties">Vedic healing properties</Option>
                          <Option value="Divine blessings">Divine blessings</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  )}
                  {selectedProductType === 'fashion-jewelry' && (
                    <>
                      <Col span={24}>
                        <Form.Item label="Fashion Style" name="fashionStyle">
                          <Select mode="tags" placeholder="Add fashion styles">
                            <Option value="Contemporary">Contemporary</Option>
                            <Option value="Minimalist">Minimalist</Option>
                            <Option value="Bohemian">Bohemian</Option>
                            <Option value="Vintage">Vintage</Option>
                            <Option value="Statement">Statement</Option>
                            <Option value="Elegant">Elegant</Option>
                            <Option value="Trendy">Trendy</Option>
                            <Option value="Classic">Classic</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        <Form.Item label="Occasion" name="occasion">
                          <Select mode="tags" placeholder="Add suitable occasions">
                            <Option value="Daily wear">Daily wear</Option>
                            <Option value="Party">Party</Option>
                            <Option value="Wedding">Wedding</Option>
                            <Option value="Office">Office</Option>
                            <Option value="Casual">Casual</Option>
                            <Option value="Formal">Formal</Option>
                            <Option value="Festival">Festival</Option>
                            <Option value="Date night">Date night</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </>
                  )}
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
                                  <Input placeholder="e.g., Small, 7, One Size" style={{ width: '100%' }} />
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={10}>
                                <Form.Item
                                  {...restField}
                                  name={[name, 'stock']}
                                  label="Stock"
                                  rules={[{ required: true, message: 'Stock required' }]}
                                >
                                  <InputNumber min={0} placeholder="Stock" style={{ width: '100%' }} />
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
                      extra="Upload or replace the main product image. Only one image is allowed."
                    >
                      <Upload
                        name="image"
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleMainImageChange}
                        onPreview={handlePreview}
                        customRequest={customRequest}
                        maxCount={1}
                        accept=".png,.jpeg,.jpg,.gif"
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
                      extra="Upload multiple gallery images. You can remove existing images and add new ones. Maximum 5 images."
                    >
                      <Upload
                        name="image"
                        listType="picture-card"
                        fileList={galleryFileList}
                        onChange={handleGalleryImageChange}
                        onPreview={handlePreview}
                        customRequest={customRequest}
                        maxCount={5}
                        multiple
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
          
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button onClick={() => navigate('/admin/products')}>
                Cancel
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={saving}
                icon={<SaveOutlined />}
                size="large"
              >
                {saving ? 'Updating...' : 'Update Product'}
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default EditProduct;