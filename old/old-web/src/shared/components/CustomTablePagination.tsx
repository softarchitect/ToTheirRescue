/* eslint-disable no-unreachable */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-console */
import { useState, FC, useEffect } from 'react';
import { startCase } from 'lodash';
import {
  Table, Form, Typography, Modal, Row, Col, Collapse, Pagination, Badge,
  Tag,
  Checkbox,
  message,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, LoadingOutlined, DownloadOutlined,
} from '@ant-design/icons';
import { pageLength } from '../constants/pagination.json';
import TYRLoader from './TyrLoader';
import { apiCall } from '../api/apiWrapper';

const { confirm } = Modal;

interface Props {
  config: any;
  tableData: any;
  columnData: any;
  isLoading: boolean;
  totalNumber: number;
  currentPage: number;
  setPaginationData: (pageNo: number) => void;
  // eslint-disable-next-line no-unused-vars
  delete: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEditModalOpen: (value: boolean, data: any) => void;
  downloadAttachment?: (data: any) => void;
}

// eslint-disable-next-line no-shadow
const CustomTablePagination: FC<Props> = (Props) => {
  const {
    tableData, columnData, isLoading, totalNumber, currentPage, setPaginationData, config, downloadAttachment,
  } = Props;

  const {
    tableType,
    selectable,
    showHeader,
    isNotEditable,
    isNotDeletable,
    isNotEditableBlur,
    isDownload,
    deleteConfirmationData,
    getDeleteConfirmationDetail,
    animalArtifact,
    mobileViewHeader,
    selectedRow,
    selectedRowDetails,
    isCustomHeight,
  } = config;
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  const [currentRecord, setCurrentRecord] = useState({});
  const [editingKey, setEditingKey] = useState('');
  const { Panel } = Collapse;

  const download = (record: any) => {
    downloadAttachment && downloadAttachment(record?.originalBlobUrl);
  };

  const edit = (record: any) => {
    Props.setEditModalOpen(true, record);
  };

  useEffect(() => {
    setData(tableData);
    setCurrentRecord(tableData?.[0]);
  }, [tableData]);

  // const setNextPage = () => {
  //   if ((totalNumber / pageLength) === currentPage) {
  //     return;
  //   }
  //   setPaginationData(currentPage + 1);
  // };

  // const setPreviousPage = () => {
  //   if (currentPage === 1) {
  //     return;
  //   }
  //   setPaginationData(currentPage - 1);
  // };

  // const itemRender = (current: any, type: any, originalElement: any) => {
  //   if (type === 'prev') {
  //     return <a style={{ marginRight: '10px' }} onClick={setPreviousPage}>Previous</a>;
  //   } if (type === 'next') {
  //     return <a onClick={setNextPage}>Next</a>;
  //   }
  //   return originalElement;
  // };

  const deleteItem = async (deleteRecord: any) => {
    Props.delete(deleteRecord?.id);
  };

  const getDeleteText = (currTableType: string, record: any) => {
    let deleteText: any = '';
    if (currTableType === 'attachments' || currTableType === 'proceduresTestTreatments' || currTableType === 'vaccination') {
      deleteText = (<b>{` ${record[columnData[0]?.dataIndex] ? record[columnData[1]?.dataIndex] : ''}`}</b>);
    } else if (currTableType === 'diary') {
      deleteText = (<b> this diary entry</b>);
    } else if (currTableType === 'meds') {
      deleteText = (<b>{` ${record[columnData[0]?.dataIndex] ? record[columnData[1]?.dataIndex] : ''} Med Given`}</b>);
    } else if (currTableType === 'donation') {
      deleteText = (<b>{` Donation Amount ${record[columnData[0]?.dataIndex] ? record[columnData[1]?.dataIndex] : ''}`}</b>);
    } else if (currTableType === 'SOAPs') {
      deleteText = (<b> this SOAP</b>);
    } else if (currTableType === 'notes') {
      deleteText = (<b> this note</b>);
    } else if (currTableType === 'vaccination-reminder' || currTableType === 'procedure-reminder' || currTableType === 'meds-reminder') {
      deleteText = (<b> this reminder</b>);
    } else {
      deleteText = (<b>{` ${record[columnData[0]?.dataIndex] ? startCase(record[columnData[0]?.dataIndex]) : ''}`}</b>);
    }
    return deleteText;
  };

  const showConfirmModal = async (record: any) => {
    let isLinkedIntake = false;
    if (tableType === 'pco') {
      await apiCall(`animal-milestone/get-pco-link-milestone-donation-volunteer?pcoId=${record?.id}`, 'get', {})
        .then((respAdd: any) => {
          isLinkedIntake = respAdd?.data?.data?.linked;
          if (isLinkedIntake) {
            message.error('PCO has attached records so must be merged with another PCO');
          }
        });
    }
    if (isLinkedIntake) {
      return;
    }
    const deleteText = getDeleteText(tableType, record);
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: <span>
        Are you sure you want to delete
        {deleteText}
        &nbsp;
        ?
        {
          deleteConfirmationData && (deleteConfirmationData.milestoneCount > 2) && (
            <div style={{ paddingLeft: '20px', backgroundColor: '#e3e1dc' }}>
              <Row justify="start">
                <Col span={12}>
                  <b>Milestone Records</b>
                </Col>
                <Col span={2}>-</Col>
                <Col span={2}>
                  {deleteConfirmationData.milestoneCount}
                </Col>
              </Row>
              <Row justify="start">
                <Col span={12}>
                  <b>Attachment Records</b>
                </Col>
                <Col span={2}>-</Col>
                <Col span={2}>
                  {deleteConfirmationData.attachmentCount}
                </Col>
              </Row>
            </div>
          )
        }
      </span>,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteItem(record);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  useEffect(() => {
    if (getDeleteConfirmationDetail && deleteConfirmationData) {
      showConfirmModal(currentRecord);
    }
  }, [deleteConfirmationData]);

  const columns = (isNotDeletable && isNotEditable) ? [...columnData] : [
    ...columnData,
    {
      title: '',
      dataIndex: 'operation',
      // eslint-disable-next-line no-nested-ternary
      width: isNotDeletable ? '80px' : (tableType === 'users') ? '120px' : '90px',
      ellipsis: true,
      render: (_: any, record: any) => {
        const abc = data as any;
        return (
          <Row justify="start" style={{ display: 'inline-flex' }}>
            {!isNotEditable && (
              <Typography.Link style={{ marginRight: '10px', marginLeft: '5px' }} disabled={record.isNotEditable || isNotEditable} onClick={(e: any) => { e.stopPropagation(); edit(record); }}>
                <EditOutlined rev={undefined} />
              </Typography.Link>
            )}
            {!isNotDeletable && (
              <Typography.Link
                onClick={(e: any) => {
                  e.stopPropagation();
                  setCurrentRecord(record);
                  getDeleteConfirmationDetail ? getDeleteConfirmationDetail(record) : showConfirmModal(record);
                }}
                disabled={(tableType === 'AnimalMilestone') && (abc?.[abc?.length - 1]?.id !== record?.id || ['birth', 'intake'].includes(record?.milestoneType?.toLowerCase()))}
              >
                <span style={{ marginLeft: '15px' }}><DeleteOutlined rev={undefined} /></span>
              </Typography.Link>
            )}
            {isDownload && (
              <Typography.Link
                onClick={() => download(record)}
              >
                <span style={{ marginLeft: '15px' }}><DownloadOutlined rev={undefined} /></span>
              </Typography.Link>
            )}
          </Row>
        );
      },
    },
  ];

  const rowSelectionSingle = selectable ? {
    rowSelection: {
      selectedRowKeys: [config?.selectedRow],
      hideSelectAll: (config?.rowSelection === 'radio'),
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        let selectedId = '' as any;
        let selectedData = {} as any;
        if (config?.selectedRow === selectedRows?.[0]?.id) {
          selectedId = selectedRows?.[1]?.id;
          selectedData = selectedRows?.[1];
        } else {
          selectedId = selectedRows?.[0]?.id;
          selectedData = selectedRows?.[0];
        }

        if (tableType === 'proceduresTestTreatments' || tableType === 'procedure-reminder') {
          config.setSelectedRow({ id: selectedId, proceduresTestTreatmentsDetails: selectedData });
        } else if (tableType === 'vaccination' || tableType === 'vaccination-reminder') {
          config.setSelectedRow({ id: selectedId, vaccinationDetails: selectedData });
        } else if (tableType === 'pco') {
          config.setSelectedRow({ id: selectedId, pcoDetail: selectedData });
          localStorage.setItem('selectedPcoDetail', JSON.stringify(selectedData));
        } else {
          config.setSelectedRow(selectedId);
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
        className: 'checkbox-thik-change',
      }),
    },
  } : {};

  const onClickRow = (selectedRowData: any) => {
    if (tableType !== 'Animals') {
      return;
    }
    if (config?.selectedRow[0] === selectedRowData.id) {
      config.setSelectedRow({ ids: [], animalDetails: [] });
    } else {
      config.setSelectedRow({ ids: [selectedRowData.id], animalDetails: [selectedRowData] });
    }
  };

  const rowSelectionMultiple = selectable ? {
    rowSelection: {
      selectedRowKeys: config?.selectedRow,
      type: 'checkbox',
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        if (tableType === 'Animals') {
          config.setSelectedRow({ ids: selectedRowKeys, animalDetails: selectedRows });
        } else if (tableType === 'meds-reminder') {
          config.setSelectedRow({ id: selectedRowKeys, medReminderDetails: selectedRows });
        } else if (tableType === 'animal-milestone-query') {
          config.setSelectedRow({ id: selectedRowKeys, milestoneQueryDetails: selectedRows });
        } else if (config?.selectedRow === selectedRows?.[0]?.id) {
          config.setSelectedRow(selectedRowKeys);
        } else {
          config.setSelectedRow(selectedRowKeys);
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
        className: 'checkbox-thik-change',
      }),
    },
  } : {};

  const rowSelectionData: any = (config?.rowSelection === 'radio') ? rowSelectionSingle : rowSelectionMultiple;

  useEffect(() => {
    const handleScrollDesktop = () => {
      // if (!document.getElementsByClassName('ant-table-body')) {
      //   return;
      // }
      let containerDesktop: any = document.getElementsByClassName('ant-table-body');
      containerDesktop = containerDesktop?.[0];
      console.log(data, '------------', containerDesktop?.scrollTop + containerDesktop?.clientHeight, '-------------', containerDesktop?.scrollHeight);

      if (containerDesktop?.scrollTop + containerDesktop?.clientHeight >= (containerDesktop?.scrollHeight - 200)) {
        // console.log((data?.length < totalNumber), '-------', totalNumber, '---------', pageLength, '-----', isLoading);
        if (((data?.length < totalNumber) && (pageLength > 0)) && !isLoading) {
          setPaginationData(currentPage + 1);
        }
      }
    };

    const handleScrollMobile = () => {
      if (!document.getElementById('table-container-mobile')) {
        return;
      }
      const containerMobile: any = document.getElementById('table-container-mobile');
      if (containerMobile?.scrollTop + containerMobile?.clientHeight >= (containerMobile?.scrollHeight - 200)) {
        if (((data?.length < totalNumber) && (pageLength > 0)) && !isLoading) {
          setPaginationData(currentPage + 1);
        }
      }
    };

    // Attach scroll event listener
    const containerDesktop = document.getElementsByClassName('ant-table-body');
    containerDesktop?.[0]?.addEventListener('scroll', handleScrollDesktop);
    const containerMobile = document.getElementById('table-container-mobile');
    containerMobile?.addEventListener('scroll', handleScrollMobile);

    // Clean up the event listener on component unmount
    return () => {
      containerDesktop?.[0]?.removeEventListener('scroll', handleScrollDesktop);
      containerMobile?.removeEventListener('scroll', handleScrollMobile);
    };
  }, [isLoading, totalNumber, data]);

  return (
    <>
      <div className="mobile-view" style={{ height: 'calc(100vh - 350px)', overflowY: 'hidden', marginBottom: '40px' }}>
        <div
          id="table-container-mobile"
          style={{
            height: 'calc(100vh - 350px)', opacity: isLoading ? '0.6' : 1, overflowY: 'auto', borderBottom: isLoading ? '' : '#F0F0F0 1px solid',
          }}
        >
          {isLoading && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                position: 'absolute',
                width: '90%',
                height: '60vh',
              }}
            >
              <div>
                <TYRLoader height="60vh" />
              </div>
            </div>
          )}
          <Collapse collapsible="icon" accordion bordered>
            {data?.map?.((currentData: any, i: any) => {
              const keyTyped = columns[0]?.dataIndex as keyof typeof currentData;
              return (
                // eslint-disable-next-line react/no-array-index-key
                <Panel
                  style={{ backgroundColor: 'white' }}
                  extra={selectable && (
                    <Checkbox
                      style={{ padding: '0px 10px 0px 20px' }}
                      // eslint-disable-next-line no-nested-ternary
                      checked={['Animals', 'meds-reminder', 'vaccination-reminder'].includes(tableType) ? ((selectedRow?.length > 0) ? selectedRow?.includes(currentData?.id) : false) : (selectedRow === currentData?.id)}
                      onChange={(() => {
                        if (tableType === 'Animals') {
                          const ids = [...selectedRow];
                          const animalDetails = selectedRowDetails || [];
                          if (ids.includes(currentData?.id)) {
                            ids?.forEach((id: any, index: any) => {
                              if (id === currentData?.id) {
                                ids.splice(index, 1);
                                animalDetails.splice(index, 1);
                              }
                            });
                          } else {
                            ids.push(currentData?.id);
                            animalDetails.push(currentData);
                          }
                          const currentSelectedData = { ids: ids || [], animalDetails };
                          config.setSelectedRow(currentSelectedData);
                        } else if (tableType === 'pco') {
                          const id = currentData?.id;
                          const pcoDetail = currentData;
                          const currentSelectedData = { id, pcoDetail };
                          config.setSelectedRow(currentSelectedData);
                        } else if (['meds-reminder', 'vaccination-reminder'].includes(tableType)) {
                          const ids = selectedRow ? [...selectedRow] : [];
                          if (ids.includes(currentData?.id)) {
                            ids?.forEach((id: any, index: any) => {
                              if (id === currentData?.id) {
                                ids.splice(index, 1);
                              }
                            });
                          } else {
                            ids.push(currentData?.id);
                          }
                          config.setSelectedRow(ids);
                        } else if (config?.selectedRow === currentData?.id) {
                          config.setSelectedRow('');
                        } else {
                          config.setSelectedRow(currentData?.id);
                        }
                      }) as any}
                    />
                  )}
                  header={(
                    <span>
                      {mobileViewHeader ? mobileViewHeader(currentData) : (
                        columns[0]?.render?.(currentData[keyTyped], currentData) || currentData[keyTyped]
                      )}
                    </span>
                  )}
                  key={i as any}
                >
                  <Row align="middle">
                    {columns.map((colData, j) => {
                      const keyName = columns[j]?.dataIndex as keyof typeof currentData;
                      if (!currentData[keyName] || colData?.desktopRenderOnly) {
                        return '';
                      }
                      if (colData.title === 'Sex') {
                        return (
                          <Tag style={{ margin: '2px' }}>
                            {colData?.render?.(currentData[keyName], currentData) || currentData[keyName]}
                          </Tag>
                        );
                      }
                      return (
                        <Tag style={{ margin: '2px' }}>
                          {(j !== 0) && <span className="hr-line" />}
                          <b>{colData.title}</b>
                          {' : '}
                          {colData?.render?.(currentData[keyName], currentData) || currentData[keyName]}
                        </Tag>
                      );
                    })}
                  </Row>
                  <Row justify="start" style={{ display: 'inline-flex' }}>
                    {!isNotEditable && (
                      <Typography.Link style={{ marginRight: '10px', marginLeft: '5px' }} disabled={currentData.isNotEditable || isNotEditable} onClick={(e: any) => { e.stopPropagation(); edit(currentData); }}>
                        <EditOutlined rev={undefined} />
                      </Typography.Link>
                    )}
                    {!isNotDeletable && (
                      <Typography.Link
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setCurrentRecord(currentData);
                          getDeleteConfirmationDetail ? getDeleteConfirmationDetail(currentData) : showConfirmModal(currentData);
                        }}
                        disabled={(tableType === 'AnimalMilestone') && (data?.[data?.length - 1]?.id !== currentData?.id || ['birth', 'intake'].includes(currentData?.milestoneType?.toLowerCase()))}
                      >
                        <span style={{ marginLeft: '15px' }}><DeleteOutlined rev={undefined} /></span>
                      </Typography.Link>
                    )}
                    {isDownload && (
                      <Typography.Link
                        onClick={() => download(currentData)}
                      >
                        <span style={{ marginLeft: '15px' }}><DownloadOutlined rev={undefined} /></span>
                      </Typography.Link>
                    )}
                  </Row>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      </div>
      <div className="desktop-view" style={{ padding: '0px 8px' }}>
        <Table
          // loading={{ indicator: <LoadingOutlined rev={undefined} style={{ fontSize: 14 }} spin />, spinning: isLoading }}
          loading={{ indicator: <TYRLoader height={isCustomHeight || '64vh'} />, spinning: isLoading }}
          style={{ border: '0px solid' }}
          dataSource={data}
          columns={columns}
          rowClassName="editable-row"
          rowKey="id"
          pagination={false}
          showHeader={showHeader}
          onRow={(record) => ({
            onClick: () => onClickRow(record),
          })}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rowSelectionData}
          scroll={{ y: isCustomHeight || '64vh' }}
        />
      </div>
    </>
  );
};

export default CustomTablePagination;
