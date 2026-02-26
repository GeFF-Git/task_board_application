import { signal, effect, WritableSignal } from '@angular/core';

export function persistedSignal<T>(key: string, defaultValue: T): WritableSignal<T> {
  const stored = localStorage.getItem(key);
  const initial = stored ? (JSON.parse(stored) as T) : defaultValue;
  const sig = signal<T>(initial);

  effect(() => {
    localStorage.setItem(key, JSON.stringify(sig()));
  });

  return sig;
}

export function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}
