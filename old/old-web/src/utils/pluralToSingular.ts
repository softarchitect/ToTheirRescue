const inflection = require('inflection');

const wordsToExclude: any = {
  Cattle: 'Cattle',
  Equine: 'Equine',
  lost: 'Lost',
  found: 'Found',
  released: 'Released',
};

export const pluralToSingular = (animalType: any) => {
  if (wordsToExclude[animalType]) {
    return animalType;
  }
  if (!animalType || animalType === '') {
    return '';
  }
  const result = inflection.singularize(animalType?.toLowerCase());
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const singularToPlural = (animalType: any) => {
  if (wordsToExclude[animalType]) {
    return animalType;
  }
  if (!animalType || animalType === '') {
    return '';
  }
  const result = inflection.pluralize(animalType?.toLowerCase());
  return result.charAt(0).toUpperCase() + result.slice(1);
};
