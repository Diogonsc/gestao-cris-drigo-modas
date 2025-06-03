import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

console.log("MSW: Configurando worker com handlers:", handlers);
export const worker = setupWorker(...handlers);

// Adiciona listener para debug
worker.events.on("request:start", ({ request }) => {
  console.log("MSW: Interceptando requisição:", request.method, request.url);
});

worker.events.on("request:match", ({ request }) => {
  console.log(
    "MSW: Requisição correspondente encontrada:",
    request.method,
    request.url
  );
});

worker.events.on("request:unhandled", ({ request }) => {
  console.log("MSW: Requisição não tratada:", request.method, request.url);
});
