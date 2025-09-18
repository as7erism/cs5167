<script>
  let history = $state([
    {
      meals: ["hi"],
    },
    {
      meals: ["bye"],
    },
  ]);
  let streak = $derived(calculateStreak(history));
  let current = $state(history.length - 1);
  let currentDate = $derived.by(() => {
    let daysBefore = history.length - 1 - current;
    return new Date(Date.now() - daysBefore * 86400000);
  });
  let ingredients = $state([]);
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

<h1>hello {name}</h1>
<h2>streak: {streak}</h2>

<h3>
  <button onclick={() => current--}>◀️</button
  >{currentDate.toDateString()}<button onclick={() => current++}>▶️</button>
</h3>
