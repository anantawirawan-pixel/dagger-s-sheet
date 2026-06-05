import html2canvas from "html2canvas";

export async function exportCharacterCardToImage(
  element: HTMLElement | null,
  characterName: string,
): Promise<void> {
  if (!element) return;
  const canvas = await html2canvas(element, {
    backgroundColor: null,
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const link = document.createElement("a");
  link.download = `${characterName || "Character"}-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}
