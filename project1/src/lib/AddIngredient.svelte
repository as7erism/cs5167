<script>
  let { submitCallback } = $props();
  let opened = $state(true);
  let input = $state("");
</script>

<label for="ingredientInput">Enter ingredient name:</label>
<input id="ingredientInput" bind:value={input} />

<button onclick={() => submitCallback(input)}>submit</button>
