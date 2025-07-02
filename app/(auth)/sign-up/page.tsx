'use client'
import AuthForm from '@/components/AuthForm'
import { signUp } from '@/lib/actions/auth'
import { SignUpSchema } from '@/lib/Validation'
import React from 'react'

const SignUppage = () => {
  return (
    <AuthForm
        type="SIGN_UP"
        schema={ SignUpSchema }
        defaultValues={
          { 
            fullName: '',
            email: '',
            universityId: 0,
            password: '',
            universityCard: '',
            profileImage:''
          }
        }
         onSubmit={signUp}
        
      />
  )
}

export default SignUppage
