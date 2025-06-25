'use client'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { DefaultValues, FieldValues, Path, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import FileUpload from './ImageUpload'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props<T extends FieldValues> {
  type: 'SIGN_IN' | 'SIGN_UP'
  schema: z.ZodType<any, any, any>
  defaultValues: T
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit
}: Props<T>) => {

  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignIn = type === 'SIGN_IN'
  
  const form: UseFormReturn<T> = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    console.log('Form data:', data)
    if (isSubmitting) return // Prevent double submission
    
    setIsSubmitting(true)
    
    try {
      const result = await onSubmit(data)
      
      if (result.success) {
        toast.success(isSignIn ? "Signed in successfully!" : "Account created successfully!")
        router.push('/')
      } else {
        toast.error(result.error || "An error occurred. Please try again.")
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-2xl font-semibold text-white'>
        {isSignIn ? "Welcome Back BookShelf" : "Create an Account"}
      </h1>
      <p className='text-light-100'>
        {isSignIn 
          ? "Access the vast collection of resources and stay updated" 
          : "Please fill a complete details and upload a valid university card to gain access."
        }
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {Object.keys(defaultValues).map((fields) => (
            <FormField
              key={fields}
              control={form.control}
              name={fields as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-white capitalize'>
                    {fields.replace(/([A-Z])/g, ' $1').trim()}
                  </FormLabel>
                  <FormControl>
                    {fields === 'universityCard' && !isSignIn ? (
                      <FileUpload
                        type="image"
                        accept="image/*"
                        placeholder="Upload your ID"
                        folder="ids"
                        variant="dark"
                        onFileChange={field.onChange}
                      
                      />
                    ) : (
                      <Input 
                        className='w-full min-h-14 border-none text-base font-bold placeholder:font-normal text-white placeholder:text-light-100 focus-visible:ring-0 focus-visible:shadow-none bg-dark-300 !important' 
                        required 
                        disabled={isSubmitting}
                        {...field} 
                        placeholder={`Enter your ${fields.replace(/([A-Z])/g, ' $1').trim()}`}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className='bg-primary text-dark-100 hover:bg-primary inline-flex min-h-14 w-full items-center justify-center rounded-md px-6 py-2 font-bold text-base disabled:opacity-50 disabled:cursor-not-allowed !important'
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-dark-100 border-t-transparent rounded-full animate-spin"></div>
                {isSignIn ? "Signing In..." : "Creating Account..."}
              </div>
            ) : (
              isSignIn ? "Sign In" : "Sign Up"
            )}
          </Button>
        </form>
      </Form>
      
      <p className='text-center text-base font-medium'>
        {isSignIn ? "New to BookShelf? " : "Already have an account? "}
        <Link 
          href={isSignIn ? "/sign-up" : "/sign-in"} 
          className='text-primary font-bold hover:underline'
        >
          {isSignIn ? "Sign Up" : "Sign In"}
        </Link>
      </p>
    </div>
  )
}

export default AuthForm