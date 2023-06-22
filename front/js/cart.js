// Récupération du LocalStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Une première variable pour stocker les ID de chaque article dans le panier
let products = [];

// Une deuxième variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

// Affichage du contenu du panier
async function displayCart() {
  const positionEmptyCart = document.getElementById("cart__items");

  // Si le localStorage est vide
  if (!cart || cart.length === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
    return;
  }

  const parser = new DOMParser();
  const cartHTML = [];

  // Mise à jour de la quantité dans le panier
  updateCartQuantities();

  // Boucle pour afficher chaque article dans le panier
  for (let i = 0; i < cart.length; i++) {
    const product = await getProductById(cart[i].id);
    const totalPriceItem = product.price * cart[i].quantity;

    const itemHTML = `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
                        <div class="cart__item__img">
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                                <h2>${product.name}</h2>
                                <p>${cart[i].color}</p>
                                <p>Prix unitaire: ${product.price}€</p>
                            </div>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : <input data-id="${cart[i].id}" data-color="${cart[i].color}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart[i].quantity}"></p>
                                    <p>Prix total pour cet article: <span class="totalPriceItem">${totalPriceItem}</span>€</p> 
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p data-id="${cart[i].id}" data-color="${cart[i].color}" class="deleteItem">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </article>`;

    cartHTML.push(itemHTML);
  }

  positionEmptyCart.innerHTML = cartHTML.join("");

  // Ecouteur d'event pour la modification et la suppression d'articles
  const quantityInputs = document.getElementsByClassName("itemQuantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("input", handleQuantityChange);
    quantityInputs[i].addEventListener("blur", handleQuantityBlur);
  }

  const deleteButtons = document.getElementsByClassName("deleteItem");
  for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", handleDeleteItem);
  }

  updateCartTotal();
}

// Fonction pour mettre à jour la quantité dans le panier
function updateCartQuantities() {
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].quantity > 100) {
      cart[i].quantity = 100; // Rétablir la valeur maximale
    }
  }
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Fonction pour récupérer les détails d'un produit par son ID
async function getProductById(productId) {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Erreur lors de la récupération du produit:", error);
    throw error;
  }
}

