import SubmitButton from "../formelements/SubmitButton";
import { useFormik } from 'formik';
import { ChatIcon } from "@heroicons/react/solid";

import { CheckCircleIcon } from "@heroicons/react/solid";
import { ErrorMessage } from "../validation/ErrorMessage";
import { ValideMessage } from "../validation/ValideMessage";
import { CommentSchema } from "../schemas/CommentSchema";
import { useAddCommentMutation } from "src/store/rtk/comments";

interface AddCommentProps {
    postid: string
}

export default function AddComment(props: AddCommentProps) {

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

    const [ addComment ] = useAddCommentMutation();

    function handleOnSubmit() {
        addComment({text:formik.values.commentValue,author:'6203c5a8242f0b39eeb4e45a',post:props.postid});
        formik.resetForm();
    }

    return (
        <div className="addcomment mb-6">
            <div className="flex space-x-2">
                <ChatIcon className="h-5 w-5" />
                <h2 className="text-1xl font-medium mb-4">Ajouter un commentaire</h2>
            </div>
            <form onSubmit={formik.handleSubmit}>
                {formik.errors.commentValue ? <ErrorMessage>{formik.errors.commentValue}</ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Commentaire valide</span></ValideMessage>}
                <div className="pt-1">
                    <label htmlFor="commentValue" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Commentaire </label>
                    <div className="mt-1 sm:mt-0">
                        <textarea name="commentValue" rows={10} cols={50} onChange={formik.handleChange} value={formik.values.commentValue} className="p-3 shadow-sm block w-full h-24 sm:text-sm border border-gray-300 rounded-md"></textarea><br/>
                       {formik.isValid && <SubmitButton value="Ajouter" />}
                    </div>
                </div>
            </form>

        </div>
    );
}