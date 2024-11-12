import React from "react";
import Button from "./Button.js";

function StatusMessage({ status, handleClick }) {
  let message = null;
  if (status === "READY") {
    message = <>Presione cualquier tecla para&nbsp;iniciar</>;
  } else if (status === "GAME_OVER") {
    message = (
      <>
        Juego Finalizado
        <Button handleClick={handleClick}>Reiniciar</Button>
      </>
    );
  } else if (status === "PAUSE") {
    message = (
      <>
        Juego pausado.
        <br />
        <br />
        Presione «P» o «space» para&nbsp;resume.
      </>
    );
  }

  if (message) {
    return (
      <div className="message">
        <div className="message--inner">{message}</div>
      </div>
    );
  } else return null;
}

export default StatusMessage;
