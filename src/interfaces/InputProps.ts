import { FormEvent, ReactNode } from "react";

export interface InputProps {
  value: string;
  onChange: (e: FormEvent<HTMLInputElement>) => void;
  name: string;
  errors: string[];
  placeholder?: string;
  label?: string;
  type?: string;
  observation?: string;
  required?: boolean;
  iconBtn?: ReactNode;
}
