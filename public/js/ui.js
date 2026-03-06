const UI = {
    toggleModal() {
        const modal = document.getElementById('modalForm');
        if (modal) modal.classList.toggle('active');
    },

    atualizarContador(total) {
        const badge = document.getElementById('event-count');
        if (badge) badge.innerText = total;
    },

    formatarData(dataString) {
        if (!dataString) return 'Data não informada';
        const data = new Date(dataString + 'T12:00:00');
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            weekday: 'short'
        }).replace('.', '');
    },

    renderizarCards(eventos) {
        const container = document.getElementById('eventos-container');
        if (!container) return;

        if (!eventos || eventos.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #71717a;">
                    <i class="fa-solid fa-calendar-xmark" style="font-size: 3rem; margin-bottom: 1rem; display: block;"></i>
                    <p>Nenhuma festa encontrada para esta busca.</p>
                </div>`;
            return;
        }

        container.innerHTML = eventos.map(evento => {
            const imgSafe = (evento.imagem_url && evento.imagem_url !== 'null') 
                ? evento.imagem_url 
                : 'img/sem-foto.png';
            
            const dataFormatada = this.formatarData(evento.data_evento);
            
            return `
            <div class="event-card-compact" onclick="window.location.href='/evento/${evento.id}'" style="cursor: pointer;">
                <div class="card-image">
                    <img src="${imgSafe}" onerror="this.src='img/sem-foto.jpg'">
                    <span class="card-badge-mini">${evento.categoria || 'Geral'}</span>
                    <div class="card-actions-mini">
                        <button class="action-btn-mini delete-btn" onclick="event.stopPropagation(); handleExcluir(${evento.id})">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </div>
                <div class="card-info-compact">
                    <div class="card-header-mini">
                        <h3 class="card-title-mini">${evento.titulo}</h3>
                        <div class="rating-purple">
                            <i class="fa-solid fa-star"></i>
                            <span>5.0</span>
                        </div>
                    </div>
                    <div class="card-meta-inline">
                        <div class="meta-item-mini">
                            <i class="fa-solid fa-location-dot"></i>
                            <span>${evento.localizacao || 'Local não informado'}</span>
                        </div>
                        <div class="meta-item-mini">
                            <i class="fa-regular fa-calendar"></i>
                            <span>${dataFormatada}</span>
                        </div>
                    </div>
                    <div class="card-footer-mini">
                        <span class="price-value-mini">Gratuito</span>
                        <a href="${evento.link_venda || '#'}" target="_blank" onclick="event.stopPropagation();" class="btn-ticket-mini">Ingressos</a>
                    </div>
                </div>
            </div>`;
        }).join('');
    },

    setLocalizacaoTexto(texto) {
        const localInfo = document.querySelector('.location-info');
        if (localInfo) {
            localInfo.innerHTML = `<i class="fa-solid fa-location-check"></i> Você está em: <strong>${texto}</strong>`;
        }
        const btnLocal = document.querySelector('.btn-activate');
        if (btnLocal) btnLocal.style.display = 'none';
    }
};
