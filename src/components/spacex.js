import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  Chip,
  FormControl,
  MenuItem,
  Select,
  TablePagination,
  CircularProgress,
  Box,
} from '@mui/material';

export default function BasicTable() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedLaunchType, setLaunchType] = useState('launches');
  const [selectedTimeDuration, setTimeDuration] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoader] = useState(false);
  useEffect(() => {
    fetchApi();
  }, []);

  const fetchApi = (param = '', filter) => {
    setLoader(true);
    setErrorMessage('');
    fetch('https://api.spacexdata.com/v3/launches/' + param)
      .then((response) => response.json())
      .then((result) => {
        let tempData = result.map((spacex) => {
          return {
            no: spacex?.flight_number,
            launched: spacex?.launch_date_local,
            location: spacex?.launch_site.site_name,
            mission: spacex?.mission_name,
            orbit: spacex?.rocket.second_stage.payloads[0].orbit,
            launchStatus: spacex?.launch_success,
            rocket: spacex?.rocket.rocket_name,
          };
        });
        if (filter === 'successful') {
          tempData = tempData.filter((spacex) => {
            return spacex?.launchStatus;
          });
        } else if (filter === 'failed') {
          tempData = tempData.filter((spacex) => {
            return !spacex?.launchStatus;
          });
        }
        setTableData(tempData);
        setLoader(false);
      })
      .catch((error) => {
        console.log('error', error);
        setErrorMessage('No result Found for specified filter');
        setTableData('');
        setLoader(false);
      });
  };

  const handleChangePast = (e) => {
    setTableData('');
    setTimeDuration(e.target.value);
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 6 months ago
    const pastSixMonthsDate = new Date();
    pastSixMonthsDate.setMonth(currentDate.getMonth() - 6);

    // Format the dates as 'YYYY-MM-DD'
    const startDateString = formatDate(pastSixMonthsDate);
    const endDateString = formatDate(currentDate);
    if (e.target.value === 'past') {
      const params = `past/start=${startDateString}&end=${endDateString}`;
      fetchApi(params);
    } else {
      fetchApi();
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeLaunch = (e) => {
    setLaunchType(e.target.value);
    setTableData('');
    if (e.target.value === 'upcoming') {
      fetchApi('upcoming');
    } else if (e.target.value === 'launches') {
      fetchApi();
    } else {
      fetchApi('', e.target.value);
    }
  };
  return (
    <>
      <FormControl
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedTimeDuration}
          onChange={handleChangePast}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="past">Last 6 months</MenuItem>
        </Select>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          onChange={handleChangeLaunch}
          value={selectedLaunchType}
        >
          <MenuItem value="launches">All Launches</MenuItem>
          <MenuItem value="upcoming">Upcoming Launches</MenuItem>
          <MenuItem value="successful">Successful Launches</MenuItem>
          <MenuItem value="failed">Failed Launches</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, borderRadius: 3 }}
          aria-label="simple table"
        >
          <TableHead sx={{ backgroundColor: 'gainsboro' }}>
            <TableRow key="row_name">
              <TableCell>No</TableCell>
              <TableCell align="left">Launched UTC</TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Mission</TableCell>
              <TableCell align="left">Orbit</TableCell>
              <TableCell align="left">Launch Status</TableCell>
              <TableCell align="left">Rocket</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableCell align="center" colSpan={7}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress />
                </Box>
              </TableCell>
            )}
            {tableData &&
              tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.no}
                    </TableCell>
                    <TableCell align="left">{row.launched}</TableCell>
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell align="left">{row.mission}</TableCell>
                    <TableCell align="left">{row.orbit}</TableCell>
                    <TableCell align="left">
                      {row.launchStatus ? (
                        <Chip label="success" color="success" />
                      ) : (
                        <Chip label="failed" color="error" />
                      )}
                    </TableCell>
                    <TableCell align="left">{row.rocket}</TableCell>
                  </TableRow>
                ))}
            {errorMessage && (
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  {errorMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ marginTop: 1, marginLeft: 'auto' }}
        component="div"
        count={tableData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

//pagination https://www.youtube.com/watch?v=wAGIOCqS8tk

//API Docs : https://docs.spacexdata.com/?version=latest#5fc4c846-c373-43df-a10a-e9faf80a8b0a
