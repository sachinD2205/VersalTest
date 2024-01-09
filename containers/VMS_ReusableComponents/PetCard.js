import React from 'react'
import styles from '../../styles/reusableComponents/vms/PetCard.module.css'

const Index = ({
  petName = 'Not found',
  casePaperNo = 'Not found',
  onClick = () => {},
}) => {
  return (
    <div className={styles.card} onClick={onClick}>
      {petName} <b>{`(${casePaperNo})`}</b>
    </div>
  )
}

export default Index
