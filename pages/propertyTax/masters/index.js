import React from "react";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";

const Index = () => {
  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <ChildrenCards pageKey={"hawkerManagementSystem"} title={"Masters"} />
      </BasicLayout>
    </div>
  );
};

export default Index;
