import { FC, useEffect, useState } from 'react';
import {
  Modal, Button, Input, Form, Row, Col, Typography, Tooltip, message,
} from 'antd';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import CustomTable from 'src/shared/components/CustomTable';
import alertConstant from 'src/shared/constants/alert.json';
import { apiCall } from 'src/shared/api/apiWrapper';
import ConfirmModal from 'src/shared/components/ConfirmModal';
import { AcquisitionWayInfo } from './Tooltips/AcquisitionFormInfo';

type ValidateStatus = Parameters<typeof Form.Item>[0]['validateStatus'];

interface Item {
  id: string;
  acquisitionWay: string;
  isNotEditable: boolean;
}

const AnimalAcquisitionWay: FC<any> = ({ permissions }) => {
  const newItem: Item[] = [];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [acquisitionWayId, setAcquisitionWayId] = useState(0);
  const [acquisitionWayList, setAcquisitionWayList] = useState(newItem);
  const [searchAcquisitionWayList, setSearchAcquisitionWayList] = useState(newItem);
  const [acquisitionWay, setAcquisitionWay] = useState('');
  const [validationStatus, setValidationStatus] = useState<{ validateStatus?: ValidateStatus; }>({});
  const [confirmModal, setConfirmModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [changeData, setChangeData] = useState(false);
  const [tempForm, setTempForm] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [getLoading, setGetLoading] = useState(false);
  const [key, setKey] = useState<any>('');
  const [form] = Form.useForm();

  const cssPrefix = 'ftr-customization';

  const columnData = [{
    title: 'Acquisition Way',
    dataIndex: 'acquisitionWayName',
    width: '80%',
  }];

  // eslint-disable-next-line
  const onSearch = (searchTextString: string) => {
    if (!searchTextString) {
      setSearchText('');
      return;
    }
    setSearchText(searchTextString);
    const newOption: any = [];
    acquisitionWayList.map((data) => {
      const re = new RegExp(searchTextString.toLowerCase(), 'g');
      if (re.test(data.acquisitionWay.toLowerCase())) {
        newOption.push(data);
      }
      return true;
    });
    setSearchAcquisitionWayList(newOption);
  };

  const showModal = () => {
    setEditModal(false);
    setTempForm('');
    setIsModalVisible(true);
  };

  useEffect(() => {
    setGetLoading(true);
    apiCall('acquisition-way/get-acquisition-way', 'GET', {})
      .then((resp: any) => {
        setGetLoading(false);
        if (resp?.data?.success) {
          setAcquisitionWayList(resp?.data?.data?.acquisitionWays);
        }
      });
    if (!isModalVisible) {
      setErrorMsg('');
      setLoading(false);
      setAcquisitionWayId(0);
      setChangeData(false);
      setAcquisitionWay('');
      setValidationStatus({});
    }
    setKey(Date.now());
  }, [changeData, isModalVisible]);

  const validate = (acquisitionWayData: string): { validateStatus: ValidateStatus } => {
    if (!acquisitionWayData) {
      setErrorMsg('Acquisition Way is required');
      return { validateStatus: 'error' };
    }
    if (acquisitionWayData.split('').length > 75) {
      setErrorMsg('Should be less than 75 characters');
      return { validateStatus: 'error' };
    }

    setErrorMsg('');
    return { validateStatus: 'success' };
  };

  const handleAnimalWayDelete = (id: string) => {
    const data = '';
    apiCall(`acquisition-way/delete-acquisition-way/${id}`, 'PATCH', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setChangeData(true);
          message.success({
            content: resp?.data?.message || alertConstant.animal_acquisition_way_delete_success,
            style: {
              marginTop: '2vh',
            },
            key: 'deletedable',
          });
        }
      });
  };

  const handleInput = (value: string) => {
    setValidationStatus({ ...validate(value) });
    setAcquisitionWay(value);
  };

  const setEditModalOpen = (value: boolean, data: any) => {
    setAcquisitionWay(data.acquisitionWayName);
    setTempForm(data.acquisitionWayName);
    setChangeData(data);
    setAcquisitionWayId(data.id);
    setEditModal(value);
    setIsModalVisible(value);
  };

  const handleOk = async () => {
    if (editModal && acquisitionWay === tempForm && acquisitionWay.length > 0) {
      setIsModalVisible(false);
      setEditModal(false);
    } else {
      setLoading(true);
      const validateResponse = validate(acquisitionWay);
      if (validateResponse && validateResponse.validateStatus !== 'success') {
        setValidationStatus({ ...validate(acquisitionWay) });
        setLoading(false);
        // eslint-disable-next-line no-useless-return
        return;
      }
      const data = {
        acquisitionWayName: acquisitionWay,
      };
      apiCall(`acquisition-way/available-acquisition-way?acquisition=${acquisitionWay}`, 'get', data)
        .then((resp: any) => {
          if (resp?.data?.data?.isAvailable) {
            setIsModalVisible(false);
            if (!editModal) {
              apiCall('acquisition-way/create-acquisition-way', 'POST', data)
                .then((respAdd: any) => {
                  if (respAdd?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respAdd?.data?.message || alertConstant.animal_acquisition_way_add_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            } else {
              apiCall(`acquisition-way/update-acquisition-way/${acquisitionWayId}`, 'POST', data)
                .then((respUpdate: any) => {
                  if (respUpdate?.data?.success) {
                    setChangeData(true);
                    message.success({
                      content: respUpdate?.data?.message || alertConstant.animal_acquisition_way_update_success,
                      style: {
                        marginTop: '2vh',
                      },
                      key: 'updatable',
                    });
                  }
                });
            }
          } else {
            message.success({
              content: resp?.data?.message || alertConstant.animal_acquisition_way_duplicate_entry,
              style: {
                marginTop: '2vh',
              },
              key: 'updatable',
            });
            setIsModalVisible(true);
            setLoading(false);
            if (!editModal) {
              setEditModal(false);
            } else {
              setEditModal(true);
            }
          }
        });
    }
  };
  const handleCancel = () => {
    if (tempForm === acquisitionWay) {
      setConfirmModal(false);
      setIsModalVisible(false);
      setEditModal(false);
      return;
    }
    setConfirmModal(true);
  };

  if (!permissions?.customization?.animal_acquisition_way?.view) {
    return (<div style={{ textAlign: 'center' }} className={`${cssPrefix}`}>No Permission</div>);
  }

  return (
    <>
      {permissions?.customization?.animal_acquisition_way?.add && (
        <Modal
          title={`${editModal ? 'Edit' : 'Add'} Acquisition Way`}
          centered
          visible={isModalVisible}
          okButtonProps={{ loading }}
          okText={editModal ? 'Update' : 'Save'}
          onOk={form.submit}
          onCancel={handleCancel}
        >
          <Row>
            <Col span={20}>
              <Form onFinish={handleOk} form={form}>
                <Form.Item
                  label="Acquisition Way"
                  className="hide-label"
                  style={{ padding: '0px 10px' }}
                  required
                  validateStatus={validationStatus.validateStatus}
                  help={errorMsg}
                >
                  <Input
                    key={key}
                    ref={(ref) => ref && ref.focus({ cursor: 'end' })}
                    value={acquisitionWay}
                    onChange={(e) => {
                      handleInput(e.target.value);
                    }}
                    placeholder="Acquisition Way"
                  />
                </Form.Item>
              </Form>
            </Col>
            <Col span={1} style={{ margin: '5px' }}>
              <Tooltip placement="bottomLeft" title={AcquisitionWayInfo}>
                <Typography.Link>
                  <InfoCircleOutlined rev={undefined} style={{ fontSize: '150%', marginRight: '18px' }} />
                </Typography.Link>
              </Tooltip>
            </Col>
          </Row>
        </Modal>
      )}
      <div style={{ marginTop: '0px' }}>
        <Row style={{ marginBottom: '10px', alignItems: 'center' }}>
          <Col flex={3}>
            <Row justify="start" style={{ width: '200px' }}>
              {/* <Input
                 onChange={(e) => onSearch(e.target.value)}
                 placeholder="Search Acquisition Way"/> */}
            </Row>
          </Col>
          {permissions?.customization?.animal_acquisition_way?.add && (
            <Col flex={3}>
              <Row justify="end">
                <Tooltip placement="bottomLeft" title={AcquisitionWayInfo}>
                  <Typography.Link>
                    <InfoCircleOutlined rev={undefined} style={{ fontSize: '150%', marginTop: '5px', marginRight: '18px' }} />
                  </Typography.Link>
                </Tooltip>
                {/* <Typography.Link><PlusOutlined style={{fontSize: '150%'}} onClick={showModal}/></Typography.Link> */}
                <Button
                  className={`${cssPrefix}__button`}
                  type="dashed"
                  onClick={showModal}
                  icon={<PlusOutlined rev={undefined} />}
                >
                  Add
                </Button>
              </Row>
            </Col>
          )}
        </Row>
        <CustomTable
          config={{ rowSelection: 'none' }}
          isNotEditable={!permissions?.customization?.animal_acquisition_way?.edit}
          isNotDeletable={!permissions?.customization?.animal_acquisition_way?.delete}
          showHeader={false}
          selectable={false}
          tableData={searchText ? searchAcquisitionWayList : acquisitionWayList}
          tableType="Acquisition Way"
          isLoading={getLoading}
          columnData={columnData}
          delete={handleAnimalWayDelete}
          setEditModalOpen={setEditModalOpen}
        />
        <ConfirmModal
          key={`confirm-modal-${confirmModal}`}
          modalVisible={confirmModal}
          setModalVisible={setConfirmModal}
          title="Do you want to save your changes?"
          onConfirmClick={async () => {
            try {
              setConfirmModal(false);
              handleOk();
            } catch (error) {
              console.log('Validation error:', error);
            }
          }}
          onCustomCancel={() => {
            setConfirmModal(false);
          }}
          onCancel={() => {
            setConfirmModal(false);
            setIsModalVisible(false);
            setEditModal(false);
          }}
          modalContent=""
          size="xs"
        />
      </div>
    </>
  );
};

export default AnimalAcquisitionWay;
