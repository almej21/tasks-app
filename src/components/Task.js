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
import { useState } from "react";
import { saveTask } from "services/taskApi";
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
  const [dueDate, setDueDate] = useState(statusObj[props.dueDate]);
  const [toast, setToast] = useState(0);

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
    const params = {
      id: props.taskId,
      title: titleText,
      description: descriptionText,
      status: statusNum,
      DueDate: dueDate || now.toISOString(),
    };
    saveTask(props.taskId, params);
    setToast((prev) => prev + 1);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDeleteClick = (event) => {};

  return (
    <Box
      sx={{
        borderRadius: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "30rem",
        height: "20rem",
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
              gap: 1,
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
                <Typography fontSize="1.3rem" fontWeight="bold">
                  Title:
                </Typography>
                <TextField
                  fullWidth
                  value={titleText}
                  onChange={handleTitleChange}
                  variant="outlined"
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
                }}
              >
                <Typography fontSize="1rem">Description:</Typography>
                <TextField
                  fullWidth
                  value={descriptionText}
                  onChange={handleDescriptionChange}
                  rows={4}
                  variant="outlined"
                  multiline
                />
              </Box>
            ) : (
              <Typography fontSize="1rem">
                Description: {descriptionText}
              </Typography>
            )}
            {isEditing ? (
              <FormControl fullWidth sx={{ marginTop: 2 }}>
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
          </Box>
        </Box>
        <ToastNotification
          triggerToast={toast}
          message="The task has been successfully saved!"
        />
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
