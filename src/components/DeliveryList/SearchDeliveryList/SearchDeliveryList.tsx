import { FC } from "react";
import DeliveryListSearchForm from "../../Forms/DeliveryListSearchForm/DeliveryListSearchForm";
import styles from "./SearchDeliveryList.module.scss";

const SearchDeliveryList: FC = () => {
  return (
    <div className={styles.searchDeliveryList}>
      <DeliveryListSearchForm />
    </div>
  );
};

export default SearchDeliveryList;
