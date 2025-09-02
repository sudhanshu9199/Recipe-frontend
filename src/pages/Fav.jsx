import RecipeCard from '../components/RecipeCard';
// import style from '';

const Fav = () => {
  const favroite = JSON.parse(localStorage.getItem('fav') || '[]');
    const renderRecipes = favroite.map(recipe => <RecipeCard key={recipe.id} recipe={recipe}/>)
  return (
    <div>{favroite.length > 0 ? renderRecipes : 'No favroite found!'}</div>
  )
}

export default Fav