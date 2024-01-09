import { Box } from "@mui/material";
import React from "react";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";

const Index = () => {
  return (
    <div>
      <Box titleProp={"none"}>
        <ChildrenCards pageKey={"FireBrigadeSystem"} title={"masters"} />
      </Box>
    </div>
  );
};

export default Index;
