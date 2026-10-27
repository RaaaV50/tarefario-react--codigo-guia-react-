import { useState } from 'react';
import { useLocalStorage } from './components/useLocalStorage';
import {
  criarTarefa,
  alternarStatusTarefa,
  atualizarTextoTarefa,
  excluirTarefa,
  alternarTodasTarefas,
  removerConcluidas,
} from './utils/gerenciadorLista';
import { filtrarTarefas, calcularPendentes } from './utils/filtrosTarefas';

import FormularioTarefa from './components/FormularioTarefas';
import BarraFiltros from './components/BarraFiltros';
import ItemTarefa from './components/ItemTarefa';
import './App.css';

export default function App() {
  const [tarefas, setTarefas] = useLocalStorage('minhas_tarefas_v2', []);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [busca, setBusca] = useState('');

  // Ações delegadas para as funções puras de utils
  const handleAdicionar = (dados) => setTarefas(criarTarefa(tarefas, dados));
  const handleAlternar = (id) => setTarefas(alternarStatusTarefa(tarefas, id));
  const handleSalvarEdicao = (id, texto) => setTarefas(atualizarTextoTarefa(tarefas, id, texto));
  const handleExcluir = (id) => setTarefas(excluirTarefa(tarefas, id));
  const handleAlternarTodas = () => setTarefas(alternarTodasTarefas(tarefas));
  const handleLimparConcluidas = () => setTarefas(removerConcluidas(tarefas));

  // Dados calculados sob demanda
  const totalPendentes = calcularPendentes(tarefas);
  const tarefasExibidas = filtrarTarefas(tarefas, filtroStatus, busca);

  return (
    <div className="card-container">
      <h2 className="card-title">Minhas Tarefas</h2>

      <FormularioTarefa onAdicionar={handleAdicionar} />

      <input
        type="text"
        placeholder="Buscar tarefa..."
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        className="input-field search-input"
      />

      <BarraFiltros
        filtroStatus={filtroStatus}
        onMudarFiltro={setFiltroStatus}
        totalPendentes={totalPendentes}
        onAlternarTodas={handleAlternarTodas}
        onLimparConcluidas={handleLimparConcluidas}
      />

      <ul className="list-container">
        {tarefasExibidas.length === 0 ? (
          <li className="empty-state">Nenhuma tarefa encontrada.</li>
        ) : (
          tarefasExibidas.map((tarefa) => (
            <ItemTarefa
              key={tarefa.id}
              tarefa={tarefa}
              onAlternar={handleAlternar}
              onExcluir={handleExcluir}
              onSalvarEdicao={handleSalvarEdicao}
            />
          ))
        )}
      </ul>
    </div>
  );
}