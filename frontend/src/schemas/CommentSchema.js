import * as Yup from 'yup';

export const CommentSchema = Yup.object().shape({
    commentValue: Yup.string()
      .min(15, 'Trop court!')
      .required('Champs requis'),
});