import style from '../styles/Create.module.scss';
import { useForm } from 'react-hook-form';
import { nanoid } from 'nanoid';
import { useContext } from 'react'
import { recipeContext } from '../context/RecipeContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
const Create = () => {
    const naviagte = useNavigate();
    const { data, setdata } = useContext(recipeContext);
    const {register, handleSubmit, reset } = useForm();

    const SubmitHandler = (recipe) => {
        recipe.id = nanoid();

        const copydata = [...data];
        copydata.push(recipe);
        setdata(copydata);
        // setdata([...data, recipe]);
        localStorage.setItem('recipes', JSON.stringify(copydata));
        toast.success('New recipe created!')
        reset();
        naviagte('/recipes');
    }
  return (
    <div className={style.outerContainer}>
        <div className={style.innerContainer}>
        <form onSubmit={handleSubmit(SubmitHandler)}>
            <input {...register('image')} type='url' placeholder='Enter image url'/> <br />
            <small className={style.errorMessage}>this is how error is shown</small> <br />

            <input {...register('title')} type="text" placeholder='Recipe title'/>
            <input {...register('chef')} type="text" placeholder='Chef Name'/> <br />

            <textarea {...register('desc')} placeholder='Recipe'></textarea>
            <textarea {...register('ingredients')} placeholder='add ingredients'></textarea> <br />
            <select {...register('category')}>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="supper">Supper</option>
                <option value="dinner">Dinner</option>
            </select> <br />
            <button>Save Recipe</button>
        </form>
    </div>
    </div>
  )
}

export default Create