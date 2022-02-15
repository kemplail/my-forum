import { useFormik } from "formik";
import SubmitButton from "./SubmitButton";
import { PostSchema } from "./PostSchema";

import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useAppDispatch } from "./hooks";
import { updateAPost } from "./store/slices/post";

export function PostModification(props) {
    
    const [postTitle, setPostTitle] = useState(props.post.title);
    const [postContent, setPostContent] = useState(props.post.text);

    //updateAPost
    const dispatch = useAppDispatch();

    const formik = useFormik(
        {
            initialValues: {
                content: props.post.text,
                title: props.post.title
            },
            validateOnMount: true,
            validationSchema:PostSchema,
            onSubmit: handleOnSubmit
        }
    );

    function handleTitleChange(event) {
        setPostTitle(event.target.value);
        formik.handleChange(event);
    }

    function handleContentChange(event) {
        setPostContent(event.target.value);
        formik.handleChange(event);
    }

    function handleOnSubmit() {

        const {title, text, ...actualPost} = props.post;
        const postToAdd = {...actualPost, title:postTitle, text:postContent};
    
        dispatch(updateAPost(postToAdd));
        props.stopModify();

    }
    
    return(
        <div className="post-modification p-4 bg-blue-100 mb-4 shadow">
            <form onSubmit={formik.handleSubmit}>
                {formik.errors.title ? <div className="text-red-700 flex space-x-2"><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.title}</span></div> : <div className="text-green-700 flex space-x-2"><CheckCircleIcon className="h-5 w-5"/><span>Titre valide</span></div>}
                <div className='mb-2'>
                    <label htmlFor="titre"> Titre </label> <br/>
                    <input onChange={handleTitleChange} name="title" className="p-3 shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md" value={ postTitle } />
                </div>
                {formik.errors.content ? <div className="text-red-700 flex space-x-2"><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.content}</span></div> : <div className="text-green-700 flex space-x-2"><CheckCircleIcon className="h-5 w-5"/><span>Contenu valide</span></div>}
                <div className='mt-2 mb-4'>
                    <label htmlFor="content">Contenu</label> <br/>
                    <textarea onChange={handleContentChange} name="content" rows={10} cols={50} className="p-3 shadow-sm block w-full h-30 sm:text-sm border border-gray-300 rounded-md" value={ postContent } />
                </div>
                <SubmitButton title="Valider" />
            </form>
        </div>
    );
}