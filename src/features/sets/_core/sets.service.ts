// =====================================
// SETS SERVICE
// Business logic for MTG sets/expansions
// =====================================

import { fetchScryfall } from "../../../core/api/scryfall/client.js";
import { ScryfallSet, ScryfallList } from "../../../shared/types/scryfall.types.js";

export interface SearchSetsParams {
  query: string;
  type?: "core" | "expansion" | "masters" | "draft_innovation" | "commander" | "planechase" | "archenemy" | "vanguard" | "funny" | "starter" | "box" | "promo" | "token" | "memorabilia";
}

export class SetsService {
  async getAllSets() {
    const response = await fetchScryfall<ScryfallList<ScryfallSet>>("/sets");

    const recentSets = response.data
      .filter(set => set.set_type !== "memorabilia" && set.set_type !== "token")
      .slice(0, 20);

    const setsList = recentSets.map(set =>
      `**${set.name}** (${set.code.toUpperCase()}) - ${set.card_count} cartes - ${set.released_at}`
    ).join("\\n");

    return {
      sets: recentSets,
      formatted: `📦 **Extensions Magic récentes** (${recentSets.length}/20):\\n\\n${setsList}`
    };
  }

  async getSetByCode(code: string) {
    const set = await fetchScryfall<ScryfallSet>(`/sets/${code.toLowerCase()}`);

    const details = [
      `📦 **${set.name}** (${set.code.toUpperCase()})`,
      `Type: ${set.set_type}`,
      `Nombre de cartes: ${set.card_count}`,
      `Date de sortie: ${set.released_at}`,
      `ID: ${set.id}`
    ].join("\\n");

    return {
      set,
      formatted: details
    };
  }

  async getSetById(id: string) {
    const set = await fetchScryfall<ScryfallSet>(`/sets/${id}`);

    const details = [
      `📦 **${set.name}** (${set.code.toUpperCase()})`,
      `Type: ${set.set_type}`,
      `Nombre de cartes: ${set.card_count}`,
      `Date de sortie: ${set.released_at}`,
      `ID: ${set.id}`
    ].join("\\n");

    return {
      set,
      formatted: details
    };
  }

  async searchSets(params: SearchSetsParams) {
    const { query, type } = params;

    const response = await fetchScryfall<ScryfallList<ScryfallSet>>("/sets");

    let filteredSets = response.data.filter(set =>
      set.name.toLowerCase().includes(query.toLowerCase()) ||
      set.code.toLowerCase().includes(query.toLowerCase())
    );

    if (type) {
      filteredSets = filteredSets.filter(set => set.set_type === type);
    }

    const limitedSets = filteredSets.slice(0, 15);

    if (limitedSets.length === 0) {
      return {
        sets: [],
        formatted: `🔍 Aucune extension trouvée pour "${query}"`
      };
    }

    const setsList = limitedSets.map(set =>
      `**${set.name}** (${set.code.toUpperCase()}) - ${set.set_type} - ${set.card_count} cartes`
    ).join("\\n");

    return {
      sets: limitedSets,
      formatted: `🔍 **Extensions trouvées pour "${query}"** (${limitedSets.length}):\\n\\n${setsList}`
    };
  }
}
