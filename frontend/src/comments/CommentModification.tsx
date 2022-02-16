import SubmitButton from "../formelements/SubmitButton";
import { useFormik } from 'formik';

import { CheckCircleIcon } from "@heroicons/react/solid";
import { ErrorMessage } from "../validation/ErrorMessage";
import { ValideMessage } from "../validation/ValideMessage";
import { CommentSchema } from "../schemas/CommentSchema";
import { ChangeEvent, useState } from "react";
import { useUpdateCommentMutation } from "src/store/rtk/comments";
import { Comment } from "src/types/comment";

interface CommentModificationProps {
    onStopModify: VoidFunction,
    comment: Comment
}

export function CommentModification(props : CommentModificationProps) {
    
    const [commentContent, setCommentContent] = useState(props.comment.text);

    const [ updateComment ] = useUpdateCommentMutation();

    const formik = useFormik(
        {
            initialValues: {
                commentValue: props.comment.text
            },
            validateOnMount: true,
            validationSchema:CommentSchema,
            onSubmit: handleOnSubmit
        }
    );

    function handleContentChange(event : ChangeEvent<HTMLTextAreaElement>) {
        setCommentContent(event.target.value);
        formik.handleChange(event);
    }

    function handleOnSubmit() {

        const { text, ...actualComment } = props.comment
        updateComment({ ...actualComment, text:formik.values.commentValue });
        
        formik.resetForm();
        props.onStopModify();

    }
    
    return (
        <div className="mt-4">
            <form onSubmit={formik.handleSubmit}>
                {formik.errors.commentValue ? <ErrorMessage>{formik.errors.commentValue}</ErrorMessage> : <ValideMessage><CheckCircleIcon className="h-5 w-5"/><span>Commentaire valide</span></ValideMessage>}
                <div className="pt-1">
                    <label htmlFor="commentValue" className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"> Commentaire </label>
                    <div className="mt-1 sm:mt-0">
                        <textarea name="commentValue" rows={10} cols={50} onChange={handleContentChange} className="p-3 shadow-sm block w-full h-24 sm:text-sm border border-gray-300 rounded-md" value={ commentContent } /><br/>
                       {formik.isValid && <SubmitButton value="Valider" />}
                    </div>
                </div>
            </form>
        </div>
    )
}