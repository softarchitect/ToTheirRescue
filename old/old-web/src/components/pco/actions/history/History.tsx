/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography, Row, Col, Image, Button, Collapse,
  Checkbox,
} from 'antd';
import { FC, useEffect, useState } from 'react';
import { startCase, upperFirst } from 'lodash';
import './History.less';
import PcoDetailCard from 'src/shared/components/PcoDetailCard';

import DisclaimerCard from 'src/shared/components/DisclaimerCard';
import { apiCall } from 'src/shared/api/apiWrapper';
import { formatStringDateByCountry } from 'src/utils/common';
import payIcon from 'src/assets/images/pay.png';
import recieveIcon from 'src/assets/images/recieve.png';
import { getCurrencyIcon } from 'src/utils/currencyIcon';
import CustomTablePagination from '../../../../shared/components/CustomTablePagination';
import PcoActionsDropdown from '../../components/pcoActionsDropdown/PcoActionsDropdown';

const { Panel } = Collapse;

// eslint-disable-next-line
export const History: FC<any> = ({ permissions, selectedPco }) => {
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [getLoading, setGetLoading] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  const getHistoryList = async () => {
    setGetLoading(true);
    try {
      apiCall(`PCO/get-pco-history?pcoId=${selectedPco?.id}`, 'GET', {})
        .then((resp: any) => {
          if (resp?.data?.success) {
            setHistoryList(resp?.data?.data?.pcosHistory);
          }
          setGetLoading(false);
        });
    } catch (error) {
      console.log('Validation error:', error);
    }
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  if (!permissions?.pco?.actions?.history) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <Row justify="space-between" align="bottom" style={{ padding: '10px 0px' }}>
        <Col xs={12} md={6}>
          <PcoDetailCard pcoDetails={selectedPco} />
        </Col>
        <Col span={3} style={{ paddingRight: '10px' }}>
          <PcoActionsDropdown />
        </Col>
      </Row>
      <div style={{ padding: '10px', height: '67.5vh', overflowY: 'scroll' }}>
        {historyList?.map((data: any, i: any) => (
          <Collapse style={{ borderRadius: 0 }} expandIconPosition="right" collapsible="icon" accordion bordered>
            {(data?.tableName === 'Animal Milestone') && (
              <Panel
                header={(
                  <Row>
                    <span style={{ marginRight: '10px' }}>
                      <span style={{ fontWeight: 500, color: '#326394' }}>{formatStringDateByCountry(data?.date, localStorage.getItem('countryCode'))}</span>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F2F2F2',
                        backgroundColor: '#326394',
                        padding: '0px 10px',
                        borderRadius: '2px',
                        marginRight: '10px',
                      }}
                    >
                      {data?.tableName}
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F2F2F2',
                        backgroundColor: '#326394',
                        padding: '0px 10px',
                        borderRadius: '2px',
                        marginRight: '10px',
                      }}
                    >
                      <span style={{ fontWeight: 500 }}>{startCase(data?.milestoneAttachmentType)}</span>
                    </span>
                    <span style={{ marginRight: '10px' }}>
                      Animal Name :
                      {' '}
                      <span style={{ fontWeight: 500, color: '#326394' }}>{startCase(data?.animalName)}</span>
                    </span>
                    {data?.firstName ? (
                      <span style={{ marginRight: '10px' }}>
                        First Name :
                        {' '}
                        <span style={{ fontWeight: 500, color: '#326394' }}>{startCase(data?.firstName)}</span>
                      </span>
                    ) : ''}
                    {data?.firstName ? (
                      <span style={{ marginRight: '10px' }}>
                        Last Name :
                        {' '}
                        <span style={{ fontWeight: 500, color: '#326394' }}>{startCase(data?.lastName)}</span>
                      </span>
                    ) : ''}
                    {data?.amount ? (
                      <span style={{ marginRight: '10px' }}>
                        {/* <img style={{ height: '26px' }} src={payIcon} alt="pay" /> */}
                        Amount Paid :
                        {' '}
                        <span style={{ fontWeight: 500, color: '#326394' }}>{data?.amount}</span>
                      </span>
                    ) : ''}
                    {data?.milestoneAmountReceivedFee ? (
                      <span style={{}}>
                        <img style={{ height: '26px' }} src={recieveIcon} alt="pay" />
                        Amount Received :
                        {' '}
                        <span style={{ fontWeight: 500, color: '#326394' }}>{data?.milestoneAmountReceivedFee}</span>
                      </span>
                    ) : ''}
                    <span style={{ marginRight: '10px' }}>
                      Notes :
                      {' '}
                      <span style={{ fontWeight: 500, color: '#326394' }}>{data?.notes}</span>
                    </span>
                  </Row>
                )}
                key={i as any}
                showArrow={false}
              >
                <Row align="middle">
                  dsgdfgfd
                </Row>
              </Panel>
            )}
            {(data?.tableName === 'PVD') && (
              <Panel
                header={(
                  <Row>
                    <span style={{ marginRight: '10px' }}>
                      <span style={{ fontWeight: 500, color: '#326394' }}>{formatStringDateByCountry(data?.date, localStorage.getItem('countryCode'))}</span>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F2F2F2',
                        backgroundColor: '#326394',
                        padding: '0px 10px',
                        borderRadius: '2px',
                        marginRight: '10px',
                      }}
                    >
                      {data?.tableName}
                    </span>
                    <span style={{}}>
                      Attachment Type :
                      {' '}
                      <span style={{ fontWeight: 500, color: '#326394' }}>{data?.milestoneAttachmentType}</span>
                    </span>
                  </Row>
                )}
                key={i as any}
                showArrow={false}
              >
                <Row align="middle">
                  dsgdfgfd
                </Row>
              </Panel>
            )}
            {(data?.tableName === 'Donation') && (
              <Panel
                header={(
                  <Row>
                    <span style={{ marginRight: '10px' }}>
                      <span style={{ fontWeight: 500, color: '#326394' }}>{formatStringDateByCountry(data?.date, localStorage.getItem('countryCode'))}</span>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F2F2F2',
                        backgroundColor: '#326394',
                        padding: '0px 10px',
                        borderRadius: '2px',
                        marginRight: '10px',
                      }}
                    >
                      {data?.tableName}
                    </span>
                    <span style={{}}>
                      Donation Type :
                      {' '}
                      <span style={{ marginRight: '10px', fontWeight: 500, color: '#326394' }}>{data?.milestoneAttachmentType}</span>
                    </span>
                    <span style={{ marginRight: '10px' }}>
                      Notes :
                      {' '}
                      <span style={{ fontWeight: 500, color: '#326394' }}>{data?.notes}</span>
                    </span>
                    {permissions?.pco?.pco_history?.donation_amount && (
                      <span style={{}}>
                        Amount :
                        {' '}
                        {getCurrencyIcon(localStorage.getItem('countryCode') || '')}
                        <span style={{ fontWeight: 500, color: '#326394' }}>{data?.amount}</span>
                      </span>
                    )}
                  </Row>
                )}
                key={i as any}
                showArrow={false}
              >
                {/* <Row align="middle">
                  dsgdfgfd
                </Row> */}
              </Panel>
            )}
            {(data?.tableName === 'Volunteer') && (
              <Panel
                header={(
                  <Row>
                    <span style={{ marginRight: '10px' }}>
                      <span style={{ fontWeight: 500, color: '#326394' }}>{formatStringDateByCountry(data?.date, localStorage.getItem('countryCode'))}</span>
                    </span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: '#F2F2F2',
                        backgroundColor: '#326394',
                        padding: '0px 10px',
                        borderRadius: '2px',
                        marginRight: '10px',
                      }}
                    >
                      {data?.tableName}
                    </span>
                    <span style={{}}>
                      Volunteer Type :
                      {' '}
                      <span style={{ fontWeight: 500, color: '#326394' }}>{data?.milestoneAttachmentType}</span>
                    </span>
                  </Row>
                )}
                key={i as any}
                showArrow={false}
              >
                <Row align="middle">
                  dsgdfgfd
                </Row>
              </Panel>
            )}
          </Collapse>
        ))}
      </div>
      {/* <CustomTablePagination
        tableData={historyList}
        isLoading={false}
        delete={() => { }}
        setEditModalOpen={() => { }}
        config={{
          isNotDeletable: true,
          isNotEditable: true,
          selectable: false,
          isNotEditableBlur: true,
          showHeader: true,
          tableType: 'History',
        }}
        totalNumber={6}
        currentPage={currentPageLocal}
        setPaginationData={setCurrentPageLocal}
        columnData={[
          {
            title: 'Date',
            dataIndex: 'DonationDate',
            width: '8%',
          },
          {
            title: 'Type',
            dataIndex: 'DonationType',
            width: '11%',
          },
          {
            title: 'Amount',
            dataIndex: 'DonationAmount',
            width: '8%',
          },
          {
            title: 'Name',
            dataIndex: 'AnimalName',
            width: '15%',
          },
          {
            title: 'Animal',
            dataIndex: 'AnimalType',
            width: '15%',
          },
          {
            title: 'Volunteer Inactive Date',
            dataIndex: 'inactiveData',
            width: '13%',
          },
          {
            title: 'Notes',
            dataIndex: 'Note',
          },
        ]}
      /> */}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  selectedPco: state.common.selectedPco.pcoDetail,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(History);
