import { Typography } from 'antd';
import { connect } from 'react-redux';
import './AnimalHealthReports.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'animal-health-report';

export const AnimalHealthReports: FC<any> = ({ permissions }) => {
  if (!permissions?.report?.animal_health) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Animal Health Report
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

export default connect(mapStateToProps, mapDispatchToProps)(AnimalHealthReports);
