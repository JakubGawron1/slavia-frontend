export async function copyText(label: string, text: string): Promise<void> {
  if (!text) throw new Error(`Brak wartości: ${label}`);
  await navigator.clipboard.writeText(text);
}

export function maskToken(token: string | null): string | null {
  if (!token) return null;
  if (token.length <= 12) return "••••••••";
  return `${token.slice(0, 6)}…${token.slice(-4)} (${token.length} znaków)`;
}
