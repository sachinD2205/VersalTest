import { Button, IconButton, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useFieldArray } from "react-hook-form"
import FormattedLabel from "../../../../containers/reuseableComponents/FormattedLabel"
import DeleteIcon from "@mui/icons-material/Delete"
import AddBoxIcon from "@mui/icons-material/AddBox"

const ChildAnswers = ({
  errors,
  control,
  register,
  nestIndex,
  typeOfAnswer,
  editMode,
}) => {
  const {
    fields: answersofSubQuestions,
    append: appendChildAnswers,
    remove: removeChildAnswers,
  } = useFieldArray({
    control,
    name: `subQuestions[${nestIndex}].answersofSubQuestions`,
  })

  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    if (!isFirstRender) {
      // alert("if")

      removeChildAnswers(answersofSubQuestions)
      // console.log(":aaa", answersofSubQuestions)
    } else if (isFirstRender && editMode) {
      // alert("else if")

      setIsFirstRender(false)
      // console.log(":aaa", answersofSubQuestions)
    } else if (isFirstRender && !editMode) {
      // alert("else if else")
      removeChildAnswers(answersofSubQuestions)
      setIsFirstRender(false)
      // console.log(":aaa", answersofSubQuestions)
    }
  }, [typeOfAnswer])

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      {answersofSubQuestions?.map((items, index) => {
        return (
          <div
            key={items.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <TextField
              type="text"
              id="outlined-basic"
              label={<FormattedLabel id="answer" />}
              variant="standard"
              {...register(
                `subQuestions[${nestIndex}].answersofSubQuestions[${index}].answer`
              )}
              defaultValue={items.answer}
            />
            <IconButton onClick={() => removeChildAnswers(index)}>
              <DeleteIcon style={{ color: "red" }} />
            </IconButton>
          </div>
        )
      })}

      {typeOfAnswer === "Radio" && answersofSubQuestions?.length == 2 && (
        <IconButton
          disabled
          onClick={() => {
            appendChildAnswers({ answer: "" })
          }}
        >
          <AddBoxIcon />
        </IconButton>
      )}
      {/* ////////////////////////////////////////// */}
      {typeOfAnswer === "Radio" && answersofSubQuestions?.length < 2 && (
        <IconButton
          onClick={() => {
            appendChildAnswers({ answer: "" })
          }}
        >
          <AddBoxIcon style={{ color: "#556CD6" }} />
        </IconButton>
      )}
      {/* ////////////////////////////////////////// */}

      {typeOfAnswer === "Select" && (
        <IconButton
          onClick={() => {
            appendChildAnswers({ answer: "" })
          }}
        >
          <AddBoxIcon style={{ color: "#556CD6" }} />
        </IconButton>
      )}
    </div>
  )
}

export default ChildAnswers
