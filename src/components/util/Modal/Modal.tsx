import { FC, ReactNode } from "react";
import { motion } from "framer-motion";
import styles from "./Modal.module.scss";
import BlackBackground from "../BlackBackground/BlackBackground";
import ReactDOM from "react-dom";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";

interface Props {
  closeModal?: () => void;
  padding?: boolean;
  children: ReactNode;
}

const Modal: FC<Props> = ({ closeModal, padding, children }) => {
  // Variants para a animação do framer-motion
  const dropIn = {
    hidden: {
      opacity: 0,
      y: "-100vh",
    },
    visible: {
      opacity: 1,
      y: "0",
      transition: {
        duration: 0.3,
        type: "spring",
      },
    },
    exit: {
      opacity: 0,
      y: "-80vh",
    },
  };

  // Criando um portal para renderizar o Modal
  return ReactDOM.createPortal(
    <BlackBackground closeBlackBg={closeModal}>
      <motion.div
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${styles.modal} ${
          padding && `${styles.padding}`
        } shadow-md all-rounded`}
      >
        <>
          <span className={styles.closeBtn} onClick={closeModal}>
            <CloseIcon />
          </span>

          {children}
        </>
      </motion.div>
    </BlackBackground>,
    document.getElementById("modal")!
  );
};

export default Modal;
