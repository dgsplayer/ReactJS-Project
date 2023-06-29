import { FC } from "react";
import formatTime from "../../util/formatTime";
import styles from "./RouteDetails.module.scss";

interface Props {
  time: number;
  amount: number;
}

const RouteDetails: FC<Props> = ({ time, amount }) => {
  return (
    <div className={styles.routeDetails}>
      <p>
        Duração estimada da rota: <strong>{formatTime(time)}h</strong>
      </p>
      <p>
        Quantidade de HAWBs: <strong>{amount}</strong>
      </p>
    </div>
  );
};

export default RouteDetails;
