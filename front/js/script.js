// On récupère les données de l'API
fetch("http://localhost:3000/api/products/")
.then(function(response) {
    if (response.ok) {
        return response.json();
    }
})

// On créé une liste de produits à partir des données de l'API
.then (function(products) {

    //Intégration des différents produits dans la page d'accueil
    for (let product of products) {
        let i = 0; i < product.lenght; i++;
         document.getElementById("items").innerHTML += `<a href="./product.html?id=${product._id}">
                                                      <article>
                                                        <img src="${product.imageUrl}" alt="${product.altTxt}">
                                                        <h3 class="productName">${product.name}</h3>
                                                        <p class="productDescription">${product.description}</p>
                                                      </article>
                                                    </a>`
    }

})

// Si une erreur se produit lors de la récupération de données
.catch(function(error) {
    console.log(error);
});