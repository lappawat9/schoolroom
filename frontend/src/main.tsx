import React from "react";
import "@ant-design/v5-patch-for-react-19";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App as AntApp, ConfigProvider } from "antd";
import thTH from "antd/locale/th_TH";
import dayjs from "dayjs";
import "dayjs/locale/th";
import App from "./App";
import "./styles.css";
dayjs.locale("th");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          colorPrimary: "#25634e",
          colorInfo: "#25634e",
          colorBgLayout: "#f5f6f2",
          colorText: "#253b32",
          colorTextSecondary: "#7b8880",
          borderRadius: 9,
          fontFamily: '"Noto Sans Thai", Tahoma, sans-serif',
          controlHeight: 40,
        },
        components: {
          Table: {
            headerBg: "#f5f7f3",
            headerColor: "#697a70",
            cellPaddingBlock: 18,
          },
          Modal: { titleFontSize: 20 },
          Button: { primaryShadow: "none" },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
