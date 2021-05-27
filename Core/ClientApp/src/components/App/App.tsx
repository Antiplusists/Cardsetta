import "./App.css";
import { Component } from "react";
import { Route, Redirect } from "react-router";
import { Layout } from "./Layout";
import MainCardsets from "../Cardsets/MainCardsets";
import QAPage from "../QAPage/QAPage";
import CardsPreviewPage from "../CardsPreviewPage/CardsPreviewPage";
import QACardSettings from "../QACardSettings/QACardSettings"
import CustomCardsets from "../Cardsets/CustomCardsets";
import { Register } from "../Authorization/Register";
import { Login } from "../Authorization/Login";
import Profile from "../Profile/Profile";
import QACardCreation from "../QACardCreation/QACardCreation";
import authService from "../api-authorization/AuthorizeService";
import AddCardset from "../CardsetSettings/AddCardset";
import EditCardset from "../CardsetSettings/EditCardset";

export default class App extends Component {
  static displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={MainCardsets} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/custom-cardsets" component={CustomCardsets} />
        <Route path="/cards/:id" render={(props) =>
          <QAPage deckId={props.match.params.id} />
        } />
        <Route exact path="/cards-preview/:id" render={(props) =>
          <CardsPreviewPage deckId={props.match.params.id} />
        } />
        <Route exact path="/card-settings/:id" render={(props) => {
          return <QACardSettings cardId={props.match.params.id} />
        }} />
        <Route path="/card-creation" component={QACardCreation} />
        <Route path="/cardset-settings/:id" render={(props) => (
          <EditCardset deckId={props.match.params.id} />)
        } />
        <Route path="/cardset-creation" component={AddCardset} />
        {!authService.isAuthenticated() ? <Redirect from='/custom-cardsets' to='/login' /> : null}
        {authService.isAuthenticated() ? <Redirect from='/login' to='/' /> : null}
        {authService.isAuthenticated() ? <Redirect from='/register' to='/' /> : null}
      </Layout>
    );
  }
}
