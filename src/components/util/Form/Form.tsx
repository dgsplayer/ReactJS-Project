import { FC, FormEvent } from "react";
import { ButtonProps } from "../../../interfaces/ButtonsProps";
import { InputProps } from "../../../interfaces/InputProps";
import Button from "../Button/Button";
import Input from "../Input/Input";
import styles from "./Form.module.scss";

interface Props {
  inputs: InputProps[];
  buttons?: ButtonProps[];
  onSubmit: () => void;
}

const Form: FC<Props> = ({ inputs, buttons, onSubmit }) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {inputs.map((input) => (
        <div key={input.name} className={styles.inputWrapper}>
          <label htmlFor={input.name} className={styles.label}>
            {input.label}
          </label>

          <Input {...input} />

          {input.observation && (
            <p className={styles.observation}>* {input.observation}</p>
          )}
        </div>
      ))}

      {buttons && (
        <div className={styles.buttonsWrapper}>
          {buttons.map((button, index) => (
            <Button key={index} {...button}>
              {button.children}
            </Button>
          ))}
        </div>
      )}
    </form>
  );
};

export default Form;
