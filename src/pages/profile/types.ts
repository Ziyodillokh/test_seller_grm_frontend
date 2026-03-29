export type CurrencyData = {
  id: string;
  isActive: boolean;
  items: [
    {
      usd: number;
      uzs: number;
    },
  ];
};
export type WeatherData = {
  current: { temp_c: string; condition: { icon: string } };
};
