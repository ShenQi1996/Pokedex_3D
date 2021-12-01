import { useReducer, useEffect, useState } from "react";
import "./App.scss";
import Slide from "./components/Slide";
import axios from "axios";
import Overdrive from "react-overdrive";

const initialState = {
  slideIndex: 0,
};

let pokemon = [];

axios.get("https://pokeapi.co/api/v2/pokemon/?limit=25").then(res => {
  pokemon = res.data.results;
});

const slidesReducer = (state, event) => {
  if (event.type === "PREV") {
    return {
      ...state,
      slideIndex: (state.slideIndex + 1) % pokemon.length,
    };
  }
  if (event.type === "NEXT") {
    return {
      ...state,
      slideIndex:
        state.slideIndex === 0 ? pokemon.length - 1 : state.slideIndex - 1,
    };
  }
};

function App() {
  const [state, dispatch] = useReducer(slidesReducer, initialState);
  const [next, setNext] = useState("");
  const [pre, setPre] = useState();
  const [poke, setPoke] = useState(pokemon);
  const [page, setPage] = useState(0);

  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon/?limit=25").then(res => {
      console.log(res);
      setNext(res.data.next);
      setPoke(pokemon);
    });
  }, []);

  const handleNext = e => {
    axios.get(next).then(res => {
      setPoke(res.data.results);
      setNext(res.data.next);
      setPre(res.data.previous);
      setPage(page + 1);
    });
  };

  const handlePrevious = e => {
    axios.get(pre).then(res => {
      setPoke(res.data.results);
      setNext(res.data.next);
      setPre(res.data.previous);
      setPage(page - 1);
    });
  };

  return (
    <div>
      <div className="slides">
        <button onClick={() => dispatch({ type: "PREV" })}>‹</button>

        {[...poke, ...poke, ...poke].map((pok, i) => {
          let offset = poke.length + (state.slideIndex - i);
          return <Slide slide={pok} offset={offset} key={i} />;
        })}
        <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
      </div>
      <div className="main_buttons">
        {page === 0 ? (
          <button onClick={() => handleNext()}>More Pokemon</button>
        ) : (
          <>
            <button onClick={() => handlePrevious()}>Previous</button>
            <button onClick={() => handleNext()}>More Pokemon</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
