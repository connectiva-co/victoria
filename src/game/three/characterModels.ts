import * as THREE from 'three';
import { createFaceTexture, createFloralDressTexture } from './materials';
import { Customer, VictoriaCustomization } from '@/src/types/game';

export interface VictoriaCharacter {
  group: THREE.Group;
  update: (time: number, delta: number) => void;
  triggerScoop: () => void;
  triggerCelebrate: () => void;
  setExpression: (expr: 'happy' | 'smile' | 'wink') => void;
}

export interface CustomerCharacter {
  group: THREE.Group;
  customerData: Customer;
  update: (time: number, delta: number) => void;
  walkTo: (targetX: number, targetZ: number, onArrival?: () => void) => void;
  triggerCelebrate: () => void;
  triggerDisappoint: () => void;
}

export function createVictoriaModel(customization: VictoriaCustomization): VictoriaCharacter {
  const group = new THREE.Group();
  group.name = 'VictoriaHero';

  // 1. Soft contact shadow disc
  const shadowGeo = new THREE.CircleGeometry(0.48, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x27170b,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.01;
  group.add(shadowMesh);

  // 2. Texture of Victoria's official 3D Pixar avatar (image_aebcaa13.png)
  const texLoader = new THREE.TextureLoader();
  const avatarTex = texLoader.load('/assets/aistudio/image_aebcaa13.png');
  avatarTex.colorSpace = THREE.SRGBColorSpace;

  // Standee geometry with dimensional presence
  const standeeGeo = new THREE.PlaneGeometry(1.05, 1.42);
  const standeeMat = new THREE.MeshStandardMaterial({
    map: avatarTex,
    roughness: 0.45,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const standeeMesh = new THREE.Mesh(standeeGeo, standeeMat);
  standeeMesh.position.set(0, 0.71, 0);
  standeeMesh.castShadow = true;
  group.add(standeeMesh);

  // Golden Crown floating above Victoria
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 1.52, 0.02);
  const crownGeo = new THREE.CylinderGeometry(0.1, 0.14, 0.08, 5);
  const crownMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.2 });
  const crownMesh = new THREE.Mesh(crownGeo, crownMat);
  crownGroup.add(crownMesh);
  group.add(crownGroup);

  // Golden Scoop prop attached to side
  const scoopGroup = new THREE.Group();
  scoopGroup.position.set(0.42, 0.65, 0.05);
  const scoopHandleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.28, 8);
  const scoopMetalMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
  const scoopBowlGeo = new THREE.SphereGeometry(0.06, 12, 12, 0, Math.PI);
  const scoopHandle = new THREE.Mesh(scoopHandleGeo, scoopMetalMat);
  scoopHandle.rotation.z = -Math.PI / 4;
  const scoopBowl = new THREE.Mesh(scoopBowlGeo, scoopMetalMat);
  scoopBowl.position.set(0.12, 0.12, 0);
  scoopGroup.add(scoopHandle, scoopBowl);
  group.add(scoopGroup);

  // Animation states
  let isScooping = false;
  let scoopTimer = 0;
  let isCelebrating = false;
  let celebrateTimer = 0;

  const update = (time: number, delta: number) => {
    // Idle breathing & gentle sway
    const breathe = Math.sin(time * 2.5) * 0.015;
    standeeMesh.position.y = 0.71 + breathe;
    standeeMesh.rotation.z = Math.sin(time * 1.5) * 0.015;
    crownGroup.position.y = 1.52 + breathe;

    if (isScooping) {
      scoopTimer += delta * 4;
      standeeMesh.rotation.x = Math.sin(scoopTimer) * 0.2;
      scoopGroup.rotation.z = Math.sin(scoopTimer * 2) * 0.5;
      if (scoopTimer > Math.PI * 2) {
        isScooping = false;
        standeeMesh.rotation.x = 0;
        scoopGroup.rotation.z = 0;
      }
    } else if (isCelebrating) {
      celebrateTimer += delta * 5;
      group.position.y = Math.abs(Math.sin(celebrateTimer * 2)) * 0.25;
      crownGroup.rotation.y = celebrateTimer * 3;
      if (celebrateTimer > Math.PI * 3) {
        isCelebrating = false;
        group.position.y = 0;
        crownGroup.rotation.y = 0;
      }
    } else {
      scoopGroup.rotation.z = Math.sin(time * 2) * 0.08;
    }
  };

  const triggerScoop = () => {
    isScooping = true;
    scoopTimer = 0;
  };

  const triggerCelebrate = () => {
    isCelebrating = true;
    celebrateTimer = 0;
  };

  const setExpression = (_expr: 'happy' | 'smile' | 'wink') => {};

  return {
    group,
    update,
    triggerScoop,
    triggerCelebrate,
    setExpression,
  };
}

