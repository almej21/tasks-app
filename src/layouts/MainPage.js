import { Box, Typography } from "@mui/material";
import Task from "components/Task.js";
import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskApi";

const MainPage = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getTasks() {
      const data = await fetchTasks();
      if (data) {
        setTasks(data);
      } else {
        setError("Failed to fetch tasks.");
      }
    }

    getTasks();
  }, []);

  return (
    <>
      {/* <Toolbar className="Toolbar"></Toolbar> */}
      <Typography fontSize="3rem">Tasks</Typography>
      <Box sx={{}}>
        <Box
          className="tasks-container"
          sx={{
            marginTop: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            // border: "2px solid red",
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
            ></Task>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default MainPage;
