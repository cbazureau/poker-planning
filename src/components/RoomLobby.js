import React, { useState } from "react";
import classnames from "classnames";
import "./RoomLobby.css";
import PROFILES from "../utils/profiles";

const RoomLobby = ({ onSubmit }) => {
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  return (
    <div className="RoomLobby">
      <div className="RoomLobby__group">
        <label className="RoomLobby__label" htmlFor="user">
          UserName
        </label>
        <input
          className="RoomLobby__input"
          type="text"
          id="user"
          name="user"
          onChange={(event) => setUser(event.target.value)}
        />
      </div>
      <div className="RoomLobby__group">
        <label className="RoomLobby__label" htmlFor="profile">
          Profile
        </label>
        <div className="RoomLobby__buttons">
          <button
            className={classnames("RoomLobby__button", {
              "is-active": PROFILES.SUBMITTER === profile,
            })}
            type="button"
            onClick={() => setProfile(PROFILES.SUBMITTER)}
          >
            Submitter only
          </button>
          <button
            className={classnames("RoomLobby__button", {
              "is-active": PROFILES.VOTER === profile,
            })}
            type="button"
            onClick={() => setProfile(PROFILES.VOTER)}
          >
            Voter only
          </button>
          <button
            className={classnames("RoomLobby__button", {
              "is-active": PROFILES.BOTH === profile,
            })}
            type="button"
            onClick={() => setProfile(PROFILES.BOTH)}
          >
            Both
          </button>
        </div>
      </div>
      <button
        className="RoomLobby__button RoomLobby__submit"
        type="submit"
        onClick={() => onSubmit({ user, profile })}
      >
        Submit
      </button>
    </div>
  );
};
export default RoomLobby;
