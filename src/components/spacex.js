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
} from '@mui/material';

export default function BasicTable() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  useEffect(() => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch('https://api.spacexdata.com/v3/launches', requestOptions)
      .then((response) => response.json())
      .then((result) => {
        const tempData = result.map((spacex) => {
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
        setTableData(tempData);
      })
      .catch((error) => console.log('error', error));
  }, []);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <>
      {/* <FormControl
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
          value={10}
          // onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={10}
          // onChange={handleChange}
        >
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl> */}
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, borderRadius: 3 }}
          aria-label="simple table"
        >
          <TableHead sx={{ backgroundColor: 'gainsboro' }}>
            <TableRow>
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
            {tableData
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
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        sx={{ marginTop: 1, marginLeft: 'auto' }}
        component="div"
        count={tableData.length}
        rowsPerPage={10}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

//pagination https://www.youtube.com/watch?v=wAGIOCqS8tk
