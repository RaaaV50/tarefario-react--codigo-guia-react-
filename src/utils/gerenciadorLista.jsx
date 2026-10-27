// utils/gerenciadorLista.jsx (ou .js)

// 1. Adiciona qualquer objeto, gerando o ID automaticamente se não vier um
export function adicionarItem(lista, novoItem) {
    const itemFormatado = {
        id: Date.now(),
        ...novoItem, // Aceita QUALQUER propriedade (nome, preco, texto, etc.)
    };
    return [...lista, itemFormatado];
}

// 2. Remove qualquer item pelo ID
export function removerItem(lista, id) {
    return lista.filter((item) => item.id !== id);
}

// 3. Atualiza QUALQUER propriedade de um item
export function atualizarItem(lista, id, propriedadesAtualizadas) {
    return lista.map((item) =>
        item.id === id ? { ...item, ...propriedadesAtualizadas } : item
    );
}

// 4. Inverte qualquer campo booleano (ex: 'concluida', 'ativo', 'pago')
export function alternarBooleano(lista, id, campo = 'concluida') {
    return lista.map((item) =>
        item.id === id ? { ...item, [campo]: !item[campo] } : item
    );
}

// Funções especializadas para Tarefas (compatibilidade com tarefas)
export function criarTarefa(lista, dados) {
    return adicionarItem(lista, {
        concluida: false,
        ...dados,
    });
}

export function alternarStatusTarefa(lista, id) {
    return alternarBooleano(lista, id, 'concluida');
}

export function atualizarTextoTarefa(lista, id, novoTexto) {
    return atualizarItem(lista, id, { texto: novoTexto });
}

export function excluirTarefa(lista, id) {
    return removerItem(lista, id);
}

export function alternarTodasTarefas(lista) {
    const todasConcluidas = lista.length > 0 && lista.every((t) => t.concluida);
    return lista.map((t) => ({ ...t, concluida: !todasConcluidas }));
}

export function removerConcluidas(lista) {
    return lista.filter((t) => !t.concluida);
}