// Seleciona os elementos
const startBtn = document.getElementById('startBtn');
const popup = document.getElementById('popup');
const closePopupBtn = document.getElementById('closePopupBtn');

// Função para abrir o pop-up
startBtn.onclick = function() {
    popup.style.display = 'flex'; // Exibe o pop-up
    startBtn.style.display = 'none'; // Esconde o botão "Clique aqui para começar"
}

// Função para fechar o pop-up
closePopupBtn.onclick = function() {
    popup.style.display = 'none'; // Oculta o pop-up
    startBtn.style.display = 'block'; // Mostra o botão "Clique aqui para começar"
}

// Fecha o pop-up se o usuário clicar fora do conteúdo
window.onclick = function(event) {
    if (event.target === popup) {
        popup.style.display = 'none'; // Oculta o pop-up
        startBtn.style.display = 'block'; // Mostra o botão novamente
    }
}
