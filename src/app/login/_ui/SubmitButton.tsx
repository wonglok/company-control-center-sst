'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <input
            disabled={pending}
            type='submit'
            value={'Continue'}
            className='bg-blue-500 hover:bg-blue-600 text-white cursor-pointer disabled:bg-gray-500 font-semibold rounded-md py-2 px-4 w-full'
        ></input>
    )
}
