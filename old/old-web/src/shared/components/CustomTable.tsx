/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import { useState, FC, useEffect } from 'react';
import {
  Table, Form, Typography, Modal, Row, Collapse, Pagination,
  Checkbox,
  Switch,
} from 'antd';
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, LoadingOutlined,
  SendOutlined,
} from '@ant-design/icons';
import TYRLoader from './TyrLoader';

const { confirm } = Modal;

interface Item {

}

interface Props {
  config: any,
  tableData: Item[];
  tableType: string,
  columnData: any,
  isLoading: boolean,
  selectable: boolean,
  showHeader: boolean,
  isNotEditable: boolean,
  isNotDeletable?: boolean,
  hideBorderColor?: boolean,
  tableHeight?: number,
  tableId?: any,
  tableKey?: any,
  ref?: any,
  // eslint-disable-next-line no-unused-vars
  delete: (id: string) => void;
  // eslint-disable-next-line no-unused-vars
  setEditModalOpen: (value: boolean, data: any) => void
}

// eslint-disable-next-line no-shadow
const EditableTable: FC<Props> = (Props) => {
  const {
    // eslint-disable-next-line no-unused-vars
    tableData, hideBorderColor, columnData, isLoading, selectable, showHeader, config, isNotEditable, isNotDeletable, tableHeight = 0,
    tableId, tableKey, tableType, ref,
  } = Props;
  const [form] = Form.useForm();
  const [data, setData] = useState(tableData);
  // eslint-disable-next-line no-unused-vars
  const [editingKey, setEditingKey] = useState('');
  const { Panel } = Collapse;
  const edit = (record: Item) => {
    Props.setEditModalOpen(true, record);
  };

  useEffect(() => {
    setData(tableData);
  }, [tableData]);

  const cancel = () => {
    setEditingKey('');
  };

  const itemRender = (current: any, type: any, originalElement: any) => {
    if (type === 'prev') {
      return <a style={{ marginRight: '10px' }}>Previous</a>;
    } if (type === 'next') {
      return <a>Next</a>;
    }
    return originalElement;
  };

  const deleteItem = async (deleteRecord: any) => {
    Props.delete(deleteRecord?.id);
  };

  const showConfirmModal = async (record: any) => {
    confirm({
      title: 'Are you sure?',
      icon: <ExclamationCircleOutlined rev={undefined} />,
      content: (tableType === 'Users') ? (
        <span>
          Are you sure you want to deactivate
          <b>{` ${record[columnData[0]?.dataIndex] ? record[columnData[0]?.dataIndex] : ''}`}</b>
          ?
        </span>
      ) : (
        <span>
          Are you sure you want to delete
          <b>{` ${record[columnData[0]?.dataIndex] ? record[columnData[0]?.dataIndex] : ''}`}</b>
          ?
        </span>
      ),
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

  const columns = (isNotDeletable && isNotEditable) ? [...columnData] : [
    ...columnData,
    {
      title: 'Action',
      dataIndex: 'operation',
      width: 180,
      render: (_: any, record: any) => (
        <Row justify="start" style={{ display: 'inline-flex' }}>
          {!isNotEditable && (
            <Typography.Link style={{ marginLeft: '10px' }} disabled={record.isNotEditable || isNotEditable} onClick={() => edit(record)}>
              <EditOutlined rev={undefined} />
            </Typography.Link>
          )}
          {record?.inviter && record?.status && (
            !isNotDeletable && ((tableType === 'Users') ? (
              <Row onClick={() => showConfirmModal(record)} style={{ marginLeft: '14px' }} align="middle">
                <Switch checkedChildren="active" checked />
              </Row>
            ) : (
              <Typography.Link onClick={() => showConfirmModal(record)}>
                <span style={{ marginLeft: '15px' }}><DeleteOutlined rev={undefined} /></span>
              </Typography.Link>
            ))
          )}
          {config.sendInvitation && (
            (config?.sendLoading === record?.id) ? (
              <Typography.Link>
                <span style={{ marginLeft: '15px' }}><LoadingOutlined rev={undefined} spin /></span>
              </Typography.Link>
            ) : (
              <Typography.Link disabled={record?.dateActive} onClick={() => config?.sendInvitation(record)}>
                <span style={{ marginLeft: '15px' }}><SendOutlined rev={undefined} /></span>
              </Typography.Link>
            )
          )}
        </Row>
      ),
    },
  ];

  const rowSelection = selectable ? {
    rowSelection: {
      selectedRowKeys: [config?.selectedRow],
      hideSelectAll: (config?.rowSelection === 'radio'),
      onChange: (selectedRowKeys: React.Key[], selectedRows: any[]) => {
        if (config?.selectedRow === selectedRows?.[0]?.id) {
          if (tableType === 'minified') {
            config.setSelectedRow({ id: selectedRows?.[1]?.id, pcoDetail: selectedRows?.[1] });
          } else {
            config.setSelectedRow(selectedRows?.[1]?.id);
          }
        } else if (tableType === 'minified') {
          config.setSelectedRow({ id: selectedRows?.[0]?.id, pcoDetail: selectedRows?.[0] });
        } else {
          config.setSelectedRow(selectedRows?.[0]?.id);
        }
      },
      getCheckboxProps: (record: any) => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
        className: 'checkbox-thik-change',
      }),
    },
  } : {};

  const tableContainerHeightStyle = (tableType === 'minified') ? { maxHeight: tableHeight ? `${tableHeight}vh` : '64vh' } : { height: tableHeight ? `${tableHeight}vh` : '64vh' };
  const desktopViewHeightStyle = (tableType === 'minified') ? { maxHeight: tableHeight ? `${tableHeight}vh` : '64vh' } : { minHeight: tableHeight ? `${tableHeight}vh` : '64vh' };

  return (
    <>
      <div className="mobile-view" style={(tableType === 'minified') ? { maxHeight: `${tableHeight}vh` || '64vh', overflowY: 'auto' } : { maxHeight: tableHeight ? `${tableHeight}vh` : '64vh', overflowY: 'auto' }}>
        <Collapse collapsible="icon" accordion bordered>
          {data?.map?.((currentData: any, i) => {
            const keyTyped = columns[0]?.dataIndex as keyof typeof currentData;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Panel
                key={currentData?.id}
                style={{ backgroundColor: 'whitesmoke' }}
                extra={(
                  <Checkbox
                    style={{ padding: '0px 10px 0px 20px' }}
                    checked={config?.selectedRow === currentData?.id}
                    onChange={(() => {
                      if (tableType === 'minified') {
                        const id = currentData?.id;
                        const pcoDetail = currentData;
                        const currentSelectedData = { id, pcoDetail };
                        config.setSelectedRow(currentSelectedData);
                      } else if (config?.selectedRow === currentData?.[0]?.id) {
                        config.setSelectedRow(currentData?.id);
                      } else {
                        config.setSelectedRow(currentData?.id);
                      }
                    }) as any}
                  />
                )}
                header={(<span>{columns[0]?.render?.(currentData[keyTyped], currentData) || currentData[keyTyped]}</span>)}
              >
                {columns.map((colData, j) => {
                  const keyName = columns[j]?.dataIndex as keyof typeof currentData;
                  return (
                    <div key={currentData?.id}>
                      {(j !== 0) && <hr className="hr-line" />}
                      <b>{colData.title}</b>
                      {' : '}
                      {colData?.render?.(null, currentData) || currentData[keyName]}
                    </div>
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
        {/* <Row justify="end" style={{ marginTop: '10px' }}>
          <Pagination itemRender={itemRender} showLessItems defaultCurrent={1} total={500} />
        </Row> */}
      </div>

      <div className="desktop-view" style={(tableType === 'minified') ? {} : { ...desktopViewHeightStyle, overflowY: 'auto' }}>
        <div
          id={(tableType === 'minified') ? 'table-container-desktop-second-minified' : 'table-container-desktop-second'}
          style={{
            ...tableContainerHeightStyle,
            overflowY: 'auto',
            borderBottom: isLoading ? '' : '#F0F0F0 1px solid',
            backgroundColor: '#FCFCFC',
            padding: '0px',
          }}
          className="custom-scrollbar"
        >
          <Table
            ref={ref}
            id="this-is-custom-id"
            className="this-is-custom-id"
            rootClassName="this-is-custom-id"
            key={tableKey}
            loading={(tableType === 'minified') ? false : { indicator: <TYRLoader height={tableHeight ? `${tableHeight - 4}vh` : '60vh'} />, spinning: isLoading }}
            style={{ borderTop: `${hideBorderColor ? '#F2F2F2 1' : '#820014 1'}px solid` }}
            dataSource={data}
            columns={columns}
            rowClassName="editable-row"
            rowKey="id"
            pagination={false}
            showHeader={showHeader}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...rowSelection}
          />
        </div>
      </div>
    </>
  );
};

export default EditableTable;
