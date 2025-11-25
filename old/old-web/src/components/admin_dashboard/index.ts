import { connect } from 'react-redux';
import { AdminDashboard } from './AdminDashboard';

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  role: state.auth.userType,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
