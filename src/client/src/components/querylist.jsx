import * as React from "react";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { memo } from "react";
import { visuallyHidden } from "@mui/utils";
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Collapse,
  Dialog,
  DialogActions,
  Grid,
  TextField,
} from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import EditIcon from "@mui/icons-material/Edit";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import axios from "axios";
import { toast } from "react-toastify";
function createData(id, name, calories, fat, carbs, protein) {
  return {
    id,
    name,
    calories,
    fat,
    carbs,
    protein,
  };
}

const rows = [
  createData(1, "Cupcake", 305, 3.7, 67, 4.3),
  createData(2, "Donut", 452, 25.0, 51, 4.9),
  createData(3, "Eclair", 262, 16.0, 24, 6.0),
  createData(4, "Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData(5, "Gingerbread", 356, 16.0, 49, 3.9),
  createData(6, "Honeycomb", 408, 3.2, 87, 6.5),
  createData(7, "Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData(8, "Jelly Bean", 375, 0.0, 94, 0.0),
  createData(9, "KitKat", 518, 26.0, 65, 7.0),
  createData(10, "Lollipop", 392, 0.2, 98, 0.0),
  createData(11, "Marshmallow", 318, 0, 81, 2.0),
  createData(12, "Nougat", 360, 19.0, 9, 37.0),
  createData(13, "Oreo", 437, 18.0, 63, 4.0),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: "student",
    numeric: false,
    disablePadding: true,
    label: "Student",
  },
  {
    id: "status",
    numeric: true,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "mentor",
    numeric: true,
    disablePadding: false,
    label: "Mentor",
  },
  {
    id: "raisedat",
    numeric: true,
    disablePadding: false,
    label: "Raised At",
  },
  {
    id: "type",
    numeric: true,
    disablePadding: false,
    label: "Type",
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

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
            <Typography variant="h6" gutterBottom component="div">
              {headCell.label}
            </Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          Query
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

function Row({ row, isItemSelected, labelId, mode, openDialog }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handledelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:3001/api/student/queries/delete/${row._id}`,
        {
          data: { kerberos: Cookies.get("kerberos") },
        }
      );
      console.log(res);
      if (res.status === 200) {
        toast.success("Query deleted successfully");
        toast.warning("Please refresh the query list to see the changes");
      }
    } catch (err) {
      toast.error("Error deleting query");
      console.log(err);
    }
  };

  return (
    <React.Fragment>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row._id}
        selected={isItemSelected}
        sx={{ cursor: "pointer" }}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell
          component="th"
          id={labelId}
          scope="row"
          padding="none"
          onClick={() => {
            navigate("/student/view_queries/" + row._id);
          }}
        >
          {row.description}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => {
            navigate("/student/view_queries/" + row._id);
          }}
        >
          {row.status}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => {
            navigate("/student/view_queries/" + row._id);
          }}
        >
          {row.mentor}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => {
            navigate("/student/view_queries/" + row._id);
          }}
        >
          {row.raised_at}
        </TableCell>
        <TableCell
          align="right"
          onClick={() => {
            navigate("/student/view_queries/" + row._id);
          }}
        >
          {row.type}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Button
                onClick={() => {
                  navigate("/student/update_queries/" + row._id);
                }}
                style={{
                  background: "blue",
                  color: "white",
                  marginTop: "0.5em",
                  marginLeft: "0.5em",
                  marginRight: "0.5em",
                  padding: "5px",
                }}
              >
                Edit
              </Button>
              <Button
                onClick={handledelete}
                style={{
                  background: "red",
                  color: "white",
                  marginTop: "0.5em",
                  marginLeft: "0.5em",
                  marginRight: "0.5em",
                  padding: "5px",
                }}
              >
                Delete
              </Button>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Info
              </Typography>

              {row.feedback && (
                <Typography variant="subtitle1" gutterBottom component="div">
                  <strong>Feedback:</strong> {"New Feedback"}
                </Typography>
              )}
              <Typography variant="subtitle1" gutterBottom component="div">
                <strong>Description:</strong> {row.description}
              </Typography>
              {row.attachments.length !== 0 && (
                <Box position="relative" display="inline-block">
                  {/* <IconButton
                    aria-label="View attachment"
                    onClick={() => {
                      openDialog();
                    }}
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 1,
                    }}
                  >
                    <RemoveRedEyeIcon />
                  </IconButton> */}
                  {row.attachments.map((attachment, index) => (
                    <img
                      key={index}
                      // src={`../../public/uploads/queries${attachment}`}
                      //take path of uploads folder...
                      src={`http://localhost:3001/uploads/queries/${attachment}`}
                      alt="Attachment"
                      style={{
                        width: "60px",
                        height: "60px",
                        zIndex: 0,
                        display: "inline-block",
                        padding: "10px",
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </Box>
              )}
              {/* Rest of the content */}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function Querylist({ mode, data }) {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("calories");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const visibleRows = React.useMemo(
    () => data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, data]
  );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={"column"}
    >
      {/* Dialog and other components */}
      <Paper sx={{ width: "90%" }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 300 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={() => {}}
              onRequestSort={() => {}}
              rowCount={data.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <Row
                    key={row._id}
                    row={row}
                    isItemSelected={isItemSelected}
                    labelId={labelId}
                    mode={mode}
                    openDialog={() => setOpen(true)}
                  />
                );
              })}
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
