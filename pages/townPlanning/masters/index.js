import Head from "next/head";
import React from "react";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";

const Index = () => {
  return (
    <div>
      <Head>
        <title>Masters</title>
      </Head>
      <ChildrenCards pageKey={"townPlanning"} title='master' />
    </div>
  );
};

export default Index;
