import React from 'react'
import styles from '../../styles/reusableComponents/vms/Tiles.module.css'
import { Button } from '@mui/material'
import { useSelector } from 'react-redux'
import FormattedLabel from '../reuseableComponents/FormattedLabel'

const Index = ({ tiles = [], tableData = [], updater }) => {
  return (
    <div className={styles.wrapper}>
      {tiles.map((tile, index) => (
        <>
          <Tile tile={tile} key={index} data={tableData} update={updater} />
          {tiles.length - 1 != index && <div className={styles.divider}></div>}
        </>
      ))}
    </div>
  )
}

export default Index

const Tile = ({ tile, data = [], update }) => {
  // @ts-ignore
  const language = useSelector((state) => state.labels.language)

  return (
    <div key={tile.id} className={styles.tile}>
      <div className={styles.icon}>{tile.icon}</div>
      <div className={styles.labelAndCount}>
        {/* Label */}
        <b>{<FormattedLabel id={tile.formattedLabel} />}</b>
        {/* Count */}
        <div className={styles.sliderContainer}>
          <div className={styles.slider}>
            <b>{tile.count}</b>
            <Button
              sx={{ width: '100%' }}
              variant='contained'
              onClick={() =>
                update(data.filter((j) => tile.status.includes(j.status)))
              }
            >
              View
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
