/**
 * ============================================================================
 * GUIA DE BOLSO REACT: CONCEITOS, SINTAXE E PADRÕES ESSENCIAIS
 * ============================================================================
 * 
 * 1. useState:
 *    - Cria a "memória reativa" da tela.
 *    - Sintaxe: const [valor, setValor] = useState(valorInicial);
 *    - NUNCA altere o valor diretamente (ex: valor = 10 NÃO FUNCIONA). Use sempre setValor(10).
 * 
 * 2. Imutabilidade (A Regra de Ouro):
 *    - Adicionar em lista:   [...listaAntiga, novoItem]
 *    - Remover da lista:     listaAntiga.filter(item => item.id !== idRemovido)
 *    - Modificar um item:    listaAntiga.map(item => item.id === idAlvo ? { ...item, modificado: true } : item)
 * 
 * 3. useEffect (Efeitos Colaterais):
 *    - Sincroniza o React com coisas externas (localStorage, APIs, temporizadores).
 *    - Com [dependencia]: roda na montagem e toda vez que essa variável mudar.
 *    - Com []: roda APENAS uma vez quando o componente é carregado.
 *    - Sem array: roda a cada renderização (quase nunca usado).
 * 
 * 4. Estado Derivado:
 *    - Se um valor pode ser calculado a partir de um estado já existente, NUNCA crie outro useState.
 *    - Apenas crie uma constante comum antes do return (ex: tarefasPendentes abaixo).
 * ============================================================================
 */

import { useState, useEffect } from 'react';
import './App.css';

export default function CodigoGuiaReact() {
  // --------------------------------------------------------------------------
  // 1. DECLARAÇÃO DE ESTADOS (useState)
  // --------------------------------------------------------------------------

  // Estado simples: string para controlar input
  const [textoInput, setTextoInput] = useState('');

  // Estado com função inicializadora (Lazy Initialization):
  // Usado quando a leitura inicial é pesada (ex: ler o localStorage).
  const [listaTarefas, setListaTarefas] = useState(() => {
    try {
      const dadosSalvos = localStorage.getItem('minhas_tarefas');
      return dadosSalvos ? JSON.parse(dadosSalvos) : [];
    } catch {
      return [];
    }
  });

  // Estado para controlar a interface (qual aba/filtro está ativo)
  const [filtro, setFiltro] = useState('todas'); // 'todas' | 'pendentes' | 'concluidas'

  // --------------------------------------------------------------------------
  // 2. EFEITOS COLATERAIS (useEffect)
  // --------------------------------------------------------------------------

  // Salva no localStorage sempre que 'listaTarefas' sofrer qualquer modificação
  useEffect(() => {
    localStorage.setItem('minhas_tarefas', JSON.stringify(listaTarefas));
  }, [listaTarefas]); // <-- Array de dependências: gatilho de execução

  // --------------------------------------------------------------------------
  // 3. FUNÇÕES MANIPULADORAS (Handlers de Ações / CRUD)
  // --------------------------------------------------------------------------

  // CREATE (Adicionar)
  function adicionarItem(e) {
    e.preventDefault(); // Impede o recarregamento padrão da página caso use <form>
    if (!textoInput.trim()) return;

    // Criamos o novo objeto (como uma struct em C)
    const novoItem = {
      id: Date.now(), // ID numérico único baseado no milissegundo atual
      texto: textoInput,
      concluida: false,
    };

    // Imutabilidade: espalha o array antigo e insere o novo no fim
    setListaTarefas([...listaTarefas, novoItem]);
    setTextoInput(''); // Limpa o input
  }

  // UPDATE (Atualizar status/inverter booleano)
  function alternarConclusao(idAlvo) {
    // .map() percorre todos os itens e retorna uma lista nova
    const listaAtualizada = listaTarefas.map((tarefa) => {
      if (tarefa.id === idAlvo) {
        // Copia as propriedades antigas com {...tarefa} e sobrescreve 'concluida'
        return { ...tarefa, concluida: !tarefa.concluida };
      }
      return tarefa; // Mantém inalterado
    });

    setListaTarefas(listaAtualizada);
  }

  // DELETE (Remover)
  function removerItem(idAlvo) {
    // .filter() retorna apenas os itens que passaram no teste lógico
    const listaFiltrada = listaTarefas.filter((tarefa) => tarefa.id !== idAlvo);
    setListaTarefas(listaFiltrada);
  }

  // --------------------------------------------------------------------------
  // 4. ESTADOS DERIVADOS (Cálculos automáticos sem novo useState)
  // --------------------------------------------------------------------------

  // Quantidade de pendentes calculada na hora
  const totalPendentes = listaTarefas.filter((t) => !t.concluida).length;

  // Filtragem da lista para exibição
  const tarefasExibidas = listaTarefas.filter((tarefa) => {
    if (filtro === 'pendentes') return !tarefa.concluida;
    if (filtro === 'concluidas') return tarefa.concluida;
    return true; // Se for 'todas', exibe tudo
  });

  // --------------------------------------------------------------------------
  // 5. RENDERIZAÇÃO (JSX)
  // --------------------------------------------------------------------------
  return (
    <div className="card-container">
      <h2 className="card-title">Minha Lista de Tarefas</h2>

      <form onSubmit={adicionarItem} className="form-group">
        <input
          type="text"
          placeholder="O que precisa ser feito?"
          value={textoInput}
          onChange={(e) => setTextoInput(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="btn btn-primary">
          Adicionar
        </button>
      </form>

      <div className="filter-group">
        <button
          type="button"
          className={`btn-filter ${filtro === 'todas' ? 'active' : ''}`}
          onClick={() => setFiltro('todas')}
        >
          Todas
        </button>
        <button
          type="button"
          className={`btn-filter ${filtro === 'pendentes' ? 'active' : ''}`}
          onClick={() => setFiltro('pendentes')}
        >
          Pendentes
        </button>
        <button
          type="button"
          className={`btn-filter ${filtro === 'concluidas' ? 'active' : ''}`}
          onClick={() => setFiltro('concluidas')}
        >
          Concluídas
        </button>
      </div>

      <ul className="list-container">
        {tarefasExibidas.length === 0 ? (
          <li className="empty-state">Nenhuma tarefa encontrada.</li>
        ) : (
          tarefasExibidas.map((tarefa) => (
            <li key={tarefa.id} className="list-item">
              <span
                onClick={() => alternarConclusao(tarefa.id)}
                className={`item-text ${tarefa.concluida ? 'completed' : ''}`}
              >
                {tarefa.texto}
              </span>

              <button
                type="button"
                onClick={() => removerItem(tarefa.id)}
                className="btn btn-danger"
              >
                Excluir
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}