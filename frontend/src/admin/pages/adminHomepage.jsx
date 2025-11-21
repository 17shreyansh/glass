import React, { useState, useEffect } from 'react';
import {
    Card,
    Form,
    Input,
    Button,
    Space,
    Typography,
    Row,
    Col,
    message,
    Tabs,
    Switch,
    ColorPicker,
    Spin,
    Upload,
    Modal
} from 'antd';
import {
    SaveOutlined,
    PlusOutlined,
    DeleteOutlined,
    EyeOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { TextArea } = Input;

axios.defaults.withCredentials = true;
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const HomePageAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const [bannerForm] = Form.useForm();
    const [shippingForm] = Form.useForm();
    const [imageGridForm] = Form.useForm();
    const [promoForm] = Form.useForm();
    const [footerForm] = Form.useForm();

    const [bannerData, setBannerData] = useState(null);
    const [shippingData, setShippingData] = useState(null);
    const [imageGridData, setImageGridData] = useState(null);
    const [promoData, setPromoData] = useState(null);
    const [footerData, setFooterData] = useState(null);

    const [bannerFileList, setBannerFileList] = useState([]);
    const [shippingFileList, setShippingFileList] = useState([]);
    const [imageGridFileList, setImageGridFileList] = useState([]);
    const [promoBannerFileList, setPromoBannerFileList] = useState([]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [banner, shipping, imageGrid, promo, footer] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/home/banner`),
                axios.get(`${API_BASE_URL}/api/home/shipping-banner`),
                axios.get(`${API_BASE_URL}/api/home/image-grid`),
                axios.get(`${API_BASE_URL}/api/home/promo-banner`),
                axios.get(`${API_BASE_URL}/api/home/footer-offer`)
            ]);

            setBannerData(banner.data.data);
            setShippingData(shipping.data.data);
            setImageGridData(imageGrid.data.data);
            setPromoData(promo.data.data);
            setFooterData(footer.data.data);

            bannerForm.setFieldsValue(banner.data.data);
            shippingForm.setFieldsValue(shipping.data.data);

            // Ensure promoForm handles the 'title' array correctly by joining for TextArea
            promoForm.setFieldsValue({
                ...promo.data.data,
                title: promo.data.data.title ? promo.data.data.title.join('\n') : ''
            });
            footerForm.setFieldsValue(footer.data.data);

            if (banner.data.data?.image) {
                setBannerFileList([{
                    uid: banner.data.data.image,
                    name: banner.data.data.image.split('/').pop(),
                    status: 'done',
                    url: `${API_BASE_URL}${banner.data.data.image}`,
                    response: { url: banner.data.data.image }
                }]);
            } else {
                setBannerFileList([]);
            }

            if (shipping.data.data?.image) {
                setShippingFileList([{
                    uid: shipping.data.data.image,
                    name: shipping.data.data.image.split('/').pop(),
                    status: 'done',
                    url: `${API_BASE_URL}${shipping.data.data.image}`,
                    response: { url: shipping.data.data.image }
                }]);
            } else {
                setShippingFileList([]);
            }

            if (imageGrid.data.data?.images && imageGrid.data.data.images.length > 0) {
                const mappedFiles = imageGrid.data.data.images.map((img, index) => ({
                    uid: img.url, // Use the actual URL as UID for existing images
                    name: img.alt || img.url.split('/').pop(),
                    status: 'done',
                    url: `${API_BASE_URL}${img.url}`,
                    response: { url: img.url }
                }));
                setImageGridFileList(mappedFiles);
                // Set the form field values for images, ensuring 'url' and 'alt' are present
                imageGridForm.setFieldsValue({ images: imageGrid.data.data.images });
                imageGridForm.setFieldsValue({ backgroundColor: imageGrid.data.data.backgroundColor });
            } else {
                setImageGridFileList([]);
                imageGridForm.setFieldsValue({ images: [] });
            }

            // Initialize promoBannerFileList for existing imageUrl
            if (promo.data.data?.image) {
            setPromoBannerFileList([{
                uid: promo.data.data.image,
                name: promo.data.data.image.split('/').pop(),
                status: 'done',
                url: `${API_BASE_URL}${promo.data.data.image}`,
                response: { url: promo.data.data.image }
            }]);
        } else {
            setPromoBannerFileList([]);
        }

    } catch (error) {
        message.error('Failed to fetch home page data');
        console.error(error);
    } finally {
        setLoading(false);
    }
};

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleSave = async (endpoint, values, fileList = [], successMessage, fileFieldName = 'image') => {
        setSaving(true);
        try {
            // --- START: Added Logging for values and fileList ---
            console.log('--- handleSave: Incoming values ---', values);
            console.log('--- handleSave: Incoming fileList ---', fileList);
            // --- END: Added Logging for values and fileList ---

            const formData = new FormData();

            for (const key in values) {
                if (values[key] !== undefined && values[key] !== null) {
                    if (typeof values[key] === 'object' && values[key] && 'toHexString' in values[key]) {
                        formData.append(key, values[key].toHexString());
                    }
                    else if (key === 'guarantees' && Array.isArray(values[key])) {
                        formData.append(key, JSON.stringify(values[key]));
                    }
                    else if (key === 'images' && Array.isArray(values[key])) {
                        // For image grid, we need to send alt text and existing URLs
                        values[key].forEach((item, index) => {
                            formData.append(`${key}[${index}][alt]`, item.alt);
                            // Only append the URL if it's an existing one (not a new file UID)
                            if (item.url && !item.url.startsWith('rc-upload-')) {
                                formData.append(`${key}[${index}][url]`, item.url);
                            }
                        });
                    }
                    // Corrected: Append each title from the TextArea individually for promo-banner
                    else if (key === 'title' && endpoint === 'promo-banner') {
                    const titlesArray = values[key].split('\n').filter(line => line.trim() !== '');
                    titlesArray.forEach(title => {
                        formData.append('title', title); // Send multiple 'title' entries
                    });
                }
                else {
                    formData.append(key, values[key]);
                }
            }
        }

            let newFileAppended = false;
            // Iterate through the fileList and append only new files (those with originFileObj)
            fileList.forEach(file => {
                if (file.originFileObj) {
                    formData.append(fileFieldName, file.originFileObj);
                    newFileAppended = true;
                }
            });

            // Specific handling for promo-banner:
            // If no new file was uploaded AND there's an existing imageUrl from promoData,
            // append the existing imageUrl as a regular text field.
            if (endpoint === 'promo-banner' && !newFileAppended && promoData?.image) {
            const relativeImageUrl = promoData.image.startsWith(API_BASE_URL) ? 
                                     promoData.image.replace(API_BASE_URL, '') : 
                                     promoData.image;
            formData.append(fileFieldName, relativeImageUrl);
        }

            // --- START: Added Logging for FormData before sending ---
            console.log('--- FormData content before sending to backend ---');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            console.log('--- End FormData Logging ---');
            // --- END: Added Logging for FormData before sending ---


            await axios.put(`${API_BASE_URL}/api/home/${endpoint}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // This is crucial for FormData
                },
            });
            message.success(successMessage);
            fetchAllData(); // Refresh data after successful save
        } catch (error) {
            console.error("Failed to save changes:", error);
            const errorMessage = error.response?.data?.message || 'Failed to save changes. Please try again.';
            message.error(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    const LoadingWrapper = ({ children }) => (
        <Spin spinning={loading} size="large">
            <div style={{ minHeight: '200px' }}>
                {children}
            </div>
        </Spin>
    );

    const BannerEditor = () => (
        <LoadingWrapper>
            <Card title="Main Banner" extra={
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => {
                        bannerForm.validateFields().then(values => {
                            handleSave('banner', values, bannerFileList, 'Banner updated successfully', 'image');
                        });
                    }}
                >
                    Save Banner
                </Button>
            }>
                <Form form={bannerForm} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="title"
                                label="Banner Title"
                                rules={[{ required: true, message: 'Please enter banner title' }]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter banner title..."
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="subtitle"
                                label="Banner Subtitle"
                                rules={[{ required: true, message: 'Please enter banner subtitle' }]}
                            >
                                <TextArea
                                    rows={3}
                                    placeholder="Enter banner subtitle..."
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Banner Image">
                                <Upload
                                    listType="picture-card"
                                    fileList={bannerFileList}
                                    onPreview={handlePreview}
                                    beforeUpload={() => false} // Prevent Ant Design's default upload behavior
                                    onChange={({ fileList: newFileList }) => setBannerFileList(newFileList)}
                                    maxCount={1}
                                >
                                    {bannerFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            {/* Display current image path if no new file is selected */}
                            {bannerData?.image && bannerFileList.length === 0 && (
                                <Text type="secondary">Current image: {bannerData.image}</Text>
                            )}
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="exploreText"
                                label="Explore Button Text"
                            >
                                <Input placeholder="EXPLORE NEW ARRIVALS" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </LoadingWrapper>
    );

    const ShippingBannerEditor = () => (
        <LoadingWrapper>
            <Card title="Shipping & Guarantee Banner" extra={
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => {
                        shippingForm.validateFields().then(values => {
                            handleSave('shipping-banner', values, shippingFileList, 'Shipping banner updated successfully', 'image');
                        });
                    }}
                >
                    Save Shipping Banner
                </Button>
            }>
                <Form form={shippingForm} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Form.Item label="Shoes Image">
                                <Upload
                                    listType="picture-card"
                                    fileList={shippingFileList}
                                    onPreview={handlePreview}
                                    beforeUpload={() => false}
                                    onChange={({ fileList: newFileList }) => setShippingFileList(newFileList)}
                                    maxCount={1}
                                >
                                    {shippingFileList.length < 1 && (
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                            </Form.Item>
                            {shippingData?.image && shippingFileList.length === 0 && (
                                <Text type="secondary">Current image: {shippingData.image}</Text>
                            )}
                        </Col>
                        <Col xs={24} lg={6}>
                            <Form.Item
                                name="backgroundColor"
                                label="Background Color"
                                getValueFromEvent={(color) => color ? color.toHexString() : undefined}
                                getValueProps={(value) => ({ value: value || '#FFFFFF' })}
                            >
                                <ColorPicker showText />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={6}>
                            <Form.Item
                                name="textColor"
                                label="Text Color"
                                getValueFromEvent={(color) => color ? color.toHexString() : undefined}
                                getValueProps={(value) => ({ value: value || '#000000' })}
                            >
                                <ColorPicker showText />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.List name="guarantees">
                        {(fields, { add, remove }) => (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <Text strong>Guarantee Messages</Text>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Guarantee
                                    </Button>
                                </div>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: 'flex', marginBottom: 8, width: '100%' }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, 'text']}
                                            rules={[{ required: true, message: 'Please enter guarantee text' }]}
                                            style={{ flex: 1 }}
                                        >
                                            <Input placeholder="e.g., Free Shipping" />
                                        </Form.Item>
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => remove(name)}
                                        />
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
        </LoadingWrapper>
    );

    const ImageGridEditor = () => (
        <LoadingWrapper>
            <Card title="Image Grid Section" extra={
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => {
                        imageGridForm.validateFields().then(values => {
                            handleSave('image-grid', values, imageGridFileList, 'Image grid updated successfully', 'images');
                        });
                    }}
                >
                    Save Image Grid
                </Button>
            }>
                <Form form={imageGridForm} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="backgroundColor"
                                label="Background Color"
                                getValueFromEvent={(color) => color ? color.toHexString() : undefined}
                                getValueProps={(value) => ({ value: value || '#E2BF9B' })}
                            >
                                <ColorPicker showText />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item label="Grid Images (Max 4)">
                        <Upload
                            listType="picture-card"
                            fileList={imageGridFileList}
                            onPreview={handlePreview}
                            beforeUpload={() => false}
                            onChange={({ fileList: newFileList }) => {
                                const filteredFileList = newFileList.filter(file => {
                                    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
                                    if (!isJpgOrPng && file.originFileObj) {
                                        message.error('You can only upload JPG/PNG/GIF file!');
                                    }
                                    return isJpgOrPng;
                                }).slice(0, 4);

                                setImageGridFileList(filteredFileList);

                                const currentFormImages = imageGridForm.getFieldValue('images') || [];
                                const updatedFormImages = filteredFileList.map((file) => {
                                    const existingImage = imageGridData?.images?.find(img => img.url === file.uid);
                                    const currentFormEntry = currentFormImages.find(item => item.url === file.uid);

                                    // For existing files, use their actual URL from the backend data
                                    // For new files, use their temporary UID (which will be replaced by server URL after upload)
                                    const imageUrlForForm = file.url && !file.originFileObj ? file.url.replace(API_BASE_URL, '') : file.uid;

                                    return {
                                        url: imageUrlForForm,
                                        alt: existingImage?.alt || currentFormEntry?.alt || file.name.split('.')[0]
                                    };
                                });
                                imageGridForm.setFieldsValue({ images: updatedFormImages });
                            }}
                            multiple
                            maxCount={4}
                        >
                            {imageGridFileList.length < 4 && (
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            )}
                        </Upload>
                    </Form.Item>

                    <Form.List name="images">
                        {(fields, { add, remove }) => (
                            <>
                                {imageGridFileList.map((file, index) => {
                                    const field = fields[index];
                                    if (!field) return null;

                                    return (
                                        <Card key={field.key} size="small" style={{ marginBottom: 16 }}>
                                            <Row gutter={[16, 16]} align="middle">
                                                <Col span={24}>
                                                    <Text strong>Alt Text for {file.name}</Text>
                                                    {file.url && !file.originFileObj && (
                                                        <Text type="secondary" style={{ marginLeft: 8 }}>({file.url.replace(API_BASE_URL, '')})</Text>
                                                    )}
                                                </Col>
                                                <Col xs={24} lg={20}>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'alt']}
                                                        label="Alt Text"
                                                        rules={[{ required: true, message: 'Please enter alt text' }]}
                                                    >
                                                        <Input placeholder="Image description..." />
                                                    </Form.Item>
                                                </Col>
                                                <Col xs={24} lg={4}>
                                                    <Button
                                                        type="text"
                                                        danger
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => {
                                                            const newFileList = imageGridFileList.filter((_, i) => i !== index);
                                                            setImageGridFileList(newFileList);

                                                            const currentImages = imageGridForm.getFieldValue('images');
                                                            const updatedImages = currentImages.filter((_, i) => i !== index);
                                                            imageGridForm.setFieldsValue({ images: updatedImages });
                                                        }}
                                                        style={{ marginTop: 30 }}
                                                    />
                                                </Col>
                                            </Row>
                                        </Card>
                                    );
                                })}
                            </>
                        )}
                    </Form.List>
                </Form>
            </Card>
        </LoadingWrapper>
    );

    const PromoBannerEditor = () => (
    <LoadingWrapper>
        <Card title="Promo Banner" extra={
            <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={saving}
                onClick={() => {
                    promoForm.validateFields().then(values => {
                        handleSave('promo-banner', values, promoBannerFileList, 'Promo banner updated successfully', 'image');
                    });
                }}
            >
                Save Promo Banner
            </Button>
        }>
            <Form form={promoForm} layout="vertical">
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={12}>
                        <Form.Item
                            name="title"
                            label="Promo Titles (One per line)"
                            rules={[{ required: true, message: 'Please enter at least one promo title' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Free Shipping&#10;Easy Returns&#10;100% Comfort&#10;Guarantee"
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Form.Item label="Promo Image">
                            <Upload
                                listType="picture-card"
                                fileList={promoBannerFileList}
                                onPreview={handlePreview}
                                beforeUpload={() => false}
                                onChange={({ fileList: newFileList }) => setPromoBannerFileList(newFileList)}
                                maxCount={1}
                            >
                                {promoBannerFileList.length < 1 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                        </Form.Item>
                        {/* Updated to use 'image' instead of 'imageUrl' */}
                        {promoData?.image && promoBannerFileList.length === 0 && (
                            <Text type="secondary">Current image: {promoData.image}</Text>
                        )}
                    </Col>
                </Row>
            </Form>
        </Card>
    </LoadingWrapper>
);

    const FooterOfferEditor = () => (
        <LoadingWrapper>
            <Card title="Footer Offer Section" extra={
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    loading={saving}
                    onClick={() => {
                        footerForm.validateFields().then(values => {
                            handleSave('footer-offer', values, null, 'Footer offer updated successfully');
                        });
                    }}
                >
                    Save Footer Offer
                </Button>
            }>
                <Form form={footerForm} layout="vertical">
                    <Row gutter={[16, 16]}>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="title"
                                label="Offer Title"
                                rules={[{ required: true, message: 'Please enter offer title' }]}
                            >
                                <Input placeholder="FOOT WEAR COLLECTION" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={12}>
                            <Form.Item
                                name="discount"
                                label="Discount Text"
                                rules={[{ required: true, message: 'Please enter discount' }]}
                            >
                                <Input placeholder="30% OFF" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Form.Item
                                name="buttonText"
                                label="Button Text"
                            >
                                <Input placeholder="SHOP NOW" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Form.Item
                                name="backgroundColor"
                                label="Background Color"
                                getValueFromEvent={(color) => color ? color.toHexString() : undefined}
                                getValueProps={(value) => ({ value: value || '#F3E2CD' })}
                            >
                                <ColorPicker showText />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </LoadingWrapper>
    );

    const tabItems = [
        {
            label: 'Main Banner',
            key: '1',
            children: <BannerEditor />,
        },
        {
            label: 'Shipping Banner',
            key: '2',
            children: <ShippingBannerEditor />,
        },
        {
            label: 'Image Grid',
            key: '3',
            children: <ImageGridEditor />,
        },
        {
            label: 'Promo Banner',
            key: '4',
            children: <PromoBannerEditor />,
        },
        
    ];

    return (
        <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                <Card style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            Home Page Editor
                        </Title>
                        <Space>
                            <Button
                                icon={<EyeOutlined />}
                                onClick={() => setPreviewVisible(true)}
                            >
                                Preview
                            </Button>
                            <Button
                                type="primary"
                                onClick={fetchAllData}
                                loading={loading}
                            >
                                Refresh Data
                            </Button>
                        </Space>
                    </div>
                </Card>

                <Tabs defaultActiveKey="1" type="card" items={tabItems} />

                <Modal
                    title={previewTitle}
                    open={previewVisible}
                    onCancel={() => setPreviewVisible(false)}
                    footer={null}
                    width="90%"
                    style={{ top: 20 }}
                >
                    <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        </div>
    );
};

export default HomePageAdmin;
