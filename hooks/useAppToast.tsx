import { UseToastOptions, useToast } from "@chakra-ui/react";
import { FiCheck } from "react-icons/fi";

type ToastType = "error" | "success";
export const useAppToast = () => {
  interface ToastOptions {
    title: string;
    message?: string;
    icon?: JSX.Element;
  }
  const toast = useToast();
  const handleColorScheme = (type: ToastType) => {
    switch (type) {
      case "error":
        return "red";
      case "success":
        return "primary";
      default:
        return;
    }
  };
  const handleOptionsByType = (
    type: ToastType,
    { title, icon, message }: ToastOptions
  ): UseToastOptions => ({
    colorScheme: handleColorScheme(type),
    title,
    icon,
    description: message,
    position: "top",
  });
  const toastSuccess = ({
    icon = <FiCheck size={"24"} />,
    ...options
  }: ToastOptions) => {
    toast(
      handleOptionsByType("success", {
        ...options,
        icon,
      })
    );
  };
  const toastError = (options: ToastOptions) => {
    toast(handleOptionsByType("error", options));
  };

  return {
    toastSuccess,
    toastError,
  };
};
