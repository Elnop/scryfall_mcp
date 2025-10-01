# 🃏 Serveur MCP Scryfall - Guide Complet

Un serveur MCP (Model Context Protocol) complet qui expose l'API Scryfall pour Magic: The Gathering, transformant Claude en assistant MTG expert.

## 🚀 Fonctionnalités

### 📊 Statistiques du serveur
- **32 outils** MCP intégrés
- **5 catégories** d'outils bien organisées
- **API complète** Scryfall intégrée
- **Architecture moderne** avec StreamableHTTP

### 🔧 Catégories d'outils

#### 🃏 Cards (Cartes) - 8 outils (4 formatted + 4 raw)

**Outils formatés (markdown):**
- `search-cards` - Recherche avancée avec syntaxe Scryfall (résultats formatés)
- `get-card-named` - Recherche par nom avec tolérance aux fautes (formaté)
- `get-random-card` - Carte aléatoire avec filtres optionnels (formaté)
- `autocomplete-cards` - Autocomplétion de noms de cartes (formaté)

**Outils raw (JSON):**
- `search-cards-raw` - Recherche avec réponse JSON brute Scryfall
- `get-card-named-raw` - Carte par nom avec JSON brut
- `get-random-card-raw` - Carte aléatoire avec JSON brut
- `autocomplete-cards-raw` - Autocomplétion avec JSON brut

#### 📦 Sets (Extensions) - 4 outils
- `get-all-sets` - Liste de toutes les extensions MTG
- `get-set-by-code` - Extension par code (DOM, WAR, etc.)
- `get-set-by-id` - Extension par ID Scryfall
- `search-sets` - Recherche d'extensions par nom/type

#### 📖 Rulings (Règles) - 3 outils
- `get-card-rulings-by-name` - Règles officielles par nom
- `get-card-rulings-by-id` - Règles par ID Scryfall
- `get-card-rulings-by-collector` - Règles par set + numéro

#### 📋 Catalogs (Catalogues) - 16 outils
- `get-card-names` - Tous les noms de cartes
- `get-creature-types` - Types de créatures
- `get-planeswalker-types` - Types de planeswalkers
- `get-land-types` - Types de terrains
- `get-artifact-types` - Types d'artefacts
- `get-enchantment-types` - Types d'enchantements
- `get-keyword-abilities` - Capacités à mot-clé
- `get-keyword-actions` - Actions à mot-clé
- `get-ability-words` - Mots d'habileté
- `get-card-types` - Types de cartes
- `get-supertypes` - Super-types
- `get-watermarks` - Filigranes
- `get-artist-names` - Noms d'artistes
- `get-powers` - Valeurs de force
- `get-toughnesses` - Valeurs d'endurance
- `get-loyalties` - Valeurs de loyauté

#### ⚙️ Générique - 1 outil
- `get-system-metrics` - Métriques système et performance du serveur

## 📚 Ressources MCP

> **Note**: Les ressources MCP dynamiques ne sont pas encore implémentées dans la nouvelle architecture.
> Utilisez les tools directement pour accéder aux fonctionnalités.

### Ressources planifiées (à venir)

**`info://systeme`** - Informations serveur
Statistiques en temps réel (uptime, mémoire, version, liste des tools)

**`scryfall://{categorie}`** - Documentation contextuelle
- `scryfall://cards` - Aide pour les outils de cartes
- `scryfall://sets` - Aide pour les extensions
- `scryfall://rulings` - Aide pour les règles
- `scryfall://catalogs` - Aide pour les catalogues
- `scryfall://syntaxe` - Syntaxe de recherche Scryfall

**`quick://{query}`** - Recherche rapide
Prévisualisation des 5 premiers résultats de recherche

> En attendant l'implémentation des resources, utilisez:
> - `get-system-metrics` pour les infos système
> - `search-cards` avec `limit: 5` pour recherche rapide

## 🎯 Exemples d'utilisation avec Claude

### Recherche de cartes
```
"Trouve toutes les cartes rouges avec 3 de force"
→ Claude utilise search-cards avec query: "c:red power=3"

"Recherche Lightning Bolt"
→ Claude utilise get-card-named avec name: "Lightning Bolt"

"Donne-moi une créature bleue aléatoire"
→ Claude utilise get-random-card avec query: "c:blue t:creature"
```

### Extensions et règles
```
"Quelles sont les infos sur l'extension Dominaria ?"
→ Claude utilise get-set-by-code avec code: "dom"

"Quelles sont les règles officielles pour Brainstorm ?"
→ Claude utilise get-card-rulings-by-name avec name: "Brainstorm"
```

