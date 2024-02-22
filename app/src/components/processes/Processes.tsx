import {
  Button,
  Chip,
  IconButton,
  Input,
  Stack,
  Table,
  Tooltip,
} from '@mui/joy';
import { Loading, Page } from '../common';
import { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import { apiUrl, navigationHeight, toastOptions } from '../../globalVariables';
import type { TProcess } from '@types';
import { useInterval } from '../../hooks/useInterval';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { FaArrowDown, FaArrowUp, FaSearch } from 'react-icons/fa';
import { useDebounce } from '../../hooks/useDebounce';
import { mirage } from 'ldrs';
import ConfirmationModal from '../common/ConfirmationModal';
import toast from 'react-hot-toast';
import { useTitle } from '../../hooks/useTitle';

mirage.register();

const paginationEnabled = false;

export default function Processes() {
  useTitle('Processes');

  const [processes, setProcesses] = useState<Array<TProcess>>([]);
  const [checksum, setChecksum] = useState<string>('');

  const [selectedProcess, setSelectedProcess] = useState<TProcess>();

  const [orderBy, setOrderBy] = useState<{
    column: 'name' | 'memoryUsage';
    direction: 'asc' | 'desc';
  }>({
    column: 'name',
    direction: 'asc',
  });

  const [query, setQuery] = useState<string>('');
  const [queryLoading, setQueryLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  const sortProcesses = useCallback(
    (list: Array<TProcess>) => {
      const sorted = list.sort((a, b) => {
        if (orderBy.column === 'memoryUsage') {
          return a[orderBy.column] - b[orderBy.column];
        } else {
          return a[orderBy.column].localeCompare(b[orderBy.column]);
        }
      });

      const ordered = orderBy.direction === 'desc' ? sorted.reverse() : sorted;

      if (debouncedQuery && debouncedQuery.trim() !== '') {
        const filtered = ordered.filter((process) => {
          return process.name
            .toLowerCase()
            .includes(debouncedQuery.toLowerCase());
        });

        setQueryLoading(false);

        return filtered;
      } else {
        setQueryLoading(false);
        return ordered;
      }
    },
    [debouncedQuery, orderBy.column, orderBy.direction]
  );

  const sortedProcesses = useMemo(
    () => sortProcesses(processes) || [],
    [processes, sortProcesses]
  );

  const fetchProcesses = async () => {
    console.log('Fetching processes...');

    axios
      .get(`${apiUrl}/processes?checksum=${checksum}`)
      .then((response) => {
        const { data } = response;

        if (data.changed === true) {
          setProcesses(data.processes);
          setChecksum(data.checksum);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useInterval(fetchProcesses, 5000, {
    immediate: true,
    initialDelay: 200,
  });

  if (!processes.length) {
    return <Loading />;
  }

  return (
    <Page overflowX="auto">
      <ConfirmationModal
        title="Kill Process"
        content={`Are you sure you want to kill the process "${selectedProcess?.name}"?`}
        open={selectedProcess !== undefined}
        setOpen={(value) => {
          if (!value) {
            setSelectedProcess(undefined);
          }
        }}
        onConfirm={() => {
          if (selectedProcess) {
            axios
              .delete(`${apiUrl}/processes/${selectedProcess.pid}`)
              .then(() => {
                fetchProcesses();
                setSelectedProcess(undefined);
              })
              .catch((error) => {
                toast.error('Failed to kill process.', toastOptions);
                console.log(error);
              });
          }
        }}
        danger
      />
      <Stack
        sx={{
          maxHeight: paginationEnabled
            ? `calc(100dvh - ${navigationHeight}px - 92px)`
            : '100%',
        }}
      >
        <Table
          variant="outlined"
          sx={(theme) => ({
            opacity: 0.95,
            backgroundColor: theme.palette.background.surface,
            borderRadius: '16px',
            borderBottomLeftRadius: paginationEnabled ? 0 : '16px',
            borderBottomRightRadius: paginationEnabled ? 0 : '16px',
            pl: 2,
            pr: 2,
            width: 'calc(100% - 16px)',
            minWidth: '800px',
            '& thead th:nth-child(1)': { width: 80 },
            '& thead th:nth-child(2)': { width: 100, textAlign: 'center' },
            '& thead th:nth-child(4)': { width: 140, textAlign: 'center' },
          })}
        >
          <thead style={{ lineHeight: 4 }}>
            <tr>
              <th>PID</th>
              <th>Actions</th>
              <th>
                <Stack
                  flexDirection={'row'}
                  justifyContent={'flex-start'}
                  alignItems={'center'}
                  height={'100%'}
                  gap={2}
                >
                  <Button
                    variant="soft"
                    onClick={() => {
                      setOrderBy({
                        column: 'name',
                        direction:
                          orderBy.column === 'name' &&
                          orderBy.direction === 'asc'
                            ? 'desc'
                            : 'asc',
                      });
                    }}
                    color={orderBy.column === 'name' ? 'primary' : 'neutral'}
                    endDecorator={
                      orderBy.column === 'name' ? (
                        orderBy.direction === 'asc' ? (
                          <FaArrowDown />
                        ) : (
                          <FaArrowUp />
                        )
                      ) : undefined
                    }
                  >
                    Name
                  </Button>
                  <Input
                    placeholder="Search..."
                    startDecorator={
                      queryLoading ? (
                        <l-mirage
                          size="16"
                          speed="2.5"
                          color="white"
                        ></l-mirage>
                      ) : (
                        <FaSearch />
                      )
                    }
                    onChange={(event) => {
                      setQueryLoading(true);
                      setTimeout(() => {
                        setQuery(event.target.value);
                      }, 500);
                    }}
                  />
                </Stack>
              </th>
              <th>
                <Button
                  variant="soft"
                  onClick={() => {
                    setOrderBy({
                      column: 'memoryUsage',
                      direction:
                        orderBy.column === 'memoryUsage' &&
                        orderBy.direction === 'asc'
                          ? 'desc'
                          : 'asc',
                    });
                  }}
                  color={
                    orderBy.column === 'memoryUsage' ? 'primary' : 'neutral'
                  }
                  endDecorator={
                    orderBy.column === 'memoryUsage' ? (
                      orderBy.direction === 'asc' ? (
                        <FaArrowDown />
                      ) : (
                        <FaArrowUp />
                      )
                    ) : undefined
                  }
                >
                  Memory Usage
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProcesses.map((process, index) => {
              const memoryUsageColor =
                process.memoryUsage > 2_000_000
                  ? 'danger'
                  : process.memoryUsage > 1_000_000
                  ? 'warning'
                  : process.memoryUsage > 50_000
                  ? 'success'
                  : 'neutral';

              return (
                <tr key={index}>
                  <td>
                    <Chip
                      sx={{
                        paddingTop: 0.1,
                        borderWidth: 2,
                      }}
                      size="md"
                      color="primary"
                      variant="outlined"
                    >
                      {process.pid}
                    </Chip>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <Tooltip
                      title="Kill Process"
                      placement="top"
                      variant="soft"
                      arrow
                    >
                      <IconButton
                        variant="soft"
                        color="danger"
                        size="sm"
                        sx={{ mt: 0.25 }}
                        onClick={() => {
                          setSelectedProcess(process);
                        }}
                      >
                        <IoRemoveCircleOutline size={24} />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td>{process.name}</td>
                  <td
                    style={{
                      textAlign: 'center',
                    }}
                  >
                    <Chip
                      sx={{
                        paddingTop: 0.1,
                        borderWidth: 2,
                      }}
                      size="md"
                      color={memoryUsageColor}
                      variant="soft"
                    >
                      {process.memoryUsage?.toLocaleString()}
                    </Chip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Stack>
      {paginationEnabled && (
        <Stack
          sx={(theme) => ({
            position: 'fixed',
            bottom: '18px',
            left: '16px',
            width: 'calc(100% - 32px)',
            height: '64px',
            zIndex: 2,
            background: theme.palette.background.body,
          })}
        ></Stack>
      )}
    </Page>
  );
}
