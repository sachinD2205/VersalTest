import React from "react";
import BasicLayout from "../../../containers/Layout/BasicLayout";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";

const index = () => {
  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <ChildrenCards pageKey={"libraryManagementSystem"} title={"Reports"} />
      </BasicLayout>
    </div>
  );
};

export default index;
