import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import urls from "../../URLS/urls";
import tableStyle from "./TdrFsiChecklistNewWorkingTable.module.css";
import { catchExceptionHandlingMethod } from "../../util/util";
import { useSelector } from "react-redux";

const Index = ({ setAnswerPayload }) => {
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
  let user = useSelector((state) => state.user.user);
  const language = useSelector((state) => state?.labels?.language);

  const router = useRouter();
  const [data, setData] = useState([]);
  const [finalDataToSubmit, setFinalDataToSubmit] = useState(null);
  const [payloadBody, setPayloadBody] = useState(data);
  const getAllQuestions = () => {
    axios
      .get(
        `${urls.TPURL}/master/siteVisitQuestions/getByServiceId?serviceId=${router?.query?.serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      )
      .then((res) => {
        if (res?.status == "200" || res?.status == "201") {
          console.log("questions", res?.data?.mstSiteVisitQuestionsDaoList);
          setData(res?.data?.mstSiteVisitQuestionsDaoList);
        }
      })
      .catch((error) => {
        callCatchMethod(error, language);
      });
  };
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

  const provideSpecificValue = (key, index, value) => {
    console.log(":ansari", value);
    return setPayloadBody((prevData) => {
      const updatedQuestions =
        prevData?.length != 0 ? [...prevData] : [...data];
      updatedQuestions[index][key] = value;

      const questionIdToSet = updatedQuestions[index]?.id;

      setFinalDataToSubmit((pre) => {
        if (!pre) {
          return [
            {
              answer: value,
              questionId: questionIdToSet,
            },
          ];
        }
        const existingItemIndex = pre.findIndex(
          (item) => item.questionId === questionIdToSet,
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...pre];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            answer: value,
          };
          return updatedItems;
        } else {
          return [
            ...pre,
            {
              answer: value,
              questionId: questionIdToSet,
            },
          ];
        }
      });

      return [...updatedQuestions];
    });
  };

  useEffect(() => {
    setAnswerPayload(finalDataToSubmit);
    console.log(":a4", finalDataToSubmit);
  }, [finalDataToSubmit]);

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
    console.log("answerType", answerType);
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

  // const handleValueChangeForSubquestions = (e, mainIndex, subIndex, x) => {
  //   const { value } = e.target

  //   switch (x) {
  //     case "Select":
  //       provideSpecificValueForSubQuestions(
  //         "select",
  //         mainIndex,
  //         subIndex,
  //         value
  //       )
  //       break

  //     case "Radio":
  //       provideSpecificValueForSubQuestions("radio", mainIndex, subIndex, value)
  //       break
  //     case "Text":
  //       provideSpecificValueForSubQuestions("text", mainIndex, subIndex, value)
  //       break

  //     case "Email":
  //       provideSpecificValueForSubQuestions("email", mainIndex, subIndex, value)
  //       break

  //     default:
  //       break
  //   }
  // }

  // const provideSpecificValueForSubQuestions = (
  //   key,
  //   mainIndex,
  //   subIndex,
  //   value
  // ) =>
  //   setPayloadBody((prevData) => {
  //     const updatedQuestions = [...prevData]
  //     updatedQuestions[mainIndex].subQuestions[subIndex][key] = value
  //     return [...updatedQuestions]
  //   })

  // function renderAnswerInputForSubQuestions(
  //   answerType,
  //   answerOptions,
  //   mainIndex,
  //   subIndex
  // ) {
  //   const nameAttribute = `question_${subIndex}`

  //   if (answerType === "Select") {
  //     return (
  //       <div>
  //         <select
  //           style={{ padding: "10px", width: "250px" }}
  //           name={nameAttribute}
  //           onChange={(e) =>
  //             handleValueChangeForSubquestions(e, mainIndex, subIndex, "Select")
  //           }
  //         >
  //           <option>Select Value Please</option>
  //           {answerOptions.map((option) => {
  //             return (
  //               <option key={option.id} value={option.answer}>
  //                 {option.answer}
  //               </option>
  //             )
  //           })}
  //         </select>
  //       </div>
  //     )
  //   } else if (answerType === "Text") {
  //     return (
  //       <div>
  //         <input
  //           type="text"
  //           // multiple
  //           placeholder="please enter text"
  //           style={{ padding: "10px", width: "250px" }}
  //           onChange={(e) =>
  //             handleValueChangeForSubquestions(e, mainIndex, subIndex, "Text")
  //           }
  //         />
  //       </div>
  //     )
  //   } else if (answerType === "Radio") {
  //     return (
  //       <div
  //         style={{
  //           display: "flex",
  //           gap: 50,
  //           padding: "10px",
  //         }}
  //       >
  //         {answerOptions.map((option) => (
  //           <label key={option.id} style={{ display: "flex", gap: 10 }}>
  //             <input
  //               type="radio"
  //               name={`question_${mainIndex}_${subIndex}`}
  //               value={`${option.answer}`}
  //               style={{ cursor: "pointer" }}
  //               onChange={(e) =>
  //                 handleValueChangeForSubquestions(
  //                   e,
  //                   mainIndex,
  //                   subIndex,
  //                   "Radio"
  //                 )
  //               }
  //             />
  //             {option.answer}
  //           </label>
  //         ))}
  //       </div>
  //     )
  //   } else if (answerType === "Email") {
  //     return (
  //       <input
  //         type="email"
  //         placeholder="please enter email"
  //         style={{ padding: "10px", width: "250px" }}
  //         onChange={(e) =>
  //           handleValueChangeForSubquestions(e, mainIndex, subIndex, "Email")
  //         }
  //       />
  //     )
  //   }
  // }
  // console.log();
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const finalSubmit = () => {
    console.log(":a7", finalDataToSubmit);
  };
  console.log(":a7", data);

  useEffect(() => {
    getAllQuestions();
  }, []);
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
                  {/* {o?.subQuestions.map((subQuestion, subIndex) => (
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
                          subIndex
                        )}
                      </td>
                    </tr>
                  ))} */}
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
