import type { Party } from "@/types/character";
import type { Character, DomainCard } from "@/types/character";
import { jsPDF } from "jspdf";

const GOLD = [212, 175, 55] as const;
const DARK = [30, 30, 35] as const;
const LIGHT = [235, 235, 240] as const;
const MUTED = [160, 160, 170] as const;

function wrapText(
  doc: jsPDF,
  text: string,
  maxWidth: number,
  _lineHeight: number,
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (doc.getTextWidth(test) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function drawSectionHeader(doc: jsPDF, y: number, title: string): number {
  doc.setFillColor(...GOLD);
  doc.rect(14, y, 182, 7, "F");
  doc.setTextColor(...DARK);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(title, 18, y + 5);
  doc.setTextColor(...LIGHT);
  return y + 10;
}

function drawTwoColumnHeader(
  doc: jsPDF,
  y: number,
  left: string,
  right: string,
): number {
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text(left, 14, y);
  const rw = doc.getTextWidth(right);
  doc.text(right, 196 - rw, y);
  doc.setTextColor(...LIGHT);
  return y + 4;
}

export function exportPartyRosterToPDF(party: Party, characters: Character[]) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" });
  const pageW = 297;
  const pageH = 210;
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 14;

  const GOLD_RGB: [number, number, number] = [212, 175, 55];
  const DARK_RGB: [number, number, number] = [20, 20, 30];
  const WHITE_RGB: [number, number, number] = [240, 240, 240];
  const GRAY_RGB: [number, number, number] = [160, 160, 180];
  const ROW_DARK: [number, number, number] = [28, 28, 38];
  const ROW_LIGHT: [number, number, number] = [36, 36, 48];

  // Background
  doc.setFillColor(...DARK_RGB);
  doc.rect(0, 0, pageW, pageH, "F");

  // Title
  doc.setTextColor(...GOLD_RGB);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(party.name || "Unnamed Party", margin, y + 8);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...GRAY_RGB);
  const today = new Date().toLocaleDateString();
  doc.text(`Party Roster — ${today}`, margin, y + 15);

  y += 24;

  const members = characters.filter((c) => party.memberIds.includes(c.id));
  const avgLevel =
    members.length > 0
      ? Math.round(members.reduce((s, m) => s + m.level, 0) / members.length)
      : 0;
  const totalCurrentHP = members.reduce((s, m) => s + m.hitPoints, 0);
  const totalMaxHP = members.reduce((s, m) => s + m.maxHitPoints, 0);

  // Summary row
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD_RGB);
  doc.text(
    `Total Members: ${members.length}  |  Average Level: ${avgLevel}  |  Total HP: ${totalCurrentHP} / ${totalMaxHP}`,
    margin,
    y,
  );
  y += 8;

  // Table columns
  const cols = [
    { label: "Name", width: 50 },
    { label: "Class", width: 36 },
    { label: "Subclass", width: 40 },
    { label: "Level", width: 18 },
    { label: "Ancestry", width: 36 },
    { label: "HP", width: 30 },
    { label: "Stress", width: 22 },
    { label: "Hope", width: 18 },
    { label: "Armor", width: 22 },
  ];

  const rowHeight = 7;
  const headerY = y;

  // Header background
  doc.setFillColor(...GOLD_RGB);
  doc.rect(margin, headerY, contentW, rowHeight, "F");

  // Header text
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK_RGB);
  let cx = margin;
  for (const col of cols) {
    doc.text(col.label, cx + 2, headerY + 5);
    cx += col.width;
  }

  y += rowHeight;

  // Rows
  doc.setFont("helvetica", "normal");
  for (let i = 0; i < members.length; i++) {
    const m = members[i];
    const rowBg = i % 2 === 0 ? ROW_DARK : ROW_LIGHT;
    doc.setFillColor(...rowBg);
    doc.rect(margin, y, contentW, rowHeight, "F");

    doc.setTextColor(...WHITE_RGB);
    cx = margin;
    const values = [
      m.name || "Unnamed",
      "—",
      "—",
      String(m.level),
      "—",
      `${m.hitPoints} / ${m.maxHitPoints}`,
      `${m.stress} / ${m.maxStress}`,
      `${m.hope} / ${m.maxHope}`,
      String(m.armorThreshold),
    ];
    for (let j = 0; j < cols.length; j++) {
      doc.text(String(values[j]), cx + 2, y + 5);
      cx += cols[j].width;
    }
    y += rowHeight;
  }

  if (members.length === 0) {
    doc.setTextColor(...GRAY_RGB);
    doc.text("No members in this party.", margin, y + 5);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...GRAY_RGB);
  doc.text(
    `Daggerheart Forge — ${party.name || "Party"}`,
    pageW / 2,
    pageH - 8,
    { align: "center" },
  );

  const filename = `${party.name || "Party"}_Roster.pdf`;
  doc.save(filename);
}

