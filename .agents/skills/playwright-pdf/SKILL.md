---
name: playwright-pdf
description: Renderizar HTML a PDF usando Playwright en el Worker de Neteg.
---

# Skill: Playwright PDF Rendering

Usa esta skill para la generación de documentos PDF a partir de plantillas HTML en el Worker.

## 🎯 Cuándo usar
- Al modificar `worker/Renderers/HtmlToPdfRenderer.cs`.
- Al crear nuevas plantillas de diplomas.
- Al debuggear problemas de diseño en los certificados generados.

## ⚙️ Preparación del Entorno
Si es la primera vez o se actualiza el paquete:
```powershell
cd worker
dotnet build
pwsh bin/Debug/net9.0/playwright.ps1 install chromium
```

## 🛠️ Implementación Recomendada

### Estructura del Renderer
```csharp
public async Task<byte[]> RenderHtmlToPdfAsync(string htmlContent) {
    using var playwright = await Playwright.CreateAsync();
    await using var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions { Headless = true });
    var page = await browser.NewPageAsync();
    
    await page.SetContentAsync(htmlContent);
    
    var pdfBytes = await page.PdfAsync(new PagePdfOptions {
        Format = "Letter",
        PrintBackground = true,
        Margin = new Margin { Top = "0px", Right = "0px", Bottom = "0px", Left = "0px" }
    });

    return pdfBytes;
}
```

## ⚠️ Consideraciones Críticas
1. **Manejo de Recursos:** Siempre usar `await using` o bloques `try/finally` para cerrar el browser. De lo contrario, los procesos de Chromium quedarán colgados consumiendo RAM.
2. **Fuentes:** Si el PDF no muestra fuentes correctamente, asegúrate de que el HTML incluya links absolutos a Google Fonts o estilos inline.
3. **Imágenes:** Las imágenes en el HTML deben ser accesibles vía URL pública o base64 para que Playwright las renderice.
4. **Docker:** El Dockerfile del worker debe incluir las dependencias de Linux para Chromium (ver `infra/docker/Dockerfile.worker`).
