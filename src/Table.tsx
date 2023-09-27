import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {bus} from "./bus";
import {row} from "./row";

let rows: row[] = []
export function createRows(buses: bus[]) {
    rows = []
    buses.forEach((bus: bus) => {
       rows.push({
           busNumber: bus.busNumber,
           eta: formatDate(bus.arrivalTime),
           destination: bus.destination,
           minutes: Math.floor(bus.timeToStation / 60),
       });
    });
}
function formatDate(arrivalTime: string): string {
    let parsedDate = Date.parse(arrivalTime);
    let date = new Date(parsedDate);
    return(date.toLocaleString())
}
export default function BasicTable() {
    return (
        <TableContainer sx = {{mt: 2, maxWidth: '50%'}} component={Paper}>
            <Table sx={{margin: 'auto'}} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Bus Number</TableCell>
                        <TableCell align="right">ETA</TableCell>
                        <TableCell align="right">Destination</TableCell>
                        <TableCell align="right">Minutes</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.eta}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {row.busNumber}
                            </TableCell>
                            <TableCell align="right">{row.eta}</TableCell>
                            <TableCell align="right">{row.destination}</TableCell>
                            <TableCell align="right">{row.minutes}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}