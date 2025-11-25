/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { useEffect, useState, FC } from 'react';
import {
  Row, Col, Button, Space, Skeleton,
} from 'antd';
import {
  PlusOutlined, FlagFilled,
} from '@ant-design/icons';
import { isMobileOnly } from 'react-device-detect';
import { apiCall } from '../../../../shared/api/apiWrapper';
import { PcoAddModal } from '../../../pco/components/PcoAddModal';
import CustomTable from '../../../../shared/components/CustomTable';
import SearchInput from '../../../../shared/components/Inputs/SearchInput.component';
import { pageLengthMinifiedPco } from '../../../../shared/constants/pagination.json';

export interface PCOAddModalProps {
  visible?: boolean;
  addPcoLoading: boolean;
  updatePcoLoading?: boolean;
  setAddModalVisibility?: any;
  addPCOCall?: any;
  updatePCOCall?: any;
  getPcoListCall?: any;
  userCountryCode?: string;
  getPcoFilter?: any;
  pcoList: [],
  totalNumber: number,
  getPcoListLoading: boolean,
  setSelectedPco: any,
  selectedId: any,
  setFirstError: any,
  tableHeight?: any,
}

const cssPrefix = 'ftr-pco';

export const PCOMinifiedScreen: FC<PCOAddModalProps> = (props) => {
  const {
    addPCOCall,
    updatePCOCall,
    getPcoListCall,
    pcoList,
    getPcoListLoading,
    setSelectedPco,
    selectedId,
    setFirstError,
    tableHeight,
    addPcoLoading,
  } = props;
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState<any>({});
  const [currentPageLocal, setCurrentPageLocal] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [searchKeyFinal, setSearchKeyFinal] = useState('');
  const [tempForm, setTempForm] = useState({});
  const [imageState, setImageState] = useState(false);
  const [pcoSuggestion, setPcoSuggestion] = useState([]);
  const [pcoListSelected, setPcoListSelected] = useState<[any]>();
  const [tableFilter, setTableFilter] = useState({
    pageLength: pageLengthMinifiedPco,
    page: 1,
    isDeleted: false,
    entityType: 'person',
    searchText: '',
  });

  function toggleTableHeight(height: string) {
    // Toggle max-height of the container to trigger height transition
    const container = document.getElementById('table-container-desktop-second-minified');
    if (!container) {
      return;
    }
    container.style.maxHeight = height;
  }

  const setEditModalOpen = (value: boolean, data: any) => {
    setEditRecord(data);
    setAddModalVisible(value);
    setTempForm(data);
  };

  const nameColumnRenderer = (text: string, record: any) => (
    <Space align="baseline" size="middle">
      <span>
        {text}
      </span>
      {record.flag ? (
        <FlagFilled
          rev={undefined}
          className={`${cssPrefix}__table-cell-flag${record.flag ? '--flagged' : ''}`}
        />
      ) : <span />}
    </Space>
  );

  useEffect(() => {
    if (!selectedId?.id) {
      toggleTableHeight('25vh');
    } else {
      toggleTableHeight('7vh');
    }
  }, []);

  // useEffect(() => {
  //   if (selectedId?.id) {
  //     toggleTableHeight('7vh');
  //   } else {
  //     toggleTableHeight('25vh');
  //   }
  // }, [selectedId?.id]);

  // useEffect(() => {
  //   console.log(pcoListSelected, '---------||||');
  //   if (!pcoListSelected?.[0]) {
  //     toggleTableHeight('25vh');
  //   } else {
  //     toggleTableHeight('7vh');
  //   }
  // }, [pcoListSelected]);

  useEffect(() => {
    setFirstError('');
    if (selectedId?.id) {
      toggleTableHeight('25vh');
    }
    getPcoListCall({
      length: pageLengthMinifiedPco,
      page: currentPageLocal,
      isDeleted: false,
      entityType: tableFilter?.entityType,
      searchText: searchKeyFinal,
    }, () => console.log('get list of pco'));
  }, [currentPageLocal, tableFilter, searchKeyFinal]);

  useEffect(() => {
    pcoList?.forEach((data: any) => {
      if (selectedId?.id === data.id) {
        setPcoListSelected([data]);
      }
    });
  }, [pcoList]);

  useEffect(() => {
    setPcoListSelected(undefined);
    if (!searchKey) {
      setSearchKeyFinal('');
      getPcoListCall({
        length: pageLengthMinifiedPco,
        page: currentPageLocal,
        isDeleted: false,
        entityType: tableFilter?.entityType,
        searchText: searchKeyFinal,
      }, () => console.log('get list of pco'));
    }
  }, [searchKey]);

  useEffect(() => {
    const data = {};
    apiCall(`PCO/search-autocomplete?searchText=${searchKey}&limit=20`, 'GET', data)
      .then((resp: any) => {
        if (resp?.status === 200) {
          setPcoSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  const pcoColumns = [{
    title: 'Last Name',
    dataIndex: 'lastName',
    render: nameColumnRenderer,
    width: '160px',
  },
  {
    title: 'First Name',
    dataIndex: 'firstName',
  },
  // {
  //   title: 'Street',
  //   dataIndex: 'street',
  //   ellipsis: true,
  // },
  // {
  //   title: 'Street 2',
  //   dataIndex: 'street2',
  // },
  {
    title: 'City',
    dataIndex: 'city',
    ellipsis: true,
  },
  {
    title: 'State',
    dataIndex: 'state',
    render: (value: any) => value?.replace(/_/g, ' ').replace(/\b\w/g, (char: any) => char.toUpperCase()),
  },
    // {
    //   title: 'Zip',
    //   dataIndex: 'zip',
    // },
    // {
    //   title: 'Phone',
    //   dataIndex: 'phone',
    // },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   width: 220,
    // },
  ];

  return (
    <div style={{ width: '100%' }}>
      <PcoAddModal
        minifiedVersion
        visible={addModalVisible}
        setAddModalVisibility={setAddModalVisible}
        editRecord={editRecord}
        setEditRecord={setEditRecord}
        addPCOCall={addPCOCall}
        updatePCOCall={updatePCOCall}
        addPcoLoading={addPcoLoading}
        updatePcoLoading={false}
        getPcoListCall={getPcoListCall}
        userCountryCode="userCountryCode"
        setSearchKey={setSearchKey}
        setSearchKeyFinal={setSearchKeyFinal}
        setSelectedPco={setSelectedPco}
        getPcoFilter={{
          length: pageLengthMinifiedPco,
          page: currentPageLocal,
          isDeleted: false,
          entityType: tableFilter?.entityType,
          searchText: searchKey,
        }}
        handleCancel={() => {
          setAddModalVisible(false);
          setEditRecord(null);
        }}
        imageState={imageState}
        setImageState={setImageState}
      />
      <Row justify="space-between">
        <Col className="" xs={22} sm={12} md={12} style={{ width: '200px', padding: '0px 0px 6px 0px' }}>
          <Row>
            <Col span={12}>
              <SearchInput
                searchKey={searchKey}
                setSearchKey={setSearchKey}
                setSearchKeyFinal={setSearchKeyFinal}
                options={pcoSuggestion}
                placeholder="Search Last Name"
              />
            </Col>
            {pcoListSelected && (
              <Col span={12}>
                <Button
                  className="ftr-button-dashed"
                  onClick={() => { toggleTableHeight('25vh'); setPcoListSelected(undefined); }}
                  style={{ width: '100px', marginLeft: '4px' }}
                >
                  Show All
                </Button>
              </Col>
            )}
          </Row>
        </Col>
        <Col xs={2} sm={10} md={12} style={{ padding: '0px 0px 6px 0px' }}>
          <Row justify="end">
            <Button
              className="ftr-button-dashed"
              onClick={() => setAddModalVisible(true)}
              style={{ width: isMobileOnly ? '24px' : '100px', marginRight: '4px' }}
            >
              <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
              {!isMobileOnly && (
                <span className="btn-text">Add</span>
              )}
            </Button>
            {!isMobileOnly && (
              <Button
                style={{ width: '120px' }}
                className="ftr-button-secondary"
              >
                PCO History
              </Button>
            )}
          </Row>
        </Col>
      </Row>
      {!getPcoListLoading ? (
        <CustomTable
          config={{
            selectedRow: selectedId?.id,
            setSelectedRow: setSelectedPco,
          }}
          tableHeight={tableHeight || 30}
          tableType="minified"
          hideBorderColor
          selectable
          showHeader={false}
          isNotEditable
          isNotDeletable
          tableData={pcoListSelected || pcoList}
          columnData={pcoColumns}
          isLoading={getPcoListLoading}
          delete={(id: string) => alert(id)}
          setEditModalOpen={(isOpen: boolean, data: any) => setEditModalOpen(isOpen, data)}
        />
      ) : (
        <Skeleton.Input style={{ width: '100%' }} active size="large" block />
      )}
    </div>
  );
};
