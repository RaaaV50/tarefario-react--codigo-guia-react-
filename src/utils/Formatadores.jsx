// Formata data ISO ou timestamp para padrão brasileiro: "27/10/2026"
export function formatarData(dataInput) {
    if (!dataInput) return '';
    const data = new Date(dataInput);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(data);
}

// Formata data com horário: "27/10/2026 às 14:30"
export function formatarDataHora(dataInput) {
    if (!dataInput) return '';
    const data = new Date(dataInput);
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(data);
}

// Formata números para moeda: 1500.5 -> "R$ 1.500,50"
export function formatarMoeda(valor) {
    const numero = Number(valor) || 0;
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numero);
}

// Primeira letra maiúscula: "estudar react" -> "Estudar react"
export function capitalizarTexto(texto) {
    if (!texto) return '';
    const limpo = texto.trim();
    return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}