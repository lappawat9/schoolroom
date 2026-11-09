const endpoint = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000/api/graphql" : "")
).replace(/\/$/, "");

interface GraphQLResponse<T> {
  data?: { result: T };
  errors?: {
    message: string;
    extensions?: { originalError?: { message?: string | string[] } };
  }[];
}

export async function api<T>(
  query: string,
  variables: object = {},
): Promise<T> {
  if (!endpoint)
    throw new Error("ยังไม่ได้ตั้งค่า VITE_API_URL สำหรับเชื่อมต่อ API");
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error(
      "เชื่อมต่อ API ไม่สำเร็จ กรุณาตรวจสอบเซิร์ฟเวอร์และการเชื่อมต่อ",
    );
  }
  const payload: GraphQLResponse<T> = await response.json().catch(() => ({}));
  if (payload.errors?.length) {
    const messages = payload.errors.flatMap((error) => {
      const message = error.extensions?.originalError?.message ?? error.message;
      return Array.isArray(message) ? message : [message];
    });
    throw new Error([...new Set(messages)].join(" · "));
  }
  if (!response.ok)
    throw new Error(`เกิดข้อผิดพลาด (${response.status})`);
  if (!payload.data || !("result" in payload.data))
    throw new Error("รูปแบบข้อมูลตอบกลับจาก GraphQL ไม่ถูกต้อง");
  return payload.data.result;
}
