import { LoginForm } from './_ui/LoginForm'

export default async function Page() {
    return (
        <>
            <div className='bg-gray-100 flex justify-center items-center h-screen'>
                {/* Left: Image */}
                <div className='w-1/2 h-screen hidden lg:block'>
                    <img src='/wallpaper/sakura3.png' alt='Sakura AI Image' className='object-cover w-full h-full' />
                </div>

                {/* Right: Login Form */}
                <div className='lg:p-36 md:p-52 sm:20 p-8 w-full lg:w-1/2'>
                    <h1 className='text-2xl font-semibold'>Admin Login</h1>
                    <h1 className='text-lg text-gray-600 mb-4'>Portal</h1>
                    <LoginForm></LoginForm>
                </div>
            </div>
        </>
    )
}
