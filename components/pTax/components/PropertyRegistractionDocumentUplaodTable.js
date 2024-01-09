import React, { useEffect, useState } from "react";
import axios from "axios";
import urls from "../../../URLS/urls";
import sweetAlert from "sweetalert";
import { Add, Delete } from "@mui/icons-material";
import { Button, IconButton, MenuItem, Select, Tooltip } from "@mui/material";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import FormattedLabel from "../../../containers/reuseableComponents/FormattedLabel";
import { Controller, useFormContext } from "react-hook-form";
import { catchExceptionHandlingMethod } from "../../../util/util";
import { DecryptData, EncryptData } from "../../common/EncryptDecrypt";
import {
  useGetToken,
  useLanguage,
  useGetLoggedInUserDetails,
  useApplicantType,
} from "../../../containers/reuseableComponents/CustomHooks";
import UploadButtonPropertyRegistraction from "../fileUpload/UploadButtonPropertyRegistraction";

const Index = () => {
  const {
    control,
    register,
    reset,
    setValue,
    getValues,
    watch,
    clearErrors,
    formState: { errors },
  } = useFormContext();
  const language = useLanguage();
  const userToken = useGetToken();
  const applicantType = useApplicantType();
  const isDeptUser = useSelector(
    (state) => state?.user?.user?.userDao?.deptUser
  );
  const loggedInUserDetails = useGetLoggedInUserDetails();
  const userID = useSelector((state) => state?.user?.user?.id);
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  // callCatchMethod
  const callCatchMethod = (error, language) => {
    if (!catchMethodStatus) {
      setTimeout(() => {
        catchExceptionHandlingMethod(error, language);
        setCatchMethodStatus(false);
      }, [0]);
      setCatchMethodStatus(true);
    }
  };

  const columns = [
    {
      headerClassName: "cellColor",
      field: "srNo",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="srNo" />,
      width: 60,
    },
    {
      headerClassName: "cellColor",
      field: language == "en" ? "documentTypeEng" : "documentTypeMr",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="documentCategory" />,
      minWidth: 200,
      flex: 1,
    },
    {
      hide:
        watch("status") == "DRAFT" ||
        (localStorage.getItem("loggedInUser") == "citizenUser" &&
          watch("status") == "APPLICATION_CREATED")
          ? true
          : false,
      headerClassName: "cellColor",
      field: "documentStatus",
      // align: 'center',
      headerAlign: "center",
      headerName: <FormattedLabel id="status" />,
      minWidth: 200,
      flex: 0.4,
      renderCell: (params) => (
        <Select
          value={params?.row?.documentStatus}
          onChange={() => {
            console.log("dsf34234", params, watch("documents"));

            let updatedFieldObject = watch("documents")?.find(
              (data) => data?.documentId == params?.row?.documentId
            );
            let withoutUpdatedFieldObject = watch("documents")?.filter(
              (data) => data?.documentId != params?.row?.documentId
            );
            let updatedObject = {
              ...updatedFieldObject,
              documentStatus: params?.row?.documentStatus == "0" ? "1" : "0",
            };

            const temData = [...withoutUpdatedFieldObject, updatedObject];
            const sortedData = temData?.sort((a, b) => a?.srNo - b?.srNo);
            setValue("documents", sortedData);
            console.log("5465464654654", sortedData);
            console.log(
              "updatedFieldObjectwithoutUpdatedFieldObject",
              updatedFieldObject,
              updatedObject
            );
          }}
        >
          <MenuItem value="1">{"Approve"}</MenuItem>
          <MenuItem value="0">{"Rejected"}</MenuItem>
        </Select>
      ),
    },
    {
      headerClassName: "cellColor",
      field: "filePath",
      align: "center",
      headerAlign: "center",
      headerName: <FormattedLabel id="actions" />,
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => {
        return (
          <div style={{ margin: "4px 0px" }}>
            <UploadButtonPropertyRegistraction
              appName="HMS"
              serviceName="H-IssuanceofHawkerLicense"
              // fileName={params?.row?.fileName}
              // filePath={params?.row?.filePath}
              // fileId={params?.row?.id}
              allData={params}
            />
          </div>
        );
      },
    },
  ];

  //! =========================> view
  return (
    <div style={{ padding: "5vh" }}>
      <DataGrid
        autoHeight
        sx={{
          marginTop: "5vh",
          width: "100%",

          border: "1px solid rgb(128,128,128,0.5)",
          boxShadow: "0px 2px 5px 0px rgba(0,0,0,0.5)",

          "& .cellColor": {
            backgroundColor: "#125597",
            color: "white",
          },
        }}
        getRowId={(row) => row?.srNo}
        density="compact"
        hideFooter
        rows={
          watch("documents") != null &&
          watch("documents") != undefined &&
          watch("documents") != "" &&
          watch("documents").length >= 1
            ? watch("documents")
            : []
        }
        columns={columns}
        pageSize={100}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
};

export default Index;
