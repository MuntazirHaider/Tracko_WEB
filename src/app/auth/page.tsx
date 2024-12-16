'use client'

import React, { useState } from 'react'
import AuthForm from '../../components/AuthForm';

const AuthPages = () => {
    const [isLogin, setIsLogin] = useState<boolean>(true);

    return (
        <div>
            <AuthForm isLogin={isLogin} setIsLogin={setIsLogin} />
        </div>
    )
}

export default AuthPages