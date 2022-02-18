import { useFormik } from "formik";
import SubmitButton from "../formelements/SubmitButton";
import { PostSchema } from "../schemas/PostSchema";

import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { ChangeEvent, useState } from "react";
import { useUpdatePostMutation } from "../store/rtk/post";
import { ErrorMessage } from "../validation/ErrorMessage";
import { ValideMessage } from "../validation/ValideMessage";
import { Post } from "src/types/post";

interface PostModificationProps {
    post: Post,
    stopModify: VoidFunction
}

export function PostModification(props : PostModificationProps) {
    
    const [postTitle, setPostTitle] = useState(props.post.title);
    const [postContent, setPostContent] = useState(props.post.text);

    const [ updatePost ] = useUpdatePostMutation();

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

    function handleTitleChange(event : ChangeEvent<HTMLInputElement>) {
        setPostTitle(event.target.value);
        formik.handleChange(event);
    }

    function handleContentChange(event : ChangeEvent<HTMLTextAreaElement>) {
        setPostContent(event.target.value);
        formik.handleChange(event);
    }

    function handleOnSubmit() {

        const {title, text, ...actualPost} = props.post;
        const postToUpdate = {...actualPost, title:postTitle, text:postContent};
        
        updatePost(postToUpdate);
        
        props.stopModify();

    }
    
    return(

        <div className="post-modification p-4 bg-blue-100 mb-4 shadow">

            <form onSubmit={formik.handleSubmit}>

                {formik.errors.title ? <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.title}</span></ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Titre valide</span></ValideMessage>}
                
                <div className='mb-2'>
                    <label htmlFor="titre"> Titre </label> <br/>
                    <input onChange={handleTitleChange} name="title" className="p-3 shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md" value={ postTitle } />
                </div>

                {formik.errors.content ? <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.content}</span></ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Contenu valide</span></ValideMessage>}
                
                <div className='mt-2 mb-4'>
                    <label htmlFor="content">Contenu</label> <br/>
                    <textarea onChange={handleContentChange} name="content" rows={10} cols={50} className="p-3 shadow-sm block w-full h-30 sm:text-sm border border-gray-300 rounded-md" value={ postContent } />
                </div>

                <SubmitButton value="Valider" />

            </form>
        </div>
    );
}