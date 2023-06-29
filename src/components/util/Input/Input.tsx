import { FC } from "react";
import { InputProps } from "../../../interfaces/InputProps";
import styles from "./Input.module.scss";

const Input: FC<InputProps> = ({
  value,
  onChange,
  name,
  errors,
  type = "text",
  placeholder,
  required,
  iconBtn,
}) => {
  return (
    <>
      <div className={styles.inputContainer}>
        <input
          className={`${styles.input} ${
            errors.length > 0 && `${styles.error}`
          }`}
          value={value}
          onChange={onChange}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          required={required}
        />

        {iconBtn && (
          <button type="submit" className={styles.iconBtn}>
            {iconBtn}
          </button>
        )}
      </div>

      {errors.length > 0 &&
        errors.map((error) => (
          <p key={error} className={styles.errorText}>
            {error}
          </p>
        ))}
    </>
  );
};
export default Input;
