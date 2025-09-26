import type { AccessCodeValidity } from "../models/access-code-validity";
import type { PlaceSuggestionResult } from "../models/place-suggestion-result";
import type { RouteInformation } from "../models/route-information";

function getBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL;
  return configured ?? "/api";
}
async function request<TResponse>(
  method: string,
  urlPart: string,
  body?: unknown,
  accessCode?: string
): Promise<TResponse> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessCode) headers["X-Access-Code"] = accessCode;

  const requestOptions: RequestInit = {
    method,
    headers,
  };

  if (body !== undefined) requestOptions.body = JSON.stringify(body);

  const response = await fetch(`${getBaseUrl()}${urlPart}`, requestOptions);

  if (!response.ok) {
    let message = `${method} request failed: ${response.status} ${response.statusText}`;
    try {
      const errorText = await response.text();
      if (errorText) message += ` - ${errorText}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  // No content
  if (response.status === 204) return undefined as unknown as TResponse;

  const contentType = response.headers.get("Content-Type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<TResponse>;
  }

  // Fallback: return text for non-JSON responses
  const text = await response.text();
  return text as unknown as TResponse;
}

async function get<T>(urlPart: string, accessCode?: string): Promise<T> {
  return request<T>("GET", urlPart, undefined, accessCode);
}

export async function post<TResponse, TRequest>(
  urlPart: string,
  body: TRequest,
  accessCode?: string
): Promise<TResponse> {
  return request<TResponse>("POST", urlPart, body, accessCode);
}

export async function fetchAddressSuggestions(
  queryHint: string,
  accessCode: string
): Promise<PlaceSuggestionResult[]> {
  const params = new URLSearchParams({
    queryHint,
  });
  return get<PlaceSuggestionResult[]>(
    `/address-suggestions?${params}`,
    accessCode
  );
}

export async function fetchRouteInformation(
  startAddress: string,
  endAddress: string,
  hasTollTag: boolean,
  accessCode: string
) {
  const params = new URLSearchParams({
    startAddress,
    endAddress,
    hasTollTag: hasTollTag.toString(),
  });
  const response = await get<RouteInformation>(
    `/route-information?${params}`,
    accessCode
  );
  response.startAddress = startAddress;
  response.endAddress = endAddress;
  return response;
}

export async function validateAccessCode(accessCode: string) {
  return await post<AccessCodeValidity, string>(
    `/access-code/validate`,
    accessCode
  );
}
