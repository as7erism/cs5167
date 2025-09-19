<script>
  import AddIngredient from "$lib/AddIngredient.svelte";
import AddMeal from "$lib/AddMeal.svelte";
    import Ingredient from "$lib/Ingredient.svelte";
    import Meal from "$lib/Meal.svelte";
import { Card } from "flowbite-svelte";

  let history = $state([
    {
      meals: [{name: "chicken", pictureUrl: "https://leitesculinaria.com/wp-content/uploads/2015/06/whole-grilled-chicken.jpg"}],
    },
    {
      meals: [{name: "beef", pictureUrl: "https://www.seriouseats.com/thmb/-KA2hwMofR2okTRndfsKtapFG4Q=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__recipes__images__2015__05__Anova-Steak-Guide-Sous-Vide-Photos15-beauty-159b7038c56a4e7685b57f478ca3e4c8.jpg"}],
    },
  ]);

  let current = $state(history.length - 1);
  let currentDate = $derived.by(() => {
    let daysBefore = history.length - 1 - current;
    return new Date(Date.now() - daysBefore * 86400000);
  });
  let ingredients = $state(["apple", "bread", "meaat"]);
  let name = "Aster";

  function calculateStreak(history) {
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].meals.length > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }
</script>

<div class="flex items-center flex-col">
  <h1>hello {name}</h1>
  <h2>you've been cooking for {history.length} days!</h2>
  <h2>streak: {calculateStreak(history)} days</h2>

  <h3>
    <button onclick={() => {if (current > 0) current -= 1;}}>◀️</button
    >{currentDate.toDateString()}<button onclick={() => {if (current < history.length - 1) current++;}}>▶️</button>
  </h3>

  <div class="flex items-center">
    {#each history[current].meals as meal}
      <Meal mealData={meal} />
    {/each}
  </div>

  <AddMeal submitCallback={() => {}} />
  <AddIngredient submitCallback={() => {}} />

  <div class="flex">
    ingredients: 
    <div class="flex flex-wrap">
      {#each ingredients as ingredient}
        <Ingredient name={ingredient} />
      {/each}
    </div>
  </div>
</div>
