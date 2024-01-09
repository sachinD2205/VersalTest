import React from "react";
import BasicLayout from "../../containers/Layout/BasicLayout";
import InnerCards from "../../containers/Layout/Inner-Cards/InnerCards";

const homeForMarriage = () => {
  return (
    <div>
      <BasicLayout titleProp={"none"}>
        <InnerCards pageKey={"libraryManagementSystem"} />
      </BasicLayout>
    </div>
  );
};

export default homeForMarriage;
