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
import { motion } from "framer-motion";
import { DateTime } from "luxon";
import { useEffect, useRef, useState } from "react";
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
  const [isEditing, setIsEditing] = useState(!props.taskId);
  const [titleText, setTitleText] = useState(props.title);
  const [descriptionText, setDescriptionText] = useState(props.description);
  const [selectedStatus, setSelectedStatus] = useState(statusObj[props.status]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const buttonRef = useRef(null);
  const [toastObj, setToastObj] = useState({
    title: "",
    severity: "success",
    triggerToast: false,
  });
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
    let statusNum = Number(findKeyByValue(statusObj, selectedStatus));
    const now = new Date();

    if (!props.taskId) {
      if (!titleText) {
        setToastObj({
          title: "You must give the task a title",
          severity: "error",
          triggerToast: true,
        });
        return;
      }
      setIsEditing(false);

      const params = {
        title: titleText,
        description: descriptionText,
        status: statusNum,
        DueDate: selectedDateTime || now.toISOString(),
      };
      apiService.addNewTask(params);
      setSelectedDateTime(selectedDateTime);
      props.setRefreshList((prev) => prev + 1);
      props.removeTask(props.localId);
      setToastObj({
        title: "The task has been successfully added!",
        severity: "success",
        triggerToast: true,
      });
    } else {
      const params = {
        id: props.taskId,
        title: titleText,
        description: descriptionText,
        status: statusNum,
        DueDate: selectedDateTime || now.toISOString(),
      };
      apiService.saveTask(props.taskId, params);
      setSelectedDateTime(selectedDateTime);
      setToastObj({
        title: "The task has been successfully saved!",
        severity: "success",
      });
      setIsEditing(false);
    }
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  const handleDeleteClick = (event) => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      if (!props.taskId) {
        props.deleteTask(props.localId, true);
      } else {
        apiService.deleteTask(props.taskId);
        props.deleteTask(props.taskId, false);
      }
      setConfirmDelete(false);
    } catch (error) {}
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setConfirmDelete(false); // Stop shaking and reset color
      }
    };

    if (confirmDelete) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [confirmDelete]);

  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  const bgColor = selectedDateTime < now ? "#d4d4d4" : "white";

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
        backgroundColor: bgColor,
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
            width: "90%",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: ".5rem",
              flexWrap: "wrap",
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
              <Typography fontSize="1.3rem" fontWeight="bold" textAlign="left">
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
              <Typography
                fontSize="1rem"
                textAlign="left"
                sx={{
                  overflowWrap: "break-word",
                  maxWidth: "100%",
                }}
              >
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
        <ToastNotification toastObj={toastObj} />
        <Box className="task-actions" sx={{}}>
          {isEditing ? (
            <IconButton
              onClick={handleSaveClick}
              sx={{
                left: 8,
              }}
            >
              <Save />
            </IconButton>
          ) : (
            <IconButton
              onClick={handleEditClick}
              sx={{
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
        <motion.div
          ref={buttonRef}
          animate={confirmDelete ? { x: [-3, 3, -3, 3, 0] } : { x: 0 }} // Reset shake properly
          transition={confirmDelete ? { repeat: Infinity, duration: 0.3 } : {}} // Stop animation when state resets
        >
          <IconButton
            onClick={handleDeleteClick}
            sx={{ color: confirmDelete ? "red" : "default" }}
          >
            <Delete />
          </IconButton>
        </motion.div>
      </Box>
    </Box>
  );
};

export default Task;
