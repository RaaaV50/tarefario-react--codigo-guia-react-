import { useState, useEffect } from 'react';

export function useFetch(url) {
    const [dados, setDados] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        if (!url) return;

        const controlador = new AbortController();
        setCarregando(true);

        fetch(url, { signal: controlador.signal })
            .then((res) => {
                if (!res.ok) throw new Error('Falha ao buscar dados do servidor');
                return res.json();
            })
            .then((json) => {
                setDados(json);
                setErro(null);
            })
            .catch((err) => {
                if (err.name !== 'AbortError') setErro(err.message);
            })
            .finally(() => setCarregando(false));

        return () => controlador.abort();
    }, [url]);

    return { dados, carregando, erro };

}