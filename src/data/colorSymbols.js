export const COLOR_SYMBOLS = {
  "W": {
    "name": "White",
    "fullName": "Plains",
    "symbol": "W",
    "svg_uri": "https://svgs.scryfall.io/card-symbols/W.svg"
  },
  "U": {
    "name": "Blue",
    "fullName": "Island",
    "symbol": "U",
    "svg_uri": "https://svgs.scryfall.io/card-symbols/U.svg"
  },
  "B": {
    "name": "Black",
    "fullName": "Swamp",
    "symbol": "B",
    "svg_uri": "https://svgs.scryfall.io/card-symbols/B.svg"
  },
  "R": {
    "name": "Red",
    "fullName": "Mountain",
    "symbol": "R",
    "svg_uri": "https://svgs.scryfall.io/card-symbols/R.svg"
  },
  "G": {
    "name": "Green",
    "fullName": "Forest",
    "symbol": "G",
    "svg_uri": "https://svgs.scryfall.io/card-symbols/G.svg"
  }
};

// Comprehensive mana symbols from Scryfall API
export const MANA_SYMBOLS = {
  // Generic mana (numbers)
  "0": { "symbol": "0", "svg_uri": "https://svgs.scryfall.io/card-symbols/0.svg", "type": "generic" },
  "1": { "symbol": "1", "svg_uri": "https://svgs.scryfall.io/card-symbols/1.svg", "type": "generic" },
  "2": { "symbol": "2", "svg_uri": "https://svgs.scryfall.io/card-symbols/2.svg", "type": "generic" },
  "3": { "symbol": "3", "svg_uri": "https://svgs.scryfall.io/card-symbols/3.svg", "type": "generic" },
  "4": { "symbol": "4", "svg_uri": "https://svgs.scryfall.io/card-symbols/4.svg", "type": "generic" },
  "5": { "symbol": "5", "svg_uri": "https://svgs.scryfall.io/card-symbols/5.svg", "type": "generic" },
  "6": { "symbol": "6", "svg_uri": "https://svgs.scryfall.io/card-symbols/6.svg", "type": "generic" },
  "7": { "symbol": "7", "svg_uri": "https://svgs.scryfall.io/card-symbols/7.svg", "type": "generic" },
  "8": { "symbol": "8", "svg_uri": "https://svgs.scryfall.io/card-symbols/8.svg", "type": "generic" },
  "9": { "symbol": "9", "svg_uri": "https://svgs.scryfall.io/card-symbols/9.svg", "type": "generic" },
  "10": { "symbol": "10", "svg_uri": "https://svgs.scryfall.io/card-symbols/10.svg", "type": "generic" },
  "11": { "symbol": "11", "svg_uri": "https://svgs.scryfall.io/card-symbols/11.svg", "type": "generic" },
  "12": { "symbol": "12", "svg_uri": "https://svgs.scryfall.io/card-symbols/12.svg", "type": "generic" },
  "13": { "symbol": "13", "svg_uri": "https://svgs.scryfall.io/card-symbols/13.svg", "type": "generic" },
  "14": { "symbol": "14", "svg_uri": "https://svgs.scryfall.io/card-symbols/14.svg", "type": "generic" },
  "15": { "symbol": "15", "svg_uri": "https://svgs.scryfall.io/card-symbols/15.svg", "type": "generic" },
  "16": { "symbol": "16", "svg_uri": "https://svgs.scryfall.io/card-symbols/16.svg", "type": "generic" },
  "17": { "symbol": "17", "svg_uri": "https://svgs.scryfall.io/card-symbols/17.svg", "type": "generic" },
  "18": { "symbol": "18", "svg_uri": "https://svgs.scryfall.io/card-symbols/18.svg", "type": "generic" },
  "19": { "symbol": "19", "svg_uri": "https://svgs.scryfall.io/card-symbols/19.svg", "type": "generic" },
  "20": { "symbol": "20", "svg_uri": "https://svgs.scryfall.io/card-symbols/20.svg", "type": "generic" },

  // Variable mana
  "X": { "symbol": "X", "svg_uri": "https://svgs.scryfall.io/card-symbols/X.svg", "type": "variable" },
  "Y": { "symbol": "Y", "svg_uri": "https://svgs.scryfall.io/card-symbols/Y.svg", "type": "variable" },
  "Z": { "symbol": "Z", "svg_uri": "https://svgs.scryfall.io/card-symbols/Z.svg", "type": "variable" },
  "½": { "symbol": "½", "svg_uri": "https://svgs.scryfall.io/card-symbols/HALF.svg", "type": "variable" },
  "∞": { "symbol": "∞", "svg_uri": "https://svgs.scryfall.io/card-symbols/INFINITY.svg", "type": "variable" },

  // Basic color mana
  "W": { "symbol": "W", "svg_uri": "https://svgs.scryfall.io/card-symbols/W.svg", "type": "color" },
  "U": { "symbol": "U", "svg_uri": "https://svgs.scryfall.io/card-symbols/U.svg", "type": "color" },
  "B": { "symbol": "B", "svg_uri": "https://svgs.scryfall.io/card-symbols/B.svg", "type": "color" },
  "R": { "symbol": "R", "svg_uri": "https://svgs.scryfall.io/card-symbols/R.svg", "type": "color" },
  "G": { "symbol": "G", "svg_uri": "https://svgs.scryfall.io/card-symbols/G.svg", "type": "color" },
  "C": { "symbol": "C", "svg_uri": "https://svgs.scryfall.io/card-symbols/C.svg", "type": "colorless" },

  // Hybrid mana (two colors)
  "W/U": { "symbol": "W/U", "svg_uri": "https://svgs.scryfall.io/card-symbols/WU.svg", "type": "hybrid" },
  "W/B": { "symbol": "W/B", "svg_uri": "https://svgs.scryfall.io/card-symbols/WB.svg", "type": "hybrid" },
  "U/B": { "symbol": "U/B", "svg_uri": "https://svgs.scryfall.io/card-symbols/UB.svg", "type": "hybrid" },
  "U/R": { "symbol": "U/R", "svg_uri": "https://svgs.scryfall.io/card-symbols/UR.svg", "type": "hybrid" },
  "B/R": { "symbol": "B/R", "svg_uri": "https://svgs.scryfall.io/card-symbols/BR.svg", "type": "hybrid" },
  "B/G": { "symbol": "B/G", "svg_uri": "https://svgs.scryfall.io/card-symbols/BG.svg", "type": "hybrid" },
  "R/G": { "symbol": "R/G", "svg_uri": "https://svgs.scryfall.io/card-symbols/RG.svg", "type": "hybrid" },
  "R/W": { "symbol": "R/W", "svg_uri": "https://svgs.scryfall.io/card-symbols/RW.svg", "type": "hybrid" },
  "G/W": { "symbol": "G/W", "svg_uri": "https://svgs.scryfall.io/card-symbols/GW.svg", "type": "hybrid" },
  "G/U": { "symbol": "G/U", "svg_uri": "https://svgs.scryfall.io/card-symbols/GU.svg", "type": "hybrid" },

  // Phyrexian mana (color or 2 life)
  "W/P": { "symbol": "W/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/WP.svg", "type": "phyrexian" },
  "U/P": { "symbol": "U/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/UP.svg", "type": "phyrexian" },
  "B/P": { "symbol": "B/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/BP.svg", "type": "phyrexian" },
  "R/P": { "symbol": "R/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/RP.svg", "type": "phyrexian" },
  "G/P": { "symbol": "G/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/GP.svg", "type": "phyrexian" },
  "C/P": { "symbol": "C/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/CP.svg", "type": "phyrexian" },

  // Hybrid Phyrexian mana (hybrid color combo or 2 life)
  "G/W/P": { "symbol": "G/W/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/GWP.svg", "type": "hybrid-phyrexian" },
  "B/G/P": { "symbol": "B/G/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/BGP.svg", "type": "hybrid-phyrexian" },
  "U/B/P": { "symbol": "U/B/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/UBP.svg", "type": "hybrid-phyrexian" },
  "B/R/P": { "symbol": "B/R/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/BRP.svg", "type": "hybrid-phyrexian" },
  "R/G/P": { "symbol": "R/G/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/RGP.svg", "type": "hybrid-phyrexian" },
  "R/W/P": { "symbol": "R/W/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/RWP.svg", "type": "hybrid-phyrexian" },
  "G/U/P": { "symbol": "G/U/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/GUP.svg", "type": "hybrid-phyrexian" },
  "W/U/P": { "symbol": "W/U/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/WUP.svg", "type": "hybrid-phyrexian" },
  "W/B/P": { "symbol": "W/B/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/WBP.svg", "type": "hybrid-phyrexian" },
  "U/R/P": { "symbol": "U/R/P", "svg_uri": "https://svgs.scryfall.io/card-symbols/URP.svg", "type": "hybrid-phyrexian" },

  // Special symbols
  "T": { "symbol": "T", "svg_uri": "https://svgs.scryfall.io/card-symbols/T.svg", "type": "special" },
  "Q": { "symbol": "Q", "svg_uri": "https://svgs.scryfall.io/card-symbols/Q.svg", "type": "special" },
  "E": { "symbol": "E", "svg_uri": "https://svgs.scryfall.io/card-symbols/E.svg", "type": "special" },
  "P": { "symbol": "P", "svg_uri": "https://svgs.scryfall.io/card-symbols/P.svg", "type": "special" },
  "PW": { "symbol": "PW", "svg_uri": "https://svgs.scryfall.io/card-symbols/PW.svg", "type": "special" },
  "CHAOS": { "symbol": "CHAOS", "svg_uri": "https://svgs.scryfall.io/card-symbols/CHAOS.svg", "type": "special" },
  "A": { "symbol": "A", "svg_uri": "https://svgs.scryfall.io/card-symbols/A.svg", "type": "special" },
  "TK": { "symbol": "TK", "svg_uri": "https://svgs.scryfall.io/card-symbols/TK.svg", "type": "special" },
  "H": { "symbol": "H", "svg_uri": "https://svgs.scryfall.io/card-symbols/H.svg", "type": "special" },
  "S": { "symbol": "S", "svg_uri": "https://svgs.scryfall.io/card-symbols/S.svg", "type": "special" }
};

