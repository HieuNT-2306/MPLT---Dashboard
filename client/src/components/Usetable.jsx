import { Table, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, useTheme } from '@mui/material'
import React, { useState } from 'react'

export default function Usetable(data, headCells, filterFn) {
  const theme = useTheme();
  const styles = {
    table: {
      marginTop: "1rem",
      "& thead th": {
        padding: "8px",
        fontWeight: "600",
        backgroundColor: theme.palette.primary.light,
        color: theme.palette.secondary[100]
      },
      "& tbody td": {
        padding: "4px",
        fontWeight: "300"
      },
      "& tbody tr:hover": {
        backgroundColor: theme.palette.background.alt,
        cursor: "pointer"
      }
    }
  };
  const pages = [5, 10, 25];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[1]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();


  const TblContainer = props => (
    <TableContainer>
      <Table sx={styles.table}>
        {props.children}
      </Table>
    </TableContainer>
  )
  const TblHead = props => {
    const handleSortRequest = cellId => {
      const isAsc = orderBy === cellId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    }
    return (
      <TableHead>
        <TableRow>
          {
            headCells.map(headCell => (
              <TableCell key={headCell.id}
                sortDirection={orderBy === headCell.id ? order : false}>
                {headCell.disableSorting ? headCell.label :
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    onClick={() => { handleSortRequest(headCell.id) }}
                    direction={orderBy === headCell.id ? order : 'asc'}
                  >
                    {headCell.label}
                  </TableSortLabel>
                }
              </TableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }
  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  const dataAfterPagingAndSorting = (paging) => {
    let filterData = stableSort(filterFn.fn(data), getComparator(order, orderBy));
    if (filterData.length < rowsPerPage || !paging) {
      return filterData;
    }
    else {
      return filterData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    }
  }

  const TblPagination = () => (<TablePagination
    component="div"
    page={page}
    rowsPerPageOptions={pages}
    rowsPerPage={rowsPerPage}
    count={data && data.length}
    onPageChange={handleChangePage}
    onRowsPerPageChange={handleChangeRowsPerPage}
  />);
  return {
    TblContainer,
    TblHead,
    TblPagination,
    dataAfterPagingAndSorting
  }
}
