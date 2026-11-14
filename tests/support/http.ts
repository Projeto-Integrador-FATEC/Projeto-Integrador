export function jsonRequest(url: string, body?: unknown, init?: RequestInit) {
  return new Request(url, {
    method: init?.method ?? "POST",
    headers: {
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

export async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}
