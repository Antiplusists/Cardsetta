import { Component } from "react";
import { Route, Switch } from "react-router";
import { Layout } from "./Layout";
import Home from "../Home/Home";
import QAPage from "../QAPage/QAPage";
import СardsPreviewPage from "../CardsPreviewPage/CardsPreviewPage";
import QACardSettings from "../QACardSettings/QACardSettings"
import { FetchData } from "../FetchData";
import AuthorizeRoute from "../api-authorization/AuthorizeRoute";
import ApiAuthorizationRoutes from "../api-authorization/ApiAuthorizationRoutes";
import { ApplicationPaths } from "../api-authorization/ApiAuthorizationConstants";

import "./App.css";
import { setCard, getCardById } from "../../fakeRepository/fakeCards";
import CardsetSettings from "../CardsetSettings/CardsetSettings";
import { getCardsetById } from "../../fakeRepository/fakeCardsets";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cards/:id" render={(props) =>
            <QAPage cardsetId={props.match.params.id} />
          } />
          <Route path="/cards-preview/:id" render={(props) =>
            <СardsPreviewPage cardsetId={props.match.params.id} />
          } />
          <Route path="/card-settings/:id" render={(props) => {
            const card = getCardById(props.match.params.id);
            return <QACardSettings {...card} />
          }} />
          <Route path="/card-settings" render={() => {
            const card = getCardById(null);
            setCard(card);
            return (<QACardSettings {...card} />);
          }
          } />
          <Route path="/cardset-settings/:id" render={(props) => {
            const cardset = getCardsetById(props.match.params.id);
            return (<CardsetSettings {...cardset} />);
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