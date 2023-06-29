import styles from "./Menu.module.scss";
import MenuItem from "./MenuItem";
import { motion, useAnimation } from "framer-motion";
import { useContext, useEffect, useMemo, useState } from "react";
import { deliveryListContext } from "../../contexts/DeliveryListContext";
import { ReactComponent as MenuIcon } from "../../assets/icons/menu.svg";
import { ReactComponent as SettingsIcon } from "../../assets/icons/settings.svg";
import { ReactComponent as SaveIcon } from "../../assets/icons/save.svg";
import { ReactComponent as RouteIcon } from "../../assets/icons/route.svg";
import { ReactComponent as CancelIcon } from "../../assets/icons/cancel.svg";
import { ReactComponent as LogoutIcon } from "../../assets/icons/logout.svg";
import { ReactComponent as HelpIcon } from "../../assets/icons/help.svg";
import { toast } from "react-toastify";
import SettingsForm from "../Forms/SettingsForm/SettingsForm";
import { useNavigate } from "react-router-dom";
import { removeCookie } from "../../util/manageCookies";
import AppHelp from "../AppHelp/AppHelp";

interface Animations {
  opacity: number;
  translateX: string;
  pointerEvents:
    | "all"
    | "none"
    | "initial"
    | "inherit"
    | "fill"
    | "stroke"
    | "-moz-initial"
    | "revert"
    | "revert-layer"
    | "unset"
    | "auto"
    | "painted"
    | "visible"
    | "visibleFill"
    | "visiblePainted";
}

const Menu = () => {
  const {
    routeDeliveryList,
    deliveryList,
    saveReorderedList,
    resetDeliveryList,
  } = useContext(deliveryListContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const animation = useAnimation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen((state) => !state);
  };

  /* Animations to open and close the list */
  const animations = useMemo(() => {
    return {
      fadeInFromLeft: {
        initial: { opacity: 0, translateX: "-50px" },
        start: { opacity: 1, translateX: "0px", pointerEvents: "all" },
      },
      fadeOutFromLeft: {
        initial: { opacity: 1, translateX: "0px" },
        start: { opacity: 0, translateX: "-50px", pointerEvents: "none" },
      },
    };
  }, []);

  /* Function that resets the current delivery list */
  const handleFinishList = () => {
    resetDeliveryList();
    toast.dismiss();
    toast.error("Reordenaçao cancelada!", { autoClose: false });
    navigate("/list-finished");
  };

  useEffect(() => {
    if (isMenuOpen) {
      animation.start(animations.fadeInFromLeft.start as Animations);
      return;
    }

    animation.start(animations.fadeOutFromLeft.start as Animations);
  }, [isMenuOpen, animation, animations]);

  return (
    <nav className={styles.menuContainer}>
      <div className={styles.hamburguerBtn} onClick={toggleMenu}>
        <MenuIcon />
      </div>

      <div className={styles.menuWrapper}>
        <motion.ul
          initial={
            isMenuOpen
              ? animations.fadeInFromLeft.initial
              : animations.fadeOutFromLeft.initial
          }
          animate={animation}
          transition={{
            type: "spring",
            duration: 0.5,
          }}
          className={styles.menu}
        >
          {deliveryList && (
            <>
              <MenuItem
                text="Roterizar HAWBs"
                icon={<RouteIcon />}
                onClick={() => routeDeliveryList(deliveryList!)}
                shouldDisableBtnAfterClick={true}
                initialDisabledCountdown={60}
              />

              <MenuItem
                text="Salvar lista reordenada"
                icon={<SaveIcon />}
                onClick={() => {
                  saveReorderedList();
                  navigate("/list-finished");
                }}
                enableModal={true}
                modalContent={{
                  title: "Atenção",
                  text: "Deseja finalizar e salvar a nova reordenação da lista?",
                }}
              />

              <span className={styles.divider}></span>
            </>
          )}

          <MenuItem
            text="Configurações"
            icon={<SettingsIcon />}
            onClick={() => {}}
            enableModal={true}
            modalContent={{
              title: "Configurações",
              text: "Customize o app conforme suas necessidades",
              HTMLcontent: <SettingsForm />,
            }}
          />

          <MenuItem
            text="Ajuda com o app"
            icon={<HelpIcon />}
            onClick={() => {}}
            enableModal={true}
            modalContent={{
              title: "Ajuda com o app",
              text: "Tire suas dúvidas em como utilizar o app e o que cada cor e ícone significa",
              HTMLcontent: <AppHelp />,
            }}
          />

          <span className={styles.divider}></span>

          {deliveryList && (
            <MenuItem
              text="Cancelar reordenação"
              icon={<CancelIcon />}
              onClick={() => handleFinishList()}
              enableModal={true}
              modalContent={{
                title: "Atenção",
                text: "Deseja realmente cancelar a reordenação da lista?",
              }}
              dangerColor={true}
            />
          )}

          <MenuItem
            text="Sair"
            icon={<LogoutIcon />}
            onClick={() => {
              toast.dismiss();
              resetDeliveryList();
              removeCookie("token");
              navigate("/login");
            }}
            enableModal={true}
            modalContent={{
              title: "Atenção",
              text: deliveryList
                ? "Deseja realmente sair? A ordenação da lista atual será cancelada e qualquer alteração feita será perdida"
                : "Deseja realmente sair?",
            }}
            dangerColor={true}
          />
        </motion.ul>
      </div>
    </nav>
  );
};

export default Menu;
