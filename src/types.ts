export type SpotCategory = 'food' | 'activity' | 'shopping' | 'scenery' | 'hotel' | 'transport';

export interface Spot {
  id: string;
  name: string;
  japaneseName?: string;
  time?: string;
  description: string;
  category: SpotCategory;
  tips?: string[];
  budget?: {
    twd: number | string;
    jpy: number | string;
    unitPriceTwd?: number | string;
    unitPriceJpy?: number | string;
  } | string;
  image?: string;
  location?: { lat: number; lng: number };
  area?: '北部' | '中部' | '南部' | '那霸';
  googleMapsUrl?: string;
  parkingUrl?: string;
  mapCode?: string;
  phone?: string;
  address?: string;
  openHours?: string;
  vrUrl?: string;
  rating?: number;
}

export type SouvenirCategory = '熱門伴手禮' | '在地小吃' | '美妝保養' | '在地飲品';

export interface Souvenir {
  name: string;
  japaneseName?: string;
  image: string;
  category?: SouvenirCategory;
  location?: string;
  priceEstimate?: string;
  description?: string;
  googleMapsUrl?: string;
  tag?: string;
  rating?: number;
  mustTry?: string[];
}

export interface HourlyWeather {
  hour: string;
  temp: number;
  condition: '晴' | '雨' | '陰';
}

export interface DayPlan {
  day: number;
  date: string;
  city: string;
  spots: Spot[];
  summary: {
    travelTime: string;
    spotCount: number;
  };
  accommodation?: string;
  accommodationUrl?: string;
  outfitAdvice: string;
  weather: {
    condition: '晴' | '雨' | '陰';
    temp: { max: number; min: number };
    rainProb: string;
    hourly?: HourlyWeather[];
  };
  souvenirs?: Souvenir[];
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  avatarImg?: string;
  department?: string;
}

export interface Expense {
  isFixed?: boolean;
  id: string;
  day: number;
  amount: number;
  currency?: 'TWD' | 'JPY';
  originalAmount?: number;
  category: string;
  note: string;
  payerId: string;
  splitWithIds: string[];
  createdAt?: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  area: string;
  tag: string;
  image: string;
  rating: number;
  googleMapsUrl: string;
  description: string;
}

export interface HighlightCard {
  id: string;
  title: string;
  category: 'all' | 'beach' | 'food' | 'drive' | 'shopping' | 'team';
  categoryLabel: string;
  tag: string;
  image: string;
  desc: string;
  location: string;
  googleMapsUrl: string;
  mapCode?: string;
}

export interface MapPoint {
  id: string;
  name: string;
  japaneseName: string;
  area: '北部' | '中部' | '南部' | '那霸';
  coords: { x: number; y: number }; // Percentage on island map
  image: string;
  category: string;
  address: string;
  phone: string;
  openHours: string;
  description: string;
  googleMapsUrl: string;
  vrUrl?: string;
  mapCode?: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  tag: string;
  important?: boolean;
}
