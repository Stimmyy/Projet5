// Récupération du LocalStorage
let cart = JSON.parse(localStorage.getItem("cart"));

// Une première variable pour stocker les ID de chaque article dans le panier
let products = [];

// Une deuxième variable qui récupère l'orderId envoyé comme réponse par le serveur lors de la requête POST
let orderId = "";

//Affichage du contenu du panier
async function displayCart() {
    const parser = new DOMParser();
    const positionEmptyCart = document.getElementById("cart__items");
    let cartArray = [];

    // Si le localStorage est vide
    if (cart === null || cart === 0) {
    positionEmptyCart.textContent = "Votre panier est vide";
    } else {
    console.log("Des produits se trouvent dans votre panier");
    }

    // Si le localStorage contient des articles
    for (i = 0; i < cart.length; i++) {
        const product = await getProductById(cart[i].id);
        const totalPriceItem = (product.price *= cart[i].quantity);
        cartArray += `<article class="cart__item" data-id="${cart[i].id}" data-color="${cart[i].color}">
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
                                <p id="quantité">
                                    Qté : <input data-id= ${cart[i].id} data-color= ${cart[i].color} type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cart[i].quantity}>
                                </p>
                                <p id="sousTotal">Prix total pour cet article: ${totalPriceItem}€</p> 
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p data-id= ${cart[i].id} data-color= ${cart[i].color} class="deleteItem">Supprimer</p>
                            </div>
                            </div>
                        </div>
                        </div>
                      </article>`;
    }

    // Boucle d'affichage du nombre total d'articles dans le panier et de la somme totale
    let totalQuantity = 0;
    let totalPrice = 0;

    for (i = 0; i < cart.length; i++) {
        const article = await getProductById(cart[i].id);
        totalQuantity += parseInt(cart[i].quantity);
        totalPrice += parseInt(article.price * cart[i].quantity);
    }

    document.getElementById("totalQuantity").innerHTML = totalQuantity;
    document.getElementById("totalPrice").innerHTML = totalPrice;

    if (i == cart.length) {
        const displayBasket = parser.parseFromString(cartArray, "text/html");
        positionEmptyCart.appendChild(displayBasket.body);
        changeQuantity();
        deleteItem();
    }
}   

// Récupération des produits de l'API
async function getProductById(productId) {
    return fetch("http://localhost:3000/api/products/" + productId)
        .then(function (res) {
        return res.json();
        })
        .catch((err) => {
        // Erreur serveur
        console.log("erreur");
        })
        .then(function (response) {
        return response;
        });
}
displayCart();

 // Modification de la quantité d'un article
 function changeQuantity() {
    const quantityInputs = document.querySelectorAll(".itemQuantity");
    quantityInputs.forEach((quantityInput) => {
        quantityInput.addEventListener("change",(event) => {
            event.preventDefault();
            const inputValue = event.target.value;
            const dataId = event.target.getAttribute("data-id");
            const dataColor = event.target.getAttribute("data-color");
            let cart = localStorage.getItem("cart");
            let items = JSON.parse(cart);

            items = items.map((item, index) => {
                if (item.id === dataId && item.color === dataColor) {
                    item.quantity = inputValue;
                }
                return item;
            });
            // Mise à jour du LocalStorage
            let itemsStr = JSON.stringify(items);
            localStorage.setItem("cart", itemsStr);
            // Refresh de la page Panier
            location.reload();
        });
    });
 }

// Supression d'un article
function deleteItem() {
    const deleteButtons = document.querySelectorAll(".deleteItem");
    deleteButtons.forEach((deleteButton) => {
        deleteButton.addEventListener("click",(event) => {
            event.preventDefault();
            const deleteId = event.target.getAttribute("data-id");
            const deleteColor = event.target.getAttribute("data-color");
            cart = cart.filter(
                (element) => !(element.id == deleteId && element.color == deleteColor)
            );
            console.log(cart);
            //Mise à jour du LocalStorage
            localStorage.setItem("cart",JSON.stringify(cart));
            //Refresh de la page Panier
            location.reload();
            alert("Article retiré du panier");
        });
    });
}

                                    // PARTIE FORMULAIRE 


// Selection du bouton Valider
const btnValidate = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour validation du formulaire

btnValidate.addEventListener("click", (event) => {
    event.preventDefault();

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
    const regExPrenomNomVille = (value) => {
    return /^[A-zA-Z][A-Za-z\u00C0-\u00FF\-]+$/.test(value);
    };

    const regExAdresse = (value) => {
    return /^[0-9][a-zA-Z0-9\u00C0-\u00FF\s,. '-]{3,}$/.test(value);
    };

    const regExEMail = (value) => {
    return /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})$/.test(value);
    };

    // Fonction de contrôle du Prénom
    function firstNameControl() {
    const prenom = contact.firstName;
    let inputFirstName = document.querySelector("#firstName");
    if (regExPrenomNomVille(prenom)) {
        inputFirstName.style.backgroundColor = "green";

        document.querySelector("#firstNameErrorMsg").textContent ="";
        return true;
    } else {
        inputFirstName.style.backgroundColor = "#FF6F61";

        document.querySelector("#firstNameErrorMsg").textContent =
        "Le champ PRÉNOM est invalide"
        return false;
    }
    }

    // Fonction de contrôle du champ Nom
    function lastNameControl() {
    const nom = contact.lastName;
    let inputLastName = document.querySelector("#lastName");
    if (regExPrenomNomVille(nom)) {
        inputLastName.style.backgroundColor ="green";

        document.querySelector("#lastNameErrorMsg").textContent = "";
        return true;
    } else {
        inputLastName.style.backgroundColor = "#FF6F61";

        document.querySelector("#lastNameErrorMsg").textContent =
        "Le champ NOM est invalide"
        return false;
    }
    }

    // Fonctions de contrôle du champ Adresse:
    function addressControl() {
    const adresse = contact.address;
    let inputAddress = document.querySelector("#address");
    if (regExAdresse(adresse)) {
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
        if (regExPrenomNomVille(ville)) {
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
        if (regExEMail(courriel)) {
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
  )
    {
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
            method : "POST",
            body:JSON.stringify({contact, products}),
            headers: {
                "Content-Type": "application/json",
            },
        })
        
        //Récupération et stockage de la réponse de l'API (orderId)
        .then((response) => {
            return response.json();
        })
        .then ((server) => {
            orderId = server.orderId;
            console.log(orderId);
        });

        // Si l'orderID a bien été récupéré, redirection de l'utilisateur vers la page Confirmation
        if (orderId !="") {
            location.href = "confirmation.html?id=" + orderId;
        }
    }
});

