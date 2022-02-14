import { Dialog } from '@headlessui/react'
import Title from './Title';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import SubmitButton from "./SubmitButton";

import { ExclamationCircleIcon } from "@heroicons/react/solid";
import { CheckCircleIcon } from "@heroicons/react/solid";

const PostSchema = Yup.object().shape({
    content: Yup.string()
      .min(30, 'Trop court!')
      .required('Champs requis'),
    title: Yup.string()
      .min(5, 'Trop court!')
      .required('Champs requis')
});

export default function AddPostModal(props) {

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

    async function handleOnSubmit() {
        const { data } = await axios.post('http://localhost:5000/posts', {title:formik.values.title,text:formik.values.content,author:"6203c5a8242f0b39eeb4e45a"});
        formik.resetForm();
        props.onAdd(data);
        props.close();
    }

    return (
          <Dialog open={props.open} onClose={props.close} className="fixed z-10 inset-0 overflow-y-auto">
            
            <div className='flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>

                <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-75" />

                <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6'>
                    <Dialog.Title><Title as="span" name="Ajouter un nouveau post" /></Dialog.Title>
                    <Dialog.Description className='mb-4'>
                        Veuillez renseigner les champs suivants afin de créer un nouveau post.
                    </Dialog.Description>

                   <form onSubmit={formik.handleSubmit}>
                       <div>
                       {formik.errors.title ? <div className="text-red-700 flex space-x-2"><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.title}</span></div> : <div className="text-green-700 flex space-x-2"><CheckCircleIcon className="h-5 w-5"/><span>Titre valide</span></div>}
                        <div className='mb-2'>
                            <label htmlFor="titre">
                                Titre
                            </label> <br/>
                            <input onChange={formik.handleChange} name="title" className="p-3 shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md"/>
                        </div>
                        {formik.errors.content ? <div className="text-red-700 flex space-x-2"><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.content}</span></div> : <div className="text-green-700 flex space-x-2"><CheckCircleIcon className="h-5 w-5"/><span>Contenu valide</span></div>}
                        <div className='mt-2 mb-4'>
                            <label htmlFor="content">
                                    Contenu
                            </label> <br/>
                            <textarea onChange={formik.handleChange} name="content" rows="10" cols="50" className="p-3 shadow-sm block w-full h-30 sm:text-sm border border-gray-300 rounded-md" />
                        </div>
                       </div>
                       {formik.isValid && <SubmitButton />}
                   </form>
                </div>
            </div>

          </Dialog>
    );
}