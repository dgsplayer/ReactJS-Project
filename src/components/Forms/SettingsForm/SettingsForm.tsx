import Form from "../../util/Form/Form";
import { useState, FormEvent } from "react";
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from "../../../util/manageLocalStorage";
import { settingsFormSchema } from "../../../yup/schemas";
import { toast } from "react-toastify";

const SettingsForm = () => {
  // States for the form
  const [maxDistanceFromFranchise, setMaxDistanceFromFranchise] = useState(
    getLocalStorageItem("maxDistanceFromFranchise")
      ? getLocalStorageItem("maxDistanceFromFranchise")
      : ""
  );
  const [errors, setErrors] = useState<string[]>([]);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    setMaxDistanceFromFranchise(e.currentTarget.value);
  };

  // onSubmit for the settings form
  const onSubmit = async () => {
    try {
      await settingsFormSchema.validate(
        {
          maxDistanceFromFranchise,
        },
        { abortEarly: false }
      );

      if (errors.length > 0) {
        setErrors([]);
      }

      setLocalStorageItem("maxDistanceFromFranchise", maxDistanceFromFranchise);
      toast.success("Configurações atualizadas!");
    } catch (e: any) {
      setErrors((errors) => {
        const error = errors.find((error) => (error = e.message));

        if (error) {
          return errors;
        }

        return [...errors, e.message];
      });
    }
  };

  return (
    <Form
      inputs={[
        {
          name: "maxDistanceFromFranchise",
          label: "Distância máxima da franquia (Km)",
          observation:
            "Caso uma HAWB esteja mais longe da franquia do que o limite, ela será automaticamente removida (ao atualizar essa configuração, ela será válida apenas para a próxima lista iniciada)",
          errors,
          value: maxDistanceFromFranchise,
          onChange,
          required: true,
        },
      ]}
      buttons={[
        {
          children: "Salvar",
          color: "success",
          type: "submit",
        },
      ]}
      onSubmit={onSubmit}
    />
  );
};

export default SettingsForm;
