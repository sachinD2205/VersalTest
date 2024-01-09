import React from "react";
import styles from "../../depositRefundProcess/deposit.module.css";
import FormattedLabel from "../../../../../containers/reuseableComponents/FormattedLabel";

const ApplicationHistory = ({ data = [] }) => {
  const columns = [
    {
      field: "srNo",
      headerName: "srNo",
      width: 75,
      align: "center",
    },
    {
      field: "approverName",
      headerName: "approverName",
      width: 250,
    },
    {
      field: "approvalDate",
      headerName: "approvalDate",
      width: 200,
    },
    {
      field: "authority",
      headerName: "authority",
      width: 200,
    },
    {
      field: "remark",
      headerName: "remark",
      width: 500,
    },
  ];

  return (
    <>
      <div className={styles.subTitle}>
        <FormattedLabel id="applicationHistory" />
      </div>

      <table className={styles.table}>
        <tbody>
          <tr>
            {columns.map((col) => (
              <th style={{ width: col?.width }}>
                <FormattedLabel id={col?.headerName} />
              </th>
            ))}
          </tr>
          {data?.length >= 1 ? (
            data?.map((row) => (
              <tr>
                {columns?.map((col) => (
                  <td style={{ textAlign: col?.align ?? "inherit" }}>
                    {row[col.field]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                <FormattedLabel id="noFileFound" bold />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default ApplicationHistory;
