import Title from "../textelements/Title";
import { useFormik } from 'formik';
import { UserInscriptionSchema } from "../schemas/UserInscriptionSchema";
import { ErrorMessage } from "../validation/ErrorMessage";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";
import { ValideMessage } from "../validation/ValideMessage";
import { useAddUserMutation } from "../store/rtk/user";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {

    const formik = useFormik(
        {
            initialValues: {
                username: '',
                email: '',
                password: '',
                confirmpassword: ''
            },
            validateOnMount: true,
            validationSchema:UserInscriptionSchema,
            onSubmit: handleOnSubmit
        }
    );

    const [ addUser, { data, isLoading, error } ] = useAddUserMutation();

    const navigate = useNavigate();

    async function handleOnSubmit() {

        addUser({username: formik.values.username, email: formik.values.email, password: formik.values.password});

    }

    useEffect(() => {
        if(data) {
            navigate('/login');
        }
    },[data])

    return (
        
        <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">

            <div className="bg-white px-6 py-8 rounded shadow text-black w-full border-2">
                <div className="text-center">
                    <Title>S'inscrire</Title>
                </div>

                { error && <div className="mb-4"><ErrorMessage> Erreur : Le pseudonyme est déjà utilisé ! </ErrorMessage></div> }

                <form onSubmit={formik.handleSubmit}>

                    { formik.touched.username && formik.errors.username && <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.username}</span></ErrorMessage> }
                    
                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
                        name="username"
                        placeholder="Pseudonyme"
                        onChange={(e) => { formik.setFieldTouched('username'); formik.handleChange(e) }}
                    />

                    { formik.touched.email && formik.errors.email && <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.email}</span></ErrorMessage>}

                    <input 
                        type="text"
                        className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
                        name="email"
                        placeholder="Email" 
                        onChange={(e) => { formik.setFieldTouched('email'); formik.handleChange(e) }}
                    />

                    { formik.touched.password && formik.errors.password && <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.password}</span></ErrorMessage>} 

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
                        name="password"
                        placeholder="Mot de passe" 
                        onChange={(e) => { formik.setFieldTouched('password'); formik.handleChange(e) }}
                    />

                    { formik.touched.confirmpassword && formik.errors.confirmpassword && <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.confirmpassword}</span></ErrorMessage>} 

                    <input 
                        type="password"
                        className="block border border-grey-light w-full p-3 rounded mb-4 mt-2"
                        name="confirmpassword"
                        placeholder="Confirmez le mot de passe" 
                        onChange={(e) => { formik.setFieldTouched('confirmpassword'); formik.handleChange(e) }}
                    />

                    <button
                        type="submit"
                        className="w-full text-center bg-blue-600 rounded-md p-2 text-white"
                    >S'inscrire</button>

                </form>

            </div>

            <div className="text-grey-dark mt-6">
                Vous avez déjà un compte ?
                <Link to="/login" className="no-underline border-b border-blue text-blue-600 ml-2">Se connecter</Link>.
            </div>
        </div>

    );
}