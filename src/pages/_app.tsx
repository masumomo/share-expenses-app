import App, { AppInitialProps, AppContext } from "next/app";
import React from "react";
import { wrapper } from "../redux/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { ThemeProvider } from "theme-ui";
import theme from "./theme";

class MyApp extends App<AppInitialProps> {
  public static getInitialProps = async ({ Component, ctx }: AppContext) => {
    ctx.store.dispatch({ type: "TOE", payload: "was set in _app" });

    //Anything returned here can be accessed by the client
    return {
      pageProps: {
        // Call page-level getInitialProps
        ...(Component.getInitialProps
          ? await Component.getInitialProps(ctx)
          : {}),
        // Some custom thing for all pages
        pathname: ctx.pathname,
      },
    };
  };

  render() {
    //Page props that were returned from 'getInitialProps' are stored in the props i.e. page props
    const { Component, pageProps } = this.props;

    return (
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}

export default wrapper.withRedux(MyApp);
