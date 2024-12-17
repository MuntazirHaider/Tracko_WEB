import Image from 'next/image'
import React from 'react'

const Error = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
    {/* Illustration */}
    <Image
        src="https://res.cloudinary.com/ddwxsev3x/image/upload/v1734182846/Image/xapshlvsr9d2upldankm.png"
        alt="Access Denied Illustration"
        className="mb-4 h-40 w-40"
    />
    <h1 className="mb-2 text-center text-2xl font-semibold text-gray-800 dark:text-white">
        Internal Server Error
    </h1>
    <p className="text-center text-gray-600 dark:text-gray-300">
        Something went wrong please try after some time.
    </p>
</div>
  )
}

export default Error