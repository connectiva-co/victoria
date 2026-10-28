export type GameMode = 'career' | 'creative' | 'relaxed';

export type ScreenType =
  | 'TITLE'
  | 'PLAYING'
  | 'DAY_SUMMARY'
  | 'RECIPES'
  | 'SHOP'
  | 'MISSIONS'
  | 'CUSTOMIZE_VICTORIA'
  | 'MINIGAME_MEMORY'
  | 'PAUSE';

export type ContainerType = 'cono' | 'vaso' | 'copa' | 'waffle';

export type FlavorId =
  | 'vainilla'
  | 'chocolate'
  | 'fresa'
  | 'mango'
  | 'arequipe'
  | 'maracuya'
  | 'menta'
  | 'brownie';

export type ToppingId =
  | 'chispas'
  | 'cereza'
  | 'galleta'
  | 'crema_batida'
  | 'waffle_crisp'
  | 'fresa_fresca';

export type SauceId = 'chocolate' | 'arequipe' | 'fresa';

export interface FlavorInfo {
  id: FlavorId;
  name: string;
  color: string;
  secondaryColor: string;
  unlocked: boolean;
  unlockCost: number;
  description: string;
}

export interface ContainerInfo {
  id: ContainerType;
  name: string;
  capacity: number; // max scoops
  price: number;
  unlocked: boolean;
}

export interface ToppingInfo {
  id: ToppingId;
  name: string;
  icon: string;
  unlocked: boolean;
  unlockCost: number;
}

export interface SauceInfo {
  id: SauceId;
  name: string;
  color: string;
  unlocked: boolean;
}

export interface RecipeStep {
  text: string;
}

export interface Recipe {
  id: string;
  name: string;
  container: ContainerType;
  flavors: FlavorId[];
  toppings: ToppingId[];
  sauce?: SauceId | null;
  price: number;
  xp: number;
  unlockLevel: number;
  discovered: boolean;
  description: string;
}

export type Personality = 'tranquilo' | 'impaciente' | 'exigente' | 'habitual' | 'especial';

export interface Customer {
  id: string;
  name: string;
  personality: Personality;
  avatarSeed: string;
  dialogueIntro: string[];
  dialogueSuccess: string[];
  dialogueFail: string[];
  patienceMultiplier: number; // 1.0 = standard, 0.7 = impatient, 1.4 = calm
  favoriteFlavor: FlavorId;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPersonality: Personality;
  recipeId?: string;
  recipeName?: string;
  targetContainer: ContainerType;
  targetFlavors: FlavorId[];
  targetToppings: ToppingId[];
  targetSauce?: SauceId | null;
  targetSeconds: number;
  timeRemaining: number;
  rewardCoins: number;
  rewardXp: number;
  customerDialogue: string;
}

export interface PreparedScoop {
  id: string;
  flavor: FlavorId;
}

export interface PreparedIceCream {
  container: ContainerType | null;
  scoops: PreparedScoop[];
  toppings: ToppingId[];
  sauce: SauceId | null;
}

export interface EvaluationResult {
  stars: number; // 1 to 3
  accuracyScore: number; // 0 to 1
  presentationScore: number; // 0 to 1
  speedScore: number; // 0 to 1
  totalScore: number; // 0 to 100
  earnedCoins: number;
  earnedXp: number;
  feedbackText: string;
  isPerfect: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardXp: number;
  completed: boolean;
  claimed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface VictoriaCustomization {
  hairstyle: 'classic_flower' | 'ponytail_ribbon' | 'chef_toque';
  apron: 'pastel_floral' | 'mint_chef' | 'sweet_strawberry' | 'golden_star';
  accessory: 'yellow_flower' | 'sparkle_clip' | 'chef_medal';
}

export interface ShopItem {
  id: string;
  name: string;
  category: 'flavor' | 'decor' | 'wardrobe' | 'tool';
  price: number;
  unlocked: boolean;
  icon: string;
  description: string;
  effect?: string;
}
