import * as yup from "yup";

const searchListFormSchema = yup.object().shape({
  searchList: yup.number().required().typeError("A lista deve ser um número"),
});

const settingsFormSchema = yup.object().shape({
  maxDistanceFromFranchise: yup
    .number()
    .typeError("A distância deve ser um número")
    .required(),
});

const loginFormSchema = yup.object().shape({
  username: yup.string().required({ username: "Por favor, digite um usuário" }),
  password: yup.string().required({ password: "Por favor, digite uma senha" }),
});

export { searchListFormSchema, settingsFormSchema, loginFormSchema };
