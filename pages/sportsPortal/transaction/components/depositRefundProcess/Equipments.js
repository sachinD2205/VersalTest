import React, { useEffect, useState } from "react";
import styles from "../../depositRefundProcess/deposit.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";
import {
  useGetToken,
  useLanguage,
} from "../../../../../containers/reuseableComponents/CustomHooks";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Add, Delete } from "@mui/icons-material";
import urls from "../../../../../URLS/urls";
import axios from "axios";

const Equipments = ({ penalty, setPenalty }) => {
  const language = useLanguage();
  const [equipmentDropDown, setEquipmentDropDown] = useState([]);
  const [enterOtherDetails, setEnterOtherDetails] = useState(false);
  const [namedEquipments, setNamedEquipments] = useState([]);
  const [otherDetails, setOtherDetails] = useState([]);

  const namedSchema = yup.object().shape({
    equipmentKey: yup
      .number()
      .required(
        language === "en"
          ? "Please select an equipment"
          : "कृपया एक उपकरण निवडा"
      )
      .typeError(
        language === "en"
          ? "Please select an equipment"
          : "कृपया एक उपकरण निवडा"
      ),
    quantity: yup
      .number()
      .required(
        language === "en"
          ? "Please enter quantity"
          : "कृपया प्रमाण प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter quantity"
          : "कृपया प्रमाण प्रविष्ट करा"
      ),
  });

  const otherSchema = yup.object().shape({
    otherDetailsEn: yup
      .string()
      .required(
        language === "en"
          ? "Please enter details in english"
          : "कृपया इंग्रजीमध्ये तपशील प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter details in english"
          : "कृपया इंग्रजीमध्ये तपशील प्रविष्ट करा"
      ),
    otherDetailsMr: yup
      .string()
      .required(
        language === "en"
          ? "Please enter details in marathi"
          : "कृपया मराठीत तपशील प्रविष्ट करा"
      )
      .typeError(
        language === "en"
          ? "Please enter details in marathi"
          : "कृपया मराठीत तपशील प्रविष्ट करा"
      ),
    charge: yup
      .number()
      .required(
        language === "en" ? "Please enter a charge" : "कृपया एक उपकरण निवडा"
      )
      .typeError(
        language === "en" ? "Please enter a charge" : "कृपया एक उपकरण निवडा"
      ),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    // watch,
    formState: { errors: error },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(namedSchema),
  });

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    reset: reset2,
    // watch,
    formState: { errors: error2 },
  } = useForm({
    criteriaMode: "all",
    resolver: yupResolver(otherSchema),
  });

  const userToken = useGetToken();

  useEffect(() => {
    axios
      .get(`${urls.SPURL}/equipment/getAll`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((res) => {
        setEquipmentDropDown(
          res?.data?.equipmentMaster?.map((obj) => ({
            id: obj?.id,
            equipmentNameEn: obj?.equipmentNameEng,
            equipmentNameMr: obj?.equipmentNameMr,
            rate: obj?.rate,
          }))
        );
      });
  }, []);

  useEffect(() => {
    let totalCount = 0;
    namedEquipments?.forEach((obj) => {
      totalCount += obj?.calculatedCharge;
    });
    setPenalty((prev) => ({ ...prev, equipmentCharges: totalCount }));
  }, [namedEquipments]);

  useEffect(() => {
    let totalCount2 = 0;
    otherDetails?.forEach((obj) => {
      totalCount2 += obj?.charge;
    });
    setPenalty((prev) => ({ ...prev, otherCharges: totalCount2 }));
  }, [otherDetails]);

  const discardOtherDetails = (checkedValue) => {
    if (!checkedValue) {
      if (!!otherDetails?.length) {
        sweetAlert({
          title: language === "en" ? "Confirmation" : "पुष्टीकरण",
          text:
            language === "en"
              ? "This will discard all the entered Other Charges. Are you sure u want to continue ?"
              : "हे सर्व प्रविष्ट केलेले इतर शुल्क हटवेल. तुम्हाला खात्री आहे की तुम्हाला पुढे जायचे आहे?",
          icon: "warning",
          buttons: [
            language === "en" ? "No" : "नाही",
            language === "en" ? "Yes" : "होय",
          ],
        }).then((ok) => {
          if (ok) {
            setOtherDetails([]);
            setEnterOtherDetails(checkedValue);
          }
        });
      } else {
        setEnterOtherDetails(checkedValue);
      }
    } else {
      setEnterOtherDetails(checkedValue);
    }
  };

  const columnsNamed = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
    },
    {
      field: language == "en" ? "equipmentNameEn" : "equipmentNameMr",
      headerName: <FormattedLabel id="equipmentName" />,
      width: 300,
    },
    {
      field: "quantity",
      headerName: <FormattedLabel id="quantity" />,
      width: 175,
    },
    {
      field: "rate",
      headerName: <FormattedLabel id="rate" />,
      width: 175,
      align: "center",
    },
    {
      field: "calculatedCharge",
      headerName: <FormattedLabel id="calculatedCharge" />,
      width: 175,
    },
    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
    },
  ];

  const columnsOther = [
    {
      field: "srNo",
      headerName: <FormattedLabel id="srNo" />,
      width: 100,
      align: "center",
    },
    {
      field: "otherDetailsEn",
      headerName: <FormattedLabel id="otherEn" />,
      width: 320,
      align: "center",
    },
    {
      field: "otherDetailsMr",
      headerName: <FormattedLabel id="otherMr" />,
      width: 320,
      align: "center",
    },
    {
      field: "charge",
      headerName: <FormattedLabel id="charge" />,
      width: 180,
      align: "center",
    },

    {
      field: "actions",
      headerName: <FormattedLabel id="actions" />,
      width: 120,
      align: "center",
    },
  ];

  const deleteBySrNo = (toDeleteSrNo, namedOrOther) => {
    namedOrOther((prev) =>
      prev
        ?.filter((equipments) => equipments?.srNo != toDeleteSrNo)
        ?.map((j, i) => ({ ...j, srNo: i + 1 }))
    );
  };

  const addEquipments = (data) => {
    setNamedEquipments((prev) =>
      [
        ...prev,
        {
          ...data,
          equipmentNameEn: equipmentDropDown?.find(
            (obj) => obj?.id == data?.equipmentKey
          )?.equipmentNameEn,
          equipmentNameMr: equipmentDropDown?.find(
            (obj) => obj?.id == data?.equipmentKey
          )?.equipmentNameMr,
          calculatedCharge: data?.rate * data?.quantity,
        },
      ]?.map((j, i) => ({ ...j, srNo: i + 1 }))
    );

    reset({
      equipmentKey: null,
      rate: null,
      quantity: null,
    });
  };

  const addOtherEquipments = (data) => {
    setOtherDetails((prev) =>
      [...prev, data]?.map((j, i) => ({ ...j, srNo: i + 1 }))
    );

    reset2({
      otherDetailsEn: "",
      otherDetailsMr: "",
      charge: null,
    });
  };

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="equipmentsDetails" />
      </div>

      <form className={styles.row} onSubmit={handleSubmit(addEquipments)}>
        <FormControl variant="standard" error={!!error.equipmentKey}>
          <InputLabel id="demo-simple-select-standard-label">
            <FormattedLabel id="equipmentName" />
          </InputLabel>
          <Controller
            render={({ field }) => (
              <Select
                sx={{ width: 250 }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                // @ts-ignore
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  setValue(
                    "rate",
                    equipmentDropDown?.find((j) => j?.id == value.target.value)
                      ?.rate
                  );
                }}
                label="equipmentKey"
              >
                {equipmentDropDown &&
                  equipmentDropDown?.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={
                        //@ts-ignore
                        value.id
                      }
                    >
                      {language == "en"
                        ? //@ts-ignore
                          value?.equipmentNameEn
                        : // @ts-ignore
                          value?.equipmentNameMr}
                    </MenuItem>
                  ))}
              </Select>
            )}
            name="equipmentKey"
            control={control}
            defaultValue=""
          />
          <FormHelperText>
            {error?.equipmentKey ? error.equipmentKey.message : null}
          </FormHelperText>
        </FormControl>

        <TextField
          sx={{ width: 250 }}
          label={<FormattedLabel id="quantity" />}
          // @ts-ignore
          variant="standard"
          {...register("quantity")}
          InputLabelProps={{
            shrink: !!watch("quantity"),
          }}
          error={!!error.quantity}
          helperText={error?.quantity ? error.quantity.message : null}
        />
        <TextField
          disabled
          sx={{ width: 250 }}
          label={<FormattedLabel id="rate" />}
          // @ts-ignore
          variant="standard"
          {...register("rate")}
          InputLabelProps={{
            shrink: !!watch("rate"),
          }}
          error={!!error.rate}
          helperText={error?.rate ? error.rate.message : null}
        />
        <Button variant="contained" type="submit" endIcon={<Add />}>
          <FormattedLabel id="add" textCase="uppercase" />
        </Button>
      </form>

      <table className={styles.table}>
        <tbody>
          <tr>
            {columnsNamed?.map((col) => (
              <th style={{ width: col?.width }}>{col.headerName}</th>
            ))}
          </tr>
          {!!namedEquipments?.length ? (
            namedEquipments?.map((row) => (
              <tr>
                {columnsNamed?.map((col) => (
                  <td style={{ textAlign: col?.align ?? "inherit" }}>
                    {col.field == "actions" ? (
                      <IconButton
                        style={{
                          color: "red",
                          textAlign: "center",
                        }}
                        onClick={() =>
                          deleteBySrNo(row?.srNo, setNamedEquipments)
                        }
                      >
                        <Delete />
                      </IconButton>
                    ) : (
                      row[col?.field]
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colspan={columnsNamed?.length}
                style={{ textAlign: "center" }}
              >
                <FormattedLabel id="noDataAdded" />
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={4} style={{ textAlign: "right" }}>
              <FormattedLabel id="total" textCase="uppercase" />
            </td>
            <td colSpan={2}>
              <b>{penalty?.equipmentCharges}</b>
            </td>
          </tr>
        </tbody>
      </table>

      <div style={{ width: "100%", marginTop: "30px", textAlign: "center" }}>
        <FormControl>
          <FormControlLabel
            label={<FormattedLabel id="otherCharges" bold />}
            control={
              <Checkbox
                // onChange={(e) => setEnterOtherDetails(e.target.checked)}
                onChange={(e) => discardOtherDetails(e.target.checked)}
                checked={enterOtherDetails}
              />
            }
          />
        </FormControl>
      </div>
      {enterOtherDetails && (
        <>
          <form
            className={styles.row}
            onSubmit={handleSubmit2(addOtherEquipments)}
          >
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="otherEn" />}
              // @ts-ignore
              variant="standard"
              {...register2("otherDetailsEn")}
              InputLabelProps={{
                shrink: !!watch2("otherDetailsEn"),
              }}
              error={!!error2.otherDetailsEn}
              helperText={
                error2?.otherDetailsEn ? error2.otherDetailsEn.message : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="otherMr" />}
              // @ts-ignore
              variant="standard"
              {...register2("otherDetailsMr")}
              InputLabelProps={{
                shrink: !!watch2("otherDetailsMr"),
              }}
              error={!!error2.otherDetailsMr}
              helperText={
                error2?.otherDetailsMr ? error2.otherDetailsMr.message : null
              }
            />
            <TextField
              sx={{ width: 250 }}
              label={<FormattedLabel id="charge" />}
              // @ts-ignore
              variant="standard"
              {...register2("charge")}
              InputLabelProps={{
                shrink: !!watch2("charge"),
              }}
              error={!!error2.charge}
              helperText={error2?.charge ? error2.charge.message : null}
            />
            <Button variant="contained" type="submit" endIcon={<Add />}>
              <FormattedLabel id="add" textCase="uppercase" />
            </Button>
          </form>

          <table className={styles.table}>
            <tbody>
              <tr>
                {columnsOther?.map((col) => (
                  <th style={{ width: col?.width }}>{col.headerName}</th>
                ))}
              </tr>
              {!!otherDetails?.length ? (
                otherDetails?.map((row) => (
                  <tr>
                    {columnsOther?.map((col) => (
                      <td style={{ textAlign: col?.align ?? "inherit" }}>
                        {col.field == "actions" ? (
                          <IconButton
                            style={{
                              color: "red",
                              textAlign: "center",
                            }}
                            onClick={() =>
                              deleteBySrNo(row?.srNo, setOtherDetails)
                            }
                          >
                            <Delete />
                          </IconButton>
                        ) : (
                          row[col?.field]
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colspan={columnsOther?.length}
                    style={{ textAlign: "center" }}
                  >
                    <FormattedLabel id="noDataAdded" />
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={4} style={{ textAlign: "right" }}>
                  <FormattedLabel id="total" textCase="uppercase" />
                </td>
                <td colSpan={2}>
                  <b>{penalty?.otherCharges}</b>
                </td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </>
  );
};

export default Equipments;
