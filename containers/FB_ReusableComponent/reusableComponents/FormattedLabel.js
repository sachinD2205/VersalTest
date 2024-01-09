import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const FormattedLabel = ({ id }) => {
  const router = useRouter();
  // @ts-ignore
  const labels = useSelector((state) => {
    console.log("ABCD", state.labels.labels);
    return state?.labels.labels;
  });
  // @ts-ignore
  const language = useSelector((state) => state?.labels.language);

  const path = router.asPath.split("/");

  const [value, setValue] = useState("");

  useEffect(() => {
    FindLabel();
  }, [language]);

  //Old
  // function FindLabel() {
  //   if (path.length < 3) {
  //     labels.forEach((element) => {
  //       if (element.lang === language) {
  //         setValue(element[id]);
  //       }
  //     });
  //   } else {
  //     labels.forEach((element) => {
  //       if (element.lang === language) {
  //         if (element.formType === path[2]) {
  //           setValue(element[id]);
  //         }
  //       }
  //     });
  //   }
  // }

  //New

  function FindLabel() {
    if (path.length < 3) {
      labels[language].forEach((arg) => {
        if (arg.type === "commonLabels") {
          setValue(arg[id]);
        }
      });
    } else {
      labels[language].forEach((arg) => {
        if (arg.type === path[2]) {
          setValue(arg[id]);
        }
      });
    }
  }

  return <>{value}</>;
};

export default FormattedLabel;
