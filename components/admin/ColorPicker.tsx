'use client'
import React, { useState } from 'react'
import { HexColorInput, HexColorPicker } from "react-colorful";

interface props {
   value : string
   onPickerChange : (color : string) => void
}

const ColorPicker = ({value, onPickerChange}:props) => {

  return(
  <div className='relative'>
    <div className='flex  flex-row items-center '>
        <p className='text-base font-semibold text-dark-400'>#</p>
        <HexColorInput color={value} onChange={onPickerChange} className='h-full flex-1 bg-transparent font-ibm-plex-sans outline-none text-dark-400' />
    </div>
 <HexColorPicker color={value} onChange={onPickerChange} />;
      

     
  </div>
  )
  
}

export default ColorPicker
