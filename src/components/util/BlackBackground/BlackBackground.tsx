import { FC, MouseEvent, ReactNode } from "react";
import styles from "./BlackBackground.module.scss";

interface Props {
  closeBlackBg?: () => void;
  children: ReactNode;
}

const BlackBackground: FC<Props> = ({ closeBlackBg, children }) => {
  // Função para fechar o BlackBg caso
  // o usuário clique nele
  const handleClickOutside = (e: MouseEvent) => {
    if (e.target === e.currentTarget && closeBlackBg) {
      closeBlackBg();
    }
  };

  return (
    <div className={styles.blackBg} onClick={handleClickOutside}>
      {children}
    </div>
  );
};

export default BlackBackground;
