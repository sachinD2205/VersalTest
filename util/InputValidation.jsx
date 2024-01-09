import { Input } from 'antd';
import React, { useState } from 'react';
import KeyPressEvents from './KeyPressEvents';

const InputValidation = () => {
  const [copyText, setCopyText] = useState(false);

  /* const maxLengthHandler = (e) => {
    setCopyText(e.preventDefault());
    return false;
  }; */

  return (
    <Input
      onPaste={(e) => {
        e.preventDefault();
        return false;
      }}
      onCopy={(e) => {
        e.preventDefault();
        return false;
      }}
      onDragOver={(e) => {
        e.preventDefault();
        return false;
      }}
    />
  );
};

export default InputValidation;
