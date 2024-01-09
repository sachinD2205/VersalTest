import { Add, Delete } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import style from "../../styles/upload.module.css";

const UploadButton = ({ Change }) => {
  const [file, setFile] = useState(null);

  const openFile = () => {
    // const base64ImageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    // const contentType = 'image/png';
    // const byteCharacters = atob(base64ImageData.substr(`data:${contentType};base64,`.length));
    // const byteArrays = [];
    // for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    //     const slice = byteCharacters.slice(offset, offset + 1024);
    //     const byteNumbers = new Array(slice.length);
    //     for (let i = 0; i < slice.length; i++) {
    //         byteNumbers[i] = slice.charCodeAt(i);
    //     }
    //     const byteArray = new Uint8Array(byteNumbers);
    //     byteArrays.push(byteArray);
    // }
    // const blob = new Blob(byteArrays, {type: contentType});
    // const blobUrl = URL.createObjectURL(blob);
    // window.open('https://www.geeksforgeeks.org/');
    // let data = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';
    // let w = window.open('about:blank');
    // let image = new Image();
    // image.src = data;
    // setTimeout(function(){
    //   w.document.write(image.outerHTML);
    // }, 0);
  };

  return (
    <div className={style.align}>
      <label className={style.uploadButton}>
        {!file && (
          <>
            <Add
              color='secondary'
              sx={{
                width: 30,
                height: 30,
                border: "1.4px dashed #9c27b0",
                marginRight: 1.5,
              }}
            />

            <input
              type='file'
              onChange={(e) => {
                console.log("File name: ", e.target.files[0]);
                setFile(e.target.files[0]);
                Change(e);
              }}
              hidden
            />
          </>
        )}
        {file ? (
          <span
            onClick={window.open("https://www.geeksforgeeks.org/")}
            className={style.fileName}
          >
            {file.name}
          </span>
        ) : (
          <span className={style.fileName}>Attach File</span>
        )}
      </label>
      {file && (
        <IconButton onClick={() => setFile(null)}>
          <Delete color='error' />
        </IconButton>
      )}
    </div>
  );
};

export default UploadButton;
