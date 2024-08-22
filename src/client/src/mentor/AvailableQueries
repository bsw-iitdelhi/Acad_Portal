import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Typography,
  IconButton,
  Collapse,
  Dialog,
  DialogActions,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  TextField,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  Edit as EditIcon,
  RemoveRedEye as RemoveRedEyeIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";

const headCells = [
  { id: "student", numeric: false, disablePadding: true, label: "Student" },
  { id: "status", numeric: true, disablePadding: false, label: "Status" },
  { id: "raised_at", numeric: true, disablePadding: false, label: "Raised At" },
  { id: "type", numeric: true, disablePadding: false, label: "Type" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

function Row(row, open, setOpenDialog) {
  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.id}
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpenDialog(row.id)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.student}
        </TableCell>
        <TableCell align="right">{row.status}</TableCell>
        <TableCell align="right">{row.raised_at}</TableCell>
        <TableCell align="right">{row.type}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom>
                Info
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                <strong>Description:</strong> {row.description}
              </Typography>
              {row.attachments.length > 0 && (
                <Box position="relative" display="inline-block">
                  <IconButton
                    aria-label="View attachment"
                    onClick={() => setOpenDialog(row.id)}
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                    }}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton>
                  <img
                    src={row.attachments[0]}
                    alt="Attachment"
                    style={{
                      width: "50px",
                      height: "50px",
                      zIndex: 0,
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <div
                className="actions"
                style={{ display: "flex", gap: "20px", marginTop: "10px" }}
              >
                {row.status === "AVAILABLE" && (
                  <Button variant="contained" size="small">
                    Take up
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleDelete(row.id)}
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function AvailableQueryList() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("status");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [data, setData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/mentor/queries",
          {
            headers: {
              "Content-Type": "application/json",
              "x-access-token": Cookies.get("token"),
            },
          }
        );
        setData(response.data);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/mentor/queries/${id}`, {
        headers: {
          "Content-Type": "application/json",
          "x-access-token": Cookies.get("token"),
        },
      });
      toast.success("Query deleted successfully");
      // Refresh data after deletion
      setData((prevData) => prevData.filter((query) => query.id !== id));
    } catch (error) {
      toast.error("Error deleting query");
      console.error(error);
    }
  };

  const visibleRows = React.useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [data, page, rowsPerPage]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Dialog
        open={Boolean(selectedRow)}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <Grid container spacing={2}>
          {selectedRow &&
            selectedRow.attachments.map((imageUrl, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="200"
                      style={{ objectFit: "cover" }}
                      image={imageUrl}
                      alt={`Image ${index}`}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
        </Grid>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Paper sx={{ width: "90%" }}>
        <TableContainer>
          <Table sx={{ minWidth: 300 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {visibleRows.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  open={openDialog === row.id}
                  setOpenDialog={setSelectedRow}
                />
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No Queries Available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
