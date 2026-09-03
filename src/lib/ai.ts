// Este archivo queda listo para cuando tengas tu API key de IA (Anthropic u OpenAI).
// La idea: recibir la descripcion de la vacante + tu CV, y devolver:
//  - habilidades clave que pide la vacante
//  - que tanto haces match con tu perfil
//  - un borrador de carta de presentacion
//
// Por ahora solo lanza un error controlado para que la UI pueda mostrar
// "Configura tu API key para activar esta funcion".

export async function analyzeJobDescription(_jobDescription: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      "No hay una API key configurada. Agrega ANTHROPIC_API_KEY (o OPENAI_API_KEY) en tu archivo .env.local para activar el analisis con IA."
    );
  }

  // TODO: aqui va la llamada real al modelo (Anthropic Messages API u OpenAI),
  // usando streaming para ir mostrando el resultado en vivo con Suspense + use().
  throw new Error("Analisis con IA todavia no implementado.");
}
