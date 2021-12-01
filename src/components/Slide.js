import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Overdrive from "react-overdrive";
import "./Slide.scss";

function useTilt(active) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !active) {
      return;
    }

    const state = {
      rect: undefined,
      mouseX: undefined,
      mouseY: undefined,
    };

    let el = ref.current;

    const handleMouseMove = e => {
      if (!el) {
        return;
      }
      if (!state.rect) {
        state.rect = el.getBoundingClientRect();
      }
      state.mouseX = e.clientX;
      state.mouseY = e.clientY;
      const px = (state.mouseX - state.rect.left) / state.rect.width;
      const py = (state.mouseY - state.rect.top) / state.rect.height;

      el.style.setProperty("--px", px);
      el.style.setProperty("--py", py);
    };

    el.addEventListener("mousemove", handleMouseMove);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
    };
  }, [active]);

  return ref;
}

const Slide = ({ slide, offset, key }) => {
  const [pokeapi, setPokeapi] = useState();
  const active = offset === 0 ? true : null;
  const ref = useTilt(active);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${slide.name}`).then(res => {
      setPokeapi(res.data);
    });
  }, [slide]);

  return pokeapi !== undefined ? (
    <div
      ref={ref}
      className="slide"
      data-active={active}
      style={{
        "--offset": offset,
        "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1,
      }}
    >
      <div
        className="slideBackground"
        style={{
          backgroundImage: `url('${pokeapi.sprites.other.dream_world.front_default}')`,
        }}
      />
      <Overdrive id={pokeapi.name}>
        <div
          className="slideContent"
          style={{
            backgroundImage: `url('${pokeapi.sprites.other.dream_world.front_default}')`,
          }}
        >
          <Overdrive id={pokeapi.name}>
            <div className="slideContentInner">
              <h2 className="slideTitle">{pokeapi.name}</h2>
              <h3 className="slideSubtitle"> #{pokeapi.id}</h3>
              {pokeapi.types.map((ele, i) => (
                <p className="slideDescription" key={i}>
                  {ele.type.name}
                </p>
              ))}
            </div>
          </Overdrive>
        </div>
      </Overdrive>
    </div>
  ) : (
    <div>
      <h1>Loading....</h1>
    </div>
  );
};

export default Slide;
