export default function ModalConfirmacao({
    aberto,
    titulo,
    mensagem,
    onConfirmar,
    onCancelar,
}) {
    if (!aberto) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
            }}
        >
            <div
                className="card-container"
                style={{ maxWidth: '360px', margin: '16px' }}
            >
                <h3 style={{ marginBottom: '8px' }}>{titulo}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
                    {mensagem}
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button type="button" onClick={onCancelar} className="btn btn-cancel">
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmar}
                        className="btn"
                        style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}