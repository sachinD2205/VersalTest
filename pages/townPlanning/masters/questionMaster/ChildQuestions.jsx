import {
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import { Controller, useFieldArray } from "react-hook-form"
import Transliteration from "../../../../components/common/linguosol/transliteration"
import AddIcon from "@mui/icons-material/Add"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import ChildAnswers from "./ChildAnswers"
import DeleteIcon from "@mui/icons-material/Delete"

const ChildQuestions = ({
  errors,
  control,
  answerTypeData,
  watch,
  checkListTypeData,
  register,
  reset,
  editMode,
}) => {
  const {
    fields: subQuestions,
    append: appendChildQuestions,
    remove: removeChildQuestions,
  } = useFieldArray({
    control,
    name: "subQuestions",
  })

  const funcForConditions = (childIndex) => {
    if (watch(`subQuestions[${childIndex}].answerType`) == "Select") {
      return watch(`subQuestions[${childIndex}].answerType`) == "Select"
    } else if (watch(`subQuestions[${childIndex}].answerType`) == "Radio") {
      return watch(`subQuestions[${childIndex}].answerType`) == "Radio"
    }
  }

  return (
    <>
      {subQuestions?.map((item, childIndex) => {
        return (
          <>
            <Grid
              container
              sx={{
                padding: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // gap: 5,
              }}
              key={item.id}
            >
              <Grid
                item
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={`subQuestions[${childIndex}].questionEn`}
                  labelName={`subQuestions[${childIndex}].questionEn`}
                  fieldName={`subQuestions[${childIndex}].questionEn`}
                  updateFieldName={`subQuestions[${childIndex}].questionMr`}
                  sourceLang={"eng"}
                  targetLang={"mar"}
                  label={<FormattedLabel id="questionEn" required />}
                  error={!!errors.questionEn}
                  helperText={
                    errors?.questionEn ? errors.questionEn.message : null
                  }
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={5.5}
                md={5.5}
                lg={5.5}
                xl={5.5}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Transliteration
                  variant={"standard"}
                  _key={`subQuestions[${childIndex}].questionMr`}
                  labelName={`subQuestions[${childIndex}].questionMr`}
                  fieldName={`subQuestions[${childIndex}].questionMr`}
                  updateFieldName={`subQuestions[${childIndex}].questionEng`}
                  sourceLang={"mar"}
                  targetLang={"eng"}
                  label={<FormattedLabel id="questionMr" required />}
                  error={!!errors.questionMr}
                  helperText={
                    errors?.questionMr ? errors.questionMr.message : null
                  }
                />
              </Grid>
            </Grid>
            <Grid
              container
              style={{
                padding: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                xs={12}
                sm={funcForConditions(childIndex) ? 12 : 4}
                md={funcForConditions(childIndex) ? 12 : 4}
                lg={funcForConditions(childIndex) ? 12 : 4}
                xl={funcForConditions(childIndex) ? 12 : 4}
                item
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  flexWrap: "wrap",
                  marginBottom: "10px",
                  gap: 1,
                }}
              >
                <FormControl
                  variant="standard"
                  sx={{ width: "250px" }}
                  error={!!errors.answerType}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <FormattedLabel id="answerType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="answerType" />}
                      >
                        {answerTypeData &&
                          answerTypeData.map((type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`subQuestions[${childIndex}].answerType`}
                    control={control}
                    defaultValue={item.answerType}
                  />
                  <FormHelperText>
                    {errors?.answerType ? errors.answerType.message : null}
                  </FormHelperText>
                </FormControl>
                {watch(`subQuestions[${childIndex}].answerType`) && (
                  <ChildAnswers
                    errors={errors}
                    control={control}
                    answerTypeData={answerTypeData}
                    checkListTypeData={checkListTypeData}
                    watch={watch}
                    register={register}
                    nestIndex={childIndex}
                    typeOfAnswer={watch(
                      `subQuestions[${childIndex}].answerType`
                    )}
                    reset={reset}
                    editMode={editMode}
                  />
                )}
              </Grid>

              <Grid xs={12} sm={4} md={4} lg={4} xl={4} item>
                <FormControl
                  variant="standard"
                  sx={{ width: "250px" }}
                  error={!!errors.checkListType}
                  size="small"
                >
                  <InputLabel id="demo-simple-select-outlined-label">
                    <FormattedLabel id="checkListType" />
                  </InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onChange={(value) => field.onChange(value)}
                        label={<FormattedLabel id="checkListType" />}
                      >
                        {checkListTypeData &&
                          checkListTypeData.map((type, index) => (
                            <MenuItem key={index} value={type}>
                              {type}
                            </MenuItem>
                          ))}
                      </Select>
                    )}
                    name={`subQuestions[${childIndex}].checklistType`}
                    control={control}
                    defaultValue={item.checklistType}
                  />
                  <FormHelperText>
                    {errors?.checklistType
                      ? errors.checklistType.message
                      : null}
                  </FormHelperText>
                </FormControl>
              </Grid>

              <Grid
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                item
                sx={{
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  color="error"
                  onClick={() => removeChildQuestions(childIndex)}
                  sx={{
                    borderRadius: "50px",
                    height: "30px",
                  }}
                >
                  <DeleteIcon />
                </Button>
              </Grid>
            </Grid>
          </>
        )
      })}
      <Grid
        container
        style={{
          display: "flex",
          justifyContent: "end",
          padding: "10px",
        }}
      >
        <Grid item>
          <Button
            onClick={() =>
              appendChildQuestions({
                questionEn: "",
                questionMr: "",
                answerType: "",
                checklistType: "",
                answersofSubQuestions: [{ answer: "" }],
              })
            }
            variant="contained"
            endIcon={<AddIcon />}
            size="small"
          >
            ADD Question
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default ChildQuestions
