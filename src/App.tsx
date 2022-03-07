import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { getTrees } from './services/trees';
import { filterDays, getFilterDate, parseData, parseIntoDayString, splitTreesResult } from './utils';
import { TreesPerDay } from './types/treesPerDay';
import { DataGrid } from '@mui/x-data-grid';
import { CircularProgress, Container, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

function App() {
  const [trees, setTrees] = useState<TreesPerDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    getTrees()
      .then(res => {
        const treesResult = parseData(res.data);
        setTrees(treesResult);
        setLoading(false)
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (filter) {
      setFilterDate(getFilterDate(filter));
    } else {
      setFilterDate(null);
    }
  }, [filter])

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(parseInt(event.target.value));
  }

  const filterCallback = (day: TreesPerDay) => {
    if (filterDate) {
      return filterDays(day, filterDate)
    }
    return true;
  }

  return (
    <div className="App">
      <Container>
      <Typography variant="h4">Trees planted per day</Typography>

      {loading && <CircularProgress />}

        {!loading && <Paper>
          <FormControl sx={{
                float: 'right',
                margin: '1em'
          }}>
            <InputLabel>Filter by</InputLabel>
            <Select
              label="Filter by"
              value={filter?.toString()}
              onChange={handleFilterChange}
              sx={{
                width: '10%',
                minWidth: 150,
              }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value={7}>Past week</MenuItem>
              <MenuItem value={30}>Past month</MenuItem>
              <MenuItem value={365}>Past year</MenuItem>
            </Select>
          </FormControl>
          <TableContainer sx={{ maxHeight: '80vh'}}>
            <Table stickyHeader sx={{ minWidth: 650, height: '100%' }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell><Typography variant="h6">Date</Typography></TableCell>
                  <TableCell><Typography variant="h6">Number of trees planted</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  trees.filter(filterCallback).map((day) => (
                    <TableRow key={day.day}>
                      <TableCell>{day.day}</TableCell>
                      <TableCell>{day.trees}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>}
      </Container>
    </div>
  );
}

export default App;
