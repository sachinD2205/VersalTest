import React from 'react'
import { Card } from 'antd'
const LayoutContent = (children, titleProp) => {
  return (
    <div className='layout-content'>
      <Card title={titleProp}></Card>
      {children}
    </div>
  )
}

export default LayoutContent
