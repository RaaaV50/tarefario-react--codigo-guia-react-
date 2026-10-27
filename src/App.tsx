import { useState, useRef, useEffect, useMemo } from 'react';
import { useLocalStorage } from './components/useLocalStorage';
import { useTema } from './components/UseTema';
import { useDebounce } from './components/UseProcuraInteligente';
import { useFetch } from './components/useFetch';
import ModalConfirmacao from './components/ModalConfirmacao';
import FormularioTarefa from './components/FormularioTarefas';
import BarraFiltros from './components/BarraFiltros';
import ItemTarefa from './components/ItemTarefa';
import {
  criarTarefa,
  alternarStatusTarefa,
  atualizarTextoTarefa,
  excluirTarefa,
  alternarTodasTarefas,
  removerConcluidas,
} from './utils/gerenciadorLista';
import { filtrarTarefas, calcularPendentes } from './utils/filtrosTarefas';
import { capitalizarTexto, formatarData } from './utils/Formatadores';
import { exportarParaJson, importarDeJson } from './utils/BckupJson';
import './App.css';

export default function App() {
  const { tema, alternarTema } = useTema();
  const [tarefas, setTarefas] = useLocalStorage('minhas_tarefas_v2', []);
  const [filtroStatus, setFiltroStatus] = useState('todas');
  const [busca, setBusca] = useState('');
  const buscaOtimizada = useDebounce(busca, 300);

  // Integração do hook useFetch para carregamento de dados remotos ou exemplos
  const [urlFetch, setUrlFetch] = useState('');
  const { dados: tarefasApi, carregando: carregandoApi, erro: erroApi } = useFetch(urlFetch);
  const ultimaUrlProcessada = useRef('');

  useEffect(() => {
    if (tarefasApi && Array.isArray(tarefasApi) && urlFetch && ultimaUrlProcessada.current !== urlFetch) {
      ultimaUrlProcessada.current = urlFetch;
      const novasTarefas = (tarefasApi as any[]).map((item: any) => ({
        id: item.id || Date.now() + Math.floor(Math.random() * 1000),
        texto: capitalizarTexto(item.texto || item.title || 'Nova Tarefa'),
        categoria: item.categoria || 'Geral',
        prioridade: item.prioridade || 'Média',
        concluida: Boolean(item.concluida ?? item.completed),
        dataCriacao: item.dataCriacao || new Date().toISOString(),
      }));
      setTarefas((atuais: any[]) => [...atuais, ...novasTarefas]);
    }
  }, [tarefasApi, urlFetch, setTarefas]);

  // Modal de Confirmação para ações críticas
  const [modalConfig, setModalConfig] = useState<{
    aberto: boolean;
    titulo: string;
    mensagem: string;
    onConfirmar: () => void;
  }>({
    aberto: false,
    titulo: '',
    mensagem: '',
    onConfirmar: () => { },
  });

  const fecharModal = () => {
    setModalConfig((prev) => ({ ...prev, aberto: false }));
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ações delegadas para as funções puras de utils
  const handleAdicionar = (dados: any) => {
    setTarefas(
      criarTarefa(tarefas, {
        ...dados,
        texto: capitalizarTexto(dados.texto),
        dataCriacao: new Date().toISOString(),
      })
    );
  };

  const handleAlternar = (id: any) => setTarefas(alternarStatusTarefa(tarefas, id));
  const handleSalvarEdicao = (id: any, texto: string) =>
    setTarefas(atualizarTextoTarefa(tarefas, id, capitalizarTexto(texto)));
  const handleExcluir = (id: any) => setTarefas(excluirTarefa(tarefas, id));
  const handleAlternarTodas = () => setTarefas(alternarTodasTarefas(tarefas));
  const handleLimparConcluidas = () => setTarefas(removerConcluidas(tarefas));

  // Acionamento com Modal de Confirmação
  const confirmarExclusao = (id: any) => {
    setModalConfig({
      aberto: true,
      titulo: 'Excluir Tarefa',
      mensagem: 'Tem certeza de que deseja excluir esta tarefa?',
      onConfirmar: () => {
        handleExcluir(id);
        fecharModal();
      },
    });
  };

  const confirmarLimparConcluidas = () => {
    const qtdConcluidas = tarefas.filter((t: any) => t.concluida).length;
    if (qtdConcluidas === 0) return;

    setModalConfig({
      aberto: true,
      titulo: 'Limpar Concluídas',
      mensagem: `Deseja realmente remover as ${qtdConcluidas} tarefa(s) concluída(s)?`,
      onConfirmar: () => {
        handleLimparConcluidas();
        fecharModal();
      },
    });
  };

  // Funções de backup com BckupJson
  const handleExportarBackup = () => {
    exportarParaJson(tarefas, `backup-tarefas-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleImportarBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    importarDeJson(
      arquivo,
      (dadosImportados: any) => {
        if (Array.isArray(dadosImportados)) {
          setTarefas(dadosImportados);
        } else {
          alert('Arquivo JSON inválido. O arquivo deve conter uma lista de tarefas.');
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      (erroMsg: string) => {
        alert(erroMsg);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    );
  };

  // Dados calculados sob demanda
  const dataHoje = useMemo(() => formatarData(new Date()), []);
  const totalPendentes = calcularPendentes(tarefas);
  const tarefasExibidas = filtrarTarefas(tarefas, filtroStatus, buscaOtimizada);

  return (
    <div className="card-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 className="card-title" style={{ marginBottom: '2px' }}>Minhas Tarefas</h2>
          <small style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {dataHoje}
          </small>
        </div>
        <button
          type="button"
          onClick={alternarTema}
          className="btn-action"
          title={`Alternar para tema ${tema === 'claro' ? 'escuro' : 'claro'}`}
          style={{ fontSize: '1.25rem', padding: '6px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
        >
          {tema === 'claro' ? '🌙' : '☀️'}
        </button>
      </div>

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
        onLimparConcluidas={confirmarLimparConcluidas}
      />

      <ul className="list-container">
        {tarefasExibidas.length === 0 ? (
          <li className="empty-state">Nenhuma tarefa encontrada.</li>
        ) : (
          tarefasExibidas.map((tarefa: any) => (
            <ItemTarefa
              key={tarefa.id}
              tarefa={tarefa}
              onAlternar={handleAlternar}
              onRemover={confirmarExclusao}
              onSalvarEdicao={handleSalvarEdicao}
            />
          ))
        )}
      </ul>

      {/* Barra de Ações Rápidas: Backup e API */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px',
          marginTop: '20px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={handleExportarBackup}
            className="btn-text"
            title="Exportar tarefas para arquivo JSON"
          >
            💾 Exportar
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="btn-text"
            title="Importar tarefas de um arquivo JSON"
          >
            📂 Importar
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            style={{ display: 'none' }}
            onChange={handleImportarBackup}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setUrlFetch('/tarefas-exemplo.json')}
            className="btn-text"
            disabled={carregandoApi}
            title="Buscar tarefas de exemplo via useFetch"
          >
            {carregandoApi ? '⏳ Carregando...' : '🌐 Carregar da API'}
          </button>
        </div>
      </div>

      {erroApi && (
        <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>
          Erro ao carregar dados: {erroApi}
        </p>
      )}

      {/* Modal de Confirmação */}
      <ModalConfirmacao
        aberto={modalConfig.aberto}
        titulo={modalConfig.titulo}
        mensagem={modalConfig.mensagem}
        onConfirmar={modalConfig.onConfirmar}
        onCancelar={fecharModal}
      />
    </div>
  );
}