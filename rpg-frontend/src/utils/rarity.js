export const getRarityClass = (rarity) => {
    switch (rarity) {
      case "COMMON":
        return "rarity-common";
      case "UNCOMMON":
        return "rarity-uncommon";
      case "RARE":
        return "rarity-rare";
      case "EPIC":
        return "rarity-epic";
      case "LEGENDARY":
        return "rarity-legendary";
      case "MYTHIC":
        return "rarity-mythic";
      default:
        return "";
    }
  };

  export const getRarityBorder = (rarity) => {
    switch (rarity) {
        case "COMMON":
            return "border-common";

        case "UNCOMMON":
            return "border-uncommon";

        case "RARE":
            return "border-rare";

        case "EPIC":
            return "border-epic";

        case "LEGENDARY":
            return "border-legendary";

        case "MYTHIC":
            return "border-mythic";

        default:
            return "";
    }
}

export const getRarityName = (rarity) => {
    switch (rarity){
        case "COMMON": return "普通";
        case "UNCOMMON": return "优秀";
        case "RARE": return "稀有";
        case "EPIC": return "史诗";
        case "LEGENDARY": return "传说";
        case "MYTHIC": return "神话";
        default: return "普通";
    }
}