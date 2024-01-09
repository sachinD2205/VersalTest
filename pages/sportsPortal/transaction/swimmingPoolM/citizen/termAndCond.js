import { Button, Paper } from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styles from "../../../../../styles/marrigeRegistration/[newMarriageRegistration]view.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";

const Index = () => {
  const [dataSource, setDataSource] = useState([]);
  const router = useRouter();

  return (
    <>
      <Paper
        sx={{
          marginLeft: 2,
          marginRight: 2,

          marginBottom: 2,
          padding: 1,
          border: 1,
          borderColor: "grey.500",
        }}
      >
        <h2>Simming Pool Condition</h2>
        <div>
          {/* <div>
            <img src="/grood.jpg" alt="" height="400vh" width="1240vw" />
          </div> */}
        </div>
        <div>
          <Button
            variant="contained"
            color="success"
            onClick={
              () => router.push(`/sportsPortal/transaction/swimmingPoolM/citizen/citizenForm`)
              /* addNewRecord() */
            }
          >
            Accept & Continue
          </Button>
        </div>

        <div className={styles.row}></div>
      </Paper>
    </>
  );
};

export default Index;
