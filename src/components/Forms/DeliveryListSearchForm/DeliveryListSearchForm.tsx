import { FormEvent, useContext, useState } from "react";
import { deliveryListContext } from "../../../contexts/DeliveryListContext";
import { searchListFormSchema } from "../../../yup/schemas";
import Form from "../../util/Form/Form";
import { ReactComponent as SearchIcon } from "../../../assets/icons/search.svg";

const DeliveryListSearch = () => {
  const { fetchDeliveryList } = useContext(deliveryListContext);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const onChange = (e: FormEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === "") {
      setErrors([]);
    }

    if (errors.length > 0) {
      setErrors([]);
    }

    setSearchInputValue(e.currentTarget.value);
  };

  const searchList = async () => {
    try {
      await searchListFormSchema.validate(
        {
          searchList: searchInputValue,
        },
        { abortEarly: false }
      );

      fetchDeliveryList(Number(searchInputValue));
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
          name: "searchList",
          errors,
          onChange,
          value: searchInputValue,
          placeholder: "Pesquisar por número da lista",
          required: true,
          iconBtn: <SearchIcon />,
        },
      ]}
      onSubmit={() => searchList()}
    />
  );
};

export default DeliveryListSearch;
