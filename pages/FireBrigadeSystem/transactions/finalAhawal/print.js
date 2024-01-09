import React, { useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import ReactToPrint from "react-to-print";
import ComponentToPrint from "./forPrint";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import axios from "axios";
import urls from "../../../../URLS/urls";

export default function Print() {
  const [data, setData] = useState();

  const router = useRouter();
  const {
    register,
    control,
    handleSubmit,
    methods,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    criteriaMode: "all",
    // resolver: yupResolver(schema),
    mode: "onChange",
  });

  console.log("hello", router.query);

  // const getById = (appId) => {
  //   axios
  //     .get(
  //       `${urls.FbsURL}/transaction/trnEmergencyServices/getById?appId=${appId}`
  //     )
  //     .then((res) => {
  //       // setValue("typeOfVardiId", res?.data?.typeOfVardiId);
  //       // reset(res.data.vardiSlip);
  //       // setValue("id", res.data.id);
  //       console.log("res.data**", res.data);
  //       setData(res.data);
  //     });
  // };

  useEffect(() => {
    if (router.query.pageMode == "Edit") {
      console.log("hello", router.query);
      reset(router.query);
      // setData(router.query);
      // getById(router.query.id);
    }
  }, []);

  let componentRef = useRef();

  return (
    <>
      <div>
        {/* button to trigger printing of target component */}
        <ReactToPrint
          // trigger={() => <Button>Print this out!</Button>}
          trigger={() => <></>}
          content={() => componentRef}
        />

        {/* component to be printed */}
        <ComponentToPrint ref={(el) => (componentRef = el)} stateData={data} />
      </div>
    </>
  );
}
