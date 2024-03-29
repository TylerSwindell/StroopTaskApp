import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import parse from "html-react-parser";

import "../styles/BlackBoard.css";

export default function Slide(props) {
  const { slideContent } = props;

  const focusRef = useRef(null);

  useEffect(() => focusRef.current.focus(), []);

  return (
    <div tabIndex="0" ref={focusRef} className="slide-container noselect">
      <div className="slide-body flex-center">
        <p className="slide-body-text noselect">
          {parse(slideContent.slideText)}
        </p>
      </div>
      <div className="slide-footer flex-center">
        <p className="slide-footer-text noselect">
          {parse(slideContent.continueText)}
        </p>
      </div>
    </div>
  );
}
