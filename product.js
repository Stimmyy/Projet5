// On récupère l'ID du produit
const getProductId = () => {
    return new URL(location.href).searchParams.get("id");
};
const productId = getProductId();

fetch(`http://localhost:3000/api/products/${productId}`)
 .then((response) => {
    return response.json();
 })

 .then((product) => {
    selectedProduct(product);
 })

 .catch((error) => {
    alert(error);
 });


 // Selection de l'ID colors
 const selectedColor = document.querySelector("#colors");

 //Selection de l'ID quantity
 const selectedQuantity = document.querySelector("#quantity");

 // Selection du bouton "Ajouter au Panier"
 const button = document.querySelector("#addToCart");

 // Avec cette fonction, on récupère les données de la promesse ".then(product)" pour injecter les valeurs dans le Html
 let selectedProduct = (product) => {
   //On intègre les données du produit sélectionné dans le HTML
   document.querySelector("head > title").textContent = product.name;
   document.querySelector(".item__img")
   .innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
   document.querySelector("#title").textContent += product.name;
   document.querySelector("#price").textContent += product.price;
   document.querySelector("#description").textContent += product.description;


   // On ajoute une boucle pour intégrer les différentes couleurs du produit dans le HTML
   for (color of product.colors) {
      let option = document.createElement("option");
      option.innerHTML = `${color}`;
      option.value = `${color}`;
      selectedColor.appendChild(option);
   }
 };