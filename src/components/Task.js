import { Delete, Edit, Save } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DateTime } from "luxon";
import { useState } from "react";
// import { addNewTask, saveTask } from "services/taskApi";
import apiService from "services/taskApi";
import DateTimePicker from "./DateTimeSelector";
import ToastNotification from "./ToastNotification";

const statusObj = {
  0: "Pending",
  1: "In Progress",
  2: "Completed",
  3: "OverDue",
};

const findKeyByValue = (obj, value) => {
  const entry = Object.entries(obj).find(([key, val]) => val === value);
  return entry ? entry[0] : undefined; // Returns the key or undefined if not found
};

const Task = (props) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleText, setTitleText] = useState(props.title);
  const [descriptionText, setDescriptionText] = useState(props.description);
  const [selectedStatus, setSelectedStatus] = useState(statusObj[props.status]);
  const [toast, setToast] = useState(0);
  const [selectedDateTime, setSelectedDateTime] = useState(
    props.dueDate ? DateTime.fromISO(props.dueDate) : DateTime.utc()
  );
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (event) => {
    setTitleText(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescriptionText(event.target.value);
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    let statusNum = Number(findKeyByValue(statusObj, selectedStatus));
    const now = new Date();

    if (props.isNewTask) {
      const params = {
        title: titleText,
        description: descriptionText,
        status: statusNum,
        DueDate: selectedDateTime || now.toISOString(),
      };
      apiService.addNewTask(params);
      setToast("The task has been successfully added!");
    } else {
      const params = {
        id: props.taskId,
        title: titleText,
        description: descriptionText,
        status: statusNum,
        DueDate: selectedDateTime || now.toISOString(),
      };
      apiService.saveTask(props.taskId, params);
      setToast("The task has been successfully saved!");
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDeleteClick = (event) => {
    try {
      if (props.isNewTask) {
        props.refreshList((prev) => prev + 1);
      } else {
        apiService.deleteTask(props.taskId);
        props.refreshList((prev) => prev + 1);
      }
    } catch (error) {}
  };

  return (
    <Box
      sx={{
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "30rem",
        height: "25rem",
        boxShadow: " 0px 0px 28px -5px rgba(0,0,0,0.75)",
        padding: "1rem",
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
          // border: "1px solid red",
        }}
      >
        <Box
          className="task-content"
          sx={{
            // border: "1px solid red",
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {isEditing ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  width: "100%",
                }}
              >
                <TextField
                  fullWidth
                  value={titleText}
                  onChange={handleTitleChange}
                  variant="outlined"
                  label="Title"
                />
              </Box>
            ) : (
              <Typography fontSize="1.3rem" fontWeight="bold">
                Title: {titleText}
              </Typography>
            )}
            {isEditing ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "start",
                  gap: 2,
                  width: "100%",
                  marginTop: "1rem",
                }}
              >
                <TextField
                  fullWidth
                  value={descriptionText}
                  onChange={handleDescriptionChange}
                  rows={4}
                  variant="outlined"
                  multiline
                  label="Description"
                />
              </Box>
            ) : (
              <Typography fontSize="1rem">
                Description: {descriptionText}
              </Typography>
            )}
            {isEditing ? (
              <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
                <InputLabel>Status:</InputLabel>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  {Object.keys(statusObj).map((key) => (
                    <MenuItem key={key} value={statusObj[key]}>
                      {statusObj[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Typography fontSize="1rem">Status: {selectedStatus}</Typography>
            )}
            {isEditing ? (
              <DateTimePicker
                initialDateTime={selectedDateTime}
                onChange={(value) => setSelectedDateTime(value)}
              />
            ) : (
              <Typography>
                DueDate: {selectedDateTime.toFormat("dd-MM-yyyy HH:mm")}
              </Typography>
            )}
          </Box>
        </Box>
        <ToastNotification triggerToast={toast} message={toast} />
        <Box className="task-actions" sx={{}}>
          {isEditing ? (
            <IconButton
              onClick={handleSaveClick}
              sx={{
                top: 8,
                left: 8,
              }}
            >
              <Save />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleEditClick}
              sx={{
                top: 8,
                left: 8,
              }}
            >
              <Edit />
            </IconButton>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <IconButton onClick={handleDeleteClick} sx={{}}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Task;
