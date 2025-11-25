/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Button, message,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import {
  PlusOutlined,
} from '@ant-design/icons';

import './Donation.less';
import { apiCall } from 'src/shared/api/apiWrapper';
import { addCommasToNumber, formatStringDateByCountry } from 'src/utils/common';
import { getCurrencyIcon } from 'src/utils/currencyIcon';
import alertConstant from 'src/shared/constants/alert.json';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import DonationModal from './DonationModal';
import PcoDetailCard from '../../../../shared/components/PcoDetailCard';
import PcoActionsDropdown from '../../components/pcoActionsDropdown/PcoActionsDropdown';

const { Title } = Typography;
const cssPrefix = 'donation';

const Donation: FC<any> = ({ permissions, selectedPcoId, selectedPco }) => {
  const [donationList, setDonationList] = useState([]);
  const [addLoading, setAddLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalDonationAmount, setTotalDonationAmount] = useState(0);
  const [donationType, setDonationType] = useState<any>(1);

  const handleAddClick = () => {
    setIsModalOpen(true);
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line no-nested-ternary
  const getPaymentTypeLabel = (value: string) => ((value === 'money') ? 'Money' : 'Other');

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord({
      ...data,
    });
    // eslint-disable-next-line no-nested-ternary
    setDonationType(data?.donationType === 'money' ? 1 : 2);
    setIsModalOpen(true);
  };

  const getDonationList = () => {
    setIsLoading(true);
    apiCall(`donation/get-donation?pcoId=${selectedPcoId}`, 'GET', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          setDonationList(resp?.data?.data?.donations);
          setTotalDonationAmount(resp?.data?.data?.totalCount);
        }
        setIsLoading(false);
      });
  };

  const deleteDonation = (donationId: any) => {
    setIsLoading(true);
    apiCall(`donation/delete-donation/${donationId}`, 'PATCH', {})
      .then((resp: any) => {
        if (resp?.data?.success) {
          getDonationList();
          message.success({
            content: resp?.data?.message || alertConstant.donation_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'updatable',
          });
        }
      });
  };

  const handleUpdate = async ({ form }: any) => {
    try {
      await form.validateFields();
      setAddLoading(true);
      const values = form.getFieldsValue();
      const data = {
        pcoId: selectedPcoId,
        // eslint-disable-next-line no-nested-ternary
        donationType: (donationType === 1) ? 'money' : 'other',
        ...values,
      };

      apiCall(`donation/update-donation/${editRecord?.id}`, 'POST', data)
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
            setIsModalOpen(false);
          }
          setAddLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getDonationList();
  }, [addLoading]);

  const columnData1 = [
    {
      title: 'Donation Date',
      dataIndex: 'donationDate',
      render: (data: any) => (data ? formatStringDateByCountry(data, localStorage.getItem('countryCode')) : ''),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
    },
    {
      title: 'Type',
      dataIndex: 'donationType',
      render: (data: any) => getPaymentTypeLabel(data),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
    },
  ];

  const columnData = columnData1;

  if (!permissions?.pco?.actions?.donate) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <Row align="bottom" justify="space-between" style={{ padding: '10px 0px' }}>
        <Col xs={12} md={6}>
          <PcoDetailCard
            pcoDetails={selectedPco}
            extraRender={() => (
              <div
                style={{
                  padding: '0px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                color="blue"
              >
                Total Donations :
                {getCurrencyIcon(localStorage.getItem('countryCode') || '')}
                <span className="">{addCommasToNumber(totalDonationAmount)}</span>
              </div>
            )}
          />
        </Col>
        <Col xs={10} sm={6} md={4} lg={6} xl={6} style={{ padding: '0px 10px' }}>
          <Row justify="end">
            <Col span={12} style={{ paddingRight: '10px' }}>
              <PcoActionsDropdown />
            </Col>
            <Col lg={12} xl={8}>
              <Button className="ftr-button-dashed" onClick={handleAddClick} style={{ margin: '0px', width: '100%' }}>
                <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                <span className="btn-text">Add</span>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <CustomTablePagination
        tableData={donationList}
        isLoading={isLoading}
        delete={deleteDonation}
        setEditModalOpen={setEditModalOpen}
        config={{
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'donation',
        }}
        totalNumber={4}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={columnData}
      />

      <DonationModal
        visible={isModalOpen}
        onCancelClicked={handleModalCancel}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        setVisible={setIsModalOpen}
        selectedPco={selectedPco}
        addLoading={addLoading}
        setAddLoading={setAddLoading}
        donationType={donationType}
        setDonationType={setDonationType}
        handleUpdate={handleUpdate}
      />
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedPcoId: state.common.selectedPco?.id,
  selectedPco: state.common.selectedPco?.pcoDetail,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Donation);
