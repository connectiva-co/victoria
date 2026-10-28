import React, { useState, useEffect, useRef } from 'react';
import { ShopScene } from '@/src/game/three/ShopScene';
import {
  GameMode,
  ScreenType,
  ContainerType,
  FlavorId,
  ToppingId,
  SauceId,
  PreparedIceCream,
  Order,
  EvaluationResult,
  ShopItem,
  VictoriaCustomization,
} from '@/src/types/game';
import {
  INITIAL_SAUCES,
  STARTER_CUSTOMERS,
  STARTER_RECIPES,
} from '@/src/game/data/gameData';
import { loadSavedGame, saveGame, SavedGameState } from '@/src/game/storage/gameStorage';
import { sound } from '@/src/game/audio/soundManager';

import { TitleScreen } from '@/src/game/components/TitleScreen';
import { GameHeader } from '@/src/game/components/GameHeader';
import { AssemblyStation } from '@/src/game/components/AssemblyStation';
import { EvaluationModal } from '@/src/game/components/EvaluationModal';
import { DaySummaryModal } from '@/src/game/components/DaySummaryModal';
import { RecipeBookModal } from '@/src/game/components/RecipeBookModal';
import { ShopModal } from '@/src/game/components/ShopModal';
import { MissionsModal } from '@/src/game/components/MissionsModal';
import { VictoriaProfileModal } from '@/src/game/components/VictoriaProfileModal';
import { MemoryMinigameModal } from '@/src/game/components/MemoryMinigameModal';
import { PauseModal } from '@/src/game/components/PauseModal';
import { ParlorWorld2D } from '@/src/game/components/ParlorWorld2D';
import { ParlorWorld3DOverlay } from '@/src/game/components/ParlorWorld3DOverlay';

export default function App() {
  const [gameState, setGameState] = useState<SavedGameState>(loadSavedGame);
  const [screen, setScreen] = useState<ScreenType>('TITLE');
  const [gameMode, setGameMode] = useState<GameMode>('career');
  const [isMuted, setIsMuted] = useState<boolean>(sound.getMuted());
  const [renderingMode, setRenderingMode] = useState<'pixar2d' | 'three3d'>('pixar2d');
  const [victoriaAction, setVictoriaAction] = useState<'idle' | 'scooping' | 'celebrating' | 'thinking'>('idle');
  const [isCustomerCelebrating, setIsCustomerCelebrating] = useState<boolean>(false);

  // Active Ice Cream being assembled
  const [prepared, setPrepared] = useState<PreparedIceCream>({
    container: null,
    scoops: [],
    toppings: [],
    sauce: null,
  });

  // Active Customer Order
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const activeCustomer = STARTER_CUSTOMERS.find((c) => c.id === activeOrder?.customerId) || null;

  // Active modal overlay
  const [activeModal, setActiveModal] = useState<
    'RECIPES' | 'SHOP' | 'MISSIONS' | 'CUSTOMIZE_VICTORIA' | 'MINIGAME_MEMORY' | 'PAUSE' | null
  >(null);

  // Three.js Mount & Instance
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const shopSceneRef = useRef<ShopScene | null>(null);
  const orderTimerRef = useRef<number | null>(null);

  // Initialize or re-create Three.js ShopScene when renderingMode changes
  useEffect(() => {
    if (renderingMode === 'three3d') {
      if (!canvasMountRef.current) return;

      // Dispose any prior scene
      if (shopSceneRef.current) {
        shopSceneRef.current.dispose();
        shopSceneRef.current = null;
      }

      const scene = new ShopScene(canvasMountRef.current, gameState.victoriaCustomization);
      shopSceneRef.current = scene;

      if (activeCustomer) {
        scene.setCustomer(activeCustomer);
      }
      scene.updateIceCream(prepared);

      return () => {
        scene.dispose();
        shopSceneRef.current = null;
      };
    } else {
      if (shopSceneRef.current) {
        shopSceneRef.current.dispose();
        shopSceneRef.current = null;
      }
    }
  }, [renderingMode]);

  // Sync 3D ice cream when prepared state changes
  useEffect(() => {
    if (renderingMode === 'three3d' && shopSceneRef.current) {
      shopSceneRef.current.updateIceCream(prepared);
    }
  }, [prepared, renderingMode]);

  // Sync Customer in 3D scene
  useEffect(() => {
    if (renderingMode === 'three3d' && shopSceneRef.current) {
      shopSceneRef.current.setCustomer(activeCustomer);
    }
  }, [activeCustomer, renderingMode]);

  // Sync Victoria actions in 3D scene
  useEffect(() => {
    if (renderingMode === 'three3d' && shopSceneRef.current) {
      if (victoriaAction === 'scooping') {
        shopSceneRef.current.triggerVictoriaScoop();
      } else if (victoriaAction === 'celebrating') {
        shopSceneRef.current.triggerCustomerCelebrate();
      }
    }
  }, [victoriaAction, renderingMode]);

  // Persist game state on changes
  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeModal) {
          setActiveModal(null);
        } else if (screen === 'PLAYING') {
          setActiveModal('PAUSE');
        }
      } else if (e.key === 'm' || e.key === 'M') {
        const newMuted = sound.toggleMute();
        setIsMuted(newMuted);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screen, activeModal]);

  // --- Order Generation & Lifecycle ---

  const spawnNextCustomer = () => {
    if (gameState.dailyCustomersServed >= 5 && gameMode === 'career') {
      // Completed full workday!
      setScreen('DAY_SUMMARY');
      return;
    }

    // Select customer from the 5 starter customers
    const custIndex = gameState.dailyCustomersServed % STARTER_CUSTOMERS.length;
    const customer = STARTER_CUSTOMERS[custIndex];

    // Pick an unlocked recipe suitable for player level or customer preference
    const availableRecipes = gameState.recipes.filter(
      (r) => r.unlockLevel <= gameState.level
    );
    const chosenRecipe =
      availableRecipes.length > 0
        ? availableRecipes[Math.floor(Math.random() * availableRecipes.length)]
        : STARTER_RECIPES[0];

    const targetSeconds = Math.round(
      (28 + chosenRecipe.flavors.length * 6) * customer.patienceMultiplier
    );

    const randomIntro =
      customer.dialogueIntro[Math.floor(Math.random() * customer.dialogueIntro.length)];

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      customerPersonality: customer.personality,
      recipeId: chosenRecipe.id,
      recipeName: chosenRecipe.name,
      targetContainer: chosenRecipe.container,
      targetFlavors: [...chosenRecipe.flavors],
      targetToppings: [...chosenRecipe.toppings],
      targetSauce: chosenRecipe.sauce || null,
      targetSeconds: targetSeconds,
      timeRemaining: targetSeconds,
      rewardCoins: chosenRecipe.price,
      rewardXp: chosenRecipe.xp,
      customerDialogue: randomIntro,
    };

    // Reset workstation for new order
    setPrepared({
      container: null,
      scoops: [],
      toppings: [],
      sauce: null,
    });

    setActiveOrder(newOrder);

    // Tell 3D scene to animate customer entering
    shopSceneRef.current?.setCustomer(customer, () => {
      // Arrived at counter
      shopSceneRef.current?.setCameraMode('assembly');
    });
  };

  // Order Patience Countdown Timer
  useEffect(() => {
    if (screen !== 'PLAYING' || !activeOrder || evaluation || activeModal || gameMode === 'relaxed') {
      if (orderTimerRef.current) clearInterval(orderTimerRef.current);
      return;
    }

    orderTimerRef.current = window.setInterval(() => {
      setActiveOrder((prev) => {
        if (!prev) return null;
        const nextTime = prev.timeRemaining - 0.2;
        if (nextTime <= 0) {
          // Time expired: auto submit what the player has
          handleSubmitOrder();
          return null;
        }
        return {
          ...prev,
          timeRemaining: nextTime,
        };
      });
    }, 200);

    return () => {
      if (orderTimerRef.current) clearInterval(orderTimerRef.current);
    };
  }, [screen, activeOrder, evaluation, activeModal, gameMode]);

  // --- Handlers for Assembling Ice Cream ---

  const handleSelectContainer = (c: ContainerType) => {
    setPrepared((prev) => ({
      ...prev,
      container: c,
      // If switching container, trim scoops if new capacity is smaller
      scoops: c === 'cono' ? prev.scoops.slice(0, 2) : prev.scoops,
    }));
  };

  const handleAddScoop = (flavor: FlavorId) => {
    shopSceneRef.current?.triggerVictoriaScoop();
    setVictoriaAction('scooping');
    setTimeout(() => setVictoriaAction('idle'), 650);
    setPrepared((prev) => ({
      ...prev,
      scoops: [...prev.scoops, { id: `scoop_${Date.now()}`, flavor }],
    }));
  };

  const handleToggleTopping = (topping: ToppingId) => {
    setPrepared((prev) => {
      const exists = prev.toppings.includes(topping);
      return {
        ...prev,
        toppings: exists
          ? prev.toppings.filter((t) => t !== topping)
          : [...prev.toppings, topping],
      };
    });
  };

  const handleSetSauce = (sauce: SauceId | null) => {
    setPrepared((prev) => ({
      ...prev,
      sauce,
    }));
  };

  const handleResetIceCream = () => {
    setPrepared({
      container: null,
      scoops: [],
      toppings: [],
      sauce: null,
    });
  };

  // --- Order Evaluation & Submission ---

  const handleSubmitOrder = () => {
    if (!activeOrder) return;

    // 1. Accuracy Score (55% weight)
    let accuracy = 0;
    let accuracyPoints = 0;
    const maxAccuracyPoints = 3;

    // Container match
    if (prepared.container === activeOrder.targetContainer) {
      accuracyPoints += 1;
    }

    // Flavors match
    const targetFlavorsSorted = [...activeOrder.targetFlavors].sort();
    const preparedFlavorsSorted = prepared.scoops.map((s) => s.flavor).sort();
    const flavorsMatch =
      targetFlavorsSorted.length === preparedFlavorsSorted.length &&
      targetFlavorsSorted.every((f, i) => f === preparedFlavorsSorted[i]);

    if (flavorsMatch) {
      accuracyPoints += 1.5;
    } else {
      // Partial credit for at least one correct flavor
      const matchingCount = preparedFlavorsSorted.filter((f) =>
        targetFlavorsSorted.includes(f)
      ).length;
      accuracyPoints += Math.min(1, matchingCount * 0.5);
    }

    // Toppings & sauce match
    const hasToppingsMatch =
      activeOrder.targetToppings.length === 0 ||
      activeOrder.targetToppings.every((t) => prepared.toppings.includes(t));
    const hasSauceMatch = activeOrder.targetSauce === prepared.sauce;

    if (hasToppingsMatch && hasSauceMatch) {
      accuracyPoints += 0.5;
    }

    accuracy = Math.min(1, accuracyPoints / maxAccuracyPoints);

    // 2. Presentation Score (25% weight)
    let presentation = 0.8;
    if (prepared.toppings.length > 0) presentation += 0.1;
    if (prepared.sauce) presentation += 0.1;
    presentation = Math.min(1, presentation);

    // 3. Speed Score (20% weight)
    const speedRatio =
      activeOrder.targetSeconds > 0
        ? activeOrder.timeRemaining / activeOrder.targetSeconds
        : 1;
    const speed = Math.max(0.4, Math.min(1, speedRatio));

    // Total Score calculation (0 to 100)
    const totalScore = Math.round(
      (accuracy * 0.55 + presentation * 0.25 + speed * 0.2) * 100
    );

    // Stars rating
    let stars = 1;
    if (totalScore >= 82) stars = 3;
    else if (totalScore >= 60) stars = 2;

    const tipMultiplier = stars === 3 ? 1.3 : stars === 2 ? 1.1 : 0.9;
    const earnedCoins = Math.round(activeOrder.rewardCoins * tipMultiplier);
    const earnedXp = Math.round(activeOrder.rewardXp * (stars / 2));

    let feedback = '¡Muy rico!';
    if (stars === 3) {
      feedback = '¡Obra de arte! ¡Exactamente lo que soñaba!';
    } else if (stars === 2) {
      feedback = '¡Muy sabroso y bien preparado!';
    } else {
      feedback = 'Estuvo bien, aunque esperaba algo un poco diferente.';
    }

    const evalResult: EvaluationResult = {
      stars,
      accuracyScore: accuracy,
      presentationScore: presentation,
      speedScore: speed,
      totalScore,
      earnedCoins,
      earnedXp,
      feedbackText: feedback,
      isPerfect: stars === 3,
    };

    setEvaluation(evalResult);

    // Animate character celebration
    if (stars >= 2) {
      shopSceneRef.current?.triggerCustomerCelebrate();
      setVictoriaAction('celebrating');
      setIsCustomerCelebrating(true);
    } else {
      shopSceneRef.current?.triggerCustomerDisappoint();
      setVictoriaAction('thinking');
      setIsCustomerCelebrating(false);
    }

    // Update Game State Progression
    setGameState((prev) => {
      const nextCoins = prev.coins + earnedCoins;
      const nextEarned = prev.totalEarned + earnedCoins;
      let nextXp = prev.currentXp + earnedXp;
      let nextLevel = prev.level;
      let nextReqXp = prev.requiredXp;

      // Level up check
      if (nextXp >= nextReqXp) {
        nextXp -= nextReqXp;
        nextLevel += 1;
        nextReqXp = Math.round(nextReqXp * 1.3);
      }

      // Update Missions
      const updatedMissions = prev.missions.map((m) => {
        let inc = 0;
        if (m.id === 'mis_1') inc = 1; // 3 pedidos
        if (m.id === 'mis_2' && prepared.toppings.includes('cereza')) inc = 1; // Cereza
        if (m.id === 'mis_3' && stars === 3) inc = 1; // 3 estrellas
        if (m.id === 'mis_4' && prepared.container === 'cono') inc = 1; // Cono
        if (m.id === 'mis_5') inc = 1; // 5 clientes

        const currentVal = Math.min(m.target, m.current + inc);
        return {
          ...m,
          current: currentVal,
          completed: currentVal >= m.target,
        };
      });

      // Update Achievements
      const updatedAchievements = prev.achievements.map((a) => {
        if (a.id === 'ach_first_scoop') {
          return { ...a, progress: 1, unlocked: true };
        }
        if (a.id === 'ach_master_chef' && stars === 3) {
          const prog = Math.min(a.maxProgress, a.progress + 1);
          return { ...a, progress: prog, unlocked: prog >= a.maxProgress };
        }
        if (a.id === 'ach_coin_collector') {
          return { ...a, progress: nextCoins, unlocked: nextCoins >= a.maxProgress };
        }
        return a;
      });

      return {
        ...prev,
        coins: nextCoins,
        totalEarned: nextEarned,
        level: nextLevel,
        currentXp: nextXp,
        requiredXp: nextReqXp,
        dailyCustomersServed: prev.dailyCustomersServed + 1,
        dailyEarnings: prev.dailyEarnings + earnedCoins,
        dailyStarsSum: prev.dailyStarsSum + stars,
        missions: updatedMissions,
        achievements: updatedAchievements,
      };
    });
  };

  const handleNextCustomer = () => {
    setEvaluation(null);
    setVictoriaAction('idle');
    setIsCustomerCelebrating(false);

    // Customer walks away
    if (renderingMode === 'three3d') {
      shopSceneRef.current?.customerLeave(() => {
        shopSceneRef.current?.setCameraMode('parlor');
        spawnNextCustomer();
      });
    } else {
      spawnNextCustomer();
    }
  };

  // --- Start Game Mode ---

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setScreen('PLAYING');
    shopSceneRef.current?.setCameraMode('parlor');
    spawnNextCustomer();
  };

  const handleStartNextDay = () => {
    setGameState((prev) => ({
      ...prev,
      currentDay: prev.currentDay + 1,
      dailyCustomersServed: 0,
      dailyEarnings: 0,
      dailyStarsSum: 0,
      businessStage:
        prev.currentDay >= 3
          ? 'Heladería con Mesas y Terraza'
          : prev.currentDay >= 2
          ? 'Heladería Moderna de Diseño'
          : prev.businessStage,
    }));
    setScreen('PLAYING');
    shopSceneRef.current?.setCameraMode('parlor');
    spawnNextCustomer();
  };

  const handleRestartDay = () => {
    setGameState((prev) => ({
      ...prev,
      dailyCustomersServed: 0,
      dailyEarnings: 0,
      dailyStarsSum: 0,
    }));
    setActiveModal(null);
    setScreen('PLAYING');
    spawnNextCustomer();
  };

  const handleToggleMute = () => {
    const newMute = sound.toggleMute();
    setIsMuted(newMute);
  };

  // --- Buy Shop Items ---

  const handleBuyItem = (item: ShopItem) => {
    setGameState((prev) => {
      const nextCoins = prev.coins - item.price;
      const updatedShopItems = prev.shopItems.map((si) =>
        si.id === item.id ? { ...si, unlocked: true } : si
      );

      // If flavor unlocked, enable in flavors
      let updatedFlavors = [...prev.flavors];
      if (item.category === 'flavor') {
        const flavorId = item.id.replace('shop_flavor_', '') as FlavorId;
        updatedFlavors = updatedFlavors.map((f) =>
          f.id === flavorId ? { ...f, unlocked: true } : f
        );
      }

      return {
        ...prev,
        coins: nextCoins,
        shopItems: updatedShopItems,
        flavors: updatedFlavors,
      };
    });
  };

  // --- Claim Mission Rewards ---

  const handleClaimMission = (missionId: string) => {
    setGameState((prev) => {
      const mission = prev.missions.find((m) => m.id === missionId);
      if (!mission || mission.claimed) return prev;

      const nextCoins = prev.coins + mission.rewardCoins;
      const nextXp = prev.currentXp + mission.rewardXp;
      const updatedMissions = prev.missions.map((m) =>
        m.id === missionId ? { ...m, claimed: true } : m
      );

      return {
        ...prev,
        coins: nextCoins,
        currentXp: nextXp,
        missions: updatedMissions,
      };
    });
  };

  // --- Minigame Reward ---

  const handleMinigameWin = (rewardCoins: number, rewardXp: number) => {
    setGameState((prev) => ({
      ...prev,
      coins: prev.coins + rewardCoins,
      currentXp: prev.currentXp + rewardXp,
      achievements: prev.achievements.map((a) =>
        a.id === 'ach_memory_champ' ? { ...a, progress: 1, unlocked: true } : a
      ),
    }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-pink-50 select-none">
      {/* 1. World View: 3D WebGL Canvas (Always present in DOM so canvasMountRef is permanently attached) */}
      <div
        ref={canvasMountRef}
        className={`absolute inset-0 w-full h-full z-0 cursor-grab active:cursor-grabbing ${
          renderingMode === 'three3d' ? 'block' : 'hidden pointer-events-none'
        }`}
      />

      {/* 3D Mode Overlay HUD when in 3D mode */}
      {renderingMode === 'three3d' && screen === 'PLAYING' && (
        <ParlorWorld3DOverlay
          currentCustomer={activeCustomer}
          isCustomerCelebrating={isCustomerCelebrating}
          victoriaAction={victoriaAction}
          prepared={prepared}
          onBellClick={handleSubmitOrder}
          canSubmit={!!prepared.container && prepared.scoops.length > 0}
          onCameraModeChange={(cam) => shopSceneRef.current?.setCameraMode(cam)}
          activeOrder={activeOrder}
          gameMode={gameMode}
        />
      )}

      {/* 2D Pixar Animated World (Active when pixar2d) */}
      {renderingMode === 'pixar2d' && (
        <div className="absolute inset-0 w-full h-full z-0">
          <ParlorWorld2D
            victoriaCustomization={gameState.victoriaCustomization}
            victoriaAction={victoriaAction}
            currentCustomer={activeCustomer}
            isCustomerCelebrating={isCustomerCelebrating}
            prepared={prepared}
            onBellClick={handleSubmitOrder}
            canSubmit={!!prepared.container && prepared.scoops.length > 0}
            activeOrder={activeOrder}
            gameMode={gameMode}
          />
        </div>
      )}

      {/* 2. Title Screen (if on TITLE) */}
      {screen === 'TITLE' && (
        <TitleScreen
          onStartGame={handleStartGame}
          onOpenMinigame={() => setActiveModal('MINIGAME_MEMORY')}
          onOpenVictoriaProfile={() => setActiveModal('CUSTOMIZE_VICTORIA')}
          isMuted={isMuted}
          renderingMode={renderingMode}
          onToggleMute={handleToggleMute}
          onToggleRenderingMode={() =>
            setRenderingMode((r) => (r === 'pixar2d' ? 'three3d' : 'pixar2d'))
          }
        />
      )}

      {/* 3. In-Game HUD (if PLAYING) */}
      {screen === 'PLAYING' && (
        <>
          <GameHeader
            coins={gameState.coins}
            level={gameState.level}
            currentXp={gameState.currentXp}
            requiredXp={gameState.requiredXp}
            currentDay={gameState.currentDay}
            dailyCustomersServed={gameState.dailyCustomersServed}
            isMuted={isMuted}
            renderingMode={renderingMode}
            onToggleMute={handleToggleMute}
            onToggleRenderingMode={() =>
              setRenderingMode((r) => (r === 'pixar2d' ? 'three3d' : 'pixar2d'))
            }
            onOpenScreen={(s) => setActiveModal(s)}
          />

          <AssemblyStation
            prepared={prepared}
            flavors={gameState.flavors}
            containers={gameState.containers}
            toppings={gameState.toppings}
            sauces={INITIAL_SAUCES}
            onSelectContainer={handleSelectContainer}
            onAddScoop={handleAddScoop}
            onToggleTopping={handleToggleTopping}
            onSetSauce={handleSetSauce}
            onResetIceCream={handleResetIceCream}
            onSubmitOrder={handleSubmitOrder}
            isOrderActive={!!activeOrder}
          />
        </>
      )}

      {/* 4. Order Evaluation Modal */}
      {evaluation && activeOrder && (
        <EvaluationModal
          evaluation={evaluation}
          order={activeOrder}
          onNextCustomer={handleNextCustomer}
        />
      )}

      {/* 5. Workday Completed Summary Modal */}
      {screen === 'DAY_SUMMARY' && (
        <DaySummaryModal
          day={gameState.currentDay}
          customersServed={gameState.dailyCustomersServed}
          earnings={gameState.dailyEarnings}
          starsSum={gameState.dailyStarsSum}
          businessStage={gameState.businessStage}
          onStartNextDay={handleStartNextDay}
        />
      )}

      {/* 6. Modals (Recipes, Shop, Missions, Victoria Profile, Minigame, Pause) */}
      {activeModal === 'RECIPES' && (
        <RecipeBookModal
          recipes={gameState.recipes}
          currentLevel={gameState.level}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'SHOP' && (
        <ShopModal
          coins={gameState.coins}
          shopItems={gameState.shopItems}
          onBuyItem={handleBuyItem}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'MISSIONS' && (
        <MissionsModal
          missions={gameState.missions}
          onClaimMission={handleClaimMission}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'CUSTOMIZE_VICTORIA' && (
        <VictoriaProfileModal
          customization={gameState.victoriaCustomization}
          achievements={gameState.achievements}
          totalServed={gameState.totalEarned}
          totalCoinsEarned={gameState.coins}
          businessStage={gameState.businessStage}
          onUpdateCustomization={(cust) =>
            setGameState((prev) => ({ ...prev, victoriaCustomization: cust }))
          }
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'MINIGAME_MEMORY' && (
        <MemoryMinigameModal
          onWinReward={handleMinigameWin}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'PAUSE' && (
        <PauseModal
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onResume={() => setActiveModal(null)}
          onRestartDay={handleRestartDay}
          onReturnTitle={() => {
            setActiveModal(null);
            setScreen('TITLE');
          }}
        />
      )}
    </div>
  );
}
