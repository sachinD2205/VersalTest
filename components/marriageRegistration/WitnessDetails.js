//
import React from "react";
import { useFormContext } from "react-hook-form";
import FormattedLabel from "../../containers/reuseableComponents/FormattedLabel";
import styles from "../marriageRegistration/view.module.css";
import Witness from "./Witness";

const WitnessDetails = () => {
  const {
    control,
    register,
    reset,
    formState: { errors },
  } = useFormContext();

  // View  -  Witness
  return (
    <>
      <div className={styles.small}>
        <h4
          style={{
            marginLeft: "40px",
            color: "red",
            fontStyle: "italic",
            marginTop: "25px",
          }}
        >
          <p>
            <blink className={styles.blink}>
              {<FormattedLabel id="onlyMHR" />}
            </blink>
          </p>
        </h4>
        <div className={styles.details}>
          <div className={styles.h1Tag}>
            <h3
              style={{
                color: "white",
                marginTop: "7px",
              }}
            >
              {" "}
              {<FormattedLabel id="witnessDetails" />}
            </h3>
          </div>
        </div>

        <Witness />
      </div>
    </>
  );
};
export default WitnessDetails;
