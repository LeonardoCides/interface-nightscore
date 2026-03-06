document.addEventListener('DOMContentLoaded', async () => {
    const cidadeSalva = localStorage.getItem("minhaCidade");
    if (cidadeSalva) {
        UI.setLocalizacaoTexto(cidadeSalva);
    }
    const btnLocalizar = document.querySelector('.btn-activate');
btnLocalizar?.addEventListener('click', () => {
    if (!navigator.geolocation) {
        alert("Seu navegador não suporta geolocalização.");
        return;
    }

    UI.setLocalizacaoTexto("Buscando...");

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await res.json();
            const cidade = data.address.city || data.address.town || data.address.village || "Local desconhecido";
            const estado = data.address.state || "";
            const localCompleto = `${cidade}, ${estado}`;
            
            UI.setLocalizacaoTexto(localCompleto);
            localStorage.setItem("minhaCidade", localCompleto);
            
        } catch (error) {
            UI.setLocalizacaoTexto("Não foi possível obter a cidade");
            console.error(error);
        }
    }, (error) => {
        UI.setLocalizacaoTexto("Acesso à localização negado");
    });
});
    const eventos = await API.buscarEventos();
    EventManager.setEventos(eventos);
    UI.renderizarCards(eventos);
    UI.atualizarContador(eventos.length);

    const inputBusca = document.getElementById('main-search');
    const tags = document.querySelectorAll('.tag');

    const dispararFiltro = () => {
        const termo = inputBusca ? inputBusca.value.toLowerCase() : '';
        const tagAtiva = document.querySelector('.tag.active');
        const categoriaAtiva = tagAtiva ? tagAtiva.innerText : 'Todas';
        const filtrados = EventManager.filtrar(termo, categoriaAtiva);
        UI.renderizarCards(filtrados);
        UI.atualizarContador(filtrados.length);
    };

    inputBusca?.addEventListener('input', dispararFiltro);

    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            dispararFiltro();
        });
    });

    document.getElementById('formFesta')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const getVal = (id) => document.getElementById(id)?.value || '';

        const dados = {
            titulo: getVal('titulo'),
            data: getVal('data'),
            local: getVal('local'),
            categoria: getVal('categoria'),
            descricao: getVal('descricao'),
            link_venda: getVal('link_venda'),
            imagem_url: getVal('imagem_url')
        };

        const res = await API.salvarEvento(dados);
        if (res.ok) {
            UI.toggleModal();
            e.target.reset();
            const novosEventos = await API.buscarEventos();
            EventManager.setEventos(novosEventos);
            UI.renderizarCards(novosEventos);
            UI.atualizarContador(novosEventos.length);
        }
    });
});

async function handleExcluir(id) {
    if (!confirm('Deseja excluir esta festa?')) return;
    
    try {
        const res = await API.excluirEvento(id);
        if (res.ok) {
            EventManager.removerEventoLocal(id);
            const atualizados = EventManager.getTodos();
            UI.renderizarCards(atualizados);
            UI.atualizarContador(atualizados.length);
        } else {
            alert('Erro ao excluir o evento do banco de dados.');
        }
    } catch (error) {
        console.error('Erro na exclusão:', error);
    }
}
