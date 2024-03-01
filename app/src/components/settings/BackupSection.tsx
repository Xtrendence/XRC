import { Button, Card, Stack, Typography } from '@mui/joy';
import { useState } from 'react';
import { FaRedo, FaTrash } from 'react-icons/fa';
import ConfirmationModal from '../common/ConfirmationModal';
import axios from 'axios';
import toast from 'react-hot-toast';
import { apiUrl, toastOptions } from '../../globalVariables';
import { BackupFilesModal } from '../backup-utility';
import { FaPencil } from 'react-icons/fa6';

export function BackupSection() {
  const [openFiles, setOpenFiles] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  return (
    <Card>
      <BackupFilesModal open={openFiles} setOpen={setOpenFiles} />
      <ConfirmationModal
        title={`Delete Backup Files Confirmation`}
        content={`Are you sure you want to delete all backup files and routines?`}
        open={openDelete}
        setOpen={(value) => {
          if (!value) {
            setOpenDelete(false);
          }
        }}
        onConfirm={() => {
          const token = localStorage.getItem('loginToken');

          axios
            .delete(`${apiUrl}/backup/all`, {
              headers: {
                Authorization: 'Bearer ' + token,
              },
            })
            .then(() => {
              toast.success(
                `All backup files have been deleted.`,
                toastOptions
              );
            })
            .catch((error) => {
              toast.error(`Failed to delete backup files.`, toastOptions);
              console.log(error);
            });
        }}
        danger
      />
      <Stack>
        <Stack
          gap={2}
          sx={{
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Stack flexDirection={'row'} alignItems={'center'} gap={2}>
            <FaRedo />
            <Typography level="h4">Backups</Typography>
          </Stack>
          <Stack flexDirection={'row'} gap={2}>
            <Button
              variant="solid"
              color="danger"
              endDecorator={<FaTrash />}
              onClick={() => setOpenDelete(true)}
            >
              Delete Files
            </Button>
            <Button
              variant="solid"
              color="primary"
              endDecorator={<FaPencil />}
              onClick={() => setOpenFiles(true)}
            >
              Manage Files
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}
