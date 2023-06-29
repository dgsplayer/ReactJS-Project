import { Link } from "react-router-dom";
import GenericMapBackground from "../../components/util/GenericMapBackground/GenericMapBackground";
import styles from "./ListFinished.module.scss";

const ListFinishedPage = () => {
  return (
    <section className={styles.listFinishedContainer}>
      <div className={styles.listFinished}>
        <h3>Ordenação da lista encerrada!</h3>

        <p>Você pode fechar o app de roteirização agora</p>

        {process.env.REACT_APP_ENV_MODE === "DEVELOPMENT" && (
          <Link to={"/map"}>Voltar para o mapa</Link>
        )}
      </div>

      <GenericMapBackground />
    </section>
  );
};

export default ListFinishedPage;
