import React, { useState } from "react";
import axios from "axios";

const YourComponent = () => {
  const [sourceWord, setSourceWord] = useState("");
  const [translatedWord, setTranslatedWord] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("mr");

  const handleTranslation = () => {
    if (sourceWord.trim().length === 0) {
      alert("Please enter source string.");
      return;
    }

    if (sourceLang === targetLang) {
      alert("Please provide source and target language different.");
      return;
    }

    const arrPythonLangCode = { en: "eng", mr: "mar" };
    const pythonSourceLang = arrPythonLangCode[sourceLang];
    const pythonTargetLang = arrPythonLangCode[targetLang];

    const data = {
      CustOrigin: "https://172.20.3.104:5000/",
      CustTokenID: "LSPCMC@&*@#",
      SLngCode: pythonSourceLang,
      TLngCode: pythonTargetLang,
      Source: sourceWord,
    };

    axios
      .post("https://noncoreuat.pcmcindia.gov.in/linguify/api/LsRevPH", data, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        setTranslatedWord(response?.data?.result);
        console.log(response?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <input
        type="text"
        value={sourceWord}
        onChange={(e) => setSourceWord(e.target.value)}
      />
      <select
        value={sourceLang}
        onChange={(e) => setSourceLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="mr">Marathi</option>
      </select>
      <select
        value={targetLang}
        onChange={(e) => setTargetLang(e.target.value)}
      >
        <option value="en">English</option>
        <option value="mr">Marathi</option>
      </select>
      <button onClick={handleTranslation}>Translate</button>
      <input type="text" value={translatedWord} readOnly />
    </div>
  );
};

export default YourComponent;
