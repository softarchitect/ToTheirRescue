import {
  Modal,
} from 'antd';
import './TyrModal.less';

interface TyrModalProps {
  modalVisible: boolean;
  setModalVisible: any;
  footerContent: any;
  modalContent: any;
  modalTitle: any;
  size: String;
  onCancel?: any;
  key?: any;
  isNotClosable?: any;
}

const cssPrefix = 'tyr-modal';

const TyrModal = (props: TyrModalProps) => {
  const {
    modalVisible, setModalVisible, footerContent, modalContent, modalTitle, size, onCancel, key, isNotClosable,
  } = props;

  const onCancelClick = () => {
    setModalVisible(false);
  };

  return (
    <Modal
      key={key}
      className={`${cssPrefix} ${cssPrefix}-${size}`}
      centered
      title={<span className={`${cssPrefix}-modal-title`}>{modalTitle}</span>}
      open={modalVisible}
      // onOk={() => onSave()}
      closable={!isNotClosable}
      onCancel={onCancel || onCancelClick}
      footer={footerContent}
    >
      {modalContent}
    </Modal>
  );
};

export default TyrModal;
