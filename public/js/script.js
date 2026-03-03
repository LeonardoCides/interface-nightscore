// 1. GESTÃO DA INTERFACE (UI)
const modal = document.getElementById('modalForm');

// Função para abrir/fechar a modal de cadastro
const toggleModal = () => {
    const modalElement = document.getElementById('modalForm');
    if (modalElement) {
        modalElement.classList.toggle('active');
    }
};

// Fechar a modal ao clicar fora do conteúdo ou pressionar a tecla ESC
window.addEventListener('click', (e) => {
    const modalElement = document.getElementById('modalForm');
    if (e.target === modalElement) toggleModal();
});

window.addEventListener('keydown', (e) => {
    const modalElement = document.getElementById('modalForm');
    if (e.key === 'Escape' && modalElement.classList.contains('active')) {
        toggleModal();
    }
});

// 2. INTEGRAÇÃO COM O BACKEND (API)

// Função para listar os eventos na página principal
const carregarEventos = async () => {
    const container = document.getElementById('eventos-container');
    if (!container) return;

    try {
        const response = await fetch('/api/eventos');
        const eventos = await response.json();

        // Atualiza o contador no badge
        const badgeSpan = document.querySelector('.badge span');
        if (badgeSpan) badgeSpan.innerText = eventos.length;

        // Se não houver eventos, mostra um aviso ou cards de exemplo
        if (eventos.length === 0) {
            container.innerHTML = `<p style="color: #3f3f46; grid-column: 1/-1; text-align: center;">Nenhuma festa encontrada no banco de dados.</p>`;
            return;
        }

        container.innerHTML = eventos.map(evento => `
            <div class="event-card">
                <div class="card-image">
                    <img src="${evento.imagem_url || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=500'}" alt="${evento.titulo}">
                    <span class="card-badge">${evento.categoria}</span>
                    <button class="wishlist-btn"><i class="fa-regular fa-heart"></i></button>
                </div>
                <div class="card-info">
                    <h3>${evento.titulo}</h3>
                    <div class="card-meta">
                        <span><i class="fa-solid fa-location-dot"></i> ${evento.localizacao}</span>
                        <span><i class="fa-regular fa-calendar"></i> ${new Date(evento.data_evento).toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})}</span>
                    </div>
                    <div class="card-footer">
                        <div class="rating">
                            <i class="fa-solid fa-star"></i><span class="stars-text">5.0</span>
                            <span class="reviews">0 avaliações</span>
                        </div>
                        <span class="price">R$ --</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
};

// Função para enviar uma nova festa para o banco de dados
const formFesta = document.getElementById('formFesta');
if (formFesta) {
    formFesta.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dados = {
            titulo: document.getElementById('titulo').value,
            data_evento: document.getElementById('data').value,
            localizacao: document.getElementById('local').value,
            categoria: document.getElementById('categoria').value,
            descricao: document.getElementById('descricao')?.value || "",
            imagem_url: document.getElementById('imagem_url')?.value || "",
            link_venda: document.getElementById('link_venda')?.value || ""
        };

        try {
            const response = await fetch('/api/eventos/cadastrar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (response.ok) {
                alert("Festa publicada com sucesso!");
                toggleModal();
                formFesta.reset();
                carregarEventos(); // Atualiza a lista sem recarregar a página
            } else {
                const erro = await response.json();
                alert(`Erro: ${erro.mensagem}`);
            }
        } catch (error) {
            console.error("Erro na submissão global:", error);
        }
    });
}

// Inicializa a lista de eventos quando o site carrega
document.addEventListener('DOMContentLoaded', carregarEventos);