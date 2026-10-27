export function criarTarefa(lista, dados) {
    const nova = {
        id: Date.now(),
        texto: dados.texto.trim(),
        categoria: dados.categoria,
        prioridade: dados.prioridade,
        concluida: false,
    };
    return [...lista, nova];
}

export function alternarStatusTarefa(lista, id) {
    return lista.map((t) => (t.id === id ? { ...t, concluida: !t.concluida } : t));
}

export function atualizarTextoTarefa(lista, id, novoTexto) {
    return lista.map((t) => (t.id === id ? { ...t, texto: novoTexto.trim() } : t));
}

export function excluirTarefa(lista, id) {
    return lista.filter((t) => t.id !== id);
}

export function alternarTodasTarefas(lista) {
    const todasConcluidas = lista.every((t) => t.concluida);
    return lista.map((t) => ({ ...t, concluida: !todasConcluidas }));
}

export function removerConcluidas(lista) {
    return lista.filter((t) => !t.concluida);
}