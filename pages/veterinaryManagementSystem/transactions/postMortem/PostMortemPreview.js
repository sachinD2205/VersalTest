import React, { useEffect, useState } from "react";
import styles from "./preview.module.css";
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel";
import moment from "moment";

const PostMortemPreview = ({ data }) => {
  const [biologicalTests, setBiologicalTests] = useState([
    "blood",
    "urine",
    "discharge",
    "biopsy",
  ]);

  useEffect(() => {
    setBiologicalTests(biologicalTests?.filter((obj) => !!data[obj]));
  }, []);

  return (
    <div className={styles.previewWrapper}>
      <div className={styles.header}>
        <img src="/logo.png" alt="pcmc logo" width={120} height={120} />
        <div className={styles.centerHeader}>
          <h2>Pimpri-Chinchwad Municipal Corporation</h2>
          <h1>Nisargakavi Bahinabai Choudhary Pranisangrahalay</h1>
          <h2>Sambhaji Nagar, Chinchwad, Pune - 411 019</h2>
        </div>
      </div>
      <div className={styles.dividerWrapper}>
        <div className={styles.divider} />
      </div>
      <center>
        <h2 style={{ marginTop: 20 }}>Post-Mortem Report</h2>
      </center>
      <div className={styles.subHeader}>
        <label>
          <FormattedLabel id="microchipNo" />: <b>{data?.microchipNo}</b>
        </label>
        <label>
          <FormattedLabel id="date" />: <b>{data?.dateOfPostMortem}</b>
        </label>
      </div>
      <table className={styles.startDetails}>
        <tbody>
          <tr>
            <th style={{ width: 200 }}>
              <FormattedLabel id="commonName" />
            </th>
            <th style={{ width: 250 }}>
              <FormattedLabel id="scientificName" />
            </th>
            <th style={{ width: 150 }}>
              <FormattedLabel id="personalName" />
            </th>
            <th style={{ width: 100 }}>
              <FormattedLabel id="sex" />
            </th>
            <th style={{ width: 100 }}>
              <FormattedLabel id="age" />
            </th>
            <th style={{ width: 100 }}>
              <FormattedLabel id="size" />
            </th>
            <th style={{ width: 100 }}>
              <FormattedLabel id="weight" />
            </th>
          </tr>
          <tr>
            <td style={{ width: 200 }}>
              {data?.personalName ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 250 }}>
              {data?.scientificName ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 150 }}>
              {data?.personalName ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 100 }}>
              {data?.animalGender ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 100 }}>
              {data?.age ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 100 }}>
              {data?.size ?? <FormattedLabel id="dataNotFound" />}
            </td>
            <td style={{ width: 100 }}>
              {data?.animalWeight + " kg" ?? (
                <FormattedLabel id="dataNotFound" />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="dateTimeAndPlaceOfDeath" bold />:{" "}
          {data?.dateOfDeath +
            " " +
            data?.timeOfDeath +
            ", " +
            data?.placeOfDeath ?? "---"}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="shortHistoryOfIllness" bold />:{" "}
          {data?.historyOfIllness}
        </label>
      </div>

      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="animalDescription" bold />:{" "}
          {data?.animalDescription}
        </label>
      </div>

      <h3 style={{ marginTop: 20, marginBottom: 20, textAlign: "center" }}>
        <FormattedLabel id="organWiseDescription" bold textCase="uppercase" />
      </h3>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="headAndNeck" bold />: {data?.headAndNeck}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="thoraxAndThoracicCavity" bold />:{" "}
          {data?.thoraxAndThoracicCavity}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="abdomenAndAbdominalCavity" bold />:{" "}
          {data?.abdomenAndAbdominalCavity}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="pelvicGirdle" bold />:
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="pelvicGirdle" bold />: {data?.pelvicGirdle}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="limbs" bold />: {data?.limbs}
        </label>
      </div>
      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="otherExaminationOrObservation" bold />:{" "}
          {data?.otherExaminationOrObservation}
        </label>
      </div>

      <h3
        style={{
          marginTop: 20,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <FormattedLabel id="biologicalTestsDone" bold textCase="uppercase" />:{" "}
        {biologicalTests
          // .filter((obj) => !!data[obj])
          .map((obj, i) => (
            <>
              <FormattedLabel id={obj} />
              {i != biologicalTests?.length - 1 && ", "}
            </>
          ))}
      </h3>
      {biologicalTests
        // .filter((obj) => !!data[obj])
        .map((obj) => (
          <div className={styles.detailsContainer}>
            <label>
              <FormattedLabel id={obj} bold />: {data[obj]}
            </label>
          </div>
        ))}

      <div className={styles.detailsContainer}>
        <label>
          <FormattedLabel id="opinionIfAny" bold />: {data?.opinion}
        </label>
      </div>

      <div
        className={styles.detailsContainer}
        style={{ display: "flex", flexDirection: "column", rowGap: 5 }}
      >
        <label>
          <FormattedLabel id="date" bold />:{" "}
          {moment(new Date()).format("DD-MM-YYYY")}
        </label>
        <label>
          <FormattedLabel id="time" bold />:{" "}
          {/* {moment(new Date()).format("HH:mm:ss")} */}
          {moment(new Date()).format("HH:mm")}
        </label>
        <label>
          <FormattedLabel id="place" bold />:
        </label>
      </div>
    </div>
  );
};

export default PostMortemPreview;
