import React from "react";
import Howto from "./Howto.js";

function StatsPanel({ level, snakeLength, children, score }) {
  const fields = [
    { name: "Nivel", value: level },
    { name: "Longitud", value: snakeLength },
    { name: "Score", value: score }
  ];

  return (
    <div className="stats-panel">
      {fields.map((field, index) => (
        <StatsField key={index} name={field.name} value={field.value} />
      ))}
      <Howto />
      {children}
    </div>
  );
}

export default StatsPanel;

function StatsField({ name, value }) {
  return (
    <div className="stats-panel-field">
      <div className="stats-panel--field-name">{name}:</div>
      <div className="stats-panel--field-value">{value}</div>
    </div>
  );
}
