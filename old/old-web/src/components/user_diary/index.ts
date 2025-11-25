import { connect } from 'react-redux';
import { } from '../../redux/user/action';
import Diary from './Diary';

const mapStateToProps = (state: any) => ({
  permissions: state.auth.permissions,
  role: state.auth.userType,
});

const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Diary);
