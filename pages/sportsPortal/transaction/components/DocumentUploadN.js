import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import URLS from "../../../../URLS/urls";

import DocumentUploadTable from "../../../../containers/reuseableComponents/DocumentUploadTable";

const DocumentUploadN = () => {
  const [filesAale, setFilesAale] = useState(false);

  const router = useRouter();
  const getDocumentName = (value, lang) => {
    if (lang == "en") {
      return documents.find((arg) => arg.id === value)?.documentNameEn;
    } else {
      return documents.find((arg) => arg.id === value)?.documentNameMr;
    }
  };

  const [documents, setDocuments] = useState([
    {
      id: 1,
      documentChecklistEn: "",
      documentChecklistMr: "",
    },
  ]);
  useEffect(() => {
    //DocumentsList
    axios.get(`${URLS.CFCURL}/master/documentMaster/getAll`).then((res) => {
      setDocuments(
        res.data.documentMaster.map((j, i) => ({
          id: j.id,
          documentNameEn: j.documentChecklistEn,
          documentNameMr: j.documentChecklistMr,
        }))
      );
    });
    //Document Checklist
    axios
      .post(
        `${
          URLS.CFCURL
        }/master/serviceWiseChecklist/getDocumentsByService?service=${29}`
      )
      .then((r) => {
        if (router.query.id) {
          axios
            //   .get(`${URLS.BaseURL}/partplan/getpartplan/${router.query.id}`)
            .get(
              `${URLS.SPURL}/sportsBooking/getSportsBooking/${router.query.id}`
            )
            .then((res) => {
              setFiles(
                r.data.map((r, i) => ({
                  id: getID(res.data.files, r.document),
                  srNo: i + 1,
                  isDocumentMandetory: r.isDocumentMandetory,
                  docKey: r.document,
                  documentNameEn: getDocumentName(r.document, "en"),
                  documentNameMr: getDocumentName(r.document, "mr"),

                  filePath: getFilePath(res.data.files, r.document),
                  status: getStatus(res.data.files, r.document),
                  remark: res.data.files.find(
                    (file) => file.docKey === r.document
                  ).remark,
                }))
              );
              setFilesAale(true);
            });
        } else {
          setFiles(
            r.data.map((j, i) => ({
              id: j.id,
              srNo: i + 1,
              isDocumentMandetory: j.isDocumentMandetory,
              docKey: j.document,
              documentNameEn: getDocumentName(j.document, "en"),
              documentNameMr: getDocumentName(j.document, "mr"),
              filePath: "",
              status: "upload",
              remark: "",
            }))
          );
          setFilesAale(true);
        }
      });
  }, [documents]);
  const uploadAgain = async () => {
    let tempNewFiles = files.map((j) => ({
      id: j.id,
      // @ts-ignore
      docKey: j.docKey,
      // @ts-ignore
      partPlanAttachmentPath: j.filePath,
      status: j.status === "upload" ? "pending" : j.status,
      remark: j.remark,
    }));

    let status = "Application Created";

    console.log("status: ", status);

    const statusUpdation = { id: router.query.id, files: tempNewFiles, status };

    await axios
      .post(`${URLS.SPURL}/sportsBooking/saveSportsBooking`, statusUpdation, {
        headers: {
          // Authorization: `Bearer ${token}`,
          role: "CITIZEN",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          sweetAlert("Saved!", "Record Saved successfully !", "success");
          //   router.push("/townPlanning/transactions/partMap");
        }
      });
  };

  const [files, setFiles] = useState([
    {
      id: 1,
      srNo: 1,
      isDocumentMandetory: true,
      docKey: 1,
      documentNameEn: "",
      documentNameMr: "",
      filePath: "",
      //   status: "",
      //   remark: "",
    },
  ]);
  return (
    <>
      <DocumentUploadTable
        appName="SP"
        serviceName="Sports Booking"
        rows={files}
        rowUpdation={setFiles}
        uploadAgain={uploadAgain}
      />
      {/* <DocumentUploadTable /> */}
    </>
  );
};

export default DocumentUploadN;
