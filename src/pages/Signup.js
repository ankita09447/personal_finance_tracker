import React from 'react'
import Header from '../components/header'
import SignupSigininComponent from '../components/SignupSignin'

function Signup() {
  return (
    <div>
      <Header/>
      <div className="wrapper">
        <SignupSigininComponent />
      </div>
    </div>
  )
}

export default Signup