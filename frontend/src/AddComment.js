import SubmitButton from "./SubmitButton";
import * as Yup from 'yup';
 import { useFormik } from 'formik';
 import axios from 'axios';
 import { ChatIcon } from "@heroicons/react/solid";

 import { ExclamationCircleIcon } from "@heroicons/react/solid";
 import { CheckCircleIcon } from "@heroicons/react/solid";

const CommentSchema = Yup.object().shape({
    commentValue: Yup.string()
      .min(15, 'Trop court!')
      .required('Champs requis'),
});

export default function AddComment(props) {

    const formik = useFormik(
        {
            initialValues: {
                commentValue: ''
            },
            validateOnMount: true,
            validationSchema:CommentSchema,
            onSubmit: handleOnSubmit
        }
    );

    async function handleOnSubmit() {
        const { data } = await axios.post('http://localhost:5000/comments', {text:formik.values.commentValue,author:'6203c5a8242f0b39eeb4e45a',post:props.postid});
        formik.resetForm();
        props.onAdd(data);
    }

    return (
        <div className="addcomment mb-6">
            <div className="flex space-x-2">
                <ChatIcon className="h-5 w-5" />
                <h2 className="text-1xl font-medium mb-4">Ajouter un commentaire</h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
                {formik.errors.commentValue ? <div className="text-red-700 flex space-x-2"><ExclamationCircleIcon className="h-5 w-5" /><span>{formik.errors.commentValue}</span></div> : <div className="text-green-700 flex space-x-2"><CheckCircleIcon className="h-5 w-5"/><span>Commentaire valide</span></div>}
                <div className="pt-1">
                    <label htmlFor="commentValue" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Commentaire </label>
                    <div className="mt-1 sm:mt-0">
                        <textarea name="commentValue" rows="10" cols="50" onChange={formik.handleChange} value={formik.values.commentValue} className="p-3 shadow-sm block w-full h-24 sm:text-sm border border-gray-300 rounded-md"></textarea><br/>
                       {formik.isValid && <SubmitButton />}
                    </div>
                </div>
            </form>

        </div>
    );
}