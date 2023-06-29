import Form from "../../util/Form/Form";
import { useState } from "react";
import { loginFormSchema } from "../../../yup/schemas";
import getURLSearchParam from "../../../util/getURLSearchParam";
import makeRequest from "../../../services/makeRequest";
import Loading from "../../util/Loading/Loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../../util/manageCookies";
import { setLocalStorageItem } from "../../../util/manageLocalStorage";

const LoginForm = () => {
  const username = getURLSearchParam("login");

  const [usernameInputValue, setUsernameInputValue] = useState(
    username ? username : ""
  );
  const [passwordInputValue, setPasswordInputValue] = useState("");
  const [usernameErrors, setUsernameErrors] = useState<string[]>([]);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      setUsernameErrors([]);
      setPasswordErrors([]);

      await loginFormSchema.validate(
        {
          username: usernameInputValue,
          password: passwordInputValue,
        },
        { abortEarly: false }
      );

      const response = await makeRequest({
        url: `${process.env.REACT_APP_ROTAS_PEGASUS_BASE_URL}auth`,
        method: "post",
        options: {
          params: {
            login: usernameInputValue,
            senha: passwordInputValue,
          },
        },
      });

      if (response.hasOwnProperty("error")) {
        throw new Error(response.error.response.data.message);
      }

      setCookie("token", response.token, 1);
      setLocalStorageItem("username", usernameInputValue);

      navigate(`/map/${window.location.search}`);
    } catch (e: any) {
      if (e.errors) {
        e.errors.forEach((error: { [key: string]: string }) => {
          if (error.username) {
            setUsernameErrors([error.username]);
          }

          if (error.password) {
            setPasswordErrors([error.password]);
          }
        });
        return;
      }

      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        inputs={[
          {
            name: "username",
            label: "Usuário",
            value: usernameInputValue,
            onChange: (e) => setUsernameInputValue(e.currentTarget.value),
            errors: usernameErrors,
          },
          {
            type: "password",
            name: "password",
            label: "Senha",
            value: passwordInputValue,
            onChange: (e) => setPasswordInputValue(e.currentTarget.value),
            errors: passwordErrors,
          },
        ]}
        buttons={[
          {
            color: "success",
            children: "Entrar",
            type: "submit",
          },
        ]}
        onSubmit={onSubmit}
      />

      {isLoading && <Loading />}
    </>
  );
};

export default LoginForm;
