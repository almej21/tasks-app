import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

const DateTimeSelector = ({ initialDateTime, onChange }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(
    initialDateTime ? DateTime.fromISO(initialDateTime) : DateTime.utc()
  );

  useEffect(() => {
    // Pass the formatted value to the parent whenever it changes
    onChange(DateTime.fromISO(selectedDateTime));
  }, [selectedDateTime]);

  const handleChange = (dateTime) => {
    if (dateTime) {
      setSelectedDateTime(dateTime);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DateTimePicker
        label="Select Date & Time"
        value={selectedDateTime}
        onChange={handleChange}
        format="dd-MM-yyyy, HH:mm" // Format for the displayed input
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};

export default DateTimeSelector;
