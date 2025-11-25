/* eslint-disable no-unused-vars */
import { connect } from 'react-redux';
import {
  Typography,
} from 'antd';

import './MergePco.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'merge-pco';

export const MergePco: FC<any> = ({ permissions }) => {
  if (!permissions?.pco?.actions?.merge_pco) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Merge PCO
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

export default connect(mapStateToProps, mapDispatchToProps)(MergePco);
