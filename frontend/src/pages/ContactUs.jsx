import React from "react";
import { Layout, Row, Col, Typography, Form, Input, Button } from "antd";

const { Content } = Layout;
const { Title, Text } = Typography;

const ContactUs = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    form.resetFields();
  };

  return (
    <Layout style={{ backgroundColor: "#f6f8f7" }}>
      <Content
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px 20px 100px",
          fontFamily: "'Josefin Sans', sans-serif",
          color: "#8E6A4E",
        }}
      >
        {/* Page Title */}
        <Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "50px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            color: "#8E6A4E",
          }}
        >
          Contact Us
        </Title>

        {/* Main Grid */}
        <Row
          gutter={[40, 40]}
          style={{
            backgroundColor: "#f1f5f4",
            borderRadius: "6px",
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* LEFT SIDE: Address & Support Info */}
          <Col
            xs={24}
            md={10}
            style={{
              backgroundColor: "#f6f8f7",
              padding: "50px 40px",
              borderRight: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <Title level={4} style={{ marginBottom: "20px", color: "#8E6A4E" }}>
              Address
            </Title>
            <Text style={{ display: "block", lineHeight: "1.8", marginBottom: "30px" }}>
              <strong>[Brand Name]</strong> Jewellery Studio <br />
              123, MG Road, Connaught Place <br />
              New Delhi - 110001
            </Text>

            <Title level={4} style={{ marginBottom: "20px", color: "#8E6A4E" }}>
              Customer Support
            </Title>
            <Text style={{ display: "block", lineHeight: "1.8" }}>
              Phone: <strong>+91 98765 43210</strong> <br />
              Email: <strong>support@[brandname].com</strong> <br />
              Live Chat: Available 10 AM – 8 PM (Mon–Sat)
            </Text>
          </Col>

          {/* RIGHT SIDE: Contact Form */}
          <Col
            xs={24}
            md={14}
            style={{
              backgroundColor: "#f9fcfb",
              padding: "50px 60px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input
                  placeholder="Name"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Invalid email format" },
                ]}
              >
                <Input
                  placeholder="Email"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                />
              </Form.Item>

              <Form.Item name="phone">
                <Input
                  placeholder="Phone"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                    fontFamily: "'Josefin Sans', sans-serif",
                  }}
                />
              </Form.Item>

              <Form.Item
                name="message"
                rules={[{ required: true, message: "Please enter your message" }]}
              >
                <Input.TextArea
                  rows={5}
                  placeholder="Message"
                  style={{
                    padding: "10px 14px",
                    borderRadius: "4px",
                    border: "1px solid #d9d9d9",
                    fontFamily: "'Josefin Sans', sans-serif",
                    resize: "none",
                  }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  style={{
                    backgroundColor: "#8E6A4E",
                    color: "white",
                    padding: "10px 30px",
                    border: "none",
                    borderRadius: "4px",
                    fontSize: "15px",
                    fontFamily: "'Josefin Sans', sans-serif",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default ContactUs;
