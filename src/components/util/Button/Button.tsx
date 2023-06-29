import { FC } from "react";
import styles from "./Button.module.scss";
import { ButtonProps } from "../../../interfaces/ButtonsProps";

const Button: FC<ButtonProps> = ({
  children,
  type = "button",
  color,
  disabled,
  onClick,
}) => {
  return (
    <button
      className={`${styles.button} ${styles[color]}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
