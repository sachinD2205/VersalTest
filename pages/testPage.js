import React from "react";
import BasicLayout from "../containers/Layout/BasicLayout";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import Loader from "../features/Loader";

const TestPage = () => {
  return (
    <div>
      <BasicLayout titleProp={"Dynamic Page Title"}>
        <h1>test</h1>
      </BasicLayout>
    </div>
  );
};

export default TestPage;
