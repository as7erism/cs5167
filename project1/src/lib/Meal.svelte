<script>
  let { name, pictureSrc } = $props();
</script>

<div class="flex flex-col items-center p-2 gap-4">
  <h3 class="text-3xl">{name}</h3>
  <img src={pictureSrc} class="object-scale-down max-h-36 rounded-lg" />
</div>
