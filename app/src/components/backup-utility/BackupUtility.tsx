import { Typography } from '@mui/joy';
import { Page } from '../common';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../globalVariables';

export default function BackupUtility() {
  const [settings, setSettings] = useState([]);

  const getSettings = () => {
    axios
      .get(`${apiUrl}/backup`)
      .then((res) => {
        setSettings(res.data.settings);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <Page>
      <Typography variant="plain">Backup Utility</Typography>
    </Page>
  );
}
