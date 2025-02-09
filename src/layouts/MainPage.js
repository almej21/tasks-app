import { Add } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import Task from "components/Task.js";
import ToastNotification from "components/ToastNotification";
import { useEffect, useState } from "react";
import apiService from "services/taskApi";

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTasks, setNewTasks] = useState([]);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(0);
  const [refreshList, setRefreshList] = useState(0);

  useEffect(() => {
    async function getTasks() {
      try {
        console.log(tasks);

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
      status: 3,
    };

    setNewTasks([...newTasks, newTask]);
  };

  return (
    <>
      {/* <Toolbar className="Toolbar"></Toolbar> */}
      <ToastNotification triggerToast={toast} message={toast} />
      <Typography fontSize="3rem">Tasks</Typography>
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
      <Box sx={{ display: "flex", flexDirection: "row" }}>
        {tasks.length === 0 && newTasks.length === 0 && (
          <Typography fontSize={25} mt={20}>
            No Tasks Available
          </Typography>
        )}
        <Box
          className="new-tasks-container"
          sx={{
            margin: "3rem",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            flexWrap: "wrap",
            gap: 4,
            border: "2px solid green",
            alignItems: "center",
          }}
        >
          {newTasks.map((task) => (
            <Task
              key={task.id}
              taskId={task.id}
              title={task.title}
              description={task.description || ""}
              status={task.status}
              dueDate={task.dueDate}
              // saveTask={handleNewTaskSave}
              isNewTask={true}
              refreshList={setRefreshList}
            ></Task>
          ))}
        </Box>
        <Box
          className="tasks-container"
          sx={{
            margin: "3rem",
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            flexWrap: "wrap",
            gap: 4,
            border: "2px solid red",
            alignItems: "center",
          }}
        >
          {tasks.map((task) => (
            <Task
              key={task.id}
              taskId={task.id}
              title={task.title}
              description={task.description || ""}
              status={task.status}
              dueDate={task.dueDate}
              saveTask={apiService.saveTask}
              refreshList={setRefreshList}
            ></Task>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MainPage;
