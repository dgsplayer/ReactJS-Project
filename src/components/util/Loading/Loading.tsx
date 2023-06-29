import styles from "./Loading.module.scss";
import { motion } from "framer-motion";
import { ReactComponent as LocalShippingIcon } from "../../../assets/icons/local_shipping.svg";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <motion.div
        initial={{ opacity: 0, translateX: -50 }}
        animate={{ opacity: 1, translateX: 0 }}
        className={styles.loading}
      >
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner}></div>

          <span>
            <LocalShippingIcon />
          </span>
        </div>

        <p>Carregando...</p>
      </motion.div>
    </div>
  );
};

export default Loading;
