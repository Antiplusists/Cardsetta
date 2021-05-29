import "./App.css";
import { useState, useEffect } from 'react';
import { Route, Redirect, Switch } from "react-router";
import { Layout } from "./Layout";
import MainCardsets from "../Cardsets/MainCardsets";
import QAPage from "../QAPage/QAPage";
import CardsPreviewPage from "../CardsPreviewPage/CardsPreviewPage";
import CustomCardsets from "../Cardsets/CustomCardsets";
import { Register } from "../Authorization/Register";
import { Login } from "../Authorization/Login";
import Profile from "../Profile/Profile";
import AddQACard from "../QACardSettings/AddQACard";
import authService from "../api-authorization/AuthorizeService";
import AddCardset from "../CardsetSettings/AddCardset";
import EditCardset from "../CardsetSettings/EditCardset";
import EditQACard from "../QACardSettings/EditQACard";
import NotFound from "../NotFound/NotFound";


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    useEffect(() => {
        const updateState = () => {
            setIsAuthenticated(authService.isAuthenticated());
        }
        updateState();
        const subscribe = authService.subscribe(updateState);
        return () => authService.unsubscribe(subscribe);
    }, []);

    return (
        <Layout>
            <Switch>
                {isAuthenticated ? <Redirect from='/register' to='/' /> : null}
                {isAuthenticated ? <Redirect from='/login' to='/' /> : null}
                {!isAuthenticated ? <Redirect from='/custom-cardsets' to='/login' /> : null}
                {!isAuthenticated ? <Redirect from='/profile' to='/login' /> : null}
                {!isAuthenticated ? [
                    <Redirect from="/card-settings" to="/login" />,
                    <Redirect from="/card-creation" to="/login" />,
                    <Redirect from="/cardset-settings" to="/login" />,
                    <Redirect from="/cardset-creation" to="/login" />
                ] : null}
                <Route exact path="/" component={MainCardsets} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/custom-cardsets" component={CustomCardsets} />
                <Route exact path="/search" render={(props) =>
                    <MainCardsets key={props.location.pathname} />
                } />
                <Route path="/cards/:id" render={(props) =>
                    <QAPage deckId={props.match.params.id} />
                } />
                <Route exact path="/cards-preview/:id" render={(props) =>
                    <CardsPreviewPage deckId={props.match.params.id} />
                } />
                <Route exact path="/card-settings/:id" render={(props) =>
                    <EditQACard cardId={props.match.params.id} />
                } />
                <Route exact path="/card-creation" component={AddQACard} />
                <Route exact path="/cardset-settings/:id" render={(props) => (
                    <EditCardset deckId={props.match.params.id} />)
                } />
                <Route exact path="/cardset-creation" component={AddCardset} />
                <Route path='*' component={NotFound} />
            </Switch>
        </Layout>
    );
}