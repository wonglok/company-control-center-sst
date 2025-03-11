'use client'
import { useActionState, useEffect } from 'react'
import { createFirstUser } from '../../../actions/createFirstUser'
import { SubmitButton } from './SubmitButton'
import { redirect } from 'next/navigation'

const initialState = {
    errors: {
        username: undefined,
        password: undefined,
        password2: undefined,
    },
}

export function CreateFirstUserForm() {
    const [state, formAction, pending] = useActionState(createFirstUser, initialState)

    useEffect(() => {
        if (state.ok === true) {
            redirect('/admin')
        }
    }, [state])

    return <>
        <form action={formAction}>
            {/*  */}

            {/* Username Input */}
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-600">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    autoComplete="off"
                />
                <span className='text-red-500 text-sm'>{typeof state === 'object' && state.errors?.username}</span>
            </div>
            {/* Password Input */}
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    autoComplete="off"
                />
                <span className='text-red-500 text-sm'>{typeof state === 'object' && state.errors?.password}</span>
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
                <label htmlFor="password2" className="block text-gray-600">
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="password2"
                    name="password2"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    autoComplete="off"
                />
                <span className='text-red-500 text-sm'>{typeof state === 'object' && state.errors?.password2}</span>
            </div>

            {/* Login Button */}
            <SubmitButton></SubmitButton>
        </form>
    </>
}