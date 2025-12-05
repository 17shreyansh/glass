import React, { useState, useEffect } from "react";
import { Table, Button, message, Popconfirm, Card, Tag, Space } from "antd";
import { DeleteOutlined, MailOutlined, DownloadOutlined } from "@ant-design/icons";
import axios from "axios";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/contacts`,
        {
          params: { page, limit: pagination.pageSize },
          withCredentials: true,
        }
      );
      setContacts(data.data);
      setPagination({
        ...pagination,
        current: data.pagination.page,
        total: data.pagination.total,
      });
    } catch (error) {
      message.error("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/contacts/${id}`,
        { withCredentials: true }
      );
      message.success("Contact deleted successfully");
      fetchContacts(pagination.current);
    } catch (error) {
      message.error("Failed to delete contact");
    }
  };

  const handleTableChange = (newPagination) => {
    fetchContacts(newPagination.current);
  };

  const handleExport = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/contacts`,
        {
          params: { page: 1, limit: 10000 },
          withCredentials: true,
        }
      );
      
      const emails = data.data.map(c => c.email).join('\n');
      const blob = new Blob([emails], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
      message.success('Emails exported successfully');
    } catch (error) {
      message.error('Failed to export emails');
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <MailOutlined />
          {email}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "subscribed" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Subscribed Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete this contact?"
          onConfirm={() => handleDelete(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title="Newsletter Contacts"
        extra={
          <Space>
            <Tag color="blue">Total Subscribers: {pagination.total}</Tag>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export Emails
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={contacts}
          rowKey="_id"
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </Card>
    </div>
  );
};

export default Contacts;
