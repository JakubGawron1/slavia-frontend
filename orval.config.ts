import { defineConfig } from "orval";

export default defineConfig({
  slavia: {
    // Lokalny snapshot z `pnpm sync:api` (gitignore). Źródło prawdy: utoipa w BE.
    input: "./openapi/openapi.json",
    output: {
      mode: "tags-split",
      target: "./lib/api/generated",
      schemas: "./lib/api/generated/models",
      client: "react-query",
      httpClient: "fetch",
      clean: true,
      override: {
        mutator: {
          path: "./lib/api/mutator.ts",
          name: "customFetch",
        },
        // Domyślnie: GET → useQuery, mutacje → useMutation.
        // Nie ustawiaj obu na true naraz — Orval 8 wtedy odwraca mapowanie.
        fetch: {
          includeHttpResponseReturnType: true,
        },
      },
    },
  },
});
