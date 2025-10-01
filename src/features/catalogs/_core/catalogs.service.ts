// =====================================
// CATALOGS SERVICE
// Business logic for MTG game data catalogs
// =====================================

import { fetchScryfall } from "../../../core/api/scryfall/client.js";
import { formatCatalog } from "../../../core/api/scryfall/formatters.js";
import { ScryfallCatalog } from "../../../shared/types/scryfall.types.js";

export class CatalogsService {
  // Card names
  async getCardNames(limit: number = 100) {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/card-names");
    return {
      names: response.data,
      formatted: formatCatalog(response.data, "Noms de cartes", limit)
    };
  }

  // Type catalogs
  async getCreatureTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/creature-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types de créatures")
    };
  }

  async getPlaneswalkerTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/planeswalker-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types de planeswalkers")
    };
  }

  async getLandTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/land-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types de terrains")
    };
  }

  async getArtifactTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/artifact-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types d'artefacts")
    };
  }

  async getEnchantmentTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/enchantment-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types d'enchantements")
    };
  }

  async getCardTypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/card-types");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Types de cartes")
    };
  }

  async getSupertypes() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/supertypes");
    return {
      types: response.data,
      formatted: formatCatalog(response.data, "Super-types")
    };
  }

  // Mechanics catalogs
  async getKeywordAbilities() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/keyword-abilities");
    return {
      abilities: response.data,
      formatted: formatCatalog(response.data, "Capacités à mot-clé")
    };
  }

  async getKeywordActions() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/keyword-actions");
    return {
      actions: response.data,
      formatted: formatCatalog(response.data, "Actions à mot-clé")
    };
  }

  async getAbilityWords() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/ability-words");
    return {
      words: response.data,
      formatted: formatCatalog(response.data, "Mots d'habileté")
    };
  }

  // Metadata catalogs
  async getWatermarks() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/watermarks");
    return {
      watermarks: response.data,
      formatted: formatCatalog(response.data, "Filigranes")
    };
  }

  async getArtistNames(limit: number = 100) {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/artist-names");
    return {
      artists: response.data,
      formatted: formatCatalog(response.data, "Noms d'artistes", limit)
    };
  }

  // Stats catalogs
  async getPowers() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/powers");
    return {
      powers: response.data,
      formatted: formatCatalog(response.data, "Valeurs de force")
    };
  }

  async getToughnesses() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/toughnesses");
    return {
      toughnesses: response.data,
      formatted: formatCatalog(response.data, "Valeurs d'endurance")
    };
  }

  async getLoyalties() {
    const response = await fetchScryfall<ScryfallCatalog>("/catalog/loyalties");
    return {
      loyalties: response.data,
      formatted: formatCatalog(response.data, "Valeurs de loyauté")
    };
  }
}
