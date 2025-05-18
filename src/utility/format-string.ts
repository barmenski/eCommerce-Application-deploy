export function formatString(string: string, pattern: string): string {
  return string.replaceAll(/[A-Z]/g, (x: string) => pattern + x.toLowerCase());
}
