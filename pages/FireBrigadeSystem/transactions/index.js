import React from "react";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";

const Index = () => {
  return (
    <div titleProp={"none"}>
      {/* <BasicLayout titleProp={"none"}> */}
      <ChildrenCards pageKey={"FireBrigadeSystem"} title={"transactions"} />
      {/* </BasicLayout> */}
    </div>
  );
};

export default Index;
