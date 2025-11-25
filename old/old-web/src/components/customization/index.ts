import { connect } from 'react-redux';
import { Customization } from './Customization';

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  role: state.auth.userType,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Customization);
