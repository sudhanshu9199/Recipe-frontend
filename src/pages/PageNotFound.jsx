import React from 'react'
import pageNotFoundImage from '../assets/pageNotFound.jpg';
import '../tailwindCSS.css';
const PageNotFound = () => {
  return (
    <div className='flex justify-center align-middle'>
        <img className='w-155' src={pageNotFoundImage} alt="" />
    </div>
  )
}

export default PageNotFound