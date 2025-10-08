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
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import EventIcon from "@mui/icons-material/Event";
import DeckIcon from "@mui/icons-material/Deck";
import HolidayVillageRoundedIcon from "@mui/icons-material/HolidayVillageRounded";
const formatDateKey = (date) => date.toISOString().split("T")[0];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#111827",
    color: theme.palette.common.white,
    fontSize: 16,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

// Main Component
export default function AttendanceTable({
  studentsAttendanceList,
  holidayList,
}) {
  const [dateRange, setDateRange] = React.useState({ start: null, end: null });
  const [displayDates, setDisplayDates] = React.useState([]);

  // Initial load
  React.useEffect(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    setDateRange({ start: startDate, end: endDate });
    generateDisplayDates(startDate, endDate);
  }, []);

  const generateDisplayDates = (start, end) => {
    const dates = [];
    const current = new Date(start);
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    setDisplayDates(dates);
  };

  const handlePreviousWeek = () => {
    const newStart = new Date(dateRange.start);
    newStart.setDate(newStart.getDate() - 7);
    const newEnd = new Date(dateRange.end);
    newEnd.setDate(newEnd.getDate() - 7);
    setDateRange({ start: newStart, end: newEnd });
    generateDisplayDates(newStart, newEnd);
  };

  const handleNextWeek = () => {
    const newStart = new Date(dateRange.start);
    newStart.setDate(newStart.getDate() + 7);
    const newEnd = new Date(dateRange.end);
    newEnd.setDate(newEnd.getDate() + 7);
    const today = new Date();
    if (newStart > today) return;
    const adjustedEnd = newEnd > today ? today : newEnd;
    setDateRange({ start: newStart, end: adjustedEnd });
    generateDisplayDates(newStart, adjustedEnd);
  };

  // HOLIDAY LOGIC
  const isHoliday = (date) => {
    const dayOfWeek = date.toLocaleDateString("en-IN", { weekday: "long" });

    if (holidayList !== null) {
      for (let holiday of holidayList) {
        // Single day holiday
        if (holiday?.holidayDate !== "NA" && holiday?.endDate === "NA") {
          const [d, m, y] = holiday?.holidayDate?.split("/").map(Number);
          const holidayDate = new Date(y, m - 1, d);
          if (
            date?.getFullYear() === holidayDate.getFullYear() &&
            date?.getMonth() === holidayDate.getMonth() &&
            date?.getDate() === holidayDate.getDate()
          ) {
            return true;
          }
        }

        // Range-based holiday
        if (
          holiday?.dayOfWeek === "Duration" &&
          holiday?.holidayDate !== "NA" &&
          holiday?.endDate !== "NA"
        ) {
          // Parse dates manually to avoid format confusion
          const [startD, startM, startY] = holiday?.holidayDate
            .split("/")
            .map(Number);
          const [endD, endM, endY] = holiday?.endDate.split("/").map(Number);

          const start = new Date(startY, startM - 1, startD);
          const end = new Date(endY, endM - 1, endD);
          const current = new Date(date);

          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          current.setHours(0, 0, 0, 0);

          if (current >= start && current <= end) {
            return true;
          }
        }

        // Weekend holiday?
        if (
          holiday?.holidayType === "Weekend" &&
          holiday?.dayOfWeek === dayOfWeek
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const getHolidayType = (date) => {
    if (!holidayList || !date) return null;

    const dayOfWeek = date.toLocaleDateString("en-IN", { weekday: "long" });

    for (const h of holidayList) {
      // Single day holiday
      if (h?.holidayDate !== "NA" && h?.endDate === "NA") {
        const [d, m, y] = h.holidayDate.split("/").map(Number);
        const holidayDate = new Date(y, m - 1, d);

        if (
          date.getFullYear() === holidayDate.getFullYear() &&
          date.getMonth() === holidayDate.getMonth() &&
          date.getDate() === holidayDate.getDate()
        ) {
          return h?.occasion;
        }
      }

      // Range-based holiday
      if (h?.holidayDate !== "NA" && h?.endDate !== "NA") {
        const [startD, startM, startY] = h.holidayDate.split("/").map(Number);
        const [endD, endM, endY] = h.endDate.split("/").map(Number);

        const start = new Date(startY, startM - 1, startD);
        const end = new Date(endY, endM - 1, endD);
        const current = new Date(date);

        // Normalize times for comparison
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        current.setHours(0, 0, 0, 0);

        if (current >= start && current <= end) {
          return h?.occasion;
        }
      }

      // Weekend holiday
      if (
        (h?.dayOfWeek === "Saturday" || h?.dayOfWeek === "Sunday") &&
        h?.holidayType === "Weekend" &&
        h?.holidayDate === "NA" &&
        h?.endDate === "NA"
      ) {
        if (dayOfWeek === h?.dayOfWeek) {
          return h?.holidayType;
        }
      }
    }

    return null;
  };

  const columns = [
    { id: "studentName", label: "Student Name", minWidth: 170 },
    ...displayDates.map((date) => {
      const holidayType = getHolidayType(date);

      return {
        id: formatDateKey(date),
        label: (
          <div>
            <div>{date.toLocaleDateString("en-IN", { weekday: "short" })}</div>
            <div className="flex flex-col">
              <Typography variant="caption">
                {date.toLocaleDateString("en-IN")}
              </Typography>
              {holidayType && (
                <span className=" p-1 rounded-lg flex items-center justify-center bg-white">
                  <p className=" text-xs font-medium text-indigo-600 mt-1">
                    {holidayType}
                  </p>
                </span>
              )}
            </div>
          </div>
        ),
        minWidth: 100,
      };
    }),
  ];

  // Attendance transformation
  const transformAttendanceData = (studentsAttendanceList) => {
    return studentsAttendanceList?.map(({ student, attendance }) => {
      const row = {
        studentName: student?.studentName,
        studentId: student?.studentID,
      };

      displayDates?.forEach((date) => {
        const dateKey = formatDateKey(date);

        const dateDisplayKey = date.toLocaleDateString("en-IN");

        if (isHoliday(date) && isHoliday(date) !== null) {
          row[dateKey] = "-";
        } else {
          const match = attendance?.find(
            (att) => att?.attendanceDate === dateDisplayKey
          );
          row[dateKey] = match?.attendance || "A";
        }
      });

      return row;
    });
  };

  const rows = transformAttendanceData(studentsAttendanceList);

  // Cell render logic
  const renderAttendanceCell = (status) => {
    if (status === "P")
      return <CheckCircleIcon color="success" fontSize="small" />;
    if (status === "A") return <CancelIcon color="error" fontSize="small" />;
    if (status === "-") {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          color="info.main"
        >
          {/* Option 1: Holiday icon */}
          <HolidayVillageRoundedIcon fontSize="small" />
        </Box>
      );
    }
    return null;
  };
  // Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 2,
        }}
      >
        <IconButton onClick={handlePreviousWeek}>
          <ArrowBackIosIcon />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2 }}>
          {dateRange?.start?.toLocaleDateString("en-IN")} -{" "}
          {dateRange?.end?.toLocaleDateString("en-IN")}
        </Typography>
        <IconButton
          onClick={handleNextWeek}
          disabled={dateRange.end >= new Date()}
        >
          <ArrowForwardIosIcon />
        </IconButton>
      </Box>

      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="student attendance table">
          <TableHead>
            <TableRow>
              {columns?.map((column) => (
                <StyledTableCell
                  key={column?.id}
                  align="center"
                  style={{ minWidth: column?.minWidth }}
                >
                  {column?.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, index) => (
                <StyledTableRow
                  hover
                  tabIndex={-1}
                  key={`${row.studentId}-${index}`}
                >
                  <StyledTableCell>{row.studentName}</StyledTableCell>
                  {displayDates?.map((date) => (
                    <StyledTableCell key={formatDateKey(date)} align="center">
                      {renderAttendanceCell(row[formatDateKey(date)])}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows?.length || 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
