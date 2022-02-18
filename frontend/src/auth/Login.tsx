import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { useFormik } from "formik";
import { access } from "fs";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks";
import { UserLoginSchema } from "src/schemas/UserLoginSchema";
import store from "src/store";
import { loginUser } from "src/store/slices/user";
import Title from "src/textelements/Title";
import { ErrorMessage } from "src/validation/ErrorMessage";
import { ValideMessage } from "src/validation/ValideMessage";
import { LoginForm } from "./LoginForm";

export function Login() {

    const acessToken = useAppSelector((state) => state.user.access_token);
    const status = useAppSelector((state) => state.user.status);

    return(
        <div className="container max-w-md mx-auto flex-1 flex flex-col items-center justify-center px-2">

            <div className="bg-white px-6 py-8 rounded shadow text-black w-full border-2">

                { !acessToken ? <LoginForm /> : status === "failed" ? <ErrorMessage>Erreur : Veuillez vérifier vos identifiants</ErrorMessage> : <ValideMessage>Vous êtes connecté !</ValideMessage> }

            </div>

        </div>
    )

}