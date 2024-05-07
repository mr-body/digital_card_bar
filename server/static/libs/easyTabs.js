var tabButtons = document.querySelectorAll(".tabContainer .buttonContainer button");
var tabPanels = document.querySelectorAll(".tabContainer .tabPanel");

function showPanel(panelIndex, colorCode) {
    tabButtons.forEach(function (node) {
        node.style.backgroundColor = "";
        node.style.color = "";
        node.style.border = ""; // Limpar o estilo da borda completamente
    });
    tabButtons[panelIndex].style.backgroundColor = "rgba(255, 166, 0, 0.133)";
    tabButtons[panelIndex].style.borderColor = "orange"; // Definir apenas a cor da borda
    tabButtons[panelIndex].style.borderWidth = "1px"; // Definir a largura da borda
    tabButtons[panelIndex].style.borderStyle = "solid"; // Definir o estilo da borda
    tabButtons[panelIndex].style.color = "orange";
    tabPanels.forEach(function (node) {
        node.style.display = "none";
    });
    tabPanels[panelIndex].style.display = "block";
    tabPanels[panelIndex].style.backgroundColor = colorCode;
}

showPanel(0, '#efefef');



document.getElementById("codigo").focus()

function insertValue(e) {
    document.getElementById('codigo').value = `${document.getElementById('codigo').value + e}`
    document.getElementById("codigo").focus()
}

function deleter() {
    document.getElementById('codigo').value = ""
    document.getElementById("codigo").focus()
}

function limpar() {
    var input = document.getElementById("codigo");
    var texto = input.value;

    // Verifica se há pelo menos um caractere
    if (texto.length > 0) {
        // Remove o último caractere
        texto = texto.slice(0, -1);
        // Atualiza o valor do campo de entrada
        input.value = texto;
    }
    document.getElementById("codigo").focus()
}
