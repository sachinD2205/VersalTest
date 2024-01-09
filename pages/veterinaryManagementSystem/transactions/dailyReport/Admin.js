import React from "react";
import styles from "./dailyReport.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";

const Index = ({ roleSetter }) => {
  const roles = [
    {
      formattedLabel: "entry",
      role: "ENTRY",
    },
    {
      formattedLabel: "vetDoc",
      role: "APPROVAL",
    },
    {
      formattedLabel: "curator",
      role: "FINAL_APPROVAL",
    },
  ];
  return (
    <div className={styles.centerDiv}>
      {roles.map((j) => {
        return (
          <label
            key={j.role}
            className={styles.card}
            onClick={() => roleSetter([j.role])}
          >
            {<FormattedLabel id={j.formattedLabel} />}
          </label>
        );
      })}
    </div>
  );
};

export default Index;
