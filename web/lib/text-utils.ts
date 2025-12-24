/**
 * Text utility functions for string manipulation
 */

/**
 * Converts a plural word to its singular form
 * Handles irregular plurals and common pluralization rules
 * 
 * @param word - The word to singularize
 * @returns The singular form of the word with first letter capitalized
 * 
 * @example
 * singularize("Dogs") // "Dog"
 * singularize("Cats") // "Cat"
 * singularize("Geese") // "Goose"
 * singularize("Sheep") // "Sheep"
 */
export function singularize(word: string): string {
  if (!word) return ""
  const lower = word.toLowerCase().trim()

  // Irregular plurals and invariant words
  const irregulars: Record<string, string> = {
    geese: "goose",
    mice: "mouse",
    sheep: "sheep",
    deer: "deer",
    fish: "fish",
    cattle: "cattle",
    swine: "swine",
    equine: "equine",
    species: "species",
    wildlife: "wildlife",
  }

  if (irregulars[lower]) {
    const result = irregulars[lower]
    return result.charAt(0).toUpperCase() + result.slice(1)
  }

  // Common pluralization rules
  let result = lower
  if (lower.endsWith("ies")) {
    result = lower.slice(0, -3) + "y"
  } else if (lower.endsWith("ves")) {
    result = lower.slice(0, -3) + "f"
  } else if (lower.endsWith("es")) {
    // Handle "foxes" -> "fox", "benches" -> "bench", but keep "horses" -> "horse"
    const specialEndings = ["ses", "xes", "zes", "ches", "shes"]
    if (specialEndings.some((e) => lower.endsWith(e))) {
      result = lower.slice(0, -2)
    } else {
      result = lower.slice(0, -1)
    }
  } else if (lower.endsWith("s") && !lower.endsWith("ss")) {
    result = lower.slice(0, -1)
  }

  return result.charAt(0).toUpperCase() + result.slice(1)
}

