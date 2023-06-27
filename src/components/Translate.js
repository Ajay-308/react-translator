import React, { useEffect } from "react";
import countries from "../countries";
const Translate = () => {
  useEffect(() => {
    const fromText = document.querySelector(".from-text");
    const toText = document.querySelector(".to-text");
    const exchageIcon = document.querySelector(".exchange");
    const selectTag = document.querySelectorAll("select");
    const icons = document.querySelectorAll(".row i");
    const translateBtn = document.querySelector("button");
    selectTag.forEach((tag, id) => {
      for (let country_code in countries) {
        let selected =
          id === 0
            ? country_code === "en-GB"
              ? "selected"
              : ""
            : country_code === "es-ES"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
      }
    });

    exchageIcon.addEventListener("click", () => {
      // console.log("helo");
      let tempText = fromText.value;
      let tempLang = selectTag[0].value;
      console.log(tempText);
      console.log(tempLang);
      fromText.value = toText.value;
      toText.value = tempText;
      selectTag[0].value = selectTag[1].value;
      selectTag[1].value = tempLang;
    });

    fromText.addEventListener("keyup", () => {
      if (!fromText.value) {
        toText.value = "";
      }
    });

    translateBtn.addEventListener("click", () => {
      let text = fromText.value.trim();
      let translateFrom = selectTag[0].value;
      let translateTo = selectTag[1].value;
      if (!text) return;
      toText.setAttribute("placeholder", "Translating...");
      let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          toText.value = data.responseData.translatedText;
          data.matches.forEach((data) => {
            if (data.id === 0) {
              toText.value = data.translation;
            }
          });
          toText.setAttribute("placeholder", "Translation");
        });
    });
    // Create a new instance of Recorder
    // const recorder = new Recorder();
    // let chunks = [];

    icons.forEach((icon) => {
      icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        let speechText;
        let lang;
        if (target.id === "from") {
          speechText = fromText.value;
          lang = selectTag[0].value;
        } else {
          speechText = toText.value;
          lang = selectTag[1].value;
        }
        const utterance = new SpeechSynthesisUtterance(speechText);
        utterance.lang = lang;

        // const audio = new Audio();
        const synth = window.speechSynthesis;

        synth.cancel(); // Stop any ongoing speech synthesis
        synth.speak(utterance);
      });
    });
  }, []);
  return (
    <>
      <div className="container">
        <div className="wrapper">
          <div className="text-input">
            <textarea
              spellCheck="false"
              className="from-text"
              placeholder="Enter text"
            ></textarea>
            <textarea
              spellCheck="false"
              readOnly
              disabled
              className="to-text"
              placeholder="Translation"
            ></textarea>
          </div>
          <ul className="controls">
            <li className="row from">
              <div className="icons">
                <i id="from" className="fas fa-volume-up"></i>
              </div>
              <select></select>
            </li>
            <li className="exchange">
              <i className="fas fa-exchange-alt"></i>
            </li>
            <li className="row to">
              <select></select>
              <div className="icons">
                <i id="to" className="fas fa-volume-up"></i>
              </div>
            </li>
          </ul>
        </div>
        <button>Translate Text</button>
      </div>
    </>
  );
};

export default Translate;
