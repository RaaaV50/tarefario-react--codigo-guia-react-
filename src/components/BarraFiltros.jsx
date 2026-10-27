export default function BarraFiltros({
    filtroStatus,
    onMudarFiltro,
    totalPendentes,
    onAlternarTodas,
    onLimparConcluidas,
}) {
    return (
        <>
            <div className="filter-group">
                <button
                    type="button"
                    className={`btn-filter ${filtroStatus === 'todas' ? 'active' : ''}`}
                    onClick={() => onMudarFiltro('todas')}
                >
                    Todas
                </button>
                <button
                    type="button"
                    className={`btn-filter ${filtroStatus === 'pendentes' ? 'active' : ''}`}
                    onClick={() => onMudarFiltro('pendentes')}
                >
                    Pendentes
                </button>
                <button
                    type="button"
                    className={`btn-filter ${filtroStatus === 'concluidas' ? 'active' : ''}`}
                    onClick={() => onMudarFiltro('concluidas')}
                >
                    Concluídas
                </button>
            </div>

            <div className="actions-bar">
                <span>{totalPendentes} restante(s)</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={onAlternarTodas} className="btn-text">
                        Marcar/Desmarcar todas
                    </button>
                    <button type="button" onClick={onLimparConcluidas} className="btn-text">
                        Limpar concluídas
                    </button>
                </div>
            </div>
        </>
    );
}