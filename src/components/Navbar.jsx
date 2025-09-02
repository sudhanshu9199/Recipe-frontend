import React from "react";
import { NavLink } from "react-router";
import style from "../styles/Navbar.module.scss";
const Navbar = () => {
  return (
    <div className={style.container}>
      <NavLink
        className={({ isActive }) =>
          `${style.navLink} ${isActive ? style.actives : ""}`
        }
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${style.navLink} ${isActive ? style.actives : ""}`
        }
        to="/recipes"
      >
        Recipe
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${style.navLink} ${isActive ? style.actives : ""}`
        }
        to="/about"
      >
        About
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${style.recipeBtn} ${isActive ? style.actives : ""}`
        }
        to="/create-recipe"
      >
        Create Recipe
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `${style.navLink} ${isActive ? style.actives : ""}`
        }
        to="/fav"
      >
        Favroite
      </NavLink>
    </div>
  );
};

export default Navbar;
