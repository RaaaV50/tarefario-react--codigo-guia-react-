import { useState, useEffect } from 'react';

export function useDebounce(valor, atrasoMs = 300) {
    const [valorAtrasado, setValorAtrasado] = useState(valor);

    useEffect(() => {
        const timer = setTimeout(() => {
            setValorAtrasado(valor);
        }, atrasoMs);

        // Se o usuário digitar outra letra antes do tempo acabar, reinicia o relógio
        return () => clearTimeout(timer);
    }, [valor, atrasoMs]);

    return valorAtrasado;
}