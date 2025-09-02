import { Link } from "react-router";
import style from "../styles/RecipeCard.module.scss";
const RecipeCard = (props) => {
  const { id, image, title, desc, chef } = props.recipe;
  return (
    <Link className={style.card} to={`/recipes/details/${id}`}>
      <img src={image} alt="" />
      <h1>{title}</h1>
      <small>{chef}</small>
      <p>
        {desc.slice(0, 100)}...<small>more</small>
      </p>
    </Link>
  );
};

export default RecipeCard;
