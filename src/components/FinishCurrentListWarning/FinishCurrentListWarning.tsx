import styles from "./FinishCurrentListWarning.module.scss";

const FinishCurrentListWarning = () => {
  return (
    <div className={styles.finishCurrentList}>
      <div className={styles.header}>
        <span>cancel</span>

        <h3>Atenção</h3>
      </div>
      <div className={styles.body}></div>
    </div>
  );
};

export default FinishCurrentListWarning;
