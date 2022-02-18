import * as Yup from 'yup';

export const UserInscriptionSchema = Yup.object().shape({
    username: Yup.string()
      .min(5, "Votre nom d'utilisateur doit faire au moins 5 caractères")
      .required('Champs requis'),
    email: Yup.string()
      .email('Votre email doit être une email valide')
      .required('Champs requis'),
    password: Yup.string()
        .required('Champs requis')
        .min(6, "Votre mot de passe doit faire au moins 6 caractères"),
    confirmpassword: Yup.string()
        .required('Champs requis')
        .oneOf([Yup.ref('password'), null], 'Les mots de passe ne sont pas identiques')
});