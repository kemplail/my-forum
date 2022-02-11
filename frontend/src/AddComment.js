import SubmitButton from "./SubmitButton";
import { useNavigate } from "react-router-dom";
import * as Yup from 'yup';
 import { useFormik } from 'formik';
 import axios from 'axios';

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
        <div className="addcomment">
            <h2>Ajouter un commentaire</h2>
            {formik.errors.commentValue && <div>{formik.errors.commentValue}</div>}
            <form onSubmit={formik.handleSubmit}>
                <textarea name="commentValue" rows="10" cols="50" onChange={formik.handleChange} value={formik.values.commentValue}></textarea><br/>
                <SubmitButton isValid={!formik.isValid} />
            </form>
        </div>
    );
}