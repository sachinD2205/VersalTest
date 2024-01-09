import { Button, Paper } from "@mui/material";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
const ComponentToPrintt = () => {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      {/* <BasicLayout titleProp={'none'}> */}
      <Paper>
        <div>
          <center>
            <h1>गोषवारा भाग १</h1>
          </center>
        </div>
        <div style={{ padding: 10 }}>
          <Button
            variant="contained"
            color="primary"
            style={{ float: "right" }}
            onClick={handlePrint}
          >
            print
          </Button>
        </div>
      </Paper>
      <ComponentToPrint ref={componentRef} />
      {/* </BasicLayout> */}
    </div>
  );
};
// Component To Print
class ComponentToPrint extends React.Component {
  render() {
    return <div></div>;
  }
}

export default ComponentToPrintt;
