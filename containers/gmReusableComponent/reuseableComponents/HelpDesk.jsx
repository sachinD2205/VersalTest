import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { useState } from 'react'
import KeyPressEvents from '../../../util/KeyPressEvents'

const HelpDesk = () => {
  const departmentsArr = [
    {
      label: 'Marriage Registration',
      value: '001',
    },
    {
      label: 'Marriage Board Registration',
      value: '002',
    },
    {
      label: 'Property Tax',
      value: '003',
    },
  ]
  const [isModalVisible, setIsModalVisible] = useState(false)
  const handleClick = () => {
    setIsModalVisible(true)
  }
  const handleModalCancel = () => {
    setIsModalVisible(false)
  }
  const handleModalOk = () => {
    setIsModalVisible(false)
  }
  const [helpDeskForm] = Form.useForm()
  return (
    <div>
      <a onClick={handleClick}>
        <b>Help Desk</b>
      </a>
      <Modal
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={900}
        visible={isModalVisible}
      >
        <Form layout='vertical' form={helpDeskForm}>
          <Row>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item name={'department'} label='Department'>
                <Select options={departmentsArr}></Select>
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name={'applicationNumber'}
                label='Application Number'
              >
                <Input type='text' onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
            <Col xl={1} lg={1} md={1} sm={1}></Col>
            <Col xl={7} lg={7} md={7} sm={7} xs={24}>
              <Form.Item
                rules={[
                  {
                    required: true,
                  },
                ]}
                name={'remarks'}
                label='Remarks'
              >
                <Input type='text' onKeyPress={KeyPressEvents.isInputChar} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: 30 }}>
            <Col sm={6} md={7} lg={7} xl={8}></Col>
            <Col xs={1} sm={1} md={1} lg={2} xl={2}></Col>
            <Button type='primary'>Get Details</Button>

            <Col xl={1} lg={2} md={3} sm={4} xs={8}></Col>
            <Col xl={2} lg={2} md={1} sm={1} xs={1}></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}

export default HelpDesk
