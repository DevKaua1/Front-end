// Seções
const lanches = document.getElementById('lanches');
const acompanhamentos = document.getElementById('acompanhamentos');
const bebidas = document.getElementById('bebidas');
const sobremesas = document.getElementById('sobremesas');
const combos = document.getElementById('combos');
const maisVendidos = document.getElementById('maisVendidos');

// Botões de navegação
const lanchesBtn = document.getElementById('lanchesBtn');
const acompanhamentosBtn = document.getElementById('acompanhamentosBtn');
const bebidasBtn = document.getElementById('bebidasBtn');
const sobremesasBtn = document.getElementById('sobremesasBtn');
const combosBtn = document.getElementById('combosBtn');
const maisVendidosBtn = document.getElementById('maisVendidosBtn');

// Botão de menu e sidebar
const menuBtn = document.getElementById('menuBtn');
const sidebar = document.getElementById('sidebar');

// Botão para finalizar o pedido
const finalizarPedidoBtn = document.getElementById('finalizarPedidoBtn');
const erroMensagem = document.getElementById('erroMensagem');

// Função para esconder todas as seções
function esconderTodasAsSecoes() {
    lanches.style.display = 'none';
    acompanhamentos.style.display = 'none';
    bebidas.style.display = 'none';
    sobremesas.style.display = 'none';
    combos.style.display = 'none';
    maisVendidos.style.display = 'none';
}

// Navegação entre seções
lanchesBtn.onclick = () => {
    esconderTodasAsSecoes();
    lanches.style.display = 'block';
};
acompanhamentosBtn.onclick = () => {
    esconderTodasAsSecoes();
    acompanhamentos.style.display = 'block';
};
bebidasBtn.onclick = () => {
    esconderTodasAsSecoes();
    bebidas.style.display = 'block';
};
sobremesasBtn.onclick = () => {
    esconderTodasAsSecoes();
    sobremesas.style.display = 'block';
};
combosBtn.onclick = () => {
    esconderTodasAsSecoes();
    combos.style.display = 'block';
};
maisVendidosBtn.onclick = () => {
    esconderTodasAsSecoes();
    maisVendidos.style.display = 'block';
    exibirMaisVendidos();
};

// Controle da sidebar em telas pequenas
menuBtn.onclick = () => sidebar.classList.toggle('open');

// Estado inicial
document.addEventListener('DOMContentLoaded', () => {
    esconderTodasAsSecoes();
    lanches.style.display = 'block'; // Exibe "Lanches" por padrão
    exibirMaisVendidos(); // Carrega mais vendidos ao iniciar
});

// Lógica do pedido
const pedidoLista = document.getElementById('pedidoLista');
const total = document.getElementById('total');
let valorTotal = 0;
let pedidoAtual = {};
let vendas = JSON.parse(localStorage.getItem('vendas')) || {};

// Função para exibir os mais vendidos
function exibirMaisVendidos() {
    const maisVendidosOpcoes = document.getElementById('maisVendidosOpcoes');
    maisVendidosOpcoes.innerHTML = '';

    const itensOrdenados = Object.keys(vendas).sort((a, b) => vendas[b] - vendas[a]);

    itensOrdenados.slice(0, 5).forEach(item => {
        const itemOriginal = document.querySelector(`.opcao-item[data-nome="${item}"]`);
        const preco = itemOriginal?.getAttribute('data-preco') || '0.00';
        const imgSrc = itemOriginal?.querySelector('img')?.src || '';

        const button = document.createElement('button');
        button.className = 'opcao-item';
        button.setAttribute('data-nome', item);
        button.setAttribute('data-preco', preco);

        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = `Imagem de ${item}`;
        img.style.width = '162';
        img.style.marginBottom = '10px';

        const text = document.createElement('span');
        text.textContent = `${item}    
            R$ ${parseFloat(preco).toFixed(2)}`;


        button.appendChild(img);
        button.appendChild(text);
        maisVendidosOpcoes.appendChild(button);

        button.onclick = () => adicionarItemAoPedido(item, parseFloat(preco));
    });
}

// Função para adicionar item ao pedido
function adicionarItemAoPedido(nome, preco) {
    if (!pedidoAtual[nome]) {
        pedidoAtual[nome] = 0;
    }
    pedidoAtual[nome]++;
    valorTotal += preco;
    atualizarListaPedido();
    total.textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
}

// Função para atualizar a lista visual do pedido
function atualizarListaPedido() {
    pedidoLista.innerHTML = '';
    for (const nome in pedidoAtual) {
        const preco = parseFloat(document.querySelector(`.opcao-item[data-nome="${nome}"]`)?.getAttribute('data-preco') || '0.00');
        const li = document.createElement('li');
        li.textContent = `${nome} - R$ ${preco.toFixed(2)} (x${pedidoAtual[nome]})`;

        const removerBtn = document.createElement('button');
        removerBtn.textContent = 'Remover';
        removerBtn.onclick = () => {
            pedidoAtual[nome]--;
            valorTotal -= preco;
            if (pedidoAtual[nome] <= 0) delete pedidoAtual[nome];
            atualizarListaPedido();
            total.textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
        };

        li.appendChild(removerBtn);
        pedidoLista.appendChild(li);
    }
}

// Adicionar itens ao pedido ao clicar nos botões
document.querySelectorAll('.opcao-item').forEach(item => {
    item.onclick = () => {
        const nome = item.getAttribute('data-nome');
        const preco = parseFloat(item.getAttribute('data-preco') || '0.00');
        adicionarItemAoPedido(nome, preco);
    };
});

// Finalizar o pedido
finalizarPedidoBtn.onclick = () => {
    if (pedidoLista.children.length === 0) {
        erroMensagem.textContent = "Erro: Adicione pelo menos um item!";
        erroMensagem.style.color = "red";
        setTimeout(() => erroMensagem.textContent = '', 3000);
        return;
    }

    let resumo = "Seu pedido:\n";
    for (const nome in pedidoAtual) {
        const preco = parseFloat(document.querySelector(`.opcao-item[data-nome="${nome}"]`)?.getAttribute('data-preco') || '0.00');
        resumo += `${nome} (x${pedidoAtual[nome]}) - R$ ${(preco * pedidoAtual[nome]).toFixed(2)}\n`;
    }
    resumo += `Total: R$ ${valorTotal.toFixed(2)}`;

    if (confirm(resumo)) {
        erroMensagem.textContent = '';

        for (const nome in pedidoAtual) {
            if (!vendas[nome]) vendas[nome] = 0;
            vendas[nome] += pedidoAtual[nome];
        }

        localStorage.setItem('vendas', JSON.stringify(vendas));
        pedidoAtual = {};
        pedidoLista.innerHTML = '';
        valorTotal = 0;
        total.textContent = `Total: R$ ${valorTotal.toFixed(2)}`;
        exibirMaisVendidos();
    }
};