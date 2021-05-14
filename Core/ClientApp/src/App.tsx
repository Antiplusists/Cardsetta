import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./components/Home";
import QAPage from "./components/QAPage";
import СardsPreviewPage from "./components/CardsPreviewPage";
import QACardSettings from "./components/QACardSettings"
import { FetchData } from "./components/FetchData";
import AuthorizeRoute from "./components/api-authorization/AuthorizeRoute";
import ApiAuthorizationRoutes from "./components/api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "./components/api-authorization/ApiAuthorizationConstants";

import { Cards } from "./fakeCards"

import "./custom.css";
import { CardInfo } from "./types/CardInfo";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cards/:id" render={(props) =>
            <QAPage setId={props.match.params.id} />
          } />
          <Route path="/cards-preview/:id" render={(props) =>
            <СardsPreviewPage setId={props.match.params.id} />
          } />
          <Route path="/card-settings/:id" render={(props) =>
            <QACardSettings id={props.match.params.id}
              questionText={Cards[props.match.params.id].questionText}
              questionImg={Cards[props.match.params.id].questionImg}
              answearText={Cards[props.match.params.id].answearText} />
          } />
          <Route path="/card-settings" render={(props) => {
            const card: CardInfo = { id: Cards.length, questionText: '', answearText: '' };
            Cards.push(card);
            return (<QACardSettings id={card.id}
              questionText={card.questionText}
              answearText={card.answearText} />);
          }
          } />
          <AuthorizeRoute path="/fetch-data" component={FetchData} />
          <Route
            path={ApplicationPaths.ApiAuthorizationPrefix}
            component={ApiAuthorizationRoutes}
          />
        </Switch>
      </Layout>
    );
  }
}
