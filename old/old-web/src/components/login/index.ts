import { connect } from 'react-redux';
import { loginCall, updateUserPermission } from '../../redux/auth/action';
import { Login } from './Login';

const mapStateToProps = (state: any) => ({
  loginLoading: state.auth.loginLoading,
  userType: state.auth.userType,
});

const mapDispatchToProps = (dispatch: any) => ({
  loginCall: (data: {}, callbackFunction: () => void) => dispatch(loginCall(data, callbackFunction)),
  updateUserPermission: (data: {}) => dispatch(updateUserPermission(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
