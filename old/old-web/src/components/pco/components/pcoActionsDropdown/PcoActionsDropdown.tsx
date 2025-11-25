/* eslint-disable no-unused-vars */
/* eslint-disable no-use-before-define */
import {
  Button,
  Dropdown,
  Menu,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { kebabCase } from 'lodash';
import { connect } from 'react-redux';
import { apiCall } from 'src/shared/api/apiWrapper';
import { pcoActionMenuList } from '../../Pco.data';

export interface ContentToolbarProps {
  selectedPcoId: any,
  permissions: any;
}

const PcoActionDropdown = (props: ContentToolbarProps) => {
  const {
    selectedPcoId, permissions,
  } = props;
  const navigate = useNavigate();
  const showActions = () => { };

  const actionsMenu = (
    <Menu>
      {pcoActionMenuList({ navigate, selectedPcoId, permissions }).map(({
        key, value, isShow, actionFunction,
      }: any) => {
        if (key === 'volunteer') {
          return '';
        }
        if (isShow) {
          return (<Menu.Item onClick={() => actionFunction && actionFunction()} key={kebabCase(key)}>{value}</Menu.Item>);
        }
        return '';
      })}
    </Menu>
  );

  const isMobile = window.innerWidth <= 768;

  return (
    <div style={{ padding: isMobile ? '0px 0px 10px 0px' : '0px 0px' }}>
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
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  selectedPcoId: state.common.selectedPco?.id,
  permissions: state.auth.permissions,
});

const mapDispatchToProps = (dispatch: any) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PcoActionDropdown);
