import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return NextResponse.json({ error: "Professor IA ainda não configurado. Adicione GEMINI_API_KEY nas variáveis de ambiente do servidor." }, { status: 503 });
  try {
    const body = await req.json();
    const question = String(body.question || "").slice(0, 4000);
    const level = String(body.level || "iniciante").slice(0, 200);
    if (!question.trim()) return NextResponse.json({ error: "Escreva sua dúvida primeiro." }, { status: 400 });
    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: "Você é o Professor MW, tutor educacional paciente para alunos de todas as idades no Brasil. Responda em português brasileiro, com linguagem clara, respeitosa e apropriada para menores. Explique passo a passo, dê exemplo e, quando útil, proponha uma pergunta para praticar. Não faça a lição inteira sem ensinar o raciocínio. Avise quando não tiver certeza." }] },
        contents: [{ role: "user", parts: [{ text: "Nível/objetivo do aluno: " + level + "\nDúvida: " + question }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 900 }
      })
    });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || "A IA não respondeu. Tente novamente mais tarde." }, { status: 502 });
    const answer = data?.candidates?.[0]?.content?.parts?.map((p: {text?:string})=>p.text || "").join("\n") || "Não consegui gerar uma resposta.";
    return NextResponse.json({ answer });
  } catch {
    return NextResponse.json({ error: "Falha ao conversar com o professor virtual." }, { status: 500 });
  }
}
