import * as React from 'react';
import Modal from 'components/ui/modal';
import ViewPDF from './ViewPDF';

interface Props {
  open: boolean;
  file: string;
  handleClose(): void;
}
const ModalPreviewPdf = (props: Props) => {
  const { open, file, handleClose } = props;
  return (
    <Modal open={open} size="lg" handleCancel={handleClose}>
      <ViewPDF file={file} />
    </Modal>
  );
};
export default ModalPreviewPdf;
