export function safeDate(value: unknown): Date | null {
    if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? null : date;
    }
    return null;
  }