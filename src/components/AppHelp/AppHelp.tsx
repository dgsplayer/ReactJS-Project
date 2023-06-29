import styles from "./AppHelp.module.scss";

const AppHelp = () => {
  return (
    <div className={styles.appHelpContainer}>
      <section>
        <h3>Cores dos marcadores</h3>

        <div className={styles.markersGrid}>
          <div className={styles.marker}>
            <img src="/marker-icon-blue.png" alt="Marcador Azul" />

            <p>HAWBs a serem entregues</p>
          </div>

          <div className={styles.marker}>
            <img src="/marker-icon-green.png" alt="Marcador Verde" />

            <p>Primeira HAWB (verde com uma casa representa a franquia)</p>
          </div>

          <div className={styles.marker}>
            <img src="/marker-icon-grey.png" alt="Marcador Cinza" />

            <p>Modo de edição para arrastar e reposicionar</p>
          </div>

          <div className={styles.marker}>
            <img src="/marker-icon-orange.png" alt="Marcador Laranja" />

            <p>Último marcador clicado</p>
          </div>

          <div className={styles.marker}>
            <img src="/marker-icon-purple.png" alt="Marcador Roxo" />

            <p>Última HAWB</p>
          </div>

          <div className={styles.marker}>
            <img src="/marker-icon-red.png" alt="Marcador Vermelho" />

            <p>HAWB removida</p>
          </div>
        </div>
      </section>

      <section>
        <h3>Cores das rotas</h3>

        <div className={styles.routes}>
          <div className={styles.route}>
            <span className={styles.blue}></span>

            <p>Rota de entrega das HAWBs com ponto de partida da franquia</p>
          </div>

          <div className={styles.route}>
            <span className={styles.red}></span>

            <p>
              Rota de retorno a franquia com ponto de partida da última HAWB
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AppHelp;
