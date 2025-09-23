<script lang="ts">
  import { initLocalStorage } from "$lib";
  import AddIngredient from "$lib/AddIngredient.svelte";
  import Ingredient from "$lib/Ingredient.svelte";
  import Meal from "$lib/Meal.svelte";
  import MealInput from "$lib/MealInput.svelte";
  import { SvelteSet } from "svelte/reactivity";

  let savedHistory = localStorage.getItem("history");
  if (!savedHistory) {
    initLocalStorage();
    savedHistory = localStorage.getItem("history");
  }
  let savedIngredients = localStorage.getItem("ingredients");

  let history: string[][] = $state(JSON.parse(savedHistory));

  let editing = $state(new SvelteSet());
  let addingNew = $state(false);

  let current = $state(history.length - 1);
  let currentDate = $derived.by(() => {
    let daysBefore = history.length - 1 - current;
    return new Date(Date.now() - daysBefore * 86400000);
  });
  let currentNumMeals = $derived(history[current].length);

  let ingredients = $state(new SvelteSet(JSON.parse(savedIngredients)));
  let ingredientInput = $state("");

  let name = "Aster";

  function calculateStreak(history) {
    let count = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].length > 0) {
        count++;
      } else {
        break;
      }
    }
    return count;
  }

  function getId(date, index) {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-i${index}`;
  }

  function submitMeal(index: number, name: string, pictureSrc?: string) {
    const id = getId(currentDate, index);

    if (pictureSrc) {
      localStorage.setItem(id, pictureSrc);
    }

    if (index < history[current].length) {
      history[current][index] = name;
    } else {
      history[current].push(name);
    }
    localStorage.setItem("history", JSON.stringify(history));

    editing.delete(index);
  }

  function addMeal(name: string, pictureSrc?: string) {
    const id = getId(currentDate, currentNumMeals);

    if (pictureSrc) {
      localStorage.setItem(id, pictureSrc);
    }

    history[current].push(name);
    localStorage.setItem("history", JSON.stringify(history));

    addingNew = false;
  }
</script>

<div class="flex items-center flex-col">
  <h1 class="text-6xl">Cooker</h1>
</div>

<div class="flex flex-col items-center mt-8">
  <div class="rounded-lg p-2 bg-slate-800 flex items-center flex-col">
    <h1>hello <b>{name}</b></h1>
    <h2>you've been cooking for <b>{history.length}</b> days!</h2>
    <h2>streak: <b>{calculateStreak(history)}</b> days 🔥</h2>
  </div>
</div>

<div class="flex flex-col items-center">
  <h3 class="text-4xl m-8">
    <button
      class={`${current <= 0 ? "opacity-75" : "hover:cursor-pointer"}`}
      onclick={() => {
        if (current > 0) {
          current--;
          addingNew = false;
          editing.clear();
        }
      }}>◀️</button
    >
    {currentDate.toDateString()}
    <button
      class={`${current >= history.length - 1 ? "opacity-50" : "hover:cursor-pointer"}`}
      onclick={() => {
        if (current < history.length - 1) {
          current++;
          addingNew = false;
          editing.clear();
        }
      }}>▶️</button
    >
  </h3>

  <div class="flex items-center gap-4">
    {#each history[current] as meal, i}
      {#if editing.has(i)}
        <div
          class="p-2 flex items-center flex-col bg-slate-800 p-2 rounded-lg w-85 max-w-85 h-85 max-h-85"
        >
          <MealInput
            name={meal}
            id={getId(currentDate, i)}
            pictureSrc={localStorage.getItem(getId(currentDate, i)) ?? ""}
            submitCallback={(name, pictureSrc) =>
              submitMeal(i, name, pictureSrc)}
            cancelCallback={() => editing.delete(i)}
          />
        </div>
      {:else}
        <div
          class="p-2 flex items-center flex-col bg-slate-800 hover:bg-indigo-950 rounded-lg w-85 max-w-85 h-85 max-h-85"
        >
          <button
            class="hover:cursor-pointer w-full h-full"
            onclick={() => editing.add(i)}
          >
            <Meal
              name={meal}
              pictureSrc={localStorage.getItem(getId(currentDate, i)) ?? ""}
            />
          </button>
        </div>
      {/if}
    {/each}

    {#if addingNew}
      <div
        class="flex items-center flex-col bg-slate-800 p-2 rounded-lg w-85 max-w-85 h-85 max-h-85"
      >
        <MealInput
          name=""
          pictureSrc=""
          id={getId(currentDate, currentNumMeals)}
          submitCallback={addMeal}
          cancelCallback={() => addingNew = false}
        />
      </div>
    {:else}
      <div
        class="p-2 flex items-center flex-col bg-slate-800 hover:bg-indigo-950 rounded-lg w-85 max-w-85 h-85 max-h-85"
      >
        <button
          class="hover:cursor-pointer w-full h-full"
          onclick={() => (addingNew = true)}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12H20M12 4V20"
              stroke="oklch(70.4% 0.04 256.788)"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  <div class="flex mt-8">
    <div class="flex flex-wrap gap-4">
      <h4 class="text-xl p-2">Ingredients:</h4>
      {#each ingredients as ingredient}
        <button
          onclick={() => {
            ingredients.delete(ingredient);
            console.log(JSON.stringify(ingredients));
            localStorage.setItem(
              "ingredients",
              JSON.stringify(Array.from(ingredients)),
            );
          }}
        >
          <Ingredient name={ingredient} />
        </button>
      {/each}

      <input class="hover:inset-shadow-sm rounded-lg bg-slate-900 text-center text-xl p-2" id="ingredientInput" bind:value={ingredientInput} />
      <button
        class="rounded-lg bg-indigo-900 hover:cursor-pointer hover:bg-indigo-800 p-2 text-xl"
        onclick={() => {
          ingredients.add(ingredientInput);
          localStorage.setItem(
            "ingredients",
            JSON.stringify(Array.from(ingredients)),
          );
          ingredientInput = "";
        }}>Add</button
      >
    </div>
  </div>
</div>
