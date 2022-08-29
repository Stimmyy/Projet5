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

    // Boucle d'afficahge du nombre total d'articles dans le panier et de la somme totale
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



