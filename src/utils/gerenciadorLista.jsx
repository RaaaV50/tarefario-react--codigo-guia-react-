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