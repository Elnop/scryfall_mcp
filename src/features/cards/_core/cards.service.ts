// =====================================
// CARDS SERVICE
// Business logic for card operations
// =====================================

import { fetchScryfall } from "../../../core/api/scryfall/client.js";
import { formatCard, formatSearchResults } from "../../../core/api/scryfall/formatters.js";
import { ScryfallCard, ScryfallList } from "../../../shared/types/scryfall.types.js";

export interface SearchCardsParams {
  query: string;
  limit?: number;
  order?: "name" | "set" | "released" | "rarity" | "color" | "usd" | "tix" | "eur" | "cmc" | "power" | "toughness" | "edhrec" | "penny" | "artist" | "review";
  dir?: "auto" | "asc" | "desc";
  unique?: "cards" | "art" | "prints";
  include_extras?: boolean;
}

export interface GetCardNamedParams {
  name: string;
  fuzzy?: boolean;
  set?: string;
}

export interface GetRandomCardParams {
  query?: string;
}

export interface AutocompleteCardsParams {
  query: string;
  include_extras?: boolean;
}

export class CardsService {
  async searchCards(params: SearchCardsParams) {
    const { query, limit = 25, order = "name", dir = "auto", unique = "cards", include_extras = false } = params;

    const searchParams = new URLSearchParams({
      q: query,
      order,
      dir,
      unique,
      page: "1"
    });

    if (include_extras) {
      searchParams.set("include_extras", "true");
    }

    const response = await fetchScryfall<ScryfallList<ScryfallCard>>(
      `/cards/search?${searchParams}`
    );

    const limitedResults = response.data.slice(0, limit);

    return {
      cards: limitedResults,
      total: response.total_cards || 0,
      formatted: formatSearchResults(limitedResults, query)
    };
  }

  async searchCardsRaw(params: SearchCardsParams) {
    const { query, limit = 25, order = "name", dir = "auto", unique = "cards", include_extras = false } = params;

    const searchParams = new URLSearchParams({
      q: query,
      order,
      dir,
      unique,
      page: "1"
    });

    if (include_extras) {
      searchParams.set("include_extras", "true");
    }

    const response = await fetchScryfall<ScryfallList<ScryfallCard>>(
      `/cards/search?${searchParams}`
    );

    if (limit < response.data.length) {
      response.data = response.data.slice(0, limit);
    }

    return JSON.stringify(response, null, 2);
  }

  async getCardNamed(params: GetCardNamedParams) {
    const { name, fuzzy = true, set } = params;

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

    return {
      card,
      formatted: formatCard(card)
    };
  }

  async getCardNamedRaw(params: GetCardNamedParams) {
    const { name, fuzzy = true, set } = params;

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
    return JSON.stringify(card, null, 2);
  }

  async getRandomCard(params: GetRandomCardParams = {}) {
    const { query } = params;

    const searchParams = query ? new URLSearchParams({ q: query }) : new URLSearchParams();
    const card = await fetchScryfall<ScryfallCard>(`/cards/random?${searchParams}`);

    return {
      card,
      formatted: `🎲 **Carte aléatoire**\\n\\n${formatCard(card)}`
    };
  }

  async getRandomCardRaw(params: GetRandomCardParams = {}) {
    const { query } = params;

    const searchParams = query ? new URLSearchParams({ q: query }) : new URLSearchParams();
    const card = await fetchScryfall<ScryfallCard>(`/cards/random?${searchParams}`);

    return JSON.stringify(card, null, 2);
  }

  async autocompleteCards(params: AutocompleteCardsParams) {
    const { query, include_extras = false } = params;

    const searchParams = new URLSearchParams({ q: query });
    if (include_extras) {
      searchParams.set("include_extras", "true");
    }

    const response = await fetchScryfall<{
      object: string;
      total_values: number;
      data: string[];
    }>(`/cards/autocomplete?${searchParams}`);

    return {
      suggestions: response.data,
      formatted: `📝 **Suggestions pour "${query}":**\\n\\n${response.data.slice(0, 20).join("\\n")}`
    };
  }

  async autocompleteCardsRaw(params: AutocompleteCardsParams) {
    const { query, include_extras = false } = params;

    const searchParams = new URLSearchParams({ q: query });
    if (include_extras) {
      searchParams.set("include_extras", "true");
    }

    const response = await fetchScryfall<{
      object: string;
      total_values: number;
      data: string[];
    }>(`/cards/autocomplete?${searchParams}`);

    return JSON.stringify(response, null, 2);
  }
}
