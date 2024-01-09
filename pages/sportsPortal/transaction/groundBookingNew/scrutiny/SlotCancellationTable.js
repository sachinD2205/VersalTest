import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import urls from "../../../../../URLS/urls.js";
import Loader from "../../../../../containers/Layout/components/Loader/index.js";
import { useGetToken } from "../../../../../containers/reuseableComponents/CustomHooks.js";
import { catchExceptionHandlingMethod } from "../../../../../util/util.js";


// Loi Generation
const SlotCancellationTable = () => {
  const language = useSelector((state) => state?.labels.language);
  // Methods in useForm
  // destructure values from methods
  const {
    control,
    register,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const userToken = useGetToken();
  const [catchMethodStatus, setCatchMethodStatus] = useState(false);
  const [loadderState, setLoadderState] = useState()
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




  // columns
  const columns = [
    {
      field: "srNo",
      headerName: "Sr No",
      width: 100,
    },
    {
      field: "fromDate",
      headerName: "Date",
      flex: 1,
    },
    {
      field: "fromBookingTime",
      headerName: "From Booking Time",
      flex: 1,
    },

    {
      field: "toBookingTime",
      headerName: "To Booking Time",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Action",
      width: 120,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        // console.log("param23432432", params?.row)
        return (
          <input
            type="checkbox"
            checked={params?.row?.checked}
            // onChange={handleCheckboxChange(event)}
            onChange={() => {

              const tempData = watch("groundBookingCancelledSlot")?.filter(data => data?.id != params?.row?.id)
              const temp1Data = {
                ...params?.row,
                checked: !params?.row?.checked
              }

              setValue("groundBookingCancelledSlot", [...tempData, temp1Data].sort((data1, data2) => data1?.srNo - data2?.srNo))

              console.log("sfsdflk543534", params?.row?.id, params?.row?.checked, params?.row, tempData, temp1Data)




            }}
          />
        );
      },
    },
  ];

  // getBookedSlotDetails
  const getBookedSlotDetails = () => {
    setLoadderState(true);
    const url = `${urls.SPURL}/groundBooking/getSlotsDtlByBookingIdAndGroundBookingKey`;
    const finalBodyForApi = {
      bookingId: watch("bookingIds") != null && watch("bookingIds") != "" && watch("bookingIds") != undefined ? watch("bookingIds").split(",").map(data => Number(data)) : null,
      groundBookingKey: watch("id")
    }

    console.log("finalBodyForApi", finalBodyForApi)
    axios
      .post(url, finalBodyForApi, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        if (res?.status == 200 || res?.status == 201) {
          console.log("sdlfjdslfjdsklfjdsklfjdsklj", res?.data?.groundSlotsDaos);
          let data = [];
          if (res?.data?.groundSlotsDaos != null && res?.data?.groundSlotsDaos != undefined && res?.data?.groundSlotsDaos.length != 0) {
            data = res?.data?.groundSlotsDaos?.map((data, index) => {
              return {
                ...data,
                fromDate: data?.fromDate != null && data?.fromDate != undefined && data?.fromData != "" ? moment(data?.fromDate).format("DD-MM-YYYY") : null,
                srNo: index + 1,
                checked: false
              }
            })
          } else {
            data = []
          }
          console.log("data", data)
          setValue("groundBookingCancelledSlot", data)
          setLoadderState(false);
        } else {
          setLoadderState(false);
        }
      })
      .catch((error) => {
        setLoadderState(false);
        callCatchMethod(error, language);
      });
  }







  //!======================= useEffect

  useEffect(() => {
    console.log("fdlskfjlkdsfjdsl", watch("id"), watch("bookingIds"))
    if (watch("id") != null && watch("id") != undefined && watch("id") != "" && watch("bookingIds") != null && watch("bookingIds") != undefined && watch("bookingIds") != "") {
      getBookedSlotDetails()
    }
  }, [watch("id"), watch("bookingIds")])





  // !================================ view
  return (
    <>
      {loadderState ? (
        <Loader />
      ) : (
        <>
          <h2
            style={{
              fontSize: "20",
              color: "white",
              marginTop: "7px",
            }}
          >
            Slot Details
          </h2>
          <DataGrid
            sx={{
              marginLeft: 3,
              marginRight: 3,
              marginTop: 3,
              marginBottom: 2,
              overflowY: "scroll",

              "& .MuiDataGrid-virtualScrollerContent": {},
              "& .MuiDataGrid-columnHeadersInner": {
                backgroundColor: "#556CD6",
                color: "white",
              },

              "& .MuiDataGrid-cell:hover": {
                color: "primary.main",
              },
            }}
            density="compact"
            autoHeight
            scrollbarSize={17}
            rows={watch("groundBookingCancelledSlot") != undefined && watch("groundBookingCancelledSlot") != null && watch("groundBookingCancelledSlot").length != 0 ? watch("groundBookingCancelledSlot") : []}
            columns={columns}
          />
        </>
      )}
    </>
  );
};

export default SlotCancellationTable;
