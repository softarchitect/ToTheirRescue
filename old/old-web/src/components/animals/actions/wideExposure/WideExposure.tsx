/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography,
} from 'antd';

import './WideExposure.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'wide_exposure';

export const WideExposure: FC<any> = ({ permissions }) => {
  if (!permissions?.animals?.actions?.wide_exposure) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Wide Exposure
        </Title>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
});

const mapDispatchToProps = (dispatch: any) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(WideExposure);
