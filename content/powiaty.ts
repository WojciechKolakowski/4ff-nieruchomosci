export interface Powiat {
  name: string;
  voivodeship: "łódzkie" | "lubelskie";
  order: number;
}

export const powiatyList: Powiat[] = [
  { name: "Powiat Pabianicki", voivodeship: "łódzkie", order: 1 },
  { name: "Łódź", voivodeship: "łódzkie", order: 2 },
  { name: "Powiat Łódzki Wschodni", voivodeship: "łódzkie", order: 3 },
  { name: "Powiat Łaski", voivodeship: "łódzkie", order: 4 },
  { name: "Powiat Zgierski", voivodeship: "łódzkie", order: 5 },
  { name: "Powiat Lubelski", voivodeship: "lubelskie", order: 6 },
  { name: "Powiat Krasnostawski", voivodeship: "lubelskie", order: 7 },
  { name: "Powiat Świdnicki", voivodeship: "lubelskie", order: 8 },
  { name: "Powiat Biłgorajski", voivodeship: "lubelskie", order: 9 },
  { name: "Powiat Zamojski", voivodeship: "lubelskie", order: 10 },
  { name: "Powiat Janowski", voivodeship: "lubelskie", order: 11 },
];
