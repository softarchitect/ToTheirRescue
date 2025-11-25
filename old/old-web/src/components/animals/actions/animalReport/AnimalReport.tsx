/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography,
} from 'antd';

import './AnimalReport.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'donation';

export const AnimalReport: FC<any> = ({ permissions }) => {
  if (!permissions?.animals?.actions?.animal_report) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Animal Report
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

export default connect(mapStateToProps, mapDispatchToProps)(AnimalReport);
