<script lang="ts">
  type Props = {
    name: string;
    pictureSrc: string;
    id: string;
    submitCallback: (name: string, pictureSrc?: string) => void;
    cancelCallback: () => void;
  };

  let { name, pictureSrc, id, submitCallback, cancelCallback }: Props = $props();

  let input = $state(name);
  let fileInput = $state();
  let imagePreview: string = $state(pictureSrc);
  let files: FileList = $state();

  const reader = new FileReader();

  function doPreview() {
    let result = reader.result.toString();

    if (result.length >= 600000) {
      window.alert(`file too large: ${result.length}`);
      fileInput = "";
    } else {
      imagePreview = result;
    }

    reader.removeEventListener("load", doPreview);
  }

  function previewImage() {
    reader.addEventListener("load", doPreview);

    if (files.length > 0) {
      reader.readAsDataURL(files[0]);
    }
  }
</script>

<div class="flex flex-col items-center gap-4 p-2">
  <input id={`${id}NameInput`} bind:value={input} class="hover:inset-shadow-sm rounded-lg bg-slate-900 text-center text-xl" />

  <img src={imagePreview} class="object-scale-down max-h-36 rounded-lg" />
  <input
    type="file"
    id={`${id}ImageUpload`}
    accept="image/*"
    bind:files
    bind:value={fileInput}
    onchange={previewImage}
    class="hover:cursor-pointer bg-slate-700 shadow-lg hover:bg-slate-600 rounded-md text-center p-1"
  />

  <div class="flex items-center gap-2">
    <button
      disabled={input.length == 0}
      onclick={() => {
        submitCallback(input, imagePreview.length > 0 ? imagePreview : undefined);
        input = "";
        fileInput = "";
        imagePreview = "";
      }}
      class="rounded-lg bg-indigo-950 enabled:bg-indigo-900 hover:enabled:cursor-pointer hover:enabled:bg-indigo-800 p-1"
    >Submit</button
    >

    <button
      onclick={() => {
        cancelCallback();
        input = "";
        fileInput = "";
        imagePreview = "";
      }}
      class="rounded-lg bg-slate-700 hover:cursor-pointer hover:bg-slate-600 p-1"
    >Cancel</button
    >
  </div>
</div>
