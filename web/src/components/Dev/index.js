import React from "react";

import "./styles.css";

export default function Dev({ dev }) {
  return (
    <li key={dev._id} className="dev-item">
      <header>
        <img src={dev.avatar_url} alt="" />
        <div className="user-info">
          <strong>{dev.name}</strong>
          <span>{dev.techs.join(", ")}</span>
        </div>
      </header>
      <p>{dev.bio}</p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://github.com/${dev.github_username}`}
      >
        Acessar perfil Github
      </a>
    </li>
  );
}
