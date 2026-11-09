const baseUrl = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api" : "")
).replace(/\/$/, "");
export function queryString(values: object) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      params.set(key, String(value));
  });
  return params.toString();
}
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  if (!baseUrl)
    throw new Error("ยังไม่ได้ตั้งค่า VITE_API_URL สำหรับเชื่อมต่อ API");
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      method,
      headers:
        body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบเซิร์ฟเวอร์และการเชื่อมต่อ",
    );
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      Array.isArray(error.message)
        ? error.message.join(" · ")
        : error.message || `เกิดข้อผิดพลาด (${response.status})`,
    );
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}
