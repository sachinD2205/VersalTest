import {
  FilledInput,
  FormGroup,
  Grid,
  Input,
  OutlinedInput,
  Paper,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Button } from "antd";
// import styles from "./view.module.css";
import styles from "../../../../styles/LegalCase_Styles/responseToNotice.module.css";

import React, { useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Controller,
  useFormContext,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Box, ThemeProvider } from "@mui/system";
import FormControl, { useFormControl } from "@mui/material/FormControl";
import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import TextArea from "antd/lib/input/TextArea";
import { useRouter } from "next/router";
const ParawiseReportAdd = () => {
  // const {
  //   control,
  //   register,
  //   reset,
  //   formState: { errors },
  // } = useForm(
  //   defaultValues: {
  //     parawiseReportDao: [
  //       { issueNo: "", paragraphWiseAanswerDraftOfIssues: "" },
  //     ]
  //   }
  // );

  const {
    control,
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      responseToNotice: [
        { issueNo: "", paragraphWiseAanswerDraftOfIssues: "" },
      ],
    },
  });

  const router = useRouter();

  useEffect(() => {
    console.log("router.query", router.query);
  }, []);

  const theme1 = createTheme({
    scrollBar: {
      "&::-webkit-scrollbar": {
        width: "0.4em",
      },
      "&::-webkit-scrollbar-track": {
        "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "rgba(0,0,0,.1)",
        outline: "1px solid slategrey",
      },
    },
  });

  // const styles = (theme: Theme) =>
  //   createStyles({

  //     scrollBar: {
  //       "&::-webkit-scrollbar": {
  //         width: "0.4em",
  //       },
  //       "&::-webkit-scrollbar-track": {
  //         "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
  //       },
  //       "&::-webkit-scrollbar-thumb": {
  //         backgroundColor: "rgba(0,0,0,.1)",
  //         outline: "1px solid slategrey",
  //       },
  //     },

  //   });

  // const styles = (theme) => ({
  //   "@global": {
  //     "*::-webkit-scrollbar": {
  //       width: "0.4em",
  //     },
  //     "*::-webkit-scrollbar-track": {
  //       "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)",
  //     },
  //     "*::-webkit-scrollbar-thumb": {
  //       backgroundColor: "rgba(0,0,0,.1)",
  //       outline: "1px solid slategrey",
  //     },
  //   },
  // });

  //key={field.id}
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "responseToNotice",
      defaultValues: {
        responseToNotice: [
          { issueNo: "", paragraphWiseAanswerDraftOfIssues: "" },
        ],
      },
      // unique name for your Field Array
    }
  );

  return (
    <>
      {/* <ThemeProvider theme={theme1}> */}
      <Box>
        <Grid container>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid gray",
            }}
          >
            <h3>Point No</h3>
          </Grid>
          <Grid
            item
            xs={10}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid gray",
            }}
          >
            <h3>Points Explanation</h3>
          </Grid>
          <Grid
            item
            xs={1}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "1px solid gray",
            }}
          >
            <Button
              onClick={() =>
                append({
                  // srNO: "",
                  issueNo: "",
                  paragraphWiseAanswerDraftOfIssues: "",
                })
              }
              // color="#e0e0e0"
              style={{
                // background: "#e0e0e0",
                backgroundColor: "LightGray",
                // background: "#89CFF0",
              }}
            >
              ADD
              {/* + */}
            </Button>
          </Grid>
        </Grid>
        <Box
          overflow="auto"
          height={250}
          flex={1}
          flexDirection="column"
          display="flex"
          p={2}
          padding="0px"
        >
          {fields.map((parawise, index) => {
            return (
              <>
                <Grid
                  container
                  className={styles.theme2}
                  component={Box}
                  style={{ marginTop: 20 }}
                >
                  <Grid
                    item
                    xs={2}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <TextField
                      placeholder="Issue No"
                      size="small"
                      type="number"
                      // oninput="auto_height(this)"
                      {...register(`responseToNotice.${index}.issueNo`)}
                    ></TextField>
                  </Grid>
                  <Grid
                    item
                    xs={8}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <TextField // style={auto_height_style}
                      // rows="1"
                      style={{ width: 500 }}
                      multiline
                      rows={3}
                      placeholder="Paragraph Wise Aanswer Draft Of Issues"
                      size="small"
                      // oninput="auto_height(this)"
                      {...register(
                        `responseToNotice.${index}.paragraphWiseAanswerDraftOfIssues`
                      )}
                    ></TextField>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      style={{
                        color: "white",
                        backgroundColor: "red",
                      }}
                      onClick={() => {
                        // remove({
                        //   applicationName: "",
                        //   roleName: "",
                        // });
                        remove(index);
                      }}
                    >
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </>
            );
          })}
          {/* </ThemeProvider> */}
        </Box>
      </Box>
    </>
  );
};

export default ParawiseReportAdd;
