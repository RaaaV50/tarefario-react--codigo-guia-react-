export function filtrarTarefas(lista, status, busca) {
    const termo = busca.toLowerCase();

    return lista.filter((item) => {
        const bateuStatus =
            status === 'todas'
                ? true
                : status === 'pendentes'
                    ? !item.concluida
                    : item.concluida;

        const bateuBusca = item.texto.toLowerCase().includes(termo);

        return bateuStatus && bateuBusca;
    });
}

export function calcularPendentes(lista) {
    return lista.filter((t) => !t.concluida).length;
}