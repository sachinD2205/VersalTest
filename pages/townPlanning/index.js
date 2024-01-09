import React from "react";
import InnerCards from "../../containers/Layout/Inner-Cards/InnerCards";
import Head from "next/head";

const Index = () => {
  return (
    <>
      <Head>
        <title>Town Planning</title>
      </Head>
      <div>
        <InnerCards pageKey={"townPlanning"} />
      </div>
    </>
  );
};

export default Index;
