"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AircraftState } from "./Aircraft";

/**
 * 三人称追従カメラ
 * 飛行機の後方上方からスムーズに追従する
 */

interface FollowCameraProps {
  stateRef: React.RefObject<AircraftState>;
}

// カメラのオフセット（機体ローカル座標系で後方上方）
const CAMERA_OFFSET = new THREE.Vector3(0, 5, 18);
// カメラ注視点のオフセット（機体の少し前方）
const LOOK_OFFSET = new THREE.Vector3(0, 1, -15);
// カメラの追従スムーズ係数（大きいほど速く追従）
const LERP_FACTOR = 3.0;

export default function FollowCamera({ stateRef }: FollowCameraProps) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 55, 18));
  const targetLookAt = useRef(new THREE.Vector3(0, 50, -15));

  useFrame((_, delta) => {
    if (!stateRef.current) return;

    const dt = Math.min(delta, 0.05);
    const state = stateRef.current;

    // 機体のクォータニオンを取得
    const quat = new THREE.Quaternion().setFromEuler(state.rotation);

    // カメラの目標位置を計算（機体後方上方）
    const offset = CAMERA_OFFSET.clone().applyQuaternion(quat);
    const desiredPosition = state.position.clone().add(offset);

    // 注視点の目標位置を計算（機体前方）
    const lookOffset = LOOK_OFFSET.clone().applyQuaternion(quat);
    const desiredLookAt = state.position.clone().add(lookOffset);

    // スムーズ補間（lerp）
    const lerpAmount = 1 - Math.exp(-LERP_FACTOR * dt);
    targetPosition.current.lerp(desiredPosition, lerpAmount);
    targetLookAt.current.lerp(desiredLookAt, lerpAmount);

    // 地面より下に行かないようにする
    targetPosition.current.y = Math.max(3, targetPosition.current.y);

    // カメラに適用
    camera.position.copy(targetPosition.current);
    camera.lookAt(targetLookAt.current);
  });

  return null;
}
