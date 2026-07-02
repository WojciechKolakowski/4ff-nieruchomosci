export const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(150deg, #8B9264, #4F5636)",
  "linear-gradient(150deg, #B08A56, #5C4326)",
  "linear-gradient(150deg, #7C8A8F, #33393B)",
];

export const PLACEHOLDER_LABEL = "Zdjęcie wkrótce";

export function placeholderGradientFor(index: number): string {
  return PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
}
