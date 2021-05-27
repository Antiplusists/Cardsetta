import Deck from "../../entities/Deck";
import {useEffect, useRef, useState} from "react";
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import DeckPage from "../../entities/DeckPage";
import Cardsets from './Cardsets';

export default function MainCardsets() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isNotFound, setNotFound] = useState(false);
  const [pageNumber, setPage] = useState(1);
  const pageNumberRef = useRef(pageNumber);
  const maxPage = useRef(pageNumber);
  const pageSize = 20;

  const getDecks = async (pageNumber: number, pageSize: number) => {
    let response = await fetch(ApiPaths.decks.default + `?pageNumber=${pageNumber}` + `&pageSize=${pageSize}`);
    
    switch (response.status) {
      case 200: break;
      case 404: {
        setNotFound(true);
        return null;
      }
      default: throw new Error(`Can not fetch ${ApiPaths.decks.default}`);
    }
    
    return await response.json() as DeckPage;
  }

  useEffect(() => {
    setLoading(true);
    getDecks(pageNumber, pageSize)
        .then((deckPage) => {
          maxPage.current = deckPage?.totalPages ?? maxPage.current;
          setDecks(value => [...value, ...(deckPage?.items ?? [])]);
          setLoading(false);
        });
  }, [pageNumber]);
  
  useEffect(() => {
    const onscroll = () => {
      if (document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight) {
        if (pageNumberRef.current >= maxPage.current) return;
        setPage((value) => value + 1);
        pageNumberRef.current++;
      }
    };
    document.addEventListener('scroll', onscroll);
    
    return () => window.removeEventListener('scroll', onscroll);
  }, []);
  
  return (
    <Cardsets decks={decks} isLoading={isLoading} isNotFound={isNotFound}/>
  );
}