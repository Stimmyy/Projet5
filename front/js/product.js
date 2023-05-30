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
    registeredProduct(product);
  })
  .catch((error) => {
    alert(error);
  });

// Selection de l'ID colors et de l'IQ quantity
const selectedColor = document.querySelector("#colors");
const selectedQuantity = document.querySelector("#quantity");

// Selection du bouton "Ajouter au Panier"
const button = document.querySelector("#addToCart");

// Avec cette fonction, on récupère les données de la promesse ".then(product)" pour injecter les valeurs dans le Html
let selectedProduct = (product) => {
  // On intègre les données du produit sélectionné dans le HTML
  document.querySelector("head > title").textContent = product.name;
  document.querySelector(".item__img").innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
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

// On crée une fonction qui enregistre dans un objet les options de l'utilisateur au clic sur le bouton "Ajouter au panier"
// On crée une fonction qui enregistre dans un objet les options de l'utilisateur au clic sur le bouton "Ajouter au panier"
let registeredProduct = (product) => {
  // Ecoute de l'event "click" sur le bouton "Ajouter"
  button.addEventListener("click", (event) => {
    event.preventDefault();

    if (selectedColor.value == false) {
      confirm("Veuillez sélectionner une couleur");
    } else if (selectedQuantity.value == 0) {
      confirm("Veuillez sélectionner le nombre d'articles souhaités");
    } else if (parseInt(selectedQuantity.value) > 100) {
      confirm("La quantité maximale autorisée est de 100");
    } else {
      const quantityToAdd = parseInt(selectedQuantity.value);

      // Vérification de la quantité totale dans le panier
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQuantityInCart = existingCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
      
      if (totalQuantityInCart + quantityToAdd > 100) {  // Limite de quantité : 100
        confirm("La quantité maximale autorisée est de 100");
        return;
      }
      

      alert("Votre article a bien été ajouté au panier");

      // On récupère les informations du produit sélectionné
      let selectedProduct = {
        id: product._id,
        name: product.name,
        img: product.imageUrl,
        altTxt: product.altTxt,
        description: product.description,
        color: selectedColor.value,
        quantity: quantityToAdd,
      };

      // Gestion du localStorage

      // Si le localStorage existe
      if (existingCart.length > 0) {
        console.log("Il y a déjà un produit dans le panier, on compare les données");

        // On recherche avec la méthode find() si l'id et la couleur d'un article sont déjà présents
        let item = existingCart.find(
          (item) =>
            item.id == selectedProduct.id && item.color == selectedProduct.color
        );

        // Si oui, on incrémente la nouvelle quantité et la mise à jour du prix total de l'article
        if (item) {
          item.quantity += selectedProduct.quantity;
          item.totalPrice += item.price * selectedProduct.quantity;
          localStorage.setItem("cart", JSON.stringify(existingCart));
          console.log("Quantité supplémentaire dans le panier.");
          return;
        }

        // Si non, alors on push le nouvel article sélectionné
        existingCart.push(selectedProduct);
        localStorage.setItem("cart", JSON.stringify(existingCart));
        console.log("Le produit a été ajouté au panier");
      } else {
        // Sinon création d'un tableau dans lequel on push l'objet "selectedProduct"
        let createLocalStorage = [];
        createLocalStorage.push(selectedProduct);
        localStorage.setItem("cart", JSON.stringify(createLocalStorage));
        console.log("Le panier est vide, on ajoute le premier produit");
      }
    }
  });
};
