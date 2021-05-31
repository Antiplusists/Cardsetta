import "./App.css";
import { useState, useEffect } from 'react';
import { Route, Redirect, Switch } from "react-router";
import { Layout } from "./Layout";
import MainDecks from "../Decks/MainDecks";
import CardsPreviewPage from "../CardsPreviewPage/CardsPreviewPage";
import CustomDecks from "../Decks/CustomDecks";
import { Register } from "../Authorization/Register";
import { Login } from "../Authorization/Login";
import Profile from "../Profile/Profile";
import AddCard from "../CardSettings/AddCard";
import authService from "../api-authorization/AuthorizeService";
import AddDeck from "../DeckSettings/AddDeck";
import EditDeck from "../DeckSettings/EditDeck";
import EditCard from "../CardSettings/EditCard";
import NotFound from "../NotFound/NotFound";
import CardsBasicStudy from "../CardsStudy/CardsBasicStudy";
import CardsEndlessStudy from "../CardsStudy/CardsEndlessStudy";


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
                {!isAuthenticated ? <Redirect from='/custom-decks' to='/login' /> : null}
                {!isAuthenticated ? <Redirect from='/profile' to='/login' /> : null}
                {!isAuthenticated ? [
                    <Redirect from="/card-settings" to="/login" />,
                    <Redirect from="/card-creation" to="/login" />,
                    <Redirect from="/deck-settings" to="/login" />,
                    <Redirect from="/deck-creation" to="/login" />,
                    <Redirect from="/cards/" to="/login" />,
                ] : null}
                <Route exact path="/" component={MainDecks} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/custom-decks" component={CustomDecks} />
                <Route exact path="/search" render={(props) =>
                    <MainDecks key={props.location.search} />
                } />
                <Route path="/cards/:id" render={(props) =>
                    <CardsBasicStudy deckId={props.match.params.id} />
                } />
                <Route path="/cards-endless/:id" render={(props) =>
                    <CardsEndlessStudy deckId={props.match.params.id} />
                } />
                <Route exact path="/cards-preview/:id" render={(props) =>
                    <CardsPreviewPage deckId={props.match.params.id} />
                } />
                <Route exact path="/card-settings/:id" render={(props) =>
                    <EditCard cardId={props.match.params.id} />
                } />
                <Route exact path="/card-creation" component={AddCard} />
                <Route exact path="/deck-settings/:id" render={(props) => (
                    <EditDeck deckId={props.match.params.id} />)
                } />
                <Route exact path="/deck-creation" component={AddDeck} />
                <Route path='*' component={NotFound} />
            </Switch>
        </Layout>
    );
}