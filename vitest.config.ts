import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      include: [
        "src/services/**/*.service.ts",
        "src/app/api/**/*.ts",
        "src/app/imagens/**/*.ts",
        "src/lib/http-error.ts",
        "src/lib/auth-guard.ts",
        "src/lib/course-catalog.ts",
        "src/app/DTOs/**/*.ts",
        "src/repositories/auth.repository.ts",
      ],
      exclude: ["src/app/api/auth/**"],
      thresholds: {
        lines: 85,
        functions: 85,
        statements: 85,
        branches: 80,
      },
    },
  },
});
