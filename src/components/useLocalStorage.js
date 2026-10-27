import { useState, useEffect } from "react";

export function useLocalStorage(chave, valorInicial) {
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