import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTema() {
    const [tema, setTema] = useLocalStorage('tema_sistema', 'claro');

    useEffect(() => {
        // Aplica o atributo data-theme="escuro" ou "claro" na tag <html>
        document.documentElement.setAttribute('data-theme', tema);
    }, [tema]);

    function alternarTema() {
        setTema(tema === 'claro' ? 'escuro' : 'claro');
    }

    return { tema, alternarTema };
}