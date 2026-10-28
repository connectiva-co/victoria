import { Order, ContainerType, FlavorId, ToppingId, SauceId } from '@/src/types/game';
import { INITIAL_FLAVORS, INITIAL_TOPPINGS, INITIAL_SAUCES, INITIAL_CONTAINERS } from '@/src/game/data/gameData';

export const FLAVOR_ICONS: Record<string, string> = {
  vainilla: '🍦',
  chocolate: '🍫',
  fresa: '🍓',
  mango: '🥭',
  arequipe: '🍮',
  maracuya: '🍋',
  menta: '🌿',
  brownie: '🍪',
};

export const CONTAINER_ICONS: Record<ContainerType, string> = {
  cono: '🍦',
  vaso: '🍧',
  copa: '🍨',
  waffle: '🧇',
};

export const CONTAINER_NAMES: Record<ContainerType, string> = {
  cono: 'Cono',
  vaso: 'Vaso',
  copa: 'Copa',
  waffle: 'Waffle',
};

export interface GroupedFlavor {
  id: FlavorId;
  name: string;
  count: number;
  color: string;
  icon: string;
}

export function getGroupedFlavors(flavorIds: FlavorId[]): GroupedFlavor[] {
  const counts: Record<string, number> = {};
  flavorIds.forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  return Object.keys(counts).map((id) => {
    const fl = INITIAL_FLAVORS.find((f) => f.id === id);
    return {
      id: id as FlavorId,
      name: fl?.name.split(' ')[0] || id, // e.g. "Chocolate", "Vainilla"
      count: counts[id],
      color: fl?.color || '#ffb3ba',
      icon: FLAVOR_ICONS[id] || '🍨',
    };
  });
}

export function getToppingInfo(id: ToppingId) {
  const top = INITIAL_TOPPINGS.find((t) => t.id === id);
  return {
    id,
    name: top?.name.split(' ')[0] || id, // "Chispas", "Cereza", "Galleta"
    fullName: top?.name || id,
    icon: top?.icon || '✨',
  };
}

export function getSauceInfo(id: SauceId) {
  const s = INITIAL_SAUCES.find((item) => item.id === id);
  let shortName = 'Salsa';
  if (id === 'arequipe') shortName = 'Caramelo';
  else if (id === 'chocolate') shortName = 'Chocolate';
  else if (id === 'fresa') shortName = 'Fresa';

  return {
    id,
    name: shortName,
    fullName: s?.name || id,
    icon: '🍯',
    color: s?.color || '#b45309',
  };
}

/**
 * Creates a crystal-clear, natural Spanish spoken request:
 * e.g. "¡Quiero un Cono con 2 bolas de Chocolate, Chispas y Salsa Caramelo!"
 */
export function formatCustomerOrderSpeech(order: Order): string {
  const container = CONTAINER_NAMES[order.targetContainer] || 'Helado';
  const article = order.targetContainer === 'copa' ? 'una' : 'un';

  const grouped = getGroupedFlavors(order.targetFlavors);
  const flavorParts = grouped.map((g) => {
    if (g.count === 1) return `1 bola de ${g.name}`;
    return `${g.count} bolas de ${g.name}`;
  });

  const flavorText = flavorParts.join(' y ');

  const toppingParts = order.targetToppings.map((t) => getToppingInfo(t).name.toLowerCase());
  const toppingText = toppingParts.length > 0 ? toppingParts.join(' y ') : null;

  const sauceText = order.targetSauce ? `salsa de ${getSauceInfo(order.targetSauce).name.toLowerCase()}` : null;

  const extras: string[] = [];
  if (toppingText) extras.push(toppingText);
  if (sauceText) extras.push(sauceText);

  let fullExtras = '';
  if (extras.length > 0) {
    fullExtras = `, con ${extras.join(' y ')}`;
  }

  return `«¡Quiero ${article} ${container} con ${flavorText}${fullExtras}!»`;
}