// Procedural 3D Customer Models (Distinct styles for each of the 5 customers)
export function createCustomerModel(customer: Customer): CustomerCharacter {
  const group = new THREE.Group();
  group.name = `Customer_${customer.id}`;

  // Contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.4, 20);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity: 0.25,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.01;
  group.add(shadow);

  // Clothing color palette based on customer
  let shirtColor = 0x38bdf8; // Mateo teal
  let pantsColor = 0x1e293b;
  let hairColor = 0x1c1917;
  let hairStyle = 'cap';

  if (customer.id === 'cust_sofia') {
    shirtColor = 0xf43f5e; // Pink chic
    pantsColor = 0xfef08a;
    hairColor = 0xfacc15; // Blonde bob
    hairStyle = 'bob';
  } else if (customer.id === 'cust_carlos') {
    shirtColor = 0x92400e; // Warm brown cardigan
    pantsColor = 0x475569;
    hairColor = 0x94a3b8; // Grey hair
    hairStyle = 'grandpa';
  } else if (customer.id === 'cust_lucas') {
    shirtColor = 0xef4444; // Sporty red
    pantsColor = 0x1d4ed8;
    hairColor = 0x78350f; // Brown messy
    hairStyle = 'spiky';
  } else if (customer.id === 'cust_valentina') {
    shirtColor = 0xc084fc; // Lavender
    pantsColor = 0xf472b6;
    hairColor = 0x27272a; // Dark ponytail
    hairStyle = 'ponytail';
  }

  const skinMat = new THREE.MeshStandardMaterial({
    color: customer.id === 'cust_carlos' ? 0xfcd34d : 0xfed7aa,
    roughness: 0.6,
  });
  const shirtMat = new THREE.MeshStandardMaterial({
    color: shirtColor,
    roughness: 0.7,
  });
  const pantsMat = new THREE.MeshStandardMaterial({
    color: pantsColor,
    roughness: 0.8,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: hairColor,
    roughness: 0.8,
  });

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.45, 10);
  const leftLeg = new THREE.Mesh(legGeo, pantsMat);
  leftLeg.position.set(-0.12, 0.25, 0);
  const rightLeg = new THREE.Mesh(legGeo, pantsMat);
  rightLeg.position.set(0.12, 0.25, 0);
  group.add(leftLeg, rightLeg);

  // Torso / Shirt
  const torsoGeo = new THREE.CylinderGeometry(0.2, 0.22, 0.5, 14);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.set(0, 0.72, 0);
  group.add(torso);

  // Head
  const headGeo = new THREE.SphereGeometry(0.26, 20, 20);
  const faceTex = createFaceTexture('smile');
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTex,
    roughness: 0.5,
  });
  const head = new THREE.Mesh(headGeo, faceMat);
  head.position.set(0, 1.2, 0);
  head.rotation.y = -Math.PI / 2;
  group.add(head);

  // Hair / Hats based on style
  if (hairStyle === 'cap') {
    // Mateo's cap
    const capGeo = new THREE.SphereGeometry(0.28, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.set(0, 1.25, 0);
    // Visor
    const visorGeo = new THREE.BoxGeometry(0.26, 0.03, 0.18);
    const visor = new THREE.Mesh(visorGeo, capMat);
    visor.position.set(0, 1.25, 0.22);
    group.add(cap, visor);
  } else if (hairStyle === 'bob') {
    // Sofia's blonde bob
    const bobGeo = new THREE.SphereGeometry(0.3, 16, 16);
    bobGeo.scale(1, 1.1, 1);
    const bob = new THREE.Mesh(bobGeo, hairMat);
    bob.position.set(0, 1.22, -0.04);
    group.add(bob);
  } else if (hairStyle === 'grandpa') {
    // Don Carlos grey hair & glasses
    const ringHairGeo = new THREE.TorusGeometry(0.25, 0.06, 8, 16);
    const hair = new THREE.Mesh(ringHairGeo, hairMat);
    hair.rotation.x = Math.PI / 2;
    hair.position.set(0, 1.25, 0);
    group.add(hair);

    // Glasses
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
    const frameGeo = new THREE.TorusGeometry(0.06, 0.015, 6, 12);
    const leftGlass = new THREE.Mesh(frameGeo, glassMat);
    leftGlass.position.set(-0.08, 1.22, 0.25);
    const rightGlass = new THREE.Mesh(frameGeo, glassMat);
    rightGlass.position.set(0.08, 1.22, 0.25);
    group.add(leftGlass, rightGlass);
  } else {
    // Default nice hair
    const hairGeo = new THREE.SphereGeometry(0.28, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.6);
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.set(0, 1.24, -0.02);
    group.add(hair);
  }

  // Arms
  const armGeo = new THREE.CylinderGeometry(0.05, 0.045, 0.35, 8);
  const leftArm = new THREE.Mesh(armGeo, shirtMat);
  leftArm.position.set(-0.28, 0.75, 0);
  const rightArm = new THREE.Mesh(armGeo, shirtMat);
  rightArm.position.set(0.28, 0.75, 0);
  group.add(leftArm, rightArm);

  let isWalking = false;
  let walkTarget = new THREE.Vector3();
  let onWalkArrival: (() => void) | null = null;
  let isCelebrating = false;
  let celebrateTimer = 0;

  const update = (time: number, delta: number) => {
    if (isWalking) {
      const stepSpeed = 2.2 * delta;
      const currentPos = group.position;
      const dist = currentPos.distanceTo(walkTarget);

      // Walk cycle animation (swinging legs & arms)
      const legSwing = Math.sin(time * 10) * 0.45;
      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -legSwing;
      leftArm.rotation.x = -legSwing * 0.7;
      rightArm.rotation.x = legSwing * 0.7;

      if (dist < stepSpeed) {
        group.position.copy(walkTarget);
        isWalking = false;
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
        if (onWalkArrival) onWalkArrival();
      } else {
        const dir = walkTarget.clone().sub(currentPos).normalize();
        group.position.addScaledVector(dir, stepSpeed);
        // Face target direction
        group.rotation.y = Math.atan2(dir.x, dir.z);
      }
    } else if (isCelebrating) {
      celebrateTimer += delta * 6;
      group.position.y = Math.abs(Math.sin(celebrateTimer * 2)) * 0.25;
      leftArm.rotation.z = Math.sin(celebrateTimer * 4) * 0.8 + 0.8;
      rightArm.rotation.z = -Math.sin(celebrateTimer * 4) * 0.8 - 0.8;
      if (celebrateTimer > Math.PI * 3) {
        isCelebrating = false;
        group.position.y = 0;
        leftArm.rotation.z = 0;
        rightArm.rotation.z = 0;
      }
    } else {
      // Idle breathing
      const idleBob = Math.sin(time * 2.5) * 0.02;
      torso.position.y = 0.72 + idleBob;
      head.position.y = 1.2 + idleBob;
    }
  };

  const walkTo = (targetX: number, targetZ: number, onArrival?: () => void) => {
    walkTarget.set(targetX, 0, targetZ);
    isWalking = true;
    onWalkArrival = onArrival || null;
  };

  const triggerCelebrate = () => {
    isCelebrating = true;
    celebrateTimer = 0;
  };

  const triggerDisappoint = () => {
    // Subtle head shake
    head.rotation.y = -Math.PI / 2 + 0.2;
    setTimeout(() => {
      head.rotation.y = -Math.PI / 2 - 0.2;
      setTimeout(() => {
        head.rotation.y = -Math.PI / 2;
      }, 150);
    }, 150);
  };

  return {
    group,
    customerData: customer,
    update,
    walkTo,
    triggerCelebrate,
    triggerDisappoint,
  };
}
