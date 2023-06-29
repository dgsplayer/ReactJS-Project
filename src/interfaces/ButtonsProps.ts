import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  type: "button" | "submit" | "reset";
  color: "info" | "danger" | "warning" | "success";
  disabled?: boolean;
  onClick?: () => void;
}
