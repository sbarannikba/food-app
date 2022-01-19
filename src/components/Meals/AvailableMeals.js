import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import classes from './AvailableMeals.module.css';
import useHttp from '../hooks/use-http';
import { useState, useEffect } from 'react';

const AvailableMeals = () => {
  const { isLoading: isRequestLoading, error: requestMealsError, sendRequest: fetchMeals } = useHttp();
  const [mealsData, setMealsData] = useState([]);
  const [isMealsDataLoading, setIsMealsDataLoading] = useState(true);

  useEffect(() => {
    const transformMeals = (mealsRespond) => {
      const fetchedMeals = [];
  
      for (const id in mealsRespond) {
        fetchedMeals.push({ 
            id: id,
            key: id,
            name: mealsRespond[id].name,
            description: mealsRespond[id].description,
            price: mealsRespond[id].price
          });
      }
      setMealsData(fetchedMeals);
      setIsMealsDataLoading(false);
    };

    fetchMeals(
      {url: 'https://react-http-d468c-default-rtdb.europe-west1.firebasedatabase.app/meals.json'},
      transformMeals);
  }, []);

  const mealsList = mealsData.map((meal) => (
    <MealItem
      key={meal.id}
      id={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));

  let content = <p>Loading</p>;
  if(requestMealsError) {
    content = <p>Error of loading meals</p>;
  } else if(!isMealsDataLoading) {
    content = <ul>{mealsList}</ul>;
  }

  return (
    <section className={classes.meals}>
      <Card>
        {content}
      </Card>
    </section>
  );
};

export default AvailableMeals;
