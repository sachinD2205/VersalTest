import React, { useState } from "react";
// import "./App.css"

import tableStyle from "./TdrFsiChecklistNewWorkingTable.module.css";

const Index = () => {
  const [data, setData] = useState([
    {
      id: 60,
      questionNo: null,
      questionEng: "This is the new Question 1",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Select",
      checklistType: "Mandatory",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [
        {
          id: 97,
          questionEn: "kahona 1",
          questionMr: "कहोना 1",
          answerType: "Text",
          checklistType: "Mandatory",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
        {
          id: 98,
          questionEn: "kahona 2",
          questionMr: "कहोना 2",
          answerType: "Select",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 257,
              questionType: "c",
              questionId: 98,
              answer: "ans 1",
            },
            {
              id: 258,
              questionType: "c",
              questionId: 98,
              answer: "ans 2",
            },
            {
              id: 259,
              questionType: "c",
              questionId: 98,
              answer: "ans 3",
            },
            {
              id: 260,
              questionType: "c",
              questionId: 98,
              answer: "ans 4",
            },
          ],
        },
        {
          id: 99,
          questionEn: "kahona 3",
          questionMr: "कहोना 2",
          answerType: "Radio",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 261,
              questionType: "c",
              questionId: 99,
              answer: "ans 1",
            },
            {
              id: 262,
              questionType: "c",
              questionId: 99,
              answer: "ans 2",
            },
          ],
        },
        {
          id: 100,
          questionEn: "kahona 4",
          questionMr: "कहोना 4",
          answerType: "Email",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
      ],
      answersofQuestions: [
        {
          id: 263,
          questionType: "p",
          questionId: 60,
          answer: "Answer 1",
        },
        {
          id: 264,
          questionType: "p",
          questionId: 60,
          answer: "Answer 2",
        },
        {
          id: 265,
          questionType: "p",
          questionId: 60,
          answer: "Answer 3",
        },
      ],
    },
    {
      id: 65,
      questionNo: null,
      questionEng: "This is the new Question 1",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Select",
      checklistType: "Mandatory",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [
        {
          id: 97,
          questionEn: "kahona 1",
          questionMr: "कहोना 1",
          answerType: "Text",
          checklistType: "Mandatory",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
        {
          id: 98,
          questionEn: "kahona 2",
          questionMr: "कहोना 2",
          answerType: "Select",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 257,
              questionType: "c",
              questionId: 98,
              answer: "ans 1",
            },
            {
              id: 258,
              questionType: "c",
              questionId: 98,
              answer: "ans 2",
            },
            {
              id: 259,
              questionType: "c",
              questionId: 98,
              answer: "ans 3",
            },
            {
              id: 260,
              questionType: "c",
              questionId: 98,
              answer: "ans 4",
            },
          ],
        },
        {
          id: 99,
          questionEn: "kahona 3",
          questionMr: "कहोना 2",
          answerType: "Radio",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 261,
              questionType: "c",
              questionId: 99,
              answer: "ans 1",
            },
            {
              id: 262,
              questionType: "c",
              questionId: 99,
              answer: "ans 2",
            },
          ],
        },
        {
          id: 100,
          questionEn: "kahona 4",
          questionMr: "कहोना 4",
          answerType: "Email",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
      ],
      answersofQuestions: [
        {
          id: 263,
          questionType: "p",
          questionId: 60,
          answer: "Answer 1",
        },
        {
          id: 264,
          questionType: "p",
          questionId: 60,
          answer: "Answer 2",
        },
        {
          id: 265,
          questionType: "p",
          questionId: 60,
          answer: "Answer 3",
        },
      ],
    },
    {
      id: 61,
      questionNo: null,
      questionEng: "This is the new Question 2",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Radio",
      checklistType: "Mandatory",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [
        {
          id: 97,
          questionEn: "kahona 12",
          questionMr: "कहोना 1",
          answerType: "Text",
          checklistType: "Mandatory",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
        {
          id: 98,
          questionEn: "kahona 22",
          questionMr: "कहोना 2",
          answerType: "Select",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 257,
              questionType: "c",
              questionId: 98,
              answer: "ans 1",
            },
            {
              id: 258,
              questionType: "c",
              questionId: 98,
              answer: "ans 2",
            },
          ],
        },
        {
          id: 99,
          questionEn: "kahona 33",
          questionMr: "कहोना 2",
          answerType: "Radio",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          select: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [
            {
              id: 261,
              questionType: "c",
              questionId: 99,
              answer: "ans 22",
            },
            {
              id: 262,
              questionType: "c",
              questionId: 99,
              answer: "ans 33",
            },
          ],
        },
        {
          id: 100,
          questionEn: "kahona 44",
          questionMr: "कहोना 4",
          answerType: "Email",
          checklistType: "Optional",
          text: null,
          number: null,
          radio: null,
          file: null,
          email: null,
          url: null,
          date: null,
          siteVisitQuestionsKey: 60,
          answersofSubQuestions: [],
        },
      ],
      answersofQuestions: [
        {
          id: 263,
          questionType: "p",
          questionId: 60,
          answer: "Answer 1",
        },
        {
          id: 264,
          questionType: "p",
          questionId: 60,
          answer: "Answer 2",
        },
      ],
    },
    {
      id: 62,
      questionNo: null,
      questionEng: "This is the new Question 2",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Text",
      checklistType: "Optional",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [],
      answersofQuestions: [],
    },

    {
      id: 63,
      questionNo: null,
      questionEng: "This is the new Question 2",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Email",
      checklistType: "Optional",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [],
      answersofQuestions: [],
    },
    {
      id: 66,
      questionNo: null,
      questionEng: "This is the new Question 2",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Email",
      checklistType: "Optional",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [],
      answersofQuestions: [],
    },
    {
      id: 67,
      questionNo: null,
      questionEng: "This is the new Question 2",
      questionMr: "तीस इस थे नव क्वेस्शन 1",
      answerType: "Email",
      checklistType: "Optional",
      serviceId: 20,
      text: null,
      number: null,
      radio: null,
      file: null,
      email: null,
      url: null,
      date: null,
      select: null,
      subQuestions: [],
      answersofQuestions: [],
    },
  ]);

  const [payloadBody, setPayloadBody] = useState(data);

  const errorMessage = (
    <span style={{ color: "red" }}>This field is required!</span>
  );

  const handleValueChangeForMainQuestions = (e, index, x) => {
    const { value } = e.target;

    switch (x) {
      case "Select":
        // alert("case Select")
        provideSpecificValue("select", index, value);
        break;

      case "Radio":
        // alert("case Radio")
        provideSpecificValue("radio", index, value);
        break;
      case "Text":
        // alert("case Text")
        // setPayloadBody((prevData) => {
        //   const updatedQuestions = [...prevData]
        //   updatedQuestions[index].text = value
        //   return [...updatedQuestions]
        // })
        provideSpecificValue("text", index, value);
        break;

      case "Email":
        // alert("case Email")
        provideSpecificValue("email", index, value);
        break;

      default:
        break;
    }
  };

  const provideSpecificValue = (key, index, value) =>
    setPayloadBody((prevData) => {
      const updatedQuestions = [...prevData];
      updatedQuestions[index][key] = value;
      return [...updatedQuestions];
    });

  // const validateFields = (checklistType) => {
  //   if (checklistType === "Mandatory") {
  //     return errorMessage
  //   }
  // }

  function renderAnswerInputForMainQuestions(
    answerType,
    answerOptions,
    index,
    checklistType,
  ) {
    const nameAttribute = `question_${index}`;

    if (answerType === "Select") {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          <select
            style={{ padding: "10px", width: "250px" }}
            name={nameAttribute}
            onChange={(e) =>
              handleValueChangeForMainQuestions(e, index, "Select")
            }
          >
            <option>Select Value Please</option>
            {answerOptions.map((option) => {
              return (
                <option key={option.id} value={option.answer}>
                  {option.answer}
                </option>
              );
            })}
          </select>
          {/* {validateFields(checklistType)} */}
        </div>
      );
    } else if (answerType === "Text") {
      return (
        <div>
          <input
            type="text"
            // multiple
            placeholder="please enter text"
            style={{ padding: "10px", width: "250px" }}
            onChange={(e) =>
              handleValueChangeForMainQuestions(e, index, "Text")
            }
          />
        </div>
      );
    } else if (answerType === "Radio") {
      return (
        <div
          style={{
            display: "flex",
            gap: 50,
            padding: "10px",
          }}
        >
          {answerOptions.map((option) => (
            <label key={option.id} style={{ display: "flex", gap: 10 }}>
              <input
                type="radio"
                name={`question_${index}`}
                value={`${option.answer}`}
                style={{ cursor: "pointer" }}
                onChange={(e) =>
                  handleValueChangeForMainQuestions(e, index, "Radio")
                }
              />
              {option.answer}
            </label>
          ))}
        </div>
      );
    } else if (answerType === "Email") {
      return (
        <input
          type="email"
          placeholder="please enter email"
          style={{ padding: "10px", width: "250px" }}
          onChange={(e) => handleValueChangeForMainQuestions(e, index, "Email")}
        />
      );
    }
  }
  // ////////////////////////////////////////////////////////////////

  const handleValueChangeForSubquestions = (e, mainIndex, subIndex, x) => {
    const { value } = e.target;

    switch (x) {
      case "Select":
        provideSpecificValueForSubQuestions(
          "select",
          mainIndex,
          subIndex,
          value,
        );
        break;

      case "Radio":
        provideSpecificValueForSubQuestions(
          "radio",
          mainIndex,
          subIndex,
          value,
        );
        break;
      case "Text":
        provideSpecificValueForSubQuestions("text", mainIndex, subIndex, value);
        break;

      case "Email":
        provideSpecificValueForSubQuestions(
          "email",
          mainIndex,
          subIndex,
          value,
        );
        break;

      default:
        break;
    }
  };

  const provideSpecificValueForSubQuestions = (
    key,
    mainIndex,
    subIndex,
    value,
  ) =>
    setPayloadBody((prevData) => {
      const updatedQuestions = [...prevData];
      updatedQuestions[mainIndex].subQuestions[subIndex][key] = value;
      return [...updatedQuestions];
    });

  function renderAnswerInputForSubQuestions(
    answerType,
    answerOptions,
    mainIndex,
    subIndex,
  ) {
    const nameAttribute = `question_${subIndex}`;

    if (answerType === "Select") {
      return (
        <div>
          <select
            style={{ padding: "10px", width: "250px" }}
            name={nameAttribute}
            onChange={(e) =>
              handleValueChangeForSubquestions(e, mainIndex, subIndex, "Select")
            }
          >
            <option>Select Value Please</option>
            {answerOptions.map((option) => {
              return (
                <option key={option.id} value={option.answer}>
                  {option.answer}
                </option>
              );
            })}
          </select>
        </div>
      );
    } else if (answerType === "Text") {
      return (
        <div>
          <input
            type="text"
            // multiple
            placeholder="please enter text"
            style={{ padding: "10px", width: "250px" }}
            onChange={(e) =>
              handleValueChangeForSubquestions(e, mainIndex, subIndex, "Text")
            }
          />
        </div>
      );
    } else if (answerType === "Radio") {
      return (
        <div
          style={{
            display: "flex",
            gap: 50,
            padding: "10px",
          }}
        >
          {answerOptions.map((option) => (
            <label key={option.id} style={{ display: "flex", gap: 10 }}>
              <input
                type="radio"
                name={`question_${mainIndex}_${subIndex}`}
                value={`${option.answer}`}
                style={{ cursor: "pointer" }}
                onChange={(e) =>
                  handleValueChangeForSubquestions(
                    e,
                    mainIndex,
                    subIndex,
                    "Radio",
                  )
                }
              />
              {option.answer}
            </label>
          ))}
        </div>
      );
    } else if (answerType === "Email") {
      return (
        <input
          type="email"
          placeholder="please enter email"
          style={{ padding: "10px", width: "250px" }}
          onChange={(e) =>
            handleValueChangeForSubquestions(e, mainIndex, subIndex, "Email")
          }
        />
      );
    }
  }

  //////////////////////////////////////////////////////////////////////////////////////////////////
  const finalSubmit = () => {};

  return (
    <div className="App">
      <div className={tableStyle.table_container}>
        <table className={tableStyle.table}>
          <thead>
            <tr>
              <th style={{ width: "10px" }}>Sr. No</th>
              <th>Question (English)</th>
              <th>Question (Marathi)</th>
              <th>Answer</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((o, mainIndex) => {
              return (
                <>
                  <tr>
                    <td style={{ textAlign: "center" }}>
                      {`${mainIndex + 1}`}
                      {o.checklistType === "Mandatory" ? (
                        <span
                          style={{
                            color: "red",
                            fontWeight: 500,
                            fontSize: "23px",
                          }}
                        >
                          *
                        </span>
                      ) : (
                        ""
                      )}
                    </td>
                    <td>{o.questionEng}</td>
                    <td>{o.questionMr}</td>
                    <td>
                      {renderAnswerInputForMainQuestions(
                        o.answerType,
                        o.answersofQuestions,
                        mainIndex,
                        o.checklistType,
                      )}
                    </td>
                  </tr>
                  {o?.subQuestions.map((subQuestion, subIndex) => (
                    <tr key={subQuestion.id}>
                      <td></td>
                      <td>
                        {`${subIndex + 1})`}{" "}
                        {o.checklistType === "Mandatory" ? (
                          <span
                            style={{
                              color: "red",
                              fontWeight: 500,
                              fontSize: "20px",
                            }}
                          >
                            *
                          </span>
                        ) : (
                          ""
                        )}{" "}
                        {subQuestion.questionEn} {subQuestion.answerType}
                      </td>
                      <td>
                        {`${subIndex + 1})`} {subQuestion.questionMr}
                      </td>
                      <td>
                        {renderAnswerInputForSubQuestions(
                          subQuestion.answerType,
                          subQuestion.answersofSubQuestions,
                          mainIndex,
                          subIndex,
                        )}
                      </td>
                    </tr>
                  ))}
                </>
              );
            })}
          </tbody>
        </table>

        {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <button
            type="submit"
            style={{
              fontSize: "20px",
              fontWeight: 500,
              padding: "5px",
              width: "80px",
            }}
            onClick={finalSubmit}
          >
            Next
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default Index;
