// =====================================
// RULINGS SERVICE
// Business logic for card rulings
// =====================================

import { fetchScryfall } from "../../../core/api/scryfall/client.js";
import { formatRulings } from "../../../core/api/scryfall/formatters.js";
import { ScryfallCard, ScryfallRuling, ScryfallList } from "../../../shared/types/scryfall.types.js";

export interface GetCardRulingsByNameParams {
  name: string;
  fuzzy?: boolean;
  set?: string;
}

export interface GetCardRulingsByCollectorParams {
  set_code: string;
  collector_number: string;
}

export class RulingsService {
  async getCardRulingsByName(params: GetCardRulingsByNameParams) {
    const { name, fuzzy = true, set } = params;

    // First, get the card
    const searchParams = new URLSearchParams();
    if (fuzzy) {
      searchParams.set("fuzzy", name);
    } else {
      searchParams.set("exact", name);
    }
    if (set) {
      searchParams.set("set", set);
    }

    const card = await fetchScryfall<ScryfallCard>(`/cards/named?${searchParams}`);

    // Then get its rulings
    const rulings = await fetchScryfall<ScryfallList<ScryfallRuling>>(
      `/cards/${card.id}/rulings`
    );

    return {
      card,
      rulings: rulings.data,
      formatted: `**${card.name}**\\n\\n${formatRulings(rulings.data)}`
    };
  }

  async getCardRulingsById(id: string) {
    const rulings = await fetchScryfall<ScryfallList<ScryfallRuling>>(
      `/cards/${id}/rulings`
    );

    return {
      rulings: rulings.data,
      formatted: formatRulings(rulings.data)
    };
  }

  async getCardRulingsByCollector(params: GetCardRulingsByCollectorParams) {
    const { set_code, collector_number } = params;

    const rulings = await fetchScryfall<ScryfallList<ScryfallRuling>>(
      `/cards/${set_code.toLowerCase()}/${collector_number}/rulings`
    );

    return {
      rulings: rulings.data,
      formatted: formatRulings(rulings.data)
    };
  }
}
