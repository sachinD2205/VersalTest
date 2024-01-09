import React, { useEffect } from "react"
import styles from "./emailLoader.module.css"

const EmailSendingLoader = () => {
  // useEffect(() => {
  //   // Get the text element by its ID
  //   const textElement = document.getElementById("emailSendingText")

  //   // Define an array of colors to use
  //   const colors = [
  //     "#3498db",
  //     "#e74c3c",
  //     "#27ae60",
  //     "#f1c40f",
  //     "#3498db",
  //     "#e74c3c",
  //     "#27ae60",
  //     "#f1c40f",
  //     "#3498db",
  //     "#e74c3c",
  //     "#27ae60",
  //     "#f1c40f",
  //     "#3498db",
  //   ]

  //   // Create an interval to change colors
  //   let colorIndex = 0
  //   const characters = textElement.querySelectorAll("strong")

  //   const interval = setInterval(() => {
  //     characters[colorIndex].style.color = colors[colorIndex]
  //     colorIndex = (colorIndex + 1) % colors.length
  //   }, 500)

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    // Get the text element by its ID
    const textElement = document.getElementById("emailSendingText")

    // Define an array of colors to use
    const colors = ["#3498db", "#e74c3c", "#27ae60", "#f1c40f"]

    // Create an interval to change colors
    let colorIndex = 0
    const characters = textElement.textContent.split("")

    const interval = setInterval(() => {
      const coloredText = characters
        .map(
          (char, index) =>
            `<span style="color: ${
              colors[(colorIndex + index) % colors.length]
            }">${char}</span>`
        )
        .join("")
      textElement.innerHTML = coloredText
      colorIndex = (colorIndex + 1) % colors.length
    }, 500)

    // Clear the interval when the component unmounts
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 200px)",
        width: "100vw",
        margin: 0,
        overflowY: "hidden",
      }}
    >
      <div className="loader">
        <strong style={{ fontSize: 18 }}>
          <h3 className="loader-text" id="emailSendingText">
            Please wait, email is sending...
          </h3>
        </strong>
      </div>
    </div>
  )
}

export default EmailSendingLoader
