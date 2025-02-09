import { Add } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Task from "components/Task.js";
import ToastNotification from "components/ToastNotification";
import { useEffect, useState } from "react";
import apiService from "services/taskApi";

const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
};

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [error, setError] = useState(null);
  // const [toast, setToast] = useState(0);
  const [toastObj, setToastObj] = useState({
    title: "",
    severity: "success",
    triggerToast: false,
  });
  const [refreshList, setRefreshList] = useState(0);

  useEffect(() => {
    async function getTasks() {
      try {
        const data = await apiService.fetchTasks();
        setTasks(data);
        if (data.length === 0) {
          setNewTasks([]);
        }
      } catch (e) {
        console.log(e);
      }
    }

    getTasks();
  }, [refreshList]);

  const handleNewTaskClick = async (event) => {
    const newTask = {
      title: "",
      description: "",
      dueDate: "",
      status: 0,
      isNew: true,
      localId: generateUniqueId(),
    };

    setNewTasks([...newTasks, newTask]);
  };

  const handleDeleteTaskClick = async (keyToDelete, isNew) => {
    if (isNew) {
      setNewTasks((prevTasks) =>
        prevTasks.filter((task) => task.localId !== keyToDelete)
      );
    } else {
      console.log(tasks);
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== keyToDelete)
      );
    }
  };

  const allTasks = [...newTasks, ...tasks];
  // console.log("allTasks:", allTasks);

  return (
    <>
      {/* <Toolbar className="Toolbar"></Toolbar> */}
      <ToastNotification toastObj={toastObj} />
      <Typography fontSize="3rem" mt={4}>
        Tasks
      </Typography>
      <IconButton
        onClick={handleNewTaskClick}
        sx={{
          position: "fixed",
          top: 15,
          left: 15,
        }}
      >
        <Add />
        New Task
      </IconButton>
      <Box
        className="content-container"
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          // border: "1px solid red",
          justifyContent: "center",
        }}
      >
        {allTasks.length === 0 ? (
          <Typography fontSize={25} mt={20}>
            No Tasks Available
          </Typography>
        ) : (
          <Box
            className="tasks-container"
            sx={{
              margin: "3rem",
              display: "flex",
              width: "100%",
              flexDirection: {
                xs: "column",
                lg: "row",
              },
              flexWrap: "wrap",
              gap: 4,
              // border: "2px solid red",
              alignItems: "center",
            }}
          >
            {allTasks.map((task) => (
              <Task
                localId={task.localId}
                key={task.id}
                taskId={task.id}
                title={task.title}
                description={task.description || ""}
                status={task.status}
                dueDate={task.dueDate}
                saveTask={apiService.saveTask}
                deleteTask={handleDeleteTaskClick}
              ></Task>
            ))}
          </Box>
        )}
      </Box>
    </>
  );
};

export default MainPage;
