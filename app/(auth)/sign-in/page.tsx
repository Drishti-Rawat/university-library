'use client'
import AuthForm from '@/components/AuthForm'
import { signInwithCredentials } from '@/lib/actions/auth'
import { SignInSchema } from '@/lib/Validation'
import React from 'react'

const SignInpage = () => {
  return (
    
      <AuthForm
        type="SIGN_IN"
        schema={ SignInSchema }
        defaultValues={{ email: '', password: '' }}
        onSubmit={signInwithCredentials}
        
      />
   
  )
}

export default SignInpage
