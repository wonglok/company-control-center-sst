'use client'
import { useActionState, useEffect, useState } from 'react'
import { SubmitButton } from './SubmitButton'
import { redirect, useRouter } from 'next/navigation'
import { loginAdmin } from '@/actions/loginAdmin'
import { loginUsername } from '@/actions/loginUsername'
import { supported } from '@github/webauthn-json'
import { client } from '@passwordless-id/webauthn'
import { getChallenge } from '@/actions/getChallenge'
import { verifyLoginPasskey } from '@/actions/verifyLoginPasskey'

const initialStatePW = {
    errors: {
        username: undefined,
        password: undefined,
    },
}

const initialStateUsr = {
    errors: {
        username: undefined,
    },
}

export function LoginForm() {
    let [username, setUsername] = useState('')
    let [status, setStatus] = useState('check')
    let [credIDs, setCredIDs] = useState([])

    console.log(credIDs)
    if (status === 'check') {
        return <CheckLoginType
            onUsername={(v) => {
                setUsername(v)
            }}
            onCredIDs={(v) => {
                setCredIDs(v)
            }}
            onLoginWithPasskey={() => {
                setStatus('passkey')
            }} onLoginWithPassword={() => {
                setStatus('password')
            }}></CheckLoginType>
    }

    if (status === 'password') {
        return <>
            <LoginWithPassword username={username}></LoginWithPassword>
        </>
    }

    if (status === 'passkey') {
        return <>
            <LoginPasskey username={username} credIDs={credIDs} onUsePassword={() => {
                setStatus('password')
            }}></LoginPasskey>
        </>
    }
}

function LoginWithPassword({ username }) {
    const [state, formAction, pending] = useActionState(loginAdmin, initialStatePW)

    if (state.ok === true) {
        redirect('/app')
    }

    return <>
        {<form action={formAction}>
            {/*  */}

            {/* Username Input */}
            <div className="mb-4">
                <label htmlFor="username" className="block text-gray-600">
                    Username
                </label>
                <input
                    defaultValue={username}
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
                    autoFocus
                    className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
                    autoComplete="off"
                />
                <span className='text-red-500 text-sm'>{typeof state === 'object' && state.errors?.password}</span>
            </div>

            {/* Login Button */}
            <SubmitButton></SubmitButton>
        </form>}

    </>
}

function LoginPasskey({ credIDs, username, onUsePassword }) {
    let router = useRouter()
    useEffect(() => {
        let run = async () => {
            let challenge = await getChallenge()
            let pubKeyCred = await client.authenticate({
                challenge: `${challenge}`,
                allowCredentials: credIDs,
                customProperties: {
                    uvm: true
                }
            })

            let result = await verifyLoginPasskey({ username, challenge, pubKeyCred, origin: location.origin })
            if (result.ok === true) {
                router.push('/app')
            }
        }
        run().catch(r => {
            console.log(r)
        })
    }, [credIDs])

    return <>
        <button

            className='bg-green-500 mb-3 hover:bg-green-600 text-white cursor-pointer disabled:bg-gray-500 font-semibold rounded-md py-2 px-4 w-full'
        >Scanning Passkey</button>
        <button
            onClick={() => {
                onUsePassword()
            }}
            className='bg-purple-500 mb-3 hover:bg-purple-600 text-white cursor-pointer disabled:bg-gray-500 font-semibold rounded-md py-2 px-4 w-full'
        >Login with Password</button>

    </>
}

function CheckLoginType({ onLoginWithPasskey, onLoginWithPassword, onCredIDs, onUsername }) {
    const [state, formAction, pending] = useActionState(loginUsername, initialStateUsr)
    let [mode, setMode] = useState('check')
    let [showPasskey, setShowPasskey] = useState(false)
    console.log(state)

    let onGoWithPasskey = () => {
        onCredIDs(state.credIDs)
        onLoginWithPasskey()
    }
    let goWithPassword = () => {
        onLoginWithPassword()
    }
    useEffect(() => {
        if (state.checkedUsername) {
            setMode('choose')
            if (state.hasPasskey && supported() && (state.credIDs || []).length > 0) {
                setShowPasskey(true)
            } else {
                setShowPasskey(false)
            }
        }
    }, [state])

    return <>
        {mode === 'check' && <form action={(formData) => {
            let username = formData.get('username')
            onUsername(username)
            formAction(formData)
        }}>
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

            {/* Login Button */}
            <SubmitButton></SubmitButton>
        </form>}

        {mode === 'choose' && <div>
            <button
                onClick={() => {
                    goWithPassword()
                }}
                className='bg-blue-500 mb-3 hover:bg-blue-600 text-white cursor-pointer disabled:bg-gray-500 font-semibold rounded-md py-2 px-4 w-full'
            >Password</button>

            {showPasskey && <button
                onClick={() => {
                    onGoWithPasskey()
                }}
                className='bg-blue-500 mb-3 hover:bg-blue-600 text-white cursor-pointer disabled:bg-gray-500 font-semibold rounded-md py-2 px-4 w-full'
            >Passkey
                (FaceID / FingerID)
            </button>}
        </div>}




    </>

}   