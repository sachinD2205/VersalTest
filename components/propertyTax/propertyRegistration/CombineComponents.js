import React from "react"
import BankDetailsPT from "./BankDetailsPT"
import ElectricalConnAvailable from "./ElectricalConnAvailable"
import WaterConnAvailable from "./WaterConnAvailable"

const CombineComponents = () => {
  return (
    <div>
      <WaterConnAvailable />
      <ElectricalConnAvailable />
      <BankDetailsPT />
    </div>
  )
}

export default CombineComponents
