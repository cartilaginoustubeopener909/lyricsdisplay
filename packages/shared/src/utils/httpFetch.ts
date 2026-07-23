import axios from 'axios';

type Headers = Record<string, string>;

const isTauri = (): boolean =>
    typeof window !== 'undefined' && !!(window as any).__TAURI_INTERNALS__;

// TODO: optimize this
export async function httpGet(url: string, headers: Headers = {}): Promise<string> {
    if (isTauri()) {
        const { invoke } = await import('@tauri-apps/api/core');
        return invoke<string>('http_get', { url, headers });
    }

    const res = await axios.get<string>(url, {
        headers,
        timeout: 12_000,
        responseType: 'text',
        transformResponse: (d) => d,
    });

    return typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
}

export async function httpGetJson<T = any>(url: string, headers: Headers = {}): Promise<T> {
    const text = await httpGet(url, headers);
    return JSON.parse(text) as T;
}
