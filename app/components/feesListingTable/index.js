"use client";
import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { useTheme, styled } from "@mui/material/styles";

const columns = [
  { id: "studentName", label: "Student Name", minWidth: 170 },
  { id: "assignTo", label: "Assign To", minWidth: 100 },
  {
    id: "groupName",
    label: "Group Name",
    minWidth: 170,
    align: "right",
  },
  {
    id: "matchedGroups",
    label: "Total Amount",
    minWidth: 170,
    align: "right",
  },
];

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: "calc(100vh - 200px)",
  "&::-webkit-scrollbar": {
    width: "8px",
    height: "8px",
  },
  "&::-webkit-scrollbar-track": {
    background: theme.palette.mode === "light" ? "#f1f1f1" : "#424242",
  },
  "&::-webkit-scrollbar-thumb": {
    background: theme.palette.mode === "light" ? "#888" : "#666",
    borderRadius: "4px",
    "&:hover": {
      background: theme.palette.mode === "light" ? "#777" : "#555",
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightMedium,
  color:
    theme.palette.mode === "light"
      ? theme.palette.grey[800]
      : theme.palette.grey[300],
  "&.MuiTableCell-head": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
    color:
      theme.palette.mode === "light"
        ? theme.palette.grey[900]
        : theme.palette.grey[100],
    fontWeight: theme.typography.fontWeightBold,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.action.hover
        : theme.palette.grey[900],
  },
  "&:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[100]
        : theme.palette.grey[800],
    transition: "background-color 0.2s ease",
  },
  "&.Mui-selected": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
  },
  "&.Mui-selected:hover": {
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.primary.light
        : theme.palette.primary.dark,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  borderRadius: "12px",
  boxShadow: theme.shadows[3],
  backgroundColor:
    theme.palette.mode === "light" ? "#ffffff" : theme.palette.grey[900],
  "& .MuiTablePagination-root": {
    borderTop: `1px solid ${
      theme.palette.mode === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800]
    }`,
  },
}));

export default function FeesListingTable({ studentsFeesList }) {
  const theme = useTheme();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const getTotalFees = (matchedGroups) => {
    if (!Array.isArray(matchedGroups)) return "₹0";
    const total = matchedGroups.reduce(
      (sum, item) => sum + (item?.totalAmount || 0),
      0
    );
    return `₹${total.toLocaleString()}`;
  };

  const getFeeGroup = (feeGroup) => {
    if (!Array.isArray(feeGroup)) return "";

    const groupNames = feeGroup.map((fee) => {
      if (Array.isArray(fee?.groupName)) {
        return fee.groupName.join(", ");
      } else {
        return fee?.groupName || "";
      }
    });

    return groupNames.join(", ");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <StyledPaper>
      <StyledTableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {studentsFeesList &&
              studentsFeesList?.length > 0 &&
              studentsFeesList
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((row) => (
                  <StyledTableRow hover tabIndex={-1} key={row?.studentID}>
                    {columns?.map((column) => {
                      let value = row[column.id] ?? "";

                      if (column.id === "groupName") {
                        value = getFeeGroup(row["matchedGroups"] ?? []);
                      } else if (column.id === "matchedGroups") {
                        value = getTotalFees(row["matchedGroups"] ?? []);
                      }

                      return (
                        <StyledTableCell key={column?.id} align={column?.align}>
                          {value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={studentsFeesList?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
            {
              color:
                theme.palette.mode === "light"
                  ? theme.palette.grey[800]
                  : theme.palette.grey[300],
            },
          "& .MuiSelect-select, & .MuiInputBase-root": {
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800]
                : theme.palette.grey[300],
          },
          "& .MuiSvgIcon-root": {
            color:
              theme.palette.mode === "light"
                ? theme.palette.grey[800]
                : theme.palette.grey[300],
          },
        }}
      />
    </StyledPaper>
  );
}
