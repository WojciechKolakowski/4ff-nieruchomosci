export interface VipStep {
  number: string;
  description: string;
}

export interface VipProgramContent {
  eyebrow: string;
  heading: string;
  description: string;
  steps: VipStep[];
  ctaButtonLabel: string;
}

export const vipProgramContent: VipProgramContent = {
  eyebrow: "Program 4FF VIP",
  heading: "Zobacz nowe oferty 7 dni przed wszystkimi",
  description:
    "Każda nowa nieruchomość trafia najpierw do zalogowanych użytkowników. Dopiero po 7 dniach staje się widoczna publicznie i pojawia się na portalach ogłoszeniowych.",
  steps: [
    { number: "01", description: "Załóż darmowe konto w mniej niż minutę." },
    { number: "02", description: "Przeglądaj nowości zanim trafią do internetu." },
    { number: "03", description: "Umów prezentację jako pierwszy zainteresowany." },
  ],
  ctaButtonLabel: "Załóż bezpłatne konto",
};
