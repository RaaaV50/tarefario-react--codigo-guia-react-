import { useState } from 'react';

export default function FormularioTarefa({ onAdicionar }) {
    const [texto, setTexto] = useState('');
    const [categoria, setCategoria] = useState('Geral');
    const [prioridade, setPrioridade] = useState('Média');

    function handleSubmit(e) {
        e.preventDefault();
        if (!texto.trim()) return;

        onAdicionar({ texto, categoria, prioridade });
        setTexto('');
    }

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <input
                type="text"
                placeholder="O que você precisa fazer?"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="input-field"
            />

            <div className="form-row">
                <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="select-field"
                >
                    <option value="Geral">Geral</option>
                    <option value="Trabalho">Trabalho</option>
                    <option value="Estudos">Estudos</option>
                    <option value="Pessoal">Pessoal</option>
                </select>

                <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value)}
                    className="select-field"
                >
                    <option value="Baixa">Prioridade Baixa</option>
                    <option value="Média">Prioridade Média</option>
                    <option value="Alta">Prioridade Alta</option>
                </select>

                <button type="submit" className="btn btn-primary">
                    Adicionar
                </button>
            </div>
        </form>
    );
}