export function exportCharacterToPDF(
  character: Character,
  className: string,
  subclassName: string,
  ancestryName: string,
  communityName: string,
  domainCardDetails: DomainCard[],
) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 14;
  const contentW = pageW - margin * 2;
  let y = 14;

  // Determine if portrait is present
  const hasPortrait = !!character.portraitDataUrl;
  const headerHeight = hasPortrait ? 52 : 40;

  // Header
  doc.setFillColor(...DARK);
  doc.rect(0, 0, pageW, headerHeight, "F");

  // Portrait thumbnail in header
  if (hasPortrait) {
    try {
      doc.addImage(
        character.portraitDataUrl as string,
        "JPEG",
        margin,
        y,
        26,
        26,
        undefined,
        "FAST",
      );
    } catch {
      // Portrait embed failed silently — continue without it
    }
  }

  const textX = hasPortrait ? margin + 30 : margin;

  doc.setTextColor(...GOLD);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(character.name || "Unnamed Hero", textX, y + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...LIGHT);
  const subtitle = `${className} — ${subclassName}  |  ${ancestryName} — ${communityName}`;
  doc.text(subtitle, textX, y + 15);

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text(`Level ${character.level}`, textX, y + 22);

  y = headerHeight + 6;

  // Core Stats
  y = drawSectionHeader(doc, y, "Core Stats");
  const stats = [
    ["Proficiency", String(character.proficiency)],
    ["Evasion", String(character.evasion)],
    ["Armor Threshold", String(character.armorThreshold)],
    ["Hope Tokens", `${character.hope} / ${character.maxHope}`],
  ];
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const colW = contentW / 2;
  for (let i = 0; i < stats.length; i++) {
    const [label, value] = stats[i];
    const cx = margin + (i % 2) * colW;
    const cy = y + Math.floor(i / 2) * 5;
    doc.setTextColor(...MUTED);
    doc.text(`${label}:`, cx, cy);
    doc.setTextColor(...LIGHT);
    doc.text(value, cx + 30, cy);
  }
  y += 14;

  // Attributes
  y = drawSectionHeader(doc, y, "Attributes");
  const traits = character.traits;
  const attrPairs = [
    ["Agility", traits.agility],
    ["Strength", traits.strength],
    ["Finesse", traits.finesse],
    ["Instinct", traits.instinct],
    ["Presence", traits.presence],
    ["Knowledge", traits.knowledge],
  ] as const;
  for (let i = 0; i < attrPairs.length; i++) {
    const [label, value] = attrPairs[i];
    const cx = margin + (i % 3) * (contentW / 3);
    const cy = y + Math.floor(i / 3) * 5;
    doc.setTextColor(...MUTED);
    doc.text(`${label}:`, cx, cy);
    doc.setTextColor(...LIGHT);
    doc.text(String(value), cx + 22, cy);
  }
  y += 14;

  // Trackers
  y = drawSectionHeader(doc, y, "Trackers");
  const trackers = [
    ["Hit Points", character.hitPoints, character.maxHitPoints],
    ["Stress", character.stress, character.maxStress],
  ] as const;
  for (const [label, current, max] of trackers) {
    doc.setTextColor(...MUTED);
    doc.setFontSize(9);
    doc.text(`${label}:`, margin, y);
    doc.setTextColor(...LIGHT);
    doc.text(`${current} / ${max}`, margin + 28, y);
    y += 5;
  }
  y += 4;

  // Domain Cards
  if (domainCardDetails.length > 0) {
    if (y > 250) {
      doc.addPage();
      y = 14;
    }
    y = drawSectionHeader(doc, y, "Domain Cards");
    for (const card of domainCardDetails) {
      if (y > 270) {
        doc.addPage();
        y = 14;
      }
      y = drawTwoColumnHeader(
        doc,
        y,
        card.name,
        `${card.domain} — ${card.type}`,
      );
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...LIGHT);
      const lines = wrapText(doc, card.description, contentW, 3.5);
      for (const line of lines) {
        doc.text(line, margin, y);
        y += 3.5;
      }
      y += 2;
    }
  }

  // Equipment
  if (character.equipment.length > 0 || character.armorId) {
    if (y > 250) {
      doc.addPage();
      y = 14;
    }
    y = drawSectionHeader(doc, y, "Equipment");
    if (character.armorId) {
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...GOLD);
      doc.text("Armor:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...LIGHT);
      doc.text(character.armorId, margin + 18, y);
      y += 5;
    }
    for (const item of character.equipment) {
      doc.setFontSize(9);
      doc.setTextColor(...LIGHT);
      doc.text(`• ${item.name} (x${item.quantity})`, margin, y);
      y += 4;
    }
    y += 4;
  }

  // Experiences
  if (
    character.experiences &&
    Array.isArray(character.experiences) &&
    character.experiences.length > 0
  ) {
    if (y > 250) {
      doc.addPage();
      y = 14;
    }
    y = drawSectionHeader(doc, y, "Experiences");
    doc.setFontSize(9);
    doc.setTextColor(...LIGHT);
    const expText = character.experiences.join(" • ");
    const expLines = wrapText(doc, expText, contentW, 3.5);
    for (const line of expLines) {
      doc.text(line, margin, y);
      y += 3.5;
    }
    y += 4;
  }

  // Features
  if (y > 230) {
    doc.addPage();
    y = 14;
  }
  y = drawSectionHeader(doc, y, "Features");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("Ancestry Features", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...LIGHT);
  // Ancestry features are not stored on character; placeholder note
  doc.text("See ancestry entry in rulebook for full feature text.", margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("Community Feature", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...LIGHT);
  doc.text("See community entry in rulebook for full feature text.", margin, y);
  y += 6;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...GOLD);
  doc.text("Class Features", margin, y);
  y += 4;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...LIGHT);
  doc.text("See class entry in rulebook for full feature text.", margin, y);
  y += 6;

  if (character.level >= 3) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("Specialization Feature", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...LIGHT);
    doc.text("Unlocked at Level 3. See subclass entry in rulebook.", margin, y);
    y += 6;
  }

  if (character.level >= 7) {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...GOLD);
    doc.text("Mastery Feature", margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...LIGHT);
    doc.text("Unlocked at Level 7. See subclass entry in rulebook.", margin, y);
    y += 6;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      `Daggerheart Forge — ${character.name} — Page ${i} of ${pageCount}`,
      pageW / 2,
      292,
      { align: "center" },
    );
  }

  const filename = `${character.name || "Character"}_L${character.level}.pdf`;
  doc.save(filename);
}
