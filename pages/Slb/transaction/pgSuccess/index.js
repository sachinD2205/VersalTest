import React, { useEffect, useState } from "react";
import BasicLayout from "../../../../containers/Layout/BasicLayout";
import ChildrenCards from "../../../../containers/Layout/Inner-Cards/ChildrenCards";
import { useRouter } from "next/router";

const Index = () => {
  // access query params
  const router = useRouter();

  const [data, setData] = useState([]);

  console.log("useEffect");
  console.log(router.query);

  for (const param in router.query) {
    if (Object.hasOwnProperty.call(router.query, param)) {
      const value = router.query[param];
      console.log(`Parameter: ${param}, Value: ${value}`);

      data.push({
        param: param,
        value: value,
      });
    }
  }

  return (
    <div>
      {(data.length != 0 && (
        <BasicLayout titleProp={"none"}>
          {/* iterate through data and show it in table format */}

          <center>
            <table>
              <thead>
                <tr>
                  <th>Parameter</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.param}</td>
                      <td>{item.value}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </center>
        </BasicLayout>
      )) || <div>loading...</div>}
    </div>
  );
};

export default Index;
