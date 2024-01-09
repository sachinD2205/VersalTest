import React from "react";
import ChildrenCards from "../../../containers/Layout/Inner-Cards/ChildrenCards";
import Head from "next/head";

const Index = () => {
  return (
    <div>
      <Head>
        <title>Transactions</title>
      </Head>

      <ChildrenCards pageKey={"townPlanning"} title="transactions" />
    </div>
  );
};

export default Index;
