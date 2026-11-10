import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { readFileSync } from "node:fs";

export function setupSwagger(app: INestApplication) {

  const assets = [
    [
      "swagger-ui.css",
      require.resolve("swagger-ui-dist/swagger-ui.css"),
      "text/css",
    ],
    [
      "swagger-ui-bundle.js",
      require.resolve("swagger-ui-dist/swagger-ui-bundle.js"),
      "application/javascript",
    ],
    [
      "swagger-ui-standalone-preset.js",
      require.resolve("swagger-ui-dist/swagger-ui-standalone-preset.js"),
      "application/javascript",
    ],
  ];
  const adapter = app.getHttpAdapter();
  for (const [name, file, contentType] of assets) {
    const content = readFileSync(file, "utf8");
    adapter.get(`/api/docs/${name}`, (_request: unknown, response: unknown) => {
      adapter.setHeader(response, "Content-Type", contentType);
      adapter.reply(response, content);
    });
  }

  const config = new DocumentBuilder()
    .setTitle("Schoolroom API")
    .setDescription(
      "API จัดการนักเรียนและห้องเรียน เลือก id คำนำหน้า เพศ ระดับชั้น และครูจาก GET /api/lookups ก่อนทดสอบ",
    )
    .setVersion("1.0")
    .build();

  SwaggerModule.setup(
    "api/docs",
    app,
    () => SwaggerModule.createDocument(app, config),
    {
      jsonDocumentUrl: "api/docs-json",
      customSiteTitle: "Schoolroom API Docs",
      customfavIcon: "data:,",
      swaggerOptions: {
        docExpansion: "none",
        displayRequestDuration: true,
        defaultModelsExpandDepth: -1,
      },
    },
  );
}
