/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import {
  Row, Col, Button, Dropdown, Menu, Tooltip, Modal,
} from 'antd';
import Search from 'antd/lib/input/Search';
import {
  DeleteOutlined, PlusOutlined, QuestionCircleOutlined, DownOutlined,
} from '@ant-design/icons';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-use-before-define
import React, {
  ReactElement, ReactHTMLElement, useEffect, useState,
} from 'react';
import './ContentToolbar.less';
import { kebabCase } from 'lodash';
import {
  actionsMenu1, actionsMenu2, actionsMenu3,
} from '../FtrAnimals.data';
import SearchInput from '../../../shared/components/Inputs/SearchInput.component';
import { apiCall } from '../../../shared/api/apiWrapper';

const cssPrefix = 'content-toolbar';

export interface ContentToolbarProps {
  filterSlot?: ReactElement | ReactHTMLElement<HTMLElement>
  disableDeleteIcon: boolean
  searchKey: string
  permissions: any
  setSearchKey: (str: string) => void
  setSearchKeyFinal: (str: string) => void
  onAddIconClicked: (flag: boolean) => void // eslint-disable-line
  onRelocateBtnClicked: (flag: boolean) => void
  onBehaviorBtnClicked: (flag: boolean) => void
  onAttachmentsBtnClicked: (flag: boolean) => void
  onProceduresBtnClicked: (flag: boolean) => void
  onSetReminderBtnClicked: (flag: boolean) => void
  onPublicityBlurbBtnClicked: (flag: boolean) => void
  onDeleteIconClicked: () => void
  onRefresh: () => void
  selectedAnimal: any
  setConfirmModal: any
  setNavigateUrl: any
  setActionModal: any
  showRecentlyAdded: any
  setShowRecentlyAdded: any
  setSelectedAnimal: any
  setPaginationData: any
}

export const ContentToolbar = (props: ContentToolbarProps) => {
  const {
    selectedAnimal, onRelocateBtnClicked, onBehaviorBtnClicked, onAttachmentsBtnClicked, onSetReminderBtnClicked, onPublicityBlurbBtnClicked, setConfirmModal, setNavigateUrl, setActionModal, permissions,
    showRecentlyAdded, setShowRecentlyAdded, setSelectedAnimal, setPaginationData,
  } = props;
  const navigate = useNavigate();
  const { searchKey, setSearchKey, setSearchKeyFinal } = props;
  const [animalSuggestion, setAnimalSuggestion] = useState([]);

  const addBtnClicked = () => { props.onAddIconClicked(true); };

  const showActions = () => { };

  const actionsMenu = (
    <Menu className="custom-scrollbar" style={{ height: isMobile ? '50vh' : '70vh', overflowY: 'scroll' }}>
      {actionsMenu1({
        navigate, selectedAnimal, onRelocateBtnClicked, onBehaviorBtnClicked, onAttachmentsBtnClicked, setConfirmModal, setNavigateUrl, setActionModal, permissions,
      }).map(({
        key, value, isShow, actionFunction,
      }) => {
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
      <Menu.Divider />
      {actionsMenu2({
        navigate, selectedAnimal, setConfirmModal, setActionModal, permissions, setNavigateUrl, onSetReminderBtnClicked,
      }).map(({
        key, value, isShow, actionFunction,
      }) => {
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
      <Menu.Divider />
      {actionsMenu3({
        navigate, selectedAnimal, permissions, setConfirmModal, setActionModal,
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

  useEffect(() => {
    if (!searchKey) {
      return;
    }
    apiCall(`animal/auto-complete-animal-list?searchText=${searchKey}&limit=20`, 'GET', {})
      .then((resp: any) => {
        if (resp.status === 200) {
          setAnimalSuggestion(resp?.data?.data);
        }
      });
  }, [searchKey]);

  return (
    <div style={{ padding: isMobile ? '0px 0px 10px 0px' : '10px 0px' }}>
      <Row>
        <Col span={24} md={12}>
          <Row justify="start">
            <Col className="" xs={24} lg={10} xl={8} style={{ padding: '6px 10px' }}>
              <SearchInput
                placeholder="Search Name"
                searchKey={searchKey}
                setSearchKey={setSearchKey}
                setSearchKeyFinal={(text: string) => {
                  setPaginationData(1);
                  setSearchKeyFinal(text);
                }}
                options={animalSuggestion}
                value="any"
              />
            </Col>
            <Col xs={24} lg={10} xl={8} style={{ padding: '6px 10px' }}>
              {props.filterSlot}
            </Col>
            {showRecentlyAdded && (
              <Col style={{ padding: '6px 10px' }}>
                <Button
                  type="dashed"
                  onClick={() => {
                    setSelectedAnimal({ ids: [], animalDetails: [] });
                    setShowRecentlyAdded(!showRecentlyAdded);
                    setPaginationData(1);
                  }}
                >
                  {showRecentlyAdded ? 'View All Animals' : 'View Recently Added'}
                </Button>
              </Col>
            )}
          </Row>
        </Col>
        <Col span={24} md={12}>
          <Row justify="end">
            <Col xs={12} sm={12} md={8} xl={5} style={{ padding: '6px 10px' }}>
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
              <Col xs={12} sm={12} md={6} lg={6} xl={5} style={{ padding: '6px 10px' }}>
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
