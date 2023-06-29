import { AnimatePresence } from "framer-motion";
import { FC, ReactNode, useEffect, useState } from "react";
import Button from "../util/Button/Button";
import Modal from "../util/Modal/Modal";
import styles from "./MenuItem.module.scss";

interface Props {
  text: string;
  icon: ReactNode;
  onClick: () => void;
  shouldDisableBtnAfterClick?: boolean;
  initialDisabledCountdown?: number;
  enableModal?: boolean;
  modalContent?: { title: string; text: string; HTMLcontent?: ReactNode };
  dangerColor?: boolean;
}

const MenuItem: FC<Props> = ({
  text,
  icon,
  onClick,
  shouldDisableBtnAfterClick,
  initialDisabledCountdown,
  enableModal,
  modalContent,
  dangerColor,
}) => {
  const [disabledCountdownStarted, setDisabledCountdownStarted] =
    useState(false);
  const [countdown, setCountdown] = useState(initialDisabledCountdown);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClick = () => {
    if (shouldDisableBtnAfterClick) {
      setDisabledCountdownStarted(true);

      setTimeout(() => {
        setDisabledCountdownStarted(false);
        setCountdown(initialDisabledCountdown);
      }, initialDisabledCountdown! * 1000);
    }

    if (enableModal) {
      openModal();
    }

    if (!enableModal) {
      onClick();
    }
  };

  const onModalConfirmation = () => {
    onClick();
    closeModal();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (disabledCountdownStarted) {
      interval = setInterval(() => {
        if (countdown) {
          setCountdown(countdown - 1);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [countdown, initialDisabledCountdown, disabledCountdownStarted]);

  return (
    <>
      <li
        className={`${styles.menuItem} ${
          disabledCountdownStarted && styles.disabled
        } ${dangerColor && styles.dangerColor}`}
        onClick={handleClick}
      >
        <span>{icon}</span>
        <p>{text}</p>

        {disabledCountdownStarted && (
          <div className={styles.disabledCountdown}>
            Espere {countdown}s para roteirizar
          </div>
        )}
      </li>

      {enableModal && modalContent && (
        <AnimatePresence>
          {isModalOpen && (
            <Modal closeModal={closeModal} padding={true}>
              <div className="modalContent">
                <h3>{modalContent.title}</h3>

                <p>{modalContent.text}</p>

                <span className="divider"></span>

                {modalContent.HTMLcontent ? (
                  modalContent.HTMLcontent
                ) : (
                  <div>
                    <Button type="button" color="danger" onClick={closeModal}>
                      Não
                    </Button>
                    <Button
                      type="button"
                      color="success"
                      onClick={onModalConfirmation}
                    >
                      Sim
                    </Button>
                  </div>
                )}
              </div>
            </Modal>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default MenuItem;
