export const svgToPng = async (
  svgEl: SVGSVGElement,
  filename: string,
  w: number,
  h: number,
) => {
  const clone = svgEl.cloneNode(true) as SVGSVGElement;

  await Promise.all(
    Array.from(clone.querySelectorAll("image")).map(async (img) => {
      const href = img.getAttribute("href");
      if (!href || href.startsWith("data:")) return;
      try {
        const blob = await fetch(href).then((r) => r.blob());
        const b64 = await new Promise<string>((res, rej) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.onerror = rej;
          reader.readAsDataURL(blob);
        });
        img.setAttribute("href", b64);
      } catch {
        /* skip unavailable logos */
      }
    }),
  );

  const svgStr = new XMLSerializer().serializeToString(clone);
  const url = URL.createObjectURL(
    new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" }),
  );

  return new Promise<void>((resolve) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      try {
        const link = document.createElement("a");
        link.download = filename;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } catch {
        // Canvas tainted — fall back to SVG download.
        const link = document.createElement("a");
        link.download = filename.replace(".png", ".svg");
        link.href = URL.createObjectURL(
          new Blob([svgStr], { type: "image/svg+xml" }),
        );
        link.click();
      }
      resolve();
    };

    img.onerror = () => {
      const link = document.createElement("a");
      link.download = filename.replace(".png", ".svg");
      link.href = url;
      link.click();
      resolve();
    };

    img.src = url;
  });
};
