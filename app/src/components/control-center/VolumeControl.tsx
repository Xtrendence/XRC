/* eslint-disable react-hooks/exhaustive-deps */
import { Card, IconButton, Slider, Stack, Tooltip } from '@mui/joy';
import { useEffect, useState } from 'react';
import {
  FaChevronLeft,
  FaChevronRight,
  FaVolumeDown,
  FaVolumeMute,
  FaVolumeUp,
} from 'react-icons/fa';
import axios from 'axios';
import { apiUrl } from '../../globalVariables';
import { useInterval } from '../../hooks/useInterval';

export function VolumeControl() {
  const [loading, setLoading] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>();
  const [volume, setVolume] = useState<number>();
  const [volumeChanged, setVolumeChanged] = useState<Date>();
  const [date, setDate] = useState<Date>();
  const [debouncedVolume, setDebouncedVolume] = useState<{
    volume: number;
    lastChange: Date;
  }>();

  const getVolume = () => {
    if (loading) return;

    axios
      .get(`${apiUrl}/volume`, {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
        },
      })
      .then((res) => {
        if (date && res.data.date < date) {
          return;
        }

        if (
          volumeChanged &&
          new Date().getTime() - volumeChanged.getTime() < 1000
        ) {
          setVolumeChanged(undefined);
          return;
        }

        setVolume(res.data.volume);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVolumeChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      if (loading) return;

      setVolume(value);
      setVolumeChanged(new Date());

      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 2500);

      if (
        !debouncedVolume ||
        debouncedVolume.lastChange.getTime() + 1000 < new Date().getTime()
      ) {
        setDebouncedVolume({
          volume: value,
          lastChange: new Date(),
        });
      }
    }
  };

  useEffect(() => {
    if (!debouncedVolume) {
      return;
    }

    const value = debouncedVolume?.volume;

    axios
      .put(
        `${apiUrl}/volume`,
        { volume: value },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('loginToken'),
          },
        }
      )
      .then((res) => {
        if (!res.data.volume) {
          getVolume();
          return;
        }

        setDate(new Date());
        setVolume(res.data.volume);
      })
      .catch((error) => {
        getVolume();
        console.error(error);
      });

    setDebouncedVolume(undefined);
  }, [debouncedVolume]);

  useInterval(getVolume, 5000, { immediate: true, initialDelay: 0 });

  const range = volume
    ? `.MuiSlider-mark:nth-of-type(n+${volume + 4}):nth-of-type(-n+106)`
    : '';

  return (
    <Card>
      <Stack
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Stack
          flexDirection={'row'}
          gap={2}
          sx={{
            justifyContent: {
              xs: 'center',
              sm: 'flex-start',
            },
          }}
        >
          <Tooltip title="Volume Down (10%)" placement="top" variant="soft">
            <IconButton
              disabled={loading}
              size="lg"
              variant="soft"
              onClick={() => {
                if (volume !== undefined) {
                  handleVolumeChange(volume - 10);
                }
              }}
            >
              <FaVolumeDown />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mute" placement="top" variant="soft">
            <IconButton
              disabled={loading}
              size="lg"
              variant="soft"
              onClick={() => {
                if (volume !== undefined) {
                  handleVolumeChange(0);
                }
              }}
            >
              <FaVolumeMute />
            </IconButton>
          </Tooltip>
          <Tooltip title="Volume Up (10%)" placement="top" variant="soft">
            <IconButton
              disabled={loading}
              size="lg"
              variant="soft"
              onClick={() => {
                if (volume !== undefined) {
                  handleVolumeChange(volume + 10);
                }
              }}
            >
              <FaVolumeUp />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack
          flexDirection={'row'}
          gap={2}
          flexGrow={1}
          sx={{
            maxWidth: {
              xs: '100%',
              sm: '300px',
              md: '500px',
            },
          }}
        >
          <Tooltip title="Volume Down (1%)" placement="top" variant="soft">
            <IconButton
              disabled={loading}
              size="lg"
              variant="soft"
              onClick={() => {
                if (volume !== undefined) {
                  handleVolumeChange(volume - 1);
                }
              }}
            >
              <FaChevronLeft />
            </IconButton>
          </Tooltip>
          <Stack flexGrow={1}>
            <Tooltip
              title={`${sliderValue ? sliderValue : volume ?? 0}%`}
              placement="top"
              variant="soft"
              sx={{
                '&.base-Popper-root': {
                  mb: '-10px !important',
                },
              }}
              open={sliderValue ? true : undefined}
              arrow
            >
              <Slider
                disabled={loading}
                size={'lg'}
                step={1}
                min={0}
                max={100}
                value={sliderValue ? sliderValue : volume ?? 0}
                color="primary"
                sx={(theme) => ({
                  '.MuiSlider-mark': {
                    background: theme.palette.primary[400],
                  },
                  [range]: {
                    background: theme.palette.neutral[600],
                  },
                })}
                onChange={(_, value) => {
                  setSliderValue(value as number);
                }}
                onChangeCommitted={(_, value) => {
                  setSliderValue(undefined);

                  if (volume !== undefined) {
                    handleVolumeChange(value as number);
                  }
                }}
              />
            </Tooltip>
          </Stack>
          <Tooltip title="Volume Up (1%)" placement="top" variant="soft">
            <IconButton
              disabled={loading}
              size="lg"
              variant="soft"
              onClick={() => {
                if (volume !== undefined) {
                  handleVolumeChange(volume + 1);
                }
              }}
            >
              <FaChevronRight />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Card>
  );
}
