import React, { useState } from "react";
import classnames from "classnames";
import "./RoomForm.css";
import PROFILES from "../utils/profiles";

const RoomForm = ({ onSubmit }) => {
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  return (
    <div className="RoomForm">
      <div className="RoomForm__group">
        <label className="RoomForm__label" htmlFor="user">
          UserName
        </label>
        <input
          className="RoomForm__input"
          type="text"
          id="user"
          name="user"
          onChange={(event) => setUser(event.target.value)}
        />
      </div>
      <div className="RoomForm__group">
        <label className="RoomForm__label" htmlFor="profile">
          Profile
        </label>
        <div className="RoomForm__buttons">
          <button
            className={classnames("RoomForm__button", {
              "is-active": PROFILES.SUBMITTER === profile,
            })}
            type="button"
            onClick={() => setProfile(PROFILES.SUBMITTER)}
          >
            Submitter only
          </button>
          <button
            className={classnames("RoomForm__button", {
              "is-active": PROFILES.VOTER === profile,
            })}
            type="button"
            onClick={() => setProfile(PROFILES.VOTER)}
          >
            Voter only
          </button>
          <button
            className={classnames("RoomForm__button", {
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
        className="RoomForm__button RoomForm__submit"
        type="submit"
        onClick={() => onSubmit({ user, profile })}
      >
        Submit
      </button>
    </div>
  );
};
export default RoomForm;
