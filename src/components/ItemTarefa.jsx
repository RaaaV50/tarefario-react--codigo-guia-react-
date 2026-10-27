import { useState } from 'react';

export default function ItemTarefa({ tarefa, onAlternar, onRemover, onSalvarEdicao }) {
    const [emEdicao, setEmEdicao] = useState(false);
    const [textoEditado, setTextoEditado] = useState(tarefa.texto);

    function handleSalvar() {
        if (!textoEditado.trim()) return;
        onSalvarEdicao(tarefa.id, textoEditado.trim());
        setEmEdicao(false);
    }

    function handleCancelar() {
        setTextoEditado(tarefa.texto);
        setEmEdicao(false);
    }

    if (emEdicao) {
        return (
            <li className="list-item">
                <div className="edit-container">
                    <input
                        type="text"
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        className="input-field"
                        autoFocus
                    />

                    <div style={{ display: 'flex', gap: '4px' }}>
                        <button type="button" onClick={handleSalvar} className="btn btn-save">
                            Salvar
                        </button>
                        <button type="button" onClick={handleCancelar} className="btn btn-cancel">
                            Cancelar
                        </button>
                    </div>
                </div>
            </li>
        );
    }

    return (
        <li className="list-item">
            <div className="item-content">
                <input
                    type="checkbox"
                    checked={tarefa.concluida}
                    onChange={() => onAlternar(tarefa.id)}
                    style={{ cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                        onClick={() => onAlternar(tarefa.id)}
                        className={`item-text ${tarefa.concluida ? 'completed' : ''}`}
                    >
                        {tarefa.texto}
                    </span>
                    <div className="badges-group">
                        <span className="badge badge-category">{tarefa.categoria}</span>
                        <span className={`badge badge-priority-${tarefa.prioridade.toLowerCase()}`}>
                            {tarefa.prioridade}
                        </span>
                    </div>
                </div>
            </div>

            <div className="item-actions">
                <button
                    type="button"
                    onClick={() => setEmEdicao(true)}
                    className="btn-action edit"
                    title="Editar"
                >
                    ✏️
                </button>
                <button
                    type="button"
                    onClick={() => onRemover(tarefa.id)}
                    className="btn-action delete"
                    title="Excluir"
                >
                    🗑️
                </button>
            </div>
        </li>
    );
}