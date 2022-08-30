const getProductId = () => {
    return new URL(location.href).searchParams.get("id");
};
const orderId = getProductId();

const cart = JSON.parse(localStorage.getItem("cart"));

const idConfirmation = document.querySelector("#orderId");

const btnRetourHtml = `<button id="retourAccueil"><a href="./index.html>Retour à l'accueil</a></button>`;

//Affichage de l'orderId
(function () {
    idConfirmation.innerHTML = ` <br> <strong> ${orderId} </strong>. <br> `;

    idConfirmation.insertAdjacentHTML("beforeend", btnRetourHTML);

    localStorage.clear();
})();