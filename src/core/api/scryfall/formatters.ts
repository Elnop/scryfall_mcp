// =====================================
// SCRYFALL DATA FORMATTERS
// Markdown formatting for MCP responses
// =====================================

import { ScryfallCard, ScryfallRuling } from "../../../shared/types/scryfall.types.js";

export function formatCard(card: ScryfallCard): string {
  const parts = [
    `**${card.name}** ${card.mana_cost || ""} (${card.cmc} CMC)`,
    `Type: ${card.type_line}`,
    card.oracle_text ? `Text: ${card.oracle_text}` : null,
    card.power && card.toughness ? `Power/Toughness: ${card.power}/${card.toughness}` : null,
    `Set: ${card.set_name} (${card.set.toUpperCase()})`,
    `Rarity: ${card.rarity}`,
    card.colors.length > 0 ? `Colors: ${card.colors.join(", ")}` : "Colorless",
    card.prices?.usd ? `Price USD: $${card.prices.usd}` : null
  ].filter(Boolean);

  return parts.join("\\n");
}

export function formatSearchResults(cards: ScryfallCard[], query: string): string {
  const total = cards.length;
  const header = `🔍 **Search results for "${query}"** (${total} card(s) found)\\n\\n`;

  if (total === 0) {
    return header + "No cards found.";
  }

  const cardsList = cards.slice(0, 10).map((card, index) =>
    `${index + 1}. **${card.name}** (${card.set.toUpperCase()}) - ${card.mana_cost || "0"}`
  ).join("\\n");

  const footer = total > 10 ? `\\n\\n... and ${total - 10} more cards.` : "";

  return header + cardsList + footer;
}

export function formatRulings(rulings: ScryfallRuling[]): string {
  if (rulings.length === 0) {
    return "No official rulings found for this card.";
  }

  const formattedRulings = rulings.map((ruling, index) => {
    const source = ruling.source === "wotc" ? "Wizards of the Coast" : "Scryfall";
    return `${index + 1}. **${source}** (${ruling.published_at}):\\n   ${ruling.comment}`;
  }).join("\\n\\n");

  return `📖 **Official rulings** (${rulings.length}):\\n\\n${formattedRulings}`;
}

export function formatCatalog(data: string[], catalogName: string, limit: number = 50): string {
  const total = data.length;
  const limited = data.slice(0, limit);

  const header = `📋 **${catalogName}** (${total} item(s)):\\n\\n`;
  const list = limited.join(", ");
  const footer = total > limit ? `\\n\\n... and ${total - limit} more items.` : "";

  return header + list + footer;
}