### Catalogues et données
```
"Liste-moi tous les types de créatures"
→ Claude utilise get-creature-types

"Quelles sont les capacités à mot-clé disponibles ?"
→ Claude utilise get-keyword-abilities

"Donne-moi des suggestions pour 'lich'"
→ Claude utilise autocomplete-cards avec query: "lich"
```

## 🔍 Syntaxe de recherche Scryfall

### Recherche de base
- `Lightning Bolt` - recherche par nom
- `"Lightning Bolt"` - nom exact (guillemets)

### Couleurs
- `c:red` ou `c:r` - cartes rouges
- `c:wu` - cartes blanches ET bleues
- `c>=2` - cartes multicolores (2+ couleurs)
- `c:colorless` - cartes incolores

### Types
- `t:creature` - créatures
- `t:instant` - éphémères
- `t:artifact` - artefacts
- `t:"legendary creature"` - créatures légendaires

### Coût de mana
- `cmc=3` - coût converti de 3
- `cmc>=4` - coût de 4 ou plus
- `cmc<=2` - coût de 2 ou moins
- `m:{2}{R}{R}` - coût exact 2RR

### Force/Endurance
- `power=3` - force de 3
- `toughness>=5` - endurance de 5 ou plus
- `pow>tou` - force supérieure à l'endurance
- `pow=tou` - force égale à l'endurance

### Extensions et formats
- `s:dom` ou `set:dominaria` - extension Dominaria
- `cn:100` - numéro de collection 100
- `f:standard` - légal en Standard
- `banned:modern` - banni en Moderne
- `legal:commander` - légal en Commander

### Raretés et prix
- `r:mythic` - cartes mythiques
- `r>=rare` - rares ou mythiques
- `usd>=10` - prix USD de 10$ ou plus
- `eur<5` - prix EUR inférieur à 5€

### Recherches avancées
- `is:permanent` - permanents
- `is:spell` - sorts
- `is:vanilla` - cartes vanilla (sans capacités)
- `has:watermark` - cartes avec filigrane
- `year>=2020` - cartes de 2020 ou plus récentes

### Opérateurs logiques
- `c:red AND t:creature` - cartes rouges ET créatures
- `c:blue OR c:black` - cartes bleues OU noires
- `t:creature NOT c:red` - créatures NON rouges
- `(c:red OR c:blue) AND t:instant` - groupement avec parenthèses

## 🛠️ Installation et configuration

### 1. Compiler le serveur
```bash
npm run build
```

### 2. Démarrage

**Mode Stdio (Claude Desktop):**
```bash
npm start              # Production
npm run dev            # Development
```

**Mode HTTP (StreamableHTTP):**
```bash
npm run start:http     # Production (port 8080)
npm run dev:http       # Development (port 8080)
PORT=3000 npm run start:http  # Port personnalisé
```

### 3. Tester le serveur
```bash
# Tests unitaires et intégration
npm test

# Test avec MCP Inspector (stdio)
npm run test:inspector

# Test avec MCP Inspector (HTTP)
npm run test:inspector:http
```

### 4. Configuration Claude Desktop
Ajoutez dans votre fichier de configuration Claude Desktop :

**Transport Stdio (recommandé):**
```json
{
  "mcpServers": {
    "scryfall": {
      "command": "node",
      "args": ["./dist/index.js"],
      "cwd": "/chemin/vers/scryfall-mcp-server"
    }
  }
}
```

**Transport HTTP (StreamableHTTP):**
```json
{
  "mcpServers": {
    "scryfall-http": {
      "url": "http://localhost:8080/mcp"
    }
  }
}
```

### 5. Redémarrer Claude Desktop
Fermez et relancez Claude Desktop pour charger le serveur.

## 📈 Performance et optimisation

### Architecture moderne
- **Cache LRU** - 1000 entrées avec TTL de 5 minutes
- **Rate limiting** - 100 requêtes/minute (respecte limites Scryfall)
- **Request deduplication** - Évite les requêtes simultanées identiques
- **Retry automatique** - Exponential backoff en cas d'erreur
- **Health check** - Monitoring de la santé API Scryfall

### Gestion des erreurs
- Toutes les erreurs API Scryfall sont capturées et formatées
- Messages d'erreur JSON-RPC 2.0 compliant
- Fallbacks gracieux pour les requêtes invalides
- Logs détaillés en mode développement

### Limitations respectées
- Limite de 175 cartes max par recherche (limite Scryfall)
- Catalogues limités à 50-500 éléments selon le type
- Rate limiting intelligent pour éviter les bans API

