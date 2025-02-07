import { Typography } from "@mui/material";
import Box from "@mui/material/Box";

const Toolbar = () => {
  return (
    <Box className="toolbar-container" sx={{ border: "2px solid red" }}>
      <Typography>Toolbar</Typography>
    </Box>
  );
};

export default Toolbar;
