/* global process */

import { generateWithGemini } from "./geminiProvider.js";

const allowedSurfaces = new Set([
  "scenario",
  "replay",
  "fuel",
  "compass",
  "customScenario",
  "simulationTurn",
  "simulationReflection",
]);

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed." });
    return;
  }

  try {
    const body =
      typeof request.body === "string" ? JSON.parse(request.body) : request.body;
    const { surface, input, context, safetyPrinciples } = body ?? {};

    if (!allowedSurfaces.has(surface)) {
      sendJson(response, 400, { error: "Unknown coach surface." });
      return;
    }

    const data = await generateWithGemini({
      surface,
      input,
      context,
      safetyPrinciples,
    });

    sendJson(response, 200, { data });
  } catch (error) {
    const message =
      error?.message === "Missing GEMINI_API_KEY."
        ? "Gemini is not configured. Add GEMINI_API_KEY on the server."
        : "Ember could not reach AI guidance right now.";

    sendJson(response, 500, {
      error: message,
      detail: process.env.NODE_ENV === "development" ? error?.message : undefined,
    });
  }
}