### Formatage optimisé
- **Formatted tools** - Markdown lisible pour Claude
- **Raw tools** - JSON brut pour intégrations avancées
- Résultats de recherche condensés mais informatifs
- Support des emojis et formatage riche

## 🎮 Cas d'usage avancés

### Construction de deck
```
"Trouve des créatures rouges de coût 1-2 pour un deck aggro"
→ search-cards: "c:red t:creature cmc<=2"

"Quels sont les terrains de base disponibles ?"
→ search-cards: "t:basic"
```

### Analyse de méta
```
"Quelles cartes de Foundations sont légales en Standard ?"
→ search-cards: "s:fdn f:standard"

"Trouve les planeswalkers les plus chers"
→ search-cards: "t:planeswalker" avec ordre "usd"
```

### Recherche thématique
```
"Trouve toutes les cartes avec 'dragon' dans le nom"
→ search-cards: "dragon"

"Cartes d'artiste Rebecca Guay"
→ search-cards: "a:\"Rebecca Guay\""
```

### Vérification de règles
```
"Comment fonctionne exactement la capacité Delve ?"
→ get-keyword-abilities puis recherche de cartes avec Delve

"Règles pour les cartes à double face"
→ search-cards: "is:dfc" puis rulings
```

## 🔧 Dépannage

### Problèmes courants

**Serveur ne démarre pas :**
- Vérifiez que `npm run build` a réussi
- Assurez-vous que Node.js 18+ est installé

**Pas de réponse de l'API :**
- Vérifiez votre connexion internet
- L'API Scryfall peut être temporairement indisponible

**Recherches qui échouent :**
- Vérifiez la syntaxe de recherche Scryfall
- Utilisez la ressource `scryfall://syntaxe` pour de l'aide

### Debug
```bash
# Test manuel du serveur
npm test

# Inspection MCP (stdio)
npm run test:inspector

# Inspection MCP (HTTP)
npm run test:inspector:http

# Mode développement avec logs
npm run dev:test
```

## 📊 Métriques du serveur

Le serveur expose des métriques en temps réel via :

**Tool `get-system-metrics`** :
- Status système (healthy/degraded)
- Temps de fonctionnement (uptime)
- Utilisation mémoire (heap, RSS, external)
- Métriques API Scryfall:
  - Total requêtes
  - Taux de cache hit
  - Temps de réponse moyen
  - Rate limit restant
  - Erreurs

**Endpoint HTTP `/health`** :
- Status du serveur
- Version
- Transport utilisé
- Timestamp

## 🏗️ Architecture technique

### Structure modulaire
```
src/
├── index.ts           # Entry point Stdio
├── index-http.ts      # Entry point HTTP (StreamableHTTP)
├── index-dev.ts       # Entry point Dev/Test
├── bootstrap/         # Configuration & registration
├── core/              # Infrastructure (API client, formatters)
├── shared/            # Types, errors, constants
└── features/          # Features modulaires
    ├── cards/         # 8 tools (formatted + raw)
    ├── sets/          # 4 tools
    ├── rulings/       # 3 tools
    ├── catalogs/      # 16 tools
    └── generic/       # 1 tool (metrics)
```

### Technologies
- **MCP SDK** v1.18.0 (Model Context Protocol)
- **StreamableHTTP** transport (MCP 2025-03-26 standard)
- **Express.js** pour le serveur HTTP
- **TypeScript** strict mode
- **Zod** pour la validation runtime
- **Node.js** 18+ requis

### Features implémentées
- ✅ Cache LRU avec TTL
- ✅ Rate limiting intelligent
- ✅ Request deduplication
- ✅ Exponential backoff retry
- ✅ Health monitoring
- ✅ JSON-RPC 2.0 compliant errors
- ✅ Formatted & Raw tool variants
- ✅ Dual transport (Stdio + HTTP)

## 🤝 Contribution

Idées d'améliorations futures :
- Support des images de cartes (Scryfall image URIs)
- Outils pour la construction de decks
- Intégration avec les prix en temps réel (TCGPlayer, Cardmarket)
- Support des tournois et méta
- Resources MCP dynamiques (quick search, help system)

---

**Votre assistant MTG ultime est prêt !** 🎉

Claude peut maintenant rechercher plus de 500 000 cartes Magic, consulter les règles officielles, explorer les extensions, et accéder à tous les catalogues de données MTG grâce aux **32 outils Scryfall intégrés** dans une architecture moderne et performante.