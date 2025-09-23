// place files you want to import through the `$lib` alias in this folder.

export function initLocalStorage() {
  localStorage.setItem(
    "history",
    JSON.stringify([["Burger"], [], ["Ham Sandwich", "Mac n Cheese"], ["Steak", "Mashed Potatoes"]]),
  );

  localStorage.setItem(
    "ingredients",
    JSON.stringify(["Butter", "Flour", "Sausage"]),
  );
}
