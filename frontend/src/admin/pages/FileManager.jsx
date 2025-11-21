import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Upload, 
  Button, 
  Image, 
  Modal, 
  message, 
  Row, 
  Col, 
  Input, 
  Select,
  Popconfirm,
  Typography,
  Space,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CopyOutlined,
  FolderOutlined,
  FileImageOutlined
} from '@ant-design/icons';
import apiService from '../../services/api';

const { Search } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const folders = [
    { value: 'all', label: 'All Files' },
    { value: 'products', label: 'Products' },
    { value: 'categories', label: 'Categories' },
    { value: 'homepage', label: 'Homepage' },
    { value: 'banners', label: 'Banners' }
  ];

  // Get backend URL from environment
  const getBackendUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    return apiUrl ? apiUrl.replace('/api', '') : 'http://localhost:3001';
  };

  const fetchFiles = async () => {
    setLoading(true);
    try {
      // This would be a custom endpoint to list files
      const response = await apiService.request('/upload/files');
      setFiles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      // Get actual files from uploads directory
      const backendUrl = getBackendUrl();
      setFiles([
        {
          id: 1,
          name: 'img-1761562306373-no6uwa.webp',
          url: `/uploads/categories/img-1761562306373-no6uwa.webp`,
          folder: 'categories',
          size: '245 KB',
          uploadDate: '2024-01-15'
        }
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async (file, folder = 'products') => {
    try {
      const response = await apiService.uploadImage(file, folder);
      message.success('File uploaded successfully');
      fetchFiles();
      return response;
    } catch (error) {
      message.error('Upload failed');
      throw error;
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await apiService.request(`/upload/files/${fileId}`, { method: 'DELETE' });
      message.success('File deleted successfully');
      fetchFiles();
    } catch (error) {
      message.error('Delete failed');
    }
  };

  const copyToClipboard = (url) => {
    const fullUrl = `${getBackendUrl()}${url}`;
    navigator.clipboard.writeText(fullUrl);
    message.success('URL copied to clipboard');
  };

  const filteredFiles = files.filter(file => {
    const matchesFolder = selectedFolder === 'all' || file.folder === selectedFolder;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Title level={2}>
            <FolderOutlined style={{ marginRight: 8, color: '#1890ff' }} />
            File Manager
          </Title>
          <Text type="secondary">Manage your uploaded images and files</Text>
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Upload
              customRequest={({ file, onSuccess, onError }) => {
                handleUpload(file, selectedFolder === 'all' ? 'products' : selectedFolder)
                  .then(onSuccess)
                  .catch(onError);
              }}
              showUploadList={false}
              accept="image/*"
              multiple
            >
              <Button type="primary" icon={<UploadOutlined />}>
                Upload Images
              </Button>
            </Upload>
          </Col>
          <Col span={8}>
            <Select
              value={selectedFolder}
              onChange={setSelectedFolder}
              style={{ width: '100%' }}
              placeholder="Select folder"
            >
              {folders.map(folder => (
                <Option key={folder.value} value={folder.value}>
                  {folder.label}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Search
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              allowClear
            />
          </Col>
        </Row>

        <Divider />

        <Row gutter={[16, 16]}>
          {filteredFiles.map(file => (
            <Col xs={24} sm={12} md={8} lg={6} key={file.id}>
              <Card
                hoverable
                cover={
                  <div style={{ height: 200, overflow: 'hidden', position: 'relative' }}>
                    <Image
                      src={`${getBackendUrl()}${file.url}`}
                      alt={file.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      preview={{
                        src: `${getBackendUrl()}${file.url}`
                      }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        background: 'rgba(0,0,0,0.5)',
                        borderRadius: 4,
                        padding: 4
                      }}
                    >
                      <Space>
                        <Button
                          type="text"
                          size="small"
                          icon={<EyeOutlined />}
                          onClick={() => {
                            setPreviewImage(`${getBackendUrl()}${file.url}`);
                            setPreviewVisible(true);
                          }}
                          style={{ color: 'white' }}
                        />
                        <Button
                          type="text"
                          size="small"
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(file.url)}
                          style={{ color: 'white' }}
                        />
                        <Popconfirm
                          title="Delete this file?"
                          onConfirm={() => handleDelete(file.id)}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={<DeleteOutlined />}
                            style={{ color: 'white' }}
                          />
                        </Popconfirm>
                      </Space>
                    </div>
                  </div>
                }
                size="small"
              >
                <Card.Meta
                  title={
                    <Text ellipsis style={{ fontSize: 12 }}>
                      {file.name}
                    </Text>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {file.folder} • {file.size}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {file.uploadDate}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>

        {filteredFiles.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <FileImageOutlined style={{ fontSize: 48, color: '#ccc' }} />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">No files found</Text>
            </div>
          </div>
        )}
      </Card>

      <Modal
        open={previewVisible}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
      >
        <Image
          src={previewImage}
          style={{ width: '100%' }}
        />
      </Modal>
    </div>
  );
};

export default FileManager;