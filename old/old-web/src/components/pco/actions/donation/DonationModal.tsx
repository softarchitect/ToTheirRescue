/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-unused-vars */
import {
  Modal, Form, message, Row, Col, Button,
} from 'antd';
import { useEffect, useState } from 'react';
import './DonationModal.less';
import TyrModal from 'src/shared/components/Modal/TyrModal';
import PcoDetailCard from 'src/shared/components/PcoDetailCard';
import TextInput from 'src/shared/components/Inputs/TextInput';
import AreaInput from 'src/shared/components/Inputs/AreaInput';
import DateInput from 'src/shared/components/Inputs/DateInput';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import dayjs, { Dayjs } from 'dayjs';
import ConfirmModal from 'src/shared/components/ConfirmModal';

const cssPrefix = 'donation-modal';

export interface DonationModalProps {
  visible: boolean;
  setVisible: any;
  editRecord: any;
  setEditRecord: any;
  handleUpdate: any;
  onCancelClicked: any;
  selectedPco: any;
  addLoading: any;
  setAddLoading: any;
  donationType: any;
  setDonationType: any;
}

export const DonationModal = (props: DonationModalProps) => {
  const [form] = Form.useForm();
  const {
    visible, setVisible, selectedPco, addLoading, setAddLoading, donationType, setDonationType, editRecord,
    setEditRecord, handleUpdate,
  } = props;
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({ ...editRecord, donationDate: dayjs(editRecord?.donationDate) });
      return;
    }
    setIsFormTouched(false);
    setEditRecord(false);
    form.resetFields();
    form.setFieldValue('donationDate', dayjs());
    form.setFieldValue('amount', 0);
  }, [visible]);

  const onCancel = () => {
    if (!isFormTouched) {
      form.resetFields();
      props.onCancelClicked(false);
      return;
    }
    setConfirmModal(true);
  };

  const handleSave = async () => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = {
        pcoId: selectedPco?.id,
        // eslint-disable-next-line no-nested-ternary
        donationType: (donationType === 1) ? 'money' : 'others',
        ...values,
      };

      apiCall('donation/add-donation', 'POST', data)
        .then((respAdd: any) => {
          if (respAdd?.data?.success) {
            message.success({
              content: respAdd?.data?.message || alertConstant.donation_add_success,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            form.resetFields();
            setVisible(false);
          }
          setAddLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  const footerContent = [
    <Button
      key="back-pco"
      onClick={() => onCancel()}
    >
      Cancel
    </Button>,
    <Button
      className="ftr-button-primary"
      form="animal-donation-form"
      key="submit"
      htmlType="submit"
      onClick={editRecord ? () => handleUpdate({ form }) : handleSave}
      loading={addLoading}
    >
      {editRecord ? 'Update' : 'Save'}
    </Button>,
  ];

  const disabledDate = (current: Dayjs | null | undefined) => !!current && current > dayjs();

  const onChange = (currValue: any) => {
    setDonationType(currValue);
  };

  const modalTitle = (<span className={`${cssPrefix}__modal__title`}>{`${editRecord ? 'Edit' : 'Add New'} Donation`}</span>);
  const modalContent = (
    <div className="">
      <Row style={{ padding: '0px 10px' }}>
        <Col span={24}>
          <PcoDetailCard pcoDetails={selectedPco} />
        </Col>
      </Row>
      <Form
        key={donationType}
        form={form}
        onFinish={handleSave}
      >
        <br />
        <Row>
          <Col sm={12} xs={24}>
            <DateInput
              label="Donation Date"
              name="donationDate"
              rules={[
                { required: true, message: 'Date is required' },
              ]}
              className="hide-label"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              onChange={() => setIsFormTouched(true)}
            />
          </Col>
          <Col sm={12} xs={24}>
            <TextInput
              label="Amount"
              name="amount"
              rules={[
                { required: true, message: 'Amount is required' },
                { pattern: /^\d*\.?\d+$/, message: 'Please eneter a number' },
              ]}
              placeholder="Amount"
              isRequired
              onChange={() => setIsFormTouched(true)}
            />
          </Col>
        </Row>
        <Row justify="center" style={{ padding: '0px 10px', marginBottom: '24px' }}>
          <Col span={6}>
            <div
              style={{ display: 'flex', justifyContent: 'center' }}
              className={(donationType === 1) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => onChange(1)}
            >
              <span className="radio-label">Money</span>
            </div>
          </Col>
          <Col span={1} />
          <Col span={6}>
            <div
              style={{ display: 'flex', justifyContent: 'center' }}
              className={(donationType === 2) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => onChange(2)}
            >
              <span className="radio-label">Other</span>
            </div>
          </Col>
          {/* <Col xs={7} span={5}>
            <div
              className={(donationType === 3) ? 'custom-tab-selected' : 'custom-tab'}
              onClick={() => onChange(3)}
            >
              <span className="radio-label">In Kind</span>
            </div>
          </Col> */}
        </Row>
        {/* <Form.Item
          label="Method"
          name="method"
          rules={[
            { required: true, message: 'Payment method is required' },
          ]}
          className="hide-label"
          style={{ padding: '0px 10px' }}
        >
          <Radio.Group onChange={onChange} donationType={donationType} style={{ marginTop: '4px' }}>
            <Space direction="horizontal">
              <Radio donationType={1}>Electronic</Radio>
              <Radio donationType={2}>Cash/Check</Radio>
              <Radio donationType={3}>In Kind</Radio>
            </Space>
          </Radio.Group>
        </Form.Item> */}

        <AreaInput
          form={form}
          label="Notes"
          name="notes"
          placeholder="Notes"
          rows={5}
          size="small"
          rules={[
            { required: (donationType === 2), message: 'Notes are required' },
          ]}
          isRequired={donationType === 2}
          onChange={() => setIsFormTouched(true)}
        />
      </Form>
    </div>
  );
  return (
    <div className={`${cssPrefix}`}>
      <TyrModal
        modalVisible={visible}
        setModalVisible={setVisible}
        footerContent={footerContent}
        modalContent={modalContent}
        modalTitle={modalTitle}
        onCancel={onCancel}
        size="xs"
      />
      <ConfirmModal
        key={`confirm-modal-${confirmModal}`}
        modalVisible={confirmModal}
        setModalVisible={setConfirmModal}
        title="Do you want to save your changes?"
        onConfirmClick={async () => {
          try {
            setConfirmModal(false);
            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
            editRecord ? () => handleUpdate({ form }) : handleSave();
          } catch (error) {
            console.log('Validation error:', error);
          }
        }}
        onCustomCancel={() => {
          setConfirmModal(false);
        }}
        onCancel={() => {
          setConfirmModal(false);
          form.resetFields();
          props.setVisible(false);
        }}
        modalContent=""
        size="xs"
      />
    </div>
  );
};

export default DonationModal;
