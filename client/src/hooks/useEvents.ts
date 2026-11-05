/**
 * Custom React hooks for event data fetching and state management.
 * Centralises loading, error, and data state to keep page components lean.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { IEvent } from "@/types/event";
import { getAllUpcomingEvents, getUserEvents, getJoinedEvents } from "@/lib/api";

interface UseEventsResult {
  events: IEvent[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/** Fetch all upcoming public events */
export function useUpcomingEvents(): UseEventsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUpcomingEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { events, loading, error, refresh: fetch };
}

/** Fetch events created by the authenticated user */
export function useUserEvents(): UseEventsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUserEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { events, loading, error, refresh: fetch };
}

/** Fetch events the authenticated user has joined */
export function useJoinedEvents(): UseEventsResult {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJoinedEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load joined events.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { events, loading, error, refresh: fetch };
}
