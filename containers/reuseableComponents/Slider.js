import React from 'react'
import styles from '../../styles/reusableComponents/Slider.module.css'

const Index = ({ slide = false, setSlider }) => {
  return (
    <label className={styles.switch}>
      <input
        checked={slide}
        onChange={(e) => setSlider(e.target.checked)}
        type='checkbox'
      />
      <span className={styles.slider}></span>
      <span className={styles.knob}></span>
    </label>
  )
}

export default Index
