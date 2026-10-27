// Faz o download de qualquer array ou objeto como um arquivo .json
export function exportarParaJson(dados, nomeArquivo = 'backup-dados.json') {
    const jsonString = JSON.stringify(dados, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = nomeArquivo;
    link.click();

    URL.revokeObjectURL(url);
}

// Lê um arquivo .json enviado pelo usuário num <input type="file" />
export function importarDeJson(arquivo, callbackSucesso, callbackErro) {
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = (evento) => {
        try {
            const dadosConvertidos = JSON.parse(evento.target.result);
            callbackSucesso(dadosConvertidos);
        } catch (erro) {
            if (callbackErro) callbackErro('Arquivo JSON inválido.');
        }
    };
    leitor.readAsText(arquivo);
}