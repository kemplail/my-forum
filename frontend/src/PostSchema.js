import * as Yup from 'yup';

export const PostSchema = Yup.object().shape({
    content: Yup.string()
      .min(30, 'Trop court!')
      .required('Champs requis'),
    title: Yup.string()
      .min(5, 'Trop court!')
      .required('Champs requis')
});