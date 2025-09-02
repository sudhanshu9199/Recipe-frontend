import React, { useContext, useEffect, useState } from "react";
import { recipeContext } from "../context/RecipeContext";
import { useParams } from "react-router";
import style from "../styles/SingleRecipe.module.scss";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const SingleRecipe = () => {
  const { data, setdata } = useContext(recipeContext);
  const navigator = useNavigate();
  const params = useParams();
  const recipe = data.find((recipe) => params.id == recipe.id);
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: recipe?.title,
      chef: recipe?.chef,
      image: recipe?.image,
      ingredients: recipe?.ingredients,
      category: recipe?.category,
    },
  });

  const UpdateHandler = (recipe) => {
    const index = data.findIndex((recipe) => params.id == recipe.id);
    if (index === -1) return;
    const copyData = [...data];
    copyData[index] = { ...copyData[index], ...recipe };
    setdata(copyData);
    localStorage.setItem("recipes", JSON.stringify(copyData));

    const copyFav = [...favroite];
    const favIndex = copyFav.findIndex(f => params.id == f.id);
    if (favIndex !== -1) {
      copyFav[favIndex] = {...copyFav[favIndex], ...recipe};
      setfavroite(copyFav);
      localStorage.setItem('fav', JSON.stringify(copyFav));
    }
    toast.success("recipe updated!");
  };

  const DeleteHandler = () => {
    const filterdata = data.filter((recipe) => recipe.id != params.id);
    setdata(filterdata);
    localStorage.setItem("recipes", JSON.stringify(filterdata));

    const filterFav = favroite.filter(f => f.id != params.id);
    setfavroite(filterFav);
    localStorage.setItem('fav', JSON.stringify(filterFav));

    toast.success("Recipe is deleted!");
    navigator(-1);

  };

  const [favroite, setfavroite] = useState(
    JSON.parse(localStorage.getItem("fav")) || []
  );

  const FavHandler = () => {
    let copyFav = [...favroite];
    if (!copyFav.find(f => f.id == recipe?.id)) {
      copyFav.push(recipe);
      setfavroite(copyFav); // <- update state so UI re-renders
      localStorage.setItem("fav", JSON.stringify(copyFav));
    }
  };
  const UnFavHandler = () => {
    const filterfav = favroite.filter((f) => f.id != recipe?.id);
    setfavroite(filterfav);
    localStorage.setItem("fav", JSON.stringify(filterfav));
  };

  

  useEffect(() => {
    console.log("SingleRecipe.jsx Mounted!");
    return () => {
      console.log("SingleRecipe.jsx UnMounted!");
    };
  }, []); // [] is used here is last to stop the re-rendering during updation is called a dependence array.

  return recipe ? (
    <div className={style.container}>
      <div>
        {favroite.find((f) => f.id == recipe?.id) ? (
          <i onClick={UnFavHandler} className="ri-heart-fill"></i>
        ) : (
          <i onClick={FavHandler} className="ri-heart-line"></i>
        )}

        <h1>{recipe.title}</h1>
        <img src={recipe.image} alt="" />
      </div>

      <form onSubmit={handleSubmit(UpdateHandler)}>
        <input
          {...register("image")}
          type="url"
          placeholder="Enter image url"
        />{" "}
        <br />
        <small className={style.errorMessage}>
          this is how error is shown
        </small>{" "}
        <br />
        <input {...register("title")} type="text" placeholder="Recipe title" />
        <input {...register("chef")} type="text" placeholder="Chef Name" />{" "}
        <br />
        <textarea
          {...register("desc")}
          placeholder="Recipe"
          value={recipe.desc}
        ></textarea>
        <textarea
          {...register("ingredients")}
          placeholder="add ingredients"
        ></textarea>{" "}
        <br />
        <select {...register("category")}>
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="supper">Supper</option>
          <option value="dinner">Dinner</option>
        </select>
        <br />
        <button>Update</button>
        <button onClick={DeleteHandler} className={style.delete}>
          Delete
        </button>
      </form>
    </div>
  ) : (
    "Loading..."
  );
};

export default SingleRecipe;
