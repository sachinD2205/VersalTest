import React from "react";
import { useFormContext } from "react-hook-form";
import NewsPapers from "./newsPapers";
import styles from "./view.module.css";
import { useSelector } from "react-redux";

const NewsPaperDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();
  const language = useSelector((state) => state?.labels.language);

  return (
    <>
      <div className={styles.small}>
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {language == "en" ? "NewsPapers" : "वृत्तपत्रे"}
            </h3>
          </div>
        </div>

        <NewsPapers />
      </div>
    </>
  );
};
export default NewsPaperDetails;
