import { Formik, Form, Field, ErrorMessage } from 'formik';
import React from 'react';
import logo from '../assets/image.png'
import api from '../config/ConfigAPI'
import { useNavigate } from 'react-router-dom';

type Errors = {
    email?:string,
    password?:string,
}
interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    avatar: string | null;
    type: string;
    created: string;
    modified: string;
    role: string;
  }
  
  interface Tokens {
    refresh: string;
    access: string;
  }
  
  interface UserData {
    user: User;
    tokens: Tokens;
  }

const Login:React.FC = () =>{

    const navigate = useNavigate()
    
    return(
        <div className="bg-white flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow-md w-80">
                <img src={logo} alt="b2bit" className="mx-auto mb-6 w-42 h-42"/>
                <Formik
                initialValues={{ email: 'cliente@youdrive.com', password: 'password' }}
                validate={values => {
                    const errors:Errors = {};
                    if (!values.email) {
                    errors.email = 'Required';
                    } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                    errors.email = 'Invalid email address';
                    }
                    return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                    api.post<UserData>("/auth/login/", {...values}, {
                        headers:{
                            Accept:'application/json;version=v1_web',
                            "Content-Type":'application/json'
                        }
                    }).then((response)=>{
                        localStorage.setItem('token', response.data.tokens.access)
                        navigate('/profile')
                    }).catch((error)=> alert(error.response.data.detail)).finally(()=> setSubmitting(false))
                }}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <div className="mb-5">
                                <label htmlFor="email" className="block mb-2 text-sm text-gray-600">E-mail</label>
                                <Field type="email" name="email" id="email" placeholder="@gmail.com" className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500" />
                                <ErrorMessage name="email" component="div" />
                            </div>
                            <div className="mb-5">
                                <label htmlFor="password" className="block mb-2 text-sm text-gray-600">Senha</label>
                                <Field type="password" name="password" id="password" placeholder="•••••••••" className="w-full px-3 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-blue-500" />
                                <ErrorMessage name="password" component="div" />
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full py-2 px-3 bg-blue-500 text-white text-center font-bold rounded-md hover:bg-blue-600">Entrar</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default Login;