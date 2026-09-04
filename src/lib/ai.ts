// Analiza una vacante contra el CV del usuario usando Groq (API compatible
// con el formato de OpenAI: https://console.groq.com/docs/api-reference).

export interface JobAnalysis {
  keySkills: string[];
  matchSummary: string;
  coverLetter: string;
}

const GROQ_MODEL = "openai/gpt-oss-120b";

export async function analyzeJobDescription(
  jobDescription: string,
  cv: string
): Promise<JobAnalysis> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No hay una API key configurada. Agrega GROQ_API_KEY en tu archivo .env.local para activar el analisis con IA."
    );
  }

  if (!jobDescription.trim()) {
    throw new Error("Esta aplicacion no tiene descripcion de vacante guardada.");
  }

  if (!cv.trim()) {
    throw new Error("Pega tu CV para poder comparar contra la vacante.");
  }

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.4,
      max_tokens: 1500,
      reasoning_effort: "low",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente de busqueda de empleo. Respondes SIEMPRE con un JSON valido " +
            'con esta forma exacta: {"keySkills": string[], "matchSummary": string, "coverLetter": string}. ' +
            "keySkills: 5-8 habilidades o requisitos clave que pide la vacante. " +
            "matchSummary: 2-4 oraciones evaluando que tan bien el CV cubre esos requisitos, en español, " +
            "mencionando fortalezas y huecos concretos. " +
            "coverLetter: un borrador breve de carta de presentacion (3 parrafos, español, tono profesional " +
            "pero natural) conectando la experiencia del CV con la vacante.",
        },
        {
          role: "user",
          content: `Descripcion de la vacante:\n${jobDescription}\n\nCV del candidato:\n${cv}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Groq respondio con error ${response.status}. ${detail.slice(0, 200)}`
    );
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("Groq no devolvio contenido en la respuesta.");
  }

  let parsed: Partial<JobAnalysis>;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("No se pudo interpretar la respuesta de la IA.");
  }

  return {
    keySkills: Array.isArray(parsed.keySkills) ? parsed.keySkills : [],
    matchSummary: parsed.matchSummary ?? "",
    coverLetter: parsed.coverLetter ?? "",
  };
}
