import { useState, useEffect } from 'react';
import './App.css';

/**
 * CUSTOM HOOK: useLocalStorage
 * Abstrai a lógica de sincronização com o localStorage em apenas uma linha.
 * Funciona exatamente como um useState comum, mas persiste os dados.
 */
function useLocalStorage(chave, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const item = localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorInicial;
    } catch (erro) {
      console.error(`Erro ao carregar chave "${chave}":`, erro);
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch (erro) {
      console.error(`Erro ao salvar chave "${chave}":`, erro);
    }
  }, [chave, valor]);

  return [valor, setValor];
}

export default function App() {
  // 1. Estados da Aplicação
  const [listaTarefas, setListaTarefas] = useLocalStorage('minhas_tarefas_v2', []);
  const [textoInput, setTextoInput] = useState('');
  const [categoriaInput, setCategoriaInput] = useState('Geral');
  const [prioridadeInput, setPrioridadeInput] = useState('Média');

  // Estados de Interface e Filtros
  const [filtroStatus, setFiltroStatus] = useState('todas'); // 'todas' | 'pendentes' | 'concluidas'
  const [busca, setBusca] = useState('');

  // Estados para Edição Inline (No próprio item)
  const [idEmEdicao, setIdEmEdicao] = useState(null);
  const [textoEmEdicao, setTextoEmEdicao] = useState('');

  // --------------------------------------------------------------------------
  // 2. Operações CRUD
  // --------------------------------------------------------------------------

  // CREATE: Adicionar Tarefa
  function adicionarTarefa(e) {
    e.preventDefault();
    if (!textoInput.trim()) return;

    const novaTarefa = {
      id: Date.now(),
      texto: textoInput.trim(),
      concluida: false,
      categoria: categoriaInput,
      prioridade: prioridadeInput,
    };

    setListaTarefas([...listaTarefas, novaTarefa]);
    setTextoInput('');
  }

  // UPDATE: Alternar status de concluída
  function alternarConcluida(id) {
    setListaTarefas(
      listaTarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa
      )
    );
  }

  // UPDATE: Iniciar modo de edição
  function iniciarEdicao(tarefa) {
    setIdEmEdicao(tarefa.id);
    setTextoEmEdicao(tarefa.texto);
  }

  // UPDATE: Salvar o texto editado
  function salvarEdicao(id) {
    if (!textoEmEdicao.trim()) return;

    setListaTarefas(
      listaTarefas.map((tarefa) =>
        tarefa.id === id ? { ...tarefa, texto: textoEmEdicao.trim() } : tarefa
      )
    );
    setIdEmEdicao(null);
    setTextoEmEdicao('');
  }

  // UPDATE: Cancelar edição
  function cancelarEdicao() {
    setIdEmEdicao(null);
    setTextoEmEdicao('');
  }

  // DELETE: Remover tarefa única
  function removerTarefa(id) {
    setListaTarefas(listaTarefas.filter((tarefa) => tarefa.id !== id));
  }

  // --------------------------------------------------------------------------
  // 3. Ações em Lote (Bulk Actions)
  // --------------------------------------------------------------------------

  function limparConcluidas() {
    setListaTarefas(listaTarefas.filter((t) => !t.concluida));
  }

  function alternarTodas() {
    const todasConcluidas = listaTarefas.every((t) => t.concluida);
    setListaTarefas(
      listaTarefas.map((t) => ({ ...t, concluida: !todasConcluidas }))
    );
  }

  // --------------------------------------------------------------------------
  // 4. Estados Derivados (Filtros e Cálculos)
  // --------------------------------------------------------------------------

  const totalPendentes = listaTarefas.filter((t) => !t.concluida).length;

  const tarefasExibidas = listaTarefas.filter((tarefa) => {
    // Filtro por Status
    const bateuStatus =
      filtroStatus === 'todas'
        ? true
        : filtroStatus === 'pendentes'
          ? !tarefa.concluida
          : tarefa.concluida;

    // Filtro por Busca de Texto
    const bateuBusca = tarefa.texto.toLowerCase().includes(busca.toLowerCase());

    return bateuStatus && bateuBusca;
  });

  // --------------------------------------------------------------------------
  // 5. Interface Visual (JSX)
  // --------------------------------------------------------------------------

  return (
    <div className="card-container">
      <h2 className="card-title">Minhas Tarefas</h2>

      {/* Formulário com Categoria e Prioridade */}
      <form onSubmit={adicionarTarefa} className="form-container">
        <input
          type="text"
          placeholder="O que você precisa fazer?"
          value={textoInput}
          onChange={(e) => setTextoInput(e.target.value)}
          className="input-field"
        />

        <div className="form-row">
          <select
            value={categoriaInput}
            onChange={(e) => setCategoriaInput(e.target.value)}
            className="select-field"
          >
            <option value="Geral">Geral</option>
            <option value="Trabalho">Trabalho</option>
            <option value="Estudos">Estudos</option>
            <option value="Pessoal">Pessoal</option>
          </select>

          <select
            value={prioridadeInput}
            onChange={(e) => setPrioridadeInput(e.target.value)}
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

      {/* Campo de Pesquisa em Tempo Real */}
      <input
        type="text"
        placeholder="Buscar tarefa..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input-field search-input"
      />

      {/* Barra de Filtros e Ações em Lote */}
      <div className="filter-group">
        <button
          type="button"
          className={`btn-filter ${filtroStatus === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('todas')}
        >
          Todas
        </button>
        <button
          type="button"
          className={`btn-filter ${filtroStatus === 'pendentes' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('pendentes')}
        >
          Pendentes
        </button>
        <button
          type="button"
          className={`btn-filter ${filtroStatus === 'concluidas' ? 'active' : ''}`}
          onClick={() => setFiltroStatus('concluidas')}
        >
          Concluídas
        </button>
      </div>

      {/* Barra de Status e Ações Rápidas */}
      <div className="actions-bar">
        <span>{totalPendentes} restante(s)</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={alternarTodas} className="btn-text">
            Marcar/Desmarcar todas
          </button>
          <button type="button" onClick={limparConcluidas} className="btn-text">
            Limpar concluídas
          </button>
        </div>
      </div>

      {/* Lista de Tarefas */}
      <ul className="list-container">
        {tarefasExibidas.length === 0 ? (
          <li className="empty-state">Nenhuma tarefa encontrada.</li>
        ) : (
          tarefasExibidas.map((tarefa) => (
            <li key={tarefa.id} className="list-item">
              {idEmEdicao === tarefa.id ? (
                /* Modo de Edição */
                <div className="edit-container">
                  <input
                    type="text"
                    value={textoEmEdicao}
                    onChange={(e) => setTextoEmEdicao(e.target.value)}
                    className="input-field"
                    autoFocus
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => salvarEdicao(tarefa.id)}
                      className="btn btn-save"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={cancelarEdicao}
                      className="btn btn-cancel"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                /* Modo Normal de Exibição */
                <>
                  <div className="item-content">
                    <input
                      type="checkbox"
                      checked={tarefa.concluida}
                      onChange={() => alternarConcluida(tarefa.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span
                        onClick={() => alternarConcluida(tarefa.id)}
                        className={`item-text ${tarefa.concluida ? 'completed' : ''}`}
                      >
                        {tarefa.texto}
                      </span>
                      <div className="badges-group">
                        <span className="badge badge-category">
                          {tarefa.categoria}
                        </span>
                        <span className={`badge badge-priority-${tarefa.prioridade.toLowerCase()}`}>
                          {tarefa.prioridade}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button
                      type="button"
                      onClick={() => iniciarEdicao(tarefa)}
                      className="btn-action edit"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => removerTarefa(tarefa.id)}
                      className="btn-action delete"
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}