import { Routes, Route } from 'react-router';
import Home from '../pages/Home';
import About from '../pages/About';
import Recipe from '../pages/Recipe';
import Create from '../pages/Create';
import SingleRecipe from '../pages/SingleRecipe';
import PageNotFound from '../pages/PageNotFound';
import Fav from '../pages/Fav';
const MainRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/recipes' element={<Recipe />}/>
        <Route path='/recipes/details/:id' element={<SingleRecipe />}/>
        <Route path='/create-recipe' element={<Create />}/>
        <Route path='/about' element={<About />}/>
        <Route path='/fav' element={<Fav />}/>
        <Route path='*' element={<PageNotFound />}/>
    </Routes>
  )
}

export default MainRoutes