import {
  FlavorInfo,
  ContainerInfo,
  ToppingInfo,
  Recipe,
  Mission,
  Achievement,
  VictoriaCustomization,
  ShopItem,
} from '@/src/types/game';
import {
  INITIAL_FLAVORS,
  INITIAL_CONTAINERS,
  INITIAL_TOPPINGS,
  STARTER_RECIPES,
  STARTER_MISSIONS,
  INITIAL_ACHIEVEMENTS,
  SHOP_ITEMS,
} from '@/src/game/data/gameData';

export interface SavedGameState {
  coins: number;
  totalEarned: number;
  level: number;
  currentXp: number;
  requiredXp: number;
  currentDay: number;
  dailyCustomersServed: number;
  dailyEarnings: number;
  dailyStarsSum: number;
  businessStage: string;
  flavors: FlavorInfo[];
  containers: ContainerInfo[];
  toppings: ToppingInfo[];
  recipes: Recipe[];
  missions: Mission[];
  achievements: Achievement[];
  shopItems: ShopItem[];
  victoriaCustomization: VictoriaCustomization;
  lastPlayedDate: string;
}

const STORAGE_KEY = 'victoria_ice_cream_world_save_v1';

export function getDefaultState(): SavedGameState {
  return {
    coins: 40,
    totalEarned: 40,
    level: 1,
    currentXp: 0,
    requiredXp: 100,
    currentDay: 1,
    dailyCustomersServed: 0,
    dailyEarnings: 0,
    dailyStarsSum: 0,
    businessStage: 'Local de Barrio',
    flavors: JSON.parse(JSON.stringify(INITIAL_FLAVORS)),
    containers: JSON.parse(JSON.stringify(INITIAL_CONTAINERS)),
    toppings: JSON.parse(JSON.stringify(INITIAL_TOPPINGS)),
    recipes: JSON.parse(JSON.stringify(STARTER_RECIPES)),
    missions: JSON.parse(JSON.stringify(STARTER_MISSIONS)),
    achievements: JSON.parse(JSON.stringify(INITIAL_ACHIEVEMENTS)),
    shopItems: JSON.parse(JSON.stringify(SHOP_ITEMS)),
    victoriaCustomization: {
      hairstyle: 'classic_flower',
      apron: 'pastel_floral',
      accessory: 'yellow_flower',
    },
    lastPlayedDate: new Date().toISOString(),
  };
}

export function loadSavedGame(): SavedGameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const defaultState = getDefaultState();
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);

    // Ensure all containers are present
    const savedContainers: ContainerInfo[] = Array.isArray(parsed.containers) ? parsed.containers : [];
    const mergedContainers = defaultState.containers.map((defaultC) => {
      const found = savedContainers.find((c) => c.id === defaultC.id);
      return found ? { ...defaultC, unlocked: found.unlocked || defaultC.unlocked } : defaultC;
    });

    // Ensure all flavors are present
    const savedFlavors: FlavorInfo[] = Array.isArray(parsed.flavors) ? parsed.flavors : [];
    const mergedFlavors = defaultState.flavors.map((defaultF) => {
      const found = savedFlavors.find((f) => f.id === defaultF.id);
      return found ? { ...defaultF, unlocked: found.unlocked || defaultF.unlocked } : defaultF;
    });

    // Ensure all toppings are present
    const savedToppings: ToppingInfo[] = Array.isArray(parsed.toppings) ? parsed.toppings : [];
    const mergedToppings = defaultState.toppings.map((defaultT) => {
      const found = savedToppings.find((t) => t.id === defaultT.id);
      return found ? { ...defaultT, unlocked: found.unlocked || defaultT.unlocked } : defaultT;
    });

    // Ensure all starter recipes are present
    const savedRecipes: Recipe[] = Array.isArray(parsed.recipes) ? parsed.recipes : [];
    const mergedRecipes = [...savedRecipes];
    defaultState.recipes.forEach((defaultR) => {
      if (!mergedRecipes.some((r) => r.id === defaultR.id)) {
        mergedRecipes.push(defaultR);
      }
    });

    return {
      ...defaultState,
      ...parsed,
      containers: mergedContainers,
      flavors: mergedFlavors,
      toppings: mergedToppings,
      recipes: mergedRecipes,
    };
  } catch (e) {
    console.warn('Could not load saved game, reverting to defaults:', e);
    return getDefaultState();
  }
}

export function saveGame(state: SavedGameState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not persist game state to localStorage:', e);
  }
}
