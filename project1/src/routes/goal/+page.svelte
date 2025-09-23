<script lang="ts">
  import { initLocalStorage } from "$lib";
  import Chart from 'chart.js/auto';
  import { onMount } from "svelte";

  let cooksPerWeek = $state("7");
  let savedHistory = localStorage.getItem("history");
  if (!savedHistory) {
    initLocalStorage();
    savedHistory = localStorage.getItem("history");
  }

  let history: string[][] = $state(JSON.parse(savedHistory));

  let current = $state(history.length - 1);
  let currentDate = $derived.by(() => {
    let daysBefore = history.length - 1 - current;
    return new Date(Date.now() - daysBefore * 86400000);
  });

  let dates = $derived.by(() => {
    return [
      new Date(currentDate.getTime() - 86400000 * 3),
      new Date(currentDate.getTime() - 86400000 * 2),
      new Date(currentDate.getTime() - 86400000 * 1),
      currentDate,
      new Date(currentDate.getTime() + 86400000 * 1),
      new Date(currentDate.getTime() + 86400000 * 2),
      new Date(currentDate.getTime() + 86400000 * 3),
    ];
  });

  let actualData = $derived.by(() => {
    const out = new Array(7);
    let accumulator = 0;
    for (let i = -3; i < out.length - 3; i++) {
      if (history[current + i]) {
        accumulator += history[current + i].length;
        out[i + 3] = accumulator;
      }
      else {
        out[i + 3] = null;
      }
    }
    console.log(`actual: ${out}`)
    return out;
  });

  let goalData = $derived.by(() => {
    const out = new Array(7);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(cooksPerWeek) * i / 7;
    }
    console.log(out);
    return out;
  })

  onMount(() => {
    new Chart(document.getElementById("chart") as HTMLCanvasElement, {
      type: "line",
      data: {
        labels: dates.map((d) => d.toDateString()),
        datasets: [
          {
            label: "Goal",
            data: goalData,
            spanGaps: true,
          },
          {
            label: "Actual",
            data: actualData,
            spanGaps: true,
          }
        ]
      },
    });
  });
</script>

I want to cook <input type="number" bind:value={cooksPerWeek} /> times per week

<div>
  <canvas id="chart"></canvas>
</div>
