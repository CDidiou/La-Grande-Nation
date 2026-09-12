(() => {


"use strict";

console.log("LIVRE PROTECTION : JS chargé");
console.log("Hash attendu :", window.LIVRE_PASSWORD_HASH);
/*
 * Hash SHA-256 attendu.
 * Il est injecté par Hugo dans window.LIVRE_PASSWORD_HASH.
 */
const passwordHash = window.LIVRE_PASSWORD_HASH;


const wall = document.getElementById("password-wall");
const content = document.getElementById("protected-content");
const form = document.getElementById("password-form");
const input = document.getElementById("password");
const error = document.getElementById("password-error");


/*
 * Vérification de la présence des éléments nécessaires.
 */
if (!wall || !content || !form || !input || !error) {
    console.error("Livre : éléments de protection introuvables.");
    return;
}


/*
 * Calcule le SHA-256 d'une chaîne UTF-8.
 */
async function sha256(text) {

    const data = new TextEncoder().encode(text);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    return Array.from(new Uint8Array(hashBuffer))
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");
}


/*
 * Affiche le contenu protégé.
 */
function unlock() {

    wall.hidden = true;
    content.hidden = false;
}


/*
 * Si le livre a déjà été déverrouillé
 * dans cet onglet, on ne redemande pas
 * le mot de passe.
 */
if (sessionStorage.getItem("livre-auth") === "true") {

    unlock();

}


/*
 * Vérification du mot de passe.
 */
form.addEventListener("submit", async (event) => {

    event.preventDefault();

    error.hidden = true;


    try {

        const hash = await sha256(input.value);


        if (hash === passwordHash) {

            sessionStorage.setItem(
                "livre-auth",
                "true"
            );

            unlock();

        } else {

            error.hidden = false;

            input.value = "";

            input.focus();

        }

    } catch (err) {

        console.error(
            "Livre : impossible de calculer le hash.",
            err
        );

    }

});


})();
