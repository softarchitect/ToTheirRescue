/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import {
  Row,
  Col,
  Button,
  Dropdown,
  Menu,
} from 'antd';
import {
  PlusOutlined, DownOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import React, {
  ReactElement, ReactHTMLElement, useEffect, useState,
} from 'react';
import './ContentToolbar.less';
import { kebabCase } from 'lodash';
import { pcoActionMenuList } from '../Pco.data';
import { apiCall } from '../../../shared/api/apiWrapper';
import SearchInput from '../../../shared/components/Inputs/SearchInput.component';

export interface ContentToolbarProps {
  filterSlot?: ReactElement | ReactHTMLElement<HTMLElement>,
  disableDeleteIcon: boolean;
  tableFilter: any;
  currentPage: any,
  pageLength: any,
  searchKey: string;
  setSearchKey: (str: string) => void;
  setSearchKeyFinal: (str: string) => void;
  onAddIconClicked: (flag: boolean) => void,
  selectedPcoId: any,
  showRecentlyAdded: any,
  setSelectedPco: any,
  setShowRecentlyAdded: any,
  setPaginationData: any,
  setVolunteerActionModal: any,
  onActionItemClick: (item: React.Key, value: string) => void,
  permissions: any;
}

export const ContentToolbar = (props: ContentToolbarProps) => {
  const {
    selectedPcoId, showRecentlyAdded, permissions, setSelectedPco, setShowRecentlyAdded, setPaginationData, setVolunteerActionModal,
  } = props;
  const navigate = useNavigate();
  const { searchKey, setSearchKey, setSearchKeyFinal } = props;
  const [pcoSuggestion, setPcoSuggestion] = useState([]);
  const addBtnClicked = () => { props.onAddIconClicked(true); };
  const showActions = () => { };

  useEffect(() => {
    const data = {};
    apiCall(`PCO/search-autocomplete?searchText=${searchKey}&limit=${props?.pageLength}&entityType=${(props?.tableFilter === 'all') ? '' : props?.tableFilter}`, 'GET', data)
      .then((resp: any) => {
        if (resp?.data?.success) {
          setPcoSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  const actionsMenu = (
    <Menu>
      {pcoActionMenuList({
        navigate,
        selectedPcoId,
        permissions,
        setVolunteerActionModal,
      }).map(({
        key, value, isShow, actionFunction,
      }) => {
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
    </Menu>
  );

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ padding: isMobile ? '0px 0px 10px 0px' : '10px 0px' }}>
      <Row>
        <Col span={24} md={16} lg={12}>
          <Row justify="start">
            <Col className="" xs={24} sm={12} md={12} lg={10} xl={8} style={{ padding: '6px 10px' }}>
              <SearchInput
                placeholder="Search Last Name"
                searchKey={searchKey}
                setSearchKey={setSearchKey}
                setSearchKeyFinal={(text: string) => {
                  setPaginationData(1);
                  setSearchKeyFinal(text);
                }}
                options={pcoSuggestion}
              />
            </Col>
            <Col xs={24} md={12} lg={12} xl={10} xxl={8} style={{ padding: '6px 10px' }}>
              {props.filterSlot}
            </Col>
            {showRecentlyAdded && (
              <Col style={{ padding: '6px 0px' }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    setSelectedPco('');
                    setShowRecentlyAdded(null);
                    setPaginationData(1);
                  }}
                >
                  {showRecentlyAdded ? 'View All PCOs' : 'View Recently PCO'}
                </Button>
              </Col>
            )}
          </Row>
        </Col>
        <Col span={24} md={8} lg={12}>
          <Row justify="end">
            <Col xs={12} sm={12} md={14} lg={8} xl={5} style={{ padding: '6px 10px' }}>
              <Dropdown overlay={actionsMenu}>
                <Button
                  className="ftr-button-primary"
                  onClick={showActions}
                  style={{ width: '100%' }}
                >
                  Actions
                  {' '}
                  <DownOutlined rev={undefined} />
                </Button>
              </Dropdown>
            </Col>
            {permissions?.animals?.add && (
              <Col xs={12} sm={12} md={10} lg={6} xl={5} style={{ padding: '6px 10px' }}>
                <Button
                  className="ftr-button-dashed"
                  onClick={addBtnClicked}
                  style={{ width: '100%' }}
                >
                  <span className="btn-icon"><PlusOutlined rev={undefined} /></span>
                  <span className="btn-text">Add</span>
                </Button>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};
