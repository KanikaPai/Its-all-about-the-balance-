import React, { useState } from "react";
import { Modal, Form, Input, Select, DatePicker, TimePicker, Button } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;

const EventModal = ({ visible, onCreate, onCancel, date, startTime, endTime }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onCreate(values);
      form.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };

  const handleCancel = async () => {
    form.resetFields();
    if (onCancel) { onCancel(); }
  }

  return (
    <Modal
      open={ visible }
      destroyOnClose={ true }
      title="Create Calendar Event"
      onCancel={ onCancel }
      footer={[
        <Button key="cancel" onClick={ handleCancel }>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={ handleOk }>
          Create
        </Button>,
      ]}
    >
        <Form 
          form={ form } 
          preserve = { false }
          layout="vertical"
          initialValues = { { 
            date,
            startTime,
            endTime
          } }
        >
            <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select a date" }]}> 
                <DatePicker needConfirm={ false } style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "A start time for events is required" }]}> 
                <TimePicker minuteStep={ 15 } needConfirm={ false } format="hh:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "An end time for events is required" }]}> 
                <TimePicker minuteStep={ 15 } needConfirm={ false } format="hh:mm" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Provide a short description event" }]}> 
                <Input />
            </Form.Item>

            <Form.Item name="description" label="Description"> 
                <TextArea rows={4} />
            </Form.Item>

            <Form.Item name="type" label="Event Type" rules={[{ required: true, message: "Events require a type" }]}> 
                <Select>
                <Select.Option value="Study">Study</Select.Option>
                <Select.Option value="ToDo">ToDo</Select.Option>
                <Select.Option value="Holiday">Holiday</Select.Option>
                </Select>
            </Form.Item>
        </Form>
    </Modal>
  );
}

export default EventModal;
