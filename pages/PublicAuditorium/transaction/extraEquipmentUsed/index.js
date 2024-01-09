import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import schema from "../../../../containers/schema/publicAuditorium/transactions/extraEquipmemtUsed";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import urls from "../../../../URLS/urls";
import { useSelector } from "react-redux";

const ExtraEquipmentUsed = () => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      levelsOfRolesDaoList: [
        { equipment: "", quantity: "", rate: "", total: "" },
      ],
    },
  });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      name: "levelsOfRolesDaoList",
      control,
    }
  );

  const language = useSelector((state) => state.labels.language);
  const token = useSelector((state) => state.user.user.token);
  const [equipments, setEquipments] = useState([]);
  const [equipmentCharges, setEquipmentCharges] = useState([]);

  useEffect(() => {
    getEquipment();
    getEquipmentCharges();
  }, []);

  const getEquipment = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipment/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res equipment", res);
        setEquipments(res?.data?.mstEquipmentList);
      });
  };

  const getEquipmentCharges = () => {
    axios
      .get(`${urls.PABBMURL}/mstEquipmentCharges/getAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("res equipment charges", res);
        setEquipmentCharges(res?.data?.mstEquipmentChargesList);
      });
  };

  const appendUI = () => {
    append({
      equipment: "",
      quantity: "",
      rate: "",
      total: "",
    });
  };

  const exitButton = () => {
    // router.push('/')
  };

  const onSubmitForm = (formData) => {
    console.log("formData", formData);
  };

  return (
    <div>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
          background:
            "linear-gradient(to right bottom, rgb(7 110 230 / 91%) 2%,rgb(111 242 249) 100%)",
        }}
      >
        <h2>Extra Equipments Used</h2>
      </Box>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Accordion sx={{ padding: "10px" }} defaultExpanded>
          <AccordionSummary
            sx={{
              backgroundColor: "#0070f3",
              color: "white",
              textTransform: "uppercase",
            }}
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            backgroundColor="#0070f3"
          >
            <Typography>Equipments</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              style={{
                display: "flex",
                justifyContent: "end",
                marginBottom: "10px",
              }}
            >
              <Button
                variant="contained"
                size="small"
                endIcon={<AddBoxOutlinedIcon />}
                onClick={() => {
                  appendUI();
                }}
              >
                Add More
              </Button>
            </Box>
            <Grid container>
              {fields.map((witness, index) => {
                return (
                  <>
                    <Grid
                      container
                      key={index}
                      sx={{
                        backgroundColor: "#E8F6F3",
                        padding: "5px",
                      }}
                    >
                      <Grid
                        item
                        xs={5}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FormControl style={{ width: "90%" }} size="small">
                          <InputLabel id="demo-simple-select-label">
                            Equipment
                          </InputLabel>
                          <Controller
                            render={({ field }) => (
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Equipment"
                                value={field.value}
                                onChange={(value) => {
                                  field.onChange(value);
                                  // console.log("value",value.target.value);
                                  let df = equipmentCharges.find((val) => {
                                    return (
                                      val.equipmentName == value.target.value &&
                                      val.totalAmount
                                    );
                                  });
                                  setValue(
                                    `levelsOfRolesDaoList.${index}.rate`,
                                    df.totalAmount
                                  );
                                }}
                                style={{ backgroundColor: "white" }}
                              >
                                {equipments.length > 0
                                  ? equipments.map((val, id) => {
                                      return (
                                        <MenuItem key={id} value={val.id}>
                                          {language === "en"
                                            ? val.equipmentNameEn
                                            : val.equipmentNameMr}
                                        </MenuItem>
                                      );
                                    })
                                  : "Not Available"}
                              </Select>
                            )}
                            name={`levelsOfRolesDaoList.${index}.equipment`}
                            control={control}
                            defaultValue=""
                            key={witness.id}
                          />
                          <FormHelperText style={{ color: "red" }}>
                            {errors?.departmentName
                              ? errors.departmentName.message
                              : null}
                          </FormHelperText>
                        </FormControl>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          size="small"
                          id="outlined-basic"
                          label="Rate"
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          style={{ backgroundColor: "white" }}
                          {...register(`levelsOfRolesDaoList.${index}.rate`)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          size="small"
                          id="outlined-basic"
                          label="Quantity"
                          variant="outlined"
                          // key={witness.id}
                          style={{ backgroundColor: "white" }}
                          {...register(
                            `levelsOfRolesDaoList.${index}.quantity`
                          )}
                          key={witness.id}
                          // name={`levelsOfRolesDaoList[${index}].quantity`}
                          inputRef={register()}
                          onChange={(event) => {
                            const { value } = event.target;
                            setValue(
                              `levelsOfRolesDaoList[${index}].total`,
                              value *
                                watch(`levelsOfRolesDaoList.${index}.rate`)
                            );
                          }}
                          error={
                            errors?.levelsOfRolesDaoList?.[index]?.quantity
                          }
                          helperText={
                            errors?.levelsOfRolesDaoList?.[index]?.quantity
                              ? errors.levelsOfRolesDaoList?.[index]?.quantity
                                  .message
                              : null
                          }
                        />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          sx={{ width: "90%" }}
                          size="small"
                          id="outlined-basic"
                          label="Total"
                          disabled
                          InputLabelProps={{
                            shrink: true,
                          }}
                          variant="outlined"
                          style={{ backgroundColor: "white" }}
                          {...register(`levelsOfRolesDaoList.${index}.total`)}
                        />
                      </Grid>

                      {/* {router.query.mode === "view" ? (
                                  <></>
                                ) : (
                                  <> */}
                      <Grid
                        item
                        xs={1}
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <IconButton color="error" onClick={() => remove(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                      {/* </>
                                )} */}
                    </Grid>
                  </>
                );
              })}
            </Grid>
          </AccordionDetails>
        </Accordion>
        <Grid container style={{ padding: "10px" }}>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              type="submit"
              variant="contained"
              color="success"
              endIcon={<SaveIcon />}
            >
              Save
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              variant="contained"
              color="error"
              endIcon={<ExitToAppIcon />}
              onClick={() => exitButton()}
            >
              Exit
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default ExtraEquipmentUsed;
