// app/api/analyze/route.js

export async function POST(req) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Aucun texte fourni' }),
        { status: 400 }
      );
    }

    const stressLevel = Math.random() * 100;

    return new Response(
      JSON.stringify({ stressLevel: stressLevel.toFixed(2) }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors de l\'analyse' }),
      { status: 500 }
    );
  }
}
