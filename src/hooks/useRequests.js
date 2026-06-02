// src/hooks/useRequests.js

import { useState, useEffect, useCallback } from 'react';
import { getAllRequests, addRequest, updateRequest, deleteRequest } from '../utils/database';

export function useRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllRequests();
      setRequests(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const createRequest = async (requestData) => {
    const newRequest = await addRequest(requestData);
    setRequests((prev) => [...prev, newRequest]);
    return newRequest;
  };

  const editRequest = async (id, updates) => {
    const updated = await updateRequest(id, updates);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    return updated;
  };

  const removeRequest = async (id) => {
    await deleteRequest(id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return {
    requests,
    loading,
    loadRequests,
    createRequest,
    editRequest,
    removeRequest,
  };
}
