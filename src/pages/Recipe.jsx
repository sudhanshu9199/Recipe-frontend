import { useContext } from 'react'
import { recipeContext } from '../context/RecipeContext.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import style from '../styles/Recipe.module.scss';
RecipeCard
const Recipe = () => {
    const { data } = useContext(recipeContext);
    const renderRecipes = data.map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)
  return (
    <div className={style.container}>{data.length > 0 ? renderRecipes : 'No recipes found!'}</div>
  )
}

export default Recipe