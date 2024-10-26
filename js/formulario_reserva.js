//  elementos del DOM
const modal = document.getElementById("calendario-modal");
const elegirFechaBtn = document.getElementById("elegir-fecha");
const closeButton = document.querySelector(".close");

// cuando hacemos click en Elegir fecha boton
elegirFechaBtn.addEventListener("click", () => {
    modal.style.display = "block";
});

//modal se cierra al hacer clic en la "X"
closeButton.addEventListener("click", () => {
    modal.style.display = "none";
});

