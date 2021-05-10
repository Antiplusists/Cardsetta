import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import QAPage from "./components/QAPage";
import СardsPreviewPage from "./components/CardsPreviewPage";
import { FetchData } from "./components/FetchData";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import "./custom.css";

export default class App extends Component {
  static displayName = App.name;
  
  render() {
    return (
      <Layout>
        <Route exact path="/" component={Home} />
        <Route path="/cards" component={QAPage} />
        <Route path="/cards-preview" component={СardsPreviewPage} />
        <AuthorizeRoute path="/fetch-data" component={FetchData} />
        <Route
          path={ApplicationPaths.ApiAuthorizationPrefix}
          component={ApiAuthorizationRoutes}
        />
      </Layout>
    );
  }
}
