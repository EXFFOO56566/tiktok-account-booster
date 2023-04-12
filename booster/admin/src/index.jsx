import "@babel/polyfill";

import { ErrorBoundary } from "react-error-boundary";
import { ConnectedRouter } from "connected-react-router";
import React from "react";
import { ConfigProvider } from "antd";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import App from "@app/app";
import i18n from "./services/language";
import configureStore from "./redux/configureStore";
import history from "@app/utils/history";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="alert-boundary">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const MOUNT_NODE = document.getElementById("root-app");

import "@app/components/core/css/antd.less";
import "@app/components/core/css/core.scss";

import vi from "antd/es/locale/en_US";
import { PageLoading } from "@app/components/core/loading";

const render = () => {
  ReactDOM.render(
    <>
    <Provider store={configureStore}>
      <ConnectedRouter history={history}>
        <ConfigProvider locale={vi}>
          <I18nextProvider i18n={i18n}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                window.location.reload()
              }}
            >
              <App />
            </ErrorBoundary>
          </I18nextProvider>
        </ConfigProvider>
      </ConnectedRouter>
    </Provider>
    <PageLoading />
    </>
    ,
    MOUNT_NODE
  );
};

if (module.hot) {
  module.hot.accept(["./app"], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    render();
  });
}

render();

if (process.env.NODE_ENV === "stg") {
  require("offline-plugin/runtime").install(); // eslint-disable-line global-require
}
