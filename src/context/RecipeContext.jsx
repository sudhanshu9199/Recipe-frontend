import React, { useState, createContext, useEffect } from "react";

export const recipeContext = createContext(null);

const RecipeContext = (props) => {
  const [data, setdata] = useState([
    {
      id: 1,
      title: "Classic Margherita Pizza",
      ingredients: "Pizza dough, Tomato sauce",
      instructions:
        "Preheat the oven to 475C, Roll out the pizza dough and spread.",
      image: "https://cdn.dummyjson.com/recipe-images/1.webp",
      chef: "Surutu Ray",
      category: "Veg",
      desc: "Send the cake Pizza, out the pizza dough ans. For 12-15 minutes or until the crust is golden brown.",
      category: 'lunch'
    },
  ]);

  useEffect(() => {
    setdata(JSON.parse(localStorage.getItem('recipes')) || []);
  }, []);
  console.log(data);

  return (
    <recipeContext.Provider value={{ data, setdata }}>
      {props.children}
    </recipeContext.Provider>
  );
};

export default RecipeContext;
