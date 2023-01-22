import { useState, useCallback } from 'react';

export const useHttp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (
      url,
      method = 'GET',
      body = null,
      headers = { 'Content-Type': 'application/json' }
    ) => {
      // запускаємо індикатор завантаження одразу коли почалося завантаження даних
      setLoading(true);

      try {
        const response = await fetch(url, { method, body, headers });
        //перевірка чи виконався наш запит нормально, інакше викинути помилку
        if (!response.ok) {
          throw new Error(`Could not fetch ${url}, status: ${response.status}`);
        }
        //якщо запит виконався без помилки -> парсим отриманий json
        const data = await response.json();

        setLoading(false);
        return data;
      } catch (err) {
        setLoading(false);
        setError(err.message);
        throw err;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  //повертаємо з хука потрібні дані!
  return { loading, request, error, clearError };
};
