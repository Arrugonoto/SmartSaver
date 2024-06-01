import { useState, useEffect, useCallback } from 'react';

type FetchProps = {
  action: (user_id: string) => Promise<any>;
  user_id: string;
};

export const useFetch = <T>({ action, user_id }: FetchProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await action(user_id);

      if (result.error) {
        setError(result.error.message);
      } else {
        setData(result.data);
        setTotalResults(result.totalResults);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [action, user_id]);

  const refetchData = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { refetchData, isLoading, data, error, totalResults };
};
