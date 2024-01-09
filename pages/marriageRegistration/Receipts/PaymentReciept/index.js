import React, { useEffect, useRef } from 'react'
import styles from './payment.module.css'
import router from 'next/router'
import { useReactToPrint } from 'react-to-print'
import { Button, Card } from '@mui/material'

const index = () => {
  return (
    <>
      <Card>
        <table className={styles.report}>
          <tr>
            <th colSpan="">
              <h3>RECEIPT / पावती</h3>
            </th>
          </tr>
          <tr>
            <th colSpan="1">
              <b>Receipt No./ पावती ᮓ.</b>
            </th>
            <th colSpan="2">
              <b>Date/ ᳰदनांक</b>
            </th>
            <th colSpan="2">
              <b>Related To / ᭒या कता</b>
            </th>
            <th colSpan="2">
              <b>CFC Ref. /सी एफ सी संदभ</b>
            </th>
            <th colSpan="2">
              <b>Counter Ref./ िखडकᳱ संदभ</b>
            </th>
          </tr>
          <tr>
            <td>
              <b>MRD / 1</b>
            </td>
            <td>
              <b>02/09/2011</b>
            </td>
            <td>
              <b>िववाह नᲂदणी िवभाग</b>
            </td>
            <td>
              <b>1/5</b>
            </td>
            <td>
              <b>1/5</b>
            </td>
          </tr>
          <tr>
            <th>
              <b> Received From/कोणाकडुन</b>
            </th>
            <td>
              <b>ी vijay patil</b>
            </td>
          </tr>
        </table>
      </Card>
    </>
  )
}

export default index
