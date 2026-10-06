import { useEffect, useState } from "react";
import { api } from "./api";

const DEFAULTS = { editor_enabled: true, review_enabled: true };
let cache = null;
let inflight = null;
const listeners = new Set();

export const fetchModes = () => {
  if (cache) return Promise.resolve(cache);
  if (!inflight) inflight = api.get("/modes").then(({ data }) => { cache = { ...DEFAULTS, ...data }; return cache; }).catch(() => DEFAULTS).finally(() => { inflight = null; });
  return inflight;
};

export const setModesCache = (m) => { cache = { ...DEFAULTS, ...m }; listeners.forEach((fn) => fn(cache)); };

export const useModes = () => {
  const [modes, setModes] = useState(cache || DEFAULTS);
  useEffect(() => {
    fetchModes().then(setModes);
    listeners.add(setModes);
    return () => listeners.delete(setModes);
  }, []);
  return modes;
};