// Helper function to get color symbol by letter
export const getColorSymbol = (colorLetter) => {
  return COLOR_SYMBOLS[colorLetter?.toUpperCase()] || null;
};

// Helper function to get multiple color symbols
export const getColorSymbols = (colorArray) => {
  if (!Array.isArray(colorArray)) return [];
  return colorArray.map(color => getColorSymbol(color)).filter(Boolean);
};

// Helper function to get mana symbol by symbol
export const getManaSymbol = (symbol) => {
  return MANA_SYMBOLS[symbol?.toUpperCase()] || null;
};

// Function to parse mana cost string and return array of symbol objects
export const parseManaCost = (manaCostString) => {
  if (!manaCostString) return [];

  // Match patterns like {3}, {W}, {U}, {X}, etc.
  const symbolMatches = manaCostString.match(/\{([^}]+)\}/g);

  if (!symbolMatches) return [];

  return symbolMatches.map(match => {
    // Remove the braces to get the symbol content
    const symbol = match.slice(1, -1);
    return getManaSymbol(symbol);
  }).filter(Boolean);
};

// Function to parse Oracle text and return React elements with symbols
export const parseOracleText = (oracleText) => {
  if (!oracleText) return null;

  // Split text by symbol patterns while keeping the symbols
  const parts = oracleText.split(/(\{[^}]+\})/g);

  return parts.map((part, index) => {
    // Check if this part is a symbol
    if (part.startsWith('{') && part.endsWith('}')) {
      const symbol = part.slice(1, -1);
      const manaSymbol = getManaSymbol(symbol);

      if (manaSymbol) {
        return (
          <img
            key={index}
            src={manaSymbol.svg_uri}
            alt={part}
            className="inline w-4 h-4 mx-0.5 align-text-bottom"
            title={part}
          />
        );
      } else {
        // If we don't have the symbol, return the original text
        return <span key={index}>{part}</span>;
      }
    }

    // Return regular text
    return <span key={index}>{part}</span>;
  });
};