import { Button } from "@mui/material"
import axios from "axios"
import html2pdf from "html2pdf-jspdf2"
import moment from "moment"
import router from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { useReactToPrint } from "react-to-print"
import swal from "sweetalert"
import urls from "../../../../URLS/urls"
import styles from "./goshwara.module.css"
import ComponentToPrint from "./ReleasingOrderComp"
import { useGetToken } from "../../../../containers/reuseableComponents/CustomHooks"
import { catchExceptionHandlingMethod } from "../../../../util/util"

const Index = () => {
  const language = useSelector((state) => state.labels.language)

  const userToken = useGetToken()

  const componentRef = useRef()
  const [selectedObject, setSelectedObject] = useState()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: "A4",
  })

  const user = useSelector((state) => state.user.user)
  // console.log("user", user);
  // selected menu from drawer
  let selectedMenuFromDrawer = Number(
    localStorage.getItem("selectedMenuFromDrawer")
  )
  console.log("selectedMenuFromDrawer", selectedMenuFromDrawer)
  // get authority of selected user
  const authority = user?.menus?.find(
    (r) => r.id == selectedMenuFromDrawer
  )?.roles
  console.log("authority", authority)
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
  const pdfOptions = {
    margin: 5,
    filename: "releasingOrder.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  }

  function blobToFile(blob, fileName) {
    const file = new File([blob], fileName, { type: blob.type })
    return file
  }

  const download = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `releasingOrder.pdf`,
    copyStyles: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument
      if (document) {
        const html = document.getElementsByTagName("html")[0]
        console.log(html)
        try {
          await html2pdf().set(pdfOptions).from(html).save()
        } catch (error) {
          console.log("error", error)
        }
      }
    },
  })

  const saveToServer = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `AAA.pdf`,
    copyStyles: true,
    print: async (printIframe) => {
      const document = printIframe.contentDocument
      if (document) {
        const html = document.getElementsByTagName("html")[0]
        console.log(html)
        try {
          let worker = await html2pdf()
            .set(pdfOptions)
            .from(html)
            .toPdf()
            .output("blob")
            .then((data) => {
              return data
            })
          console.log("gggg::", worker)
          var file = blobToFile(worker, "releasing_order.pdf")
          console.log("file::", file)
          let formData = new FormData()
          formData.append("file", file)
          formData.append("appName", "NRMS")
          formData.append("serviceName", "N-BS")
          formData.append("fileName", "bill.pdf")
          axios
            .post(`${urls.CFCURL}/file/upload`, formData, {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            })
            .then((r) => {
              console.log("pathhhh", r.data.filePath)
              return r.data.filePath
            })
            .catch((error) => {
              callCatchMethod(error, language);
            })
        } catch (error) {
          console.log("error", error)
        }
      }
    },
  })

  useEffect(() => {
    if (router?.query?.id) {
      axios
        .get(
          `${urls.NRMS}/trnNewsPublishRequest/getById?id=${router?.query?.id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then((r) => {
          console.log("selectedobject", r.data)
          setSelectedObject({
            ...r.data,
          })
        })
        .catch((error) => {
          callCatchMethod(error, language);
        })
    }
  }, [router?.query])
  return (
    <>
      <div>
        <ComponentToPrint
          selectedObject={{ ...selectedObject, language }}
          ref={componentRef}
        />
      </div>
      <br />
      <div className={styles.btn}>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={download}
        >
          Download
        </Button>
        <Button
          variant="contained"
          sx={{ size: "23px" }}
          type="primary"
          onClick={handlePrint}
        >
          print
        </Button>
        <Button
          type="primary"
          variant="contained"
          onClick={() => {
            // swal("Exit!");
            // router.back();
            router.push({
              pathname: "/newsRotationManagementSystem/dashboard",
            })
          }}
        >
          Exit
        </Button>
      </div>
    </>
  )
}

export default Index
