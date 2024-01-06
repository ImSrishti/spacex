import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Paper,
  TableRow,
  Chip,
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
export default function BasicModal({ selectedLaunch, openModal }) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalData, setModalData] = React.useState('');
  React.useEffect(() => {
    if (openModal) handleOpen();

    fetch('https://api.spacexdata.com/v3/launches/' + selectedLaunch)
      .then((response) => response.json())
      .then((result) => {
        let tempData = {
          Logo: result?.links.mission_patch_small,
          details: result?.details,
          flight_number: result?.flight_number,
          mission_name: result?.mission_name,
          rocket_type: result?.rocket.rocket_type,
          rocket_name: result?.rocket.rocket_name,
          manufacturer: result?.rocket.second_stage.payloads[0].manufacturer,
          nationality: result?.rocket.second_stage.payloads[0].nationality,
          launch_date_local: result?.launch_date_local,
          payload_type: result?.rocket.second_stage.payloads[0].payload_type,
          orbit: result?.rocket.second_stage.payloads[0].orbit,
          launch_site: result?.launch_site.site_name,
          launchStatus: result?.launch_success,
        };
        setModalData(tempData);
      })
      .catch((error) => {
        console.log('error', error);
      });
  }, [selectedLaunch, openModal]);
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>
        <Box sx={style}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Box
              component="img"
              sx={{
                height: 80,
                width: 80,
                marginRight: 2,
                marginBottom: 2,
              }}
              alt="Logo.img"
              src={modalData.Logo}
            />

            <div>
              <Box sx={{ typography: 'h6', fontWeight: 'bold' }}>
                {modalData.mission_name}
              </Box>

              <Box sx={{ typography: 'body2' }}>{modalData.rocket_name}</Box>
              <Box sx={{ marginTop: 1 }}>
                {modalData.launchStatus ? (
                  <Chip label="success" color="success" />
                ) : (
                  <Chip label="failed" color="error" />
                )}
              </Box>
            </div>
          </Box>
          <Typography id="modal-modal-description" sx={{ mb: 2 }}>
            {modalData.details}
          </Typography>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650, borderRadius: 3 }}
              aria-label="simple table"
            >
              {modalData && (
                <TableBody>
                  <TableRow>
                    <TableCell align="left">Flight Number</TableCell>
                    <TableCell align="left">
                      {modalData.flight_number}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.rocket_type}</TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.rocket_name}</TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.manufacturer}</TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.nationality}</TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">
                      {modalData.launch_date_local}
                    </TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.orbit}</TableCell>
                  </TableRow>{' '}
                  <TableRow>
                    <TableCell align="left">Mission name</TableCell>
                    <TableCell align="left">{modalData.launch_site}</TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Box>
      </>
    </Modal>
  );
}

//https://api.spacexdata.com/v3/launches/{{flight_number}}
