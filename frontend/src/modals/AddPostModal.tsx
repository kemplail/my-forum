import { useFormik } from 'formik';
import SubmitButton from "../formelements/SubmitButton";

import { PostSchema } from '../schemas/PostSchema';
import { Modal } from './Modal';

import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { CheckCircleIcon } from "@heroicons/react/solid";
import { useAddPostMutation } from '../store/rtk/post';
import { ErrorMessage } from '../validation/ErrorMessage';
import { ValideMessage } from '../validation/ValideMessage';
import { useEffect } from 'react';

export default function AddPostModal(props : any) {

    const formik = useFormik(
        {
            initialValues: {
                content: '',
                title: ''
            },
            validateOnMount: true,
            validationSchema:PostSchema,
            onSubmit: handleOnSubmit
        }
    );

    const [ addPost, { data } ] = useAddPostMutation();

    async function handleOnSubmit() {
        formik.resetForm();
        addPost({title:formik.values.title,text:formik.values.content,author:"6203c5a8242f0b39eeb4e45a"});
        props.close();
    }

    useEffect(() => {
            if(data) {
                alert(`${data.title} a été ajouté !`)
            }
    },[data])

    return (
          <Modal open={props.open} close={props.close} title="Ajouter un nouveau post" description="Ajout d'un nouveau post">

                   <form onSubmit={formik.handleSubmit}>
                       <div>

                            {formik.errors.title ? <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.title}</span></ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Titre valide</span></ValideMessage>}
                            
                            <div className='mb-2'>
                                <label htmlFor="titre">
                                    Titre
                                </label> <br/>
                                <input onChange={formik.handleChange} name="title" className="p-3 shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"/>
                            </div>

                            {formik.errors.content ? <ErrorMessage><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.content}</span></ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Contenu valide</span></ValideMessage>}
                            
                            <div className='mt-2 mb-4'>
                                <label htmlFor="content">
                                        Contenu
                                </label> <br/>
                                <textarea onChange={formik.handleChange} name="content" rows={10} cols={50} className="p-3 shadow-sm block w-full h-30 sm:text-sm border border-gray-300 rounded-md" />
                            </div>
                            
                       </div>

                       {formik.isValid && <SubmitButton value="Ajouter" />}
                       
                   </form>
        </Modal>
    );
}