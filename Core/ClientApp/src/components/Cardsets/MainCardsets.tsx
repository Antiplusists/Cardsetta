import PreviewCardsets from '../PreviewCardsets/PreviewCardsets';
import './Cardsets.css';
import Deck from "../../entities/Deck";
import {useEffect, useRef, useState} from "react";
import {ApiPaths} from "../api-authorization/ApiAuthorizationConstants";
import DeckPage from "../../entities/DeckPage";

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
        });
    setLoading(false);
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
    <div className='previews'>
      {isNotFound ? <div>Наборов еще нет</div> : null} {/*TODO: Сделать какой-нить стиль или компонент*/}
      {decks.map(cardset =>
        <PreviewCardsets key={cardset.id} {...cardset} />
      )}
      {isLoading ? <div>Loading...</div> : null} {/*TODO: Сделать лоадер*/}
    </div>
  );
}