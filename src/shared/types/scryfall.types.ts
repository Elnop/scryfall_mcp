// =====================================
// SCRYFALL API TYPES
// =====================================

export interface ScryfallCard {
  // Core identifiers
  id: string;
  oracle_id?: string;
  arena_id?: number;
  mtgo_id?: number;
  multiverse_ids?: number[];
  tcgplayer_id?: number;
  cardmarket_id?: number;

  // Core card information
  name: string;
  lang?: string;
  released_at?: string;
  uri?: string;
  scryfall_uri?: string;
  layout?: string;

  // Mana and costs
  mana_cost?: string;
  cmc: number;

  // Type information
  type_line: string;
  oracle_text?: string;

  // Power and toughness
  power?: string;
  toughness?: string;
  loyalty?: string;

  // Colors
  colors: string[];
  color_identity: string[];
  color_indicator?: string[];
  produced_mana?: string[];

  // Set information
  set: string;
  set_name: string;
  set_type?: string;
  set_id?: string;
  set_search_uri?: string;
  scryfall_set_uri?: string;
  rulings_uri?: string;
  prints_search_uri?: string;

  // Collector information
  collector_number?: string;
  rarity: string;
  artist?: string;
  artist_ids?: string[];
  illustration_id?: string;
  border_color?: string;
  frame?: string;
  frame_effects?: string[];
  security_stamp?: string;
  full_art?: boolean;
  textless?: boolean;
  booster?: boolean;
  story_spotlight?: boolean;

  // Imagery
  image_uris?: {
    small?: string;
    normal?: string;
    large?: string;
    png?: string;
    art_crop?: string;
    border_crop?: string;
  };

  // Pricing
  prices?: {
    usd?: string;
    usd_foil?: string;
    usd_etched?: string;
    eur?: string;
    eur_foil?: string;
    tix?: string;
  };

  // Purchase URIs
  purchase_uris?: {
    tcgplayer?: string;
    cardmarket?: string;
    cardhoarder?: string;
  };

  // Legalities
  legalities: Record<string, string>;

  // Game information
  games?: string[];
  reserved?: boolean;
  foil?: boolean;
  nonfoil?: boolean;
  finishes?: string[];
  oversized?: boolean;
  promo?: boolean;
  reprint?: boolean;
  variation?: boolean;
  digital?: boolean;

  // Rankings
  edhrec_rank?: number;
  penny_rank?: number;

  // Flavor and additional text
  flavor_text?: string;
  flavor_name?: string;
  watermark?: string;

  // Keywords and mechanics
  keywords?: string[];

  // Multi-card information
  all_parts?: Array<{
    object: string;
    id: string;
    component: string;
    name: string;
    type_line: string;
    uri: string;
  }>;

  // Card faces for multi-faced cards
  card_faces?: Array<{
    artist?: string;
    artist_id?: string;
    cmc?: number;
    color_indicator?: string[];
    colors?: string[];
    flavor_text?: string;
    illustration_id?: string;
    image_uris?: {
      small?: string;
      normal?: string;
      large?: string;
      png?: string;
      art_crop?: string;
      border_crop?: string;
    };
    layout?: string;
    loyalty?: string;
    mana_cost: string;
    name: string;
    object: string;
    oracle_id?: string;
    oracle_text?: string;
    power?: string;
    printed_name?: string;
    printed_text?: string;
    printed_type_line?: string;
    toughness?: string;
    type_line?: string;
    watermark?: string;
  }>;

  // Preview information
  preview?: {
    previewed_at?: string;
    source_uri?: string;
    source?: string;
  };

  // Content warnings
  content_warning?: boolean;
}

export interface ScryfallSet {
  id: string;
  code: string;
  name: string;
  set_type: string;
  card_count: number;
  released_at: string;
  icon_svg_uri: string;
}

export interface ScryfallRuling {
  oracle_id: string;
  source: string;
  published_at: string;
  comment: string;
}

export interface ScryfallCatalog {
  object: "catalog";
  total_values: number;
  data: string[];
}

export interface ScryfallList<T> {
  object: "list";
  total_cards?: number;
  has_more: boolean;
  next_page?: string;
  data: T[];
  warnings?: string[];
}
