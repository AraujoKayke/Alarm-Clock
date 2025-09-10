//region modal
// Obtem a modal para o DOM
const modal = document.getElementById("modal-alerta");

// Pega o botão que abre a modal
var btn = document.getElementById("myBtn");

// pega o elemento <span> que fecah a modal
const span = document.getElementsByClassName("close")[0];

//quando cliacar no botão, abre-se a modal
btn.onclick = function() {
  modal.style.display = "block";
}

// Quando clicar no <span> (x), a modal fecha
span.onclick = function() {
  modal.style.display = "none";
}

// com a modal aberta, se clicar em qualquer lugar da tela, ela fecha
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


