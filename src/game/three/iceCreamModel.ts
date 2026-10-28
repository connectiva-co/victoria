import * as THREE from 'three';
import { ContainerType, FlavorId, PreparedIceCream, ToppingId } from '@/src/types/game';
import { createWaffleTexture } from './materials';
import { INITIAL_FLAVORS } from '@/src/game/data/gameData';

export function createIceCream3D(prepared: PreparedIceCream, isSoftwareGl: boolean = false): THREE.Group {
  const root = new THREE.Group();
  root.name = 'IceCream3D';

  // Base contact shadow
  const shadowGeo = new THREE.CircleGeometry(0.3, 16);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x27170b,
    transparent: true,
    opacity: 0.3,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.005;
  root.add(shadow);

  if (!prepared.container) {
    return root;
  }

  let containerHeight = 0.5;

  // 1. Container Mesh
  if (prepared.container === 'cono') {
    // Waffle Cone
    const coneGeo = new THREE.ConeGeometry(0.24, 0.65, 18, 1, true);
    const waffleMat = new THREE.MeshStandardMaterial({
      map: createWaffleTexture(),
      roughness: 0.7,
      metalness: 0.05,
    });
    const cone = new THREE.Mesh(coneGeo, waffleMat);
    cone.rotation.x = Math.PI;
    cone.position.set(0, 0.325, 0);
    root.add(cone);

    // Rim ring
    const rimGeo = new THREE.TorusGeometry(0.24, 0.02, 8, 18);
    const rim = new THREE.Mesh(rimGeo, waffleMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 0.65, 0);
    root.add(rim);

    containerHeight = 0.65;
  } else if (prepared.container === 'vaso') {
    // Pastel Cup
    const cupGeo = new THREE.CylinderGeometry(0.32, 0.24, 0.45, 20, 1, true);
    const cupMat = new THREE.MeshStandardMaterial({
      color: 0xfce7f3, // Soft pink cup
      roughness: 0.4,
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    cup.position.set(0, 0.225, 0);
    root.add(cup);

    // Cup rim
    const rimGeo = new THREE.TorusGeometry(0.32, 0.025, 8, 20);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.set(0, 0.45, 0);
    root.add(rim);

    containerHeight = 0.45;
  } else if (prepared.container === 'copa') {
    // Glass Coupe
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: isSoftwareGl ? 0 : 0.9,
      transparent: true,
      opacity: isSoftwareGl ? 0.35 : 0.85,
      roughness: 0.1,
      ior: 1.5,
    });

    // Base foot
    const footGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.03, 16);
    const foot = new THREE.Mesh(footGeo, glassMat);
    foot.position.set(0, 0.015, 0);

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 12);
    const stem = new THREE.Mesh(stemGeo, glassMat);
    stem.position.set(0, 0.14, 0);

    // Bowl
    const bowlGeo = new THREE.SphereGeometry(0.35, 16, 12, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5);
    const bowl = new THREE.Mesh(bowlGeo, glassMat);
    bowl.position.set(0, 0.45, 0);

    root.add(foot, stem, bowl);
    containerHeight = 0.45;
  } else if (prepared.container === 'waffle') {
    // Ceramic plate base
    const plateGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.03, 24);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xfffafa,
      roughness: 0.2,
      metalness: 0.05,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, 0.015, 0);

    // Decorative pink rim on plate
    const plateRimGeo = new THREE.TorusGeometry(0.48, 0.015, 8, 24);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.3 });
    const plateRim = new THREE.Mesh(plateRimGeo, rimMat);
    plateRim.rotation.x = Math.PI / 2;
    plateRim.position.set(0, 0.03, 0);

    // Thick Belgian Waffle disc with waffle grid texture
    const waffleGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.07, 20);
    const waffleMat = new THREE.MeshStandardMaterial({
      map: createWaffleTexture(),
      roughness: 0.8,
      metalness: 0.05,
    });
    const waffleMesh = new THREE.Mesh(waffleGeo, waffleMat);
    waffleMesh.position.set(0, 0.065, 0);

    // Melting Butter Pat
    const butterGeo = new THREE.BoxGeometry(0.08, 0.03, 0.08);
    const butterMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
    const butterMesh = new THREE.Mesh(butterGeo, butterMat);
    butterMesh.position.set(0.24, 0.11, 0.1);
    butterMesh.rotation.y = 0.4;

    root.add(plate, plateRim, waffleMesh, butterMesh);
    containerHeight = 0.1;
  }

  // 2. Ice Cream Scoops
  const scoopPositions: THREE.Vector3[] = [];
  const scoopRadius = 0.26;

  prepared.scoops.forEach((scoop, index) => {
    const flavorInfo = INITIAL_FLAVORS.find((f) => f.id === scoop.flavor) || INITIAL_FLAVORS[0];

    const scoopGeo = new THREE.SphereGeometry(scoopRadius, 16, 16);
    // Subtle organic procedural deformation
    const posAttr = scoopGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const vz = posAttr.getZ(i);
      const noise = (Math.sin(vx * 15) * Math.cos(vy * 15) * Math.sin(vz * 15)) * 0.018;
      posAttr.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    scoopGeo.computeVertexNormals();

    const scoopMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(flavorInfo.color),
      roughness: 0.85,
      metalness: 0.02,
    });

    const scoopMesh = new THREE.Mesh(scoopGeo, scoopMat);

    // Stacking offset
    let yPos = containerHeight + index * (scoopRadius * 1.35);
    let xOffset = 0;
    let zOffset = 0;

    if (prepared.container === 'copa' && prepared.scoops.length === 3) {
      // 3-scoop pyramid layout in copa
      if (index === 0) {
        xOffset = -0.12;
        yPos = containerHeight + 0.1;
      } else if (index === 1) {
        xOffset = 0.12;
        yPos = containerHeight + 0.1;
      } else {
        xOffset = 0;
        yPos = containerHeight + 0.32;
      }
    } else if (prepared.container === 'waffle') {
      if (prepared.scoops.length === 1) {
        xOffset = 0;
        yPos = containerHeight + scoopRadius * 0.8;
      } else if (prepared.scoops.length === 2) {
        xOffset = index === 0 ? -0.16 : 0.16;
        yPos = containerHeight + scoopRadius * 0.8;
      } else if (prepared.scoops.length >= 3) {
        if (index === 0) {
          xOffset = -0.15;
          zOffset = 0.04;
          yPos = containerHeight + scoopRadius * 0.8;
        } else if (index === 1) {
          xOffset = 0.15;
          zOffset = 0.04;
          yPos = containerHeight + scoopRadius * 0.8;
        } else {
          xOffset = 0;
          zOffset = -0.05;
          yPos = containerHeight + scoopRadius * 1.55;
        }
      }
    }

    scoopMesh.position.set(xOffset, yPos, zOffset);
    root.add(scoopMesh);
    scoopPositions.push(scoopMesh.position);
  });

  const topScoopPos = scoopPositions.length > 0 ? scoopPositions[scoopPositions.length - 1] : new THREE.Vector3(0, containerHeight, 0);

  // 3. Sauces
  if (prepared.sauce && scoopPositions.length > 0) {
    let sauceColor = 0x3b1c09; // chocolate
    if (prepared.sauce === 'arequipe') sauceColor = 0xb45309;
    if (prepared.sauce === 'fresa') sauceColor = 0xe11d48;

    const sauceMat = new THREE.MeshStandardMaterial({
      color: sauceColor,
      roughness: 0.18,
      metalness: 0.1,
    });

    // Drizzled rings/drops over top scoop
    const sauceGeo = new THREE.TorusGeometry(scoopRadius * 0.75, 0.035, 8, 16);
    const sauceMesh = new THREE.Mesh(sauceGeo, sauceMat);
    sauceMesh.rotation.x = Math.PI / 2.2;
    sauceMesh.position.set(topScoopPos.x, topScoopPos.y + scoopRadius * 0.6, topScoopPos.z);
    root.add(sauceMesh);

    // Second diagonal drizzle
    const sauceGeo2 = new THREE.TorusGeometry(scoopRadius * 0.65, 0.025, 8, 14);
    const sauceMesh2 = new THREE.Mesh(sauceGeo2, sauceMat);
    sauceMesh2.rotation.x = Math.PI / 2.8;
    sauceMesh2.rotation.y = Math.PI / 3;
    sauceMesh2.position.set(topScoopPos.x, topScoopPos.y + scoopRadius * 0.75, topScoopPos.z);
    root.add(sauceMesh2);
  }

  // 4. Toppings
  prepared.toppings.forEach((topId) => {
    if (topId === 'chispas') {
      // Instanced sprinkles
      const sprinkleGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.05, 5);
      const sprinkleColors = [0x06b6d4, 0xfacc15, 0xec4899, 0xa855f7, 0x10b981];

      for (let i = 0; i < 28; i++) {
        const c = sprinkleColors[i % sprinkleColors.length];
        const sMat = new THREE.MeshStandardMaterial({ color: c, roughness: 0.4 });
        const sMesh = new THREE.Mesh(sprinkleGeo, sMat);

        const theta = (i * 2.4);
        const r = (i / 28) * (scoopRadius * 0.85);
        const sx = topScoopPos.x + Math.cos(theta) * r;
        const sz = topScoopPos.z + Math.sin(theta) * r;
        const sy = topScoopPos.y + Math.sqrt(Math.max(0, scoopRadius * scoopRadius - (sx * sx + sz * sz))) + 0.01;

        sMesh.position.set(sx, sy, sz);
        sMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        root.add(sMesh);
      }
    } else if (topId === 'cereza') {
      // Red cherry on top with stem
      const cherryGroup = new THREE.Group();
      cherryGroup.position.set(topScoopPos.x, topScoopPos.y + scoopRadius + 0.04, topScoopPos.z);

      const cherryGeo = new THREE.SphereGeometry(0.075, 16, 16);
      const cherryMat = new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        roughness: 0.15,
        metalness: 0.1,
      });
      const cherry = new THREE.Mesh(cherryGeo, cherryMat);
      cherryGroup.add(cherry);

      // Curved green stem
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.05, 0),
        new THREE.Vector3(0.04, 0.14, 0),
        new THREE.Vector3(0.09, 0.22, 0.02),
      ]);
      const stemGeo = new THREE.TubeGeometry(curve, 8, 0.01, 6, false);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      cherryGroup.add(stem);

      root.add(cherryGroup);
    } else if (topId === 'crema_batida') {
      // Swirled whipped cream
      const creamGeo = new THREE.ConeGeometry(0.18, 0.25, 12);
      const creamMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.3,
      });
      const cream = new THREE.Mesh(creamGeo, creamMat);
      cream.position.set(topScoopPos.x, topScoopPos.y + scoopRadius + 0.08, topScoopPos.z);
      root.add(cream);
    } else if (topId === 'galleta') {
      // Chocolate cookie wafer stuck diagonally
      const cookieGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.03, 14);
      const cookieMat = new THREE.MeshStandardMaterial({
        color: 0x3d1c0b,
        roughness: 0.9,
      });
      const cookie = new THREE.Mesh(cookieGeo, cookieMat);
      cookie.position.set(topScoopPos.x + 0.16, topScoopPos.y + scoopRadius * 0.6, topScoopPos.z + 0.06);
      cookie.rotation.set(0.4, 0.3, -0.6);
      root.add(cookie);
    } else if (topId === 'waffle_crisp') {
      // Waffle fan
      const crispGeo = new THREE.BoxGeometry(0.02, 0.28, 0.14);
      const crispMat = new THREE.MeshStandardMaterial({
        map: createWaffleTexture(),
        roughness: 0.7,
      });
      const crisp = new THREE.Mesh(crispGeo, crispMat);
      crisp.position.set(topScoopPos.x - 0.16, topScoopPos.y + scoopRadius * 0.7, topScoopPos.z);
      crisp.rotation.set(0.2, 0.2, 0.5);
      root.add(crisp);
    } else if (topId === 'fresa_fresca') {
      // Strawberry slice
      const strawGeo = new THREE.ConeGeometry(0.08, 0.14, 10);
      const strawMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
      const straw = new THREE.Mesh(strawGeo, strawMat);
      straw.position.set(topScoopPos.x, topScoopPos.y + scoopRadius + 0.05, topScoopPos.z + 0.08);
      straw.rotation.set(0.3, 0, 0.3);
      root.add(straw);
    }
  });

  return root;
}
