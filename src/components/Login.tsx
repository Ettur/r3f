import ky from 'ky';
import React, { useEffect, useState } from 'react';
import { useStore } from '../store';

interface AuthResponse {
    token: string
}

export const Login = ():JSX.Element => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const token = useStore(state => state.token)
    const setToken = useStore(state => state.setToken)
    const SIGNIN = process.env.NEXT_PUBLIC_API_SIGNIN ? process.env.NEXT_PUBLIC_API_SIGNIN : ''

    console.log(token)

    const handleSignIn = async (e: React.MouseEvent) => {

        const json: AuthResponse = await ky.post(SIGNIN, {
            body: JSON.stringify({
                Email: email,
                password: password
            }),
            headers: {
                'content-type': 'application/json'
            }
        }).json();

        // console.log(json)
        setToken(json.token)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const id = e.target.id;
        const value = e.target.value;

        switch(id){
            case 'password':
                setPassword(prev => value);
                return;
            case 'email':
                setEmail(prev => value);
                return;
            default:
                return;
        }
    }

    return <div className="login-container">
        <div className="login-form">
            <h3>MEMBERS AREA</h3>
            <h1>LOGIN</h1>
            <label htmlFor="">EMAIL</label>
            <input
                type='text'
                id='email'
                onChange={handleChange}
            />
            <label htmlFor="">PASSWORD</label>
            <input
                type='password'
                id='password'
                onChange={handleChange}
            />
            <button className="button-signin" onClick={handleSignIn}>
                SIGN IN
            </button>
            <span>Dont have account?</span>
            <a>Sign up</a>
        </div>
    </div>
}