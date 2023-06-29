import React from "react";
import ReactDOM from "react-dom/client";
import DeliveryListProvider from "./contexts/DeliveryListContext";
import "./globalStyles/index.scss";
import { RouterProvider } from "react-router-dom";
import router from "./router/router";
import { ToastContainer } from "react-toastify";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <DeliveryListProvider>
      <RouterProvider router={router} />

      <ToastContainer draggablePercent={40} limit={3} position="top-center" />
    </DeliveryListProvider>
  </React.StrictMode>
);
