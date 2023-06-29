import LoginForm from "../../components/Forms/LoginForm/LoginForm";
import styles from "./Login.module.scss";
import { Navigate } from "react-router-dom";
import GenericMapBackground from "../../components/util/GenericMapBackground/GenericMapBackground";
import { getCookie } from "../../util/manageCookies";

const LoginPage = () => {
  const token = getCookie("token");

  if (token) {
    return <Navigate to={`/map/${window.location.search}`} />;
  }

  return (
    <section className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h3>Confirme sua senha</h3>
        <p>(a mesma do Flash Pegasus)</p>

        <LoginForm />
      </div>

      <GenericMapBackground />
    </section>
  );
};

export default LoginPage;
