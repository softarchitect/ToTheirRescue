/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography,
} from 'antd';

import './Email.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'email';

export const Email: FC<any> = ({ permissions }) => {
  if (!permissions?.pco?.actions?.email) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Manage Email
        </Title>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Email);
