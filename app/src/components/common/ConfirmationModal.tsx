import * as React from 'react';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import DialogActions from '@mui/joy/DialogActions';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import { IoWarning } from 'react-icons/io5';

export default function ConfirmationModal({
  open,
  setOpen,
  onConfirm,
  title = 'Confirmation',
  content,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  title: string;
  content: string;
}) {
  return (
    <>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle
            sx={{
              alignItems: 'center',
            }}
          >
            <IoWarning />
            {title}
          </DialogTitle>
          <Divider />
          {content && <DialogContent>{content}</DialogContent>}
          <DialogActions>
            <Button
              variant="solid"
              color="primary"
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
            >
              Confirm
            </Button>
            <Button
              variant="soft"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </>
  );
}
