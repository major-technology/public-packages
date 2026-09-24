import { describe, expect, it, vi } from "vitest";
import { createAppFetch } from "../src/app-fetch";

const APP_ID = "22222222-2222-2222-2222-222222222222";

function fakeFetch(lookup: Response) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes("/app-calls/apps/")) {
      return lookup;
    }

    return new Response("from-b", { status: 200 });
  });
}

describe("createAppFetch", () => {
  it("resolves the target URL, then calls it with the path and the user JWT", async () => {
    const fetchMock = fakeFetch(Response.json({ url: "https://b.apps.major.build/" }));
    const appFetch = createAppFetch({
      baseUrl: "https://go-api.test/",
      appId: APP_ID,
      majorJwtToken: "app-token",
      fetch: fetchMock as unknown as typeof fetch,
      getUserJwt: () => "visitor-jwt",
    });

    const res = await appFetch("https://evil.example/api/hello?x=1", { method: "POST", body: "{}" });

    expect(await res.text()).toBe("from-b");
    const [lookupUrl, lookupInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(lookupUrl).toBe(`https://go-api.test/app-calls/apps/${APP_ID}`);
    expect(new Headers(lookupInit.headers).get("x-major-jwt")).toBe("app-token");
    expect(new Headers(lookupInit.headers).get("x-major-user-jwt")).toBe("visitor-jwt");

    const [targetUrl, targetInit] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(targetUrl).toBe("https://b.apps.major.build/api/hello?x=1");
    expect(targetInit.method).toBe("POST");
    expect(new Headers(targetInit.headers).get("x-major-jwt")).toBe("visitor-jwt");
    expect(new Headers(targetInit.headers).get("x-major-user-jwt")).toBeNull();
    expect([...new Headers(targetInit.headers).values()]).not.toContain("app-token");
  });

  it("throws with the status and server message when the lookup fails", async () => {
    const fetchMock = fakeFetch(Response.json({ error: "no access" }, { status: 403 }));
    const appFetch = createAppFetch({
      baseUrl: "https://go-api.test",
      appId: APP_ID,
      majorJwtToken: "app-token",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await expect(appFetch("/api/hello")).rejects.toThrow("app-client: lookup for app 22222222-2222-2222-2222-222222222222 failed (403): no access");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("checks config at request time, not at creation", async () => {
    const appFetch = createAppFetch({ baseUrl: "", appId: APP_ID, majorJwtToken: "t" });

    await expect(appFetch("/x")).rejects.toThrow("createAppFetch: baseUrl is required");
  });
});
