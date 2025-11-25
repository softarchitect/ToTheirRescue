import { Typography } from 'antd';
import { connect } from 'react-redux';
import './TodaysMedsReports.less';
import { FC } from 'react';

const { Title } = Typography;
const cssPrefix = 'todays-meds';

export const TodaysMedsReports: FC<any> = ({ permissions }) => {
  if (!permissions?.report?.meds) {
    return (<div style={{ textAlign: 'center' }}>No Permission</div>);
  }

  return (
    <>
      <div className={`${cssPrefix}__header-row`}>
        <Title level={3} style={{ margin: '16px 0' }}>
          Today &apos;s Meds Report
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

export default connect(mapStateToProps, mapDispatchToProps)(TodaysMedsReports);
