'use client'
import { useActionState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { createAdminUser } from '@/actions/createAdminUser'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { v4 } from 'uuid'
import { toast } from 'sonner'

const initialState = {
    errors: {
        username: undefined,
        password: undefined,
        password2: undefined,
    },
}

export function CreateNewUser() {
    const [state, formAction, pending] = useActionState(createAdminUser, initialState)

    useEffect(() => {
        if (state.ok === true) {
            toast(`Successfully added new admin`)
        }
    }, [state])

    return (
        <>
            <Card className='size-full'>
                <CardHeader>
                    <CardTitle>Create Admin User</CardTitle>
                    <CardDescription>Access to the Portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={formAction}>
                        {/*  */}

                        {/* Username Input */}
                        <div className='mb-4'>
                            <label htmlFor='username' className='block text-gray-600 text-sm'>
                                Username
                            </label>
                            <input
                                type='text'
                                id='username'
                                name='username'
                                className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500'
                                autoComplete='off'
                            />
                            <span className='text-red-500 text-sm'>
                                {typeof state === 'object' && state.errors?.username}
                            </span>
                        </div>
                        {/* Password Input */}
                        <div className='mb-4'>
                            <label htmlFor='password' className='block text-gray-600 text-sm'>
                                Password
                            </label>
                            <input
                                type='password'
                                id='password'
                                name='password'
                                className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500'
                                autoComplete='off'
                            />
                            <span className='text-red-500 text-sm'>
                                {typeof state === 'object' && state.errors?.password}
                            </span>
                        </div>

                        {/* Confirm Password Input */}
                        <div className='mb-4'>
                            <label htmlFor='password2' className='block text-gray-600 text-sm'>
                                Confirm Password
                            </label>
                            <input
                                type='password'
                                id='password2'
                                name='password2'
                                className='w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500'
                                autoComplete='off'
                            />
                            <span className='text-red-500 text-sm'>
                                {typeof state === 'object' && state.errors?.password2}
                            </span>
                        </div>
                        <div className=' flex justify-end'>
                            <Button type='submit'>Create</Button>
                        </div>

                        {/* Login Button */}
                        {/* <SubmitButton></SubmitButton> */}
                    </form>
                </CardContent>
                <CardFooter className='flex justify-end'></CardFooter>
            </Card>
        </>
    )
}