// Fonction de mise à jour de la quantité d'un article
async function handleQuantityChange(event) {
  const input = event.target;
  const newQuantity = parseInt(input.value);
  const productId = input.getAttribute("data-id");
  const color = input.getAttribute("data-color");

  // Vérification de la quantité maximale (100)
  if (newQuantity > 100) {
    input.value = 100; // Si la quantité dépasse les 100, on la remet à 100
    return; 
  }

  // Mise à jour de la quantité dans le localStorage
  if (cart) {
    const updatedCart = cart.map((item) => {
      if (item.id === productId && item.color === color) {
        // Vérification de la quantité maximale (100) avant la mise à jour
        item.quantity = newQuantity <= 100 ? newQuantity : 100;
      }
      return item;
    });
    cart = updatedCart; // Mettre à jour la variable cart avec les nouvelles valeurs
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Mise à jour du prix total pour cet article
  const priceElement = input.parentNode.nextElementSibling.querySelector(".totalPriceItem");
  const product = await getProductById(productId);
  if (product) {
    const totalPriceItem = product.price * newQuantity;
    priceElement.textContent = totalPriceItem;
  }

  updateCartTotal();
}
// Fonction pour gérer le dépassement de quantité après la perte de focus de l'input. Cette fonction est une mesure pour s'assurer que la quantité ne peut être dépassée.
function handleQuantityBlur(event) {
  const input = event.target;
  const newQuantity = parseInt(input.value);
  const productId = input.getAttribute("data-id");
  const color = input.getAttribute("data-color");

  // Vérification de la quantité maximale (100)
  if (newQuantity > 100) {
    input.value = 100; // Rétablir la valeur maximale
  }

  // Mise à jour de la quantité dans le localStorage
  if (cart) {
    const updatedCart = cart.map((item) => {
      if (item.id === productId && item.color === color) {
        item.quantity = newQuantity;
      }
      return item;
    });
    cart = updatedCart; // Mettre à jour la variable cart avec les nouvelles valeurs
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  updateCartTotal();
}

// Fonction de suppression d'un article
function handleDeleteItem(event) {
  const button = event.target;
  const productId = button.getAttribute("data-id");
  const color = button.getAttribute("data-color");

  // Suppression de l'article du localStorage
  if (cart) {
    const updatedCart = cart.filter((item) => !(item.id === productId && item.color === color));
    cart = updatedCart; // Mettre à jour la variable cart avec les nouvelles valeurs
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  }

  // Suppression de l'article de l'affichage du panier
  const article = button.closest(".cart__item");
  article.remove();

  updateCartTotal();
}

// Fonction de mise à jour du total du panier
async function updateCartTotal() {
  let totalQuantity = 0;
  let totalPrice = 0;

  for (let i = 0; i < cart.length; i++) {
    totalQuantity += parseInt(cart[i].quantity);
    const product = await getProductById(cart[i].id);
    if (product) {
      totalPrice += product.price * cart[i].quantity;
    }
  }

  document.getElementById("totalQuantity").textContent = totalQuantity;
  document.getElementById("totalPrice").textContent = totalPrice;
}

displayCart();


// PARTIE FORMULAIRE

// Sélection du bouton Valider
const btnValidate = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour la validation du formulaire
btnValidate.addEventListener("click", (event) => {
  event.preventDefault();

  // Vérification si le panier est vide
  if (!cart || cart.length === 0) {
    alert("Votre panier est vide");
    return;
  }

  let contact = {
    firstName: document.querySelector("#firstName").value,
    lastName: document.querySelector("#lastName").value,
    address: document.querySelector("#address").value,
    city: document.querySelector("#city").value,
    email: document.querySelector("#email").value,
  };

  console.log(contact);

  // GESTION DU FORMULAIRE

  // RegEx pour le contrôle des champs à remplir ([Prénom, Nom, Ville] | [Adresse] | [Email])
  const regExPrenomNomVille = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\- ]*$/;
  const regExAdresse = /^\d+\s+[a-zA-Z\d\s,'À-ÿ-]+$/
  const regExEMail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Fonction de contrôle du Prénom
  function firstNameControl() {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExPrenomNomVille.test(prenom)) {
      inputFirstName.style.backgroundColor = "green";
      document.querySelector("#firstNameErrorMsg").textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "#FF6F61";
      document.querySelector("#firstNameErrorMsg").textContent =
        "Le champ PRÉNOM est invalide";
      return false;
    }
  }

  // Fonction de contrôle du champ Nom
  function lastNameControl() {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExPrenomNomVille.test(nom)) {
      inputLastName.style.backgroundColor = "green";
      document.querySelector("#lastNameErrorMsg").textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = "#FF6F61";
      document.querySelector("#lastNameErrorMsg").textContent =
        "Le champ NOM est invalide";
      return false;
    }
  }

  // Fonctions de contrôle du champ Adresse:
  function addressControl() {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse.test(adresse)) {
      inputAddress.style.backgroundColor = "green";
      document.querySelector("#addressErrorMsg").textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = "#FF6F61";
      document.querySelector("#addressErrorMsg").textContent =
        "Champ Adresse de formulaire invalide, ex: 50 rue de la paix";
      return false;
    }
  }

  // Fonctions de contrôle du champ Ville:
  function cityControl() {
    const ville = contact.city;
    let inputCity = document.querySelector("#city");
    if (regExPrenomNomVille.test(ville)) {
      inputCity.style.backgroundColor = "green";
      document.querySelector("#cityErrorMsg").textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = "#FF6F61";
      document.querySelector("#cityErrorMsg").textContent =
        "Champ Ville de formulaire invalide, ex: Paris";
      return false;
    }
  }

  // Fonctions de contrôle du champ Email:
  function mailControl() {
    const courriel = contact.email;
    let inputMail = document.querySelector("#email");
    if (regExEMail.test(courriel)) {
      inputMail.style.backgroundColor = "green";
      document.querySelector("#emailErrorMsg").textContent = "";
      return true;
    } else {
      inputMail.style.backgroundColor = "#FF6F61";
      document.querySelector("#emailErrorMsg").textContent =
        "Champ Email de formulaire invalide, ex: example@contact.fr";
      return false;
    }
  }

  // Contrôle de validité du formulaire avant de l'envoyer dans le localStorage
  if (
    firstNameControl() &&
    lastNameControl() &&
    addressControl() &&
    cityControl() &&
    mailControl()
  ) {
    // Enregistrement du formulaire dans le localStorage
    localStorage.setItem("contact", JSON.stringify(contact));

    document.querySelector("#order").value =
      "Articles et formulaire valides\n Valider la commande";
    sendToServer();
  } else {
    error("Merci de remplir correctement le formulaire");
  }

  /* FIN DE GESTION DU FORMULAIRE */
  /* REQUETE DU SERVEUR ET POST DES DONNÉES */
  function sendToServer() {
    const sendToServer = fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      body: JSON.stringify({ contact, products }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      //Récupération et stockage de la réponse de l'API (orderId)
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        orderId = server.orderId;
        console.log(orderId);
      });

    // Si l'orderID a bien été récupéré, redirection de l'utilisateur vers la page Confirmation
    if (orderId !== "") {
      location.href = "confirmation.html?id=" + orderId;
    }
  }
});
