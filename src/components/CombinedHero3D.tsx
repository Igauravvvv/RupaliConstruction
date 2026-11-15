import { useRef, useState, useEffect, type ReactNode, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const FINISH = 26;
const stages = ["01 / Foundations", "02 / Structure", "03 / Upper floors", "04 / Finishing touches", "05 / Ready for life"];
type Clock = RefObject<number>;

function Solid({ at, size, color = "#e4d6bd", glass = false, finish, round = false }: { at: [number, number, number]; size: [number, number, number]; color?: string; glass?: boolean; round?: boolean; finish?: { clock: Clock; height: number; color: string } }) {
  const material = useRef<THREE.MeshStandardMaterial>(null);
  const base = new THREE.Color(color);
  const completed = new THREE.Color(finish?.color ?? color);
  useFrame(() => {
    if (!finish || !material.current) return;
    const start = 18 + finish.height * 6;
    const progress = THREE.MathUtils.smoothstep(finish.clock.current, start, start + 0.65);
    material.current.color.copy(base).lerp(completed, progress);
    material.current.roughness = THREE.MathUtils.lerp(glass ? 0.3 : 0.7, glass ? 0.08 : 0.45, progress);
  });
  return <mesh position={at}>
    {round ? <cylinderGeometry args={[size[0] / 2, size[0] / 2, size[1], 40]} /> : <boxGeometry args={size} />}
    <meshStandardMaterial ref={material} color={color} roughness={glass ? 0.18 : 0.7} metalness={glass ? 0.25 : 0.06} transparent={glass} opacity={glass ? 0.78 : 1} />
    <Edges color={glass ? "#305563" : "#756952"} transparent opacity={glass ? 0.65 : 0.18} />
  </mesh>;
}

// Each part travels down the crane line and settles into its final position.
// Columns rise from their footing; no whole-building scale or pop-in animation.
function BuildPart({ clock, delay, duration = 1.4, rise = false, anchor = 0, children }: { clock: Clock; delay: number; duration?: number; rise?: boolean; anchor?: number; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const progress = THREE.MathUtils.smoothstep(clock.current, delay, delay + duration);
    ref.current.visible = clock.current >= delay;
    ref.current.position.y = anchor + (rise ? 0 : (1 - progress) * 5);
    ref.current.scale.y = rise ? Math.max(0.001, progress) : 1;
  });
  return <group ref={ref} visible={false}>{children}</group>;
}

function SiteTools({ clock, height, x, finish = 18 }: { clock: Clock; height: number; x: number; finish?: number }) {
  const crane = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Group>(null);
  const hoist = useRef<THREE.Group>(null);
  useFrame(() => {
    const t = clock.current;
    if (crane.current) {
      crane.current.visible = t < finish + 2;
      crane.current.position.y = 0;
      crane.current.scale.y = 1 - THREE.MathUtils.smoothstep(t, finish, finish + 2);
    }
    if (cable.current) cable.current.rotation.y = Math.sin(t * 0.6) * 0.16;
    const workingHeight = Math.min(height - 3, 1 + t / finish * (height - 4));
    if (hoist.current) hoist.current.position.y = workingHeight;

  });
  return <group>
    <group ref={crane} position={[x, 0, -2]}>
      <Solid at={[0, height / 2, 0]} size={[0.35, height, 0.35]} color="#b48547" />
      {Array.from({ length: Math.ceil(height / 1.5) }, (_, i) => <Solid key={i} at={[0, i * 1.5 + 0.4, 0]} size={[0.8, 0.09, 0.7]} color="#c79a5d" />)}
      <group ref={cable} position={[0, height, 0]}>
        <Solid at={[-2.1, 0, 0]} size={[7, 0.3, 0.4]} color="#c79a5d" />
        <Solid at={[1.25, -0.4, 0]} size={[1.1, 0.65, 1]} color="#344d54" />
        <mesh position={[-3.7, -height / 2, 0]}><cylinderGeometry args={[0.025, 0.025, height, 6]} /><meshStandardMaterial color="#526368" /></mesh>
      </group>
      <group ref={hoist} position={[-3.7, 1, 0]}><Solid at={[0, 0, 0]} size={[1.5, 0.15, 1]} color="#b48547" /></group>
    </group>

  </group>;
}

function FinishingBrush({ clock, height, width, z, lane = 0, offset = 0 }: { clock: Clock; height: number; width: number; z: number; lane?: number; offset?: number }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const progress = THREE.MathUtils.clamp((clock.current - 18 - offset) / 6, 0, 1);
    ref.current.visible = clock.current >= 18 + offset && clock.current < 24.8 + offset;
    ref.current.position.set(lane + Math.sin(progress * Math.PI * 3) * 0.5, progress * height + 0.2, z);
    ref.current.rotation.z = -0.15 + Math.sin(progress * Math.PI * 3) * 0.12;
    ref.current.scale.setScalar(1 - THREE.MathUtils.smoothstep(clock.current, 24 + offset, 24.8 + offset));
  });
  return <group ref={ref} visible={false}>
    <Solid at={[0, -0.75, 0.08]} size={[0.2, 1.2, 0.22]} color="#654939" />
    <Solid at={[0, -0.05, 0]} size={[width, 0.34, 0.3]} color="#b7b7b1" />
    <Solid at={[0, 0.36, 0]} size={[width * 0.92, 0.5, 0.27]} color="#ede7d9" />
    {Array.from({ length: 6 }, (_, i) => <Solid key={i} at={[-width * 0.38 + i * width * 0.15, 0.38, 0.15]} size={[0.018, 0.4, 0.018]} color="#a89e8c" />)}
  </group>;
}

function CompanionTower({ clock, position, floors, delay, color, round = false }: { clock: Clock; position: [number, number, number]; floors: number; delay: number; color: string; round?: boolean }) {
  return <group position={position}>
    {Array.from({ length: floors }, (_, i) => <group key={i}>
      <BuildPart clock={clock} delay={delay + i * 0.9} duration={1.1} rise anchor={i * 1.2}>
        <Solid at={[0, 0.55, 0]} size={[2.6, 1.1, 2.8]} round={round} color={color} glass finish={{clock, height: (i + 0.5) * 1.2 / 20, color: color === "#82998b" ? "#806b67" : "#5e6473"}} />
        {(round ? Array.from({length: 8}, (_, n) => [Math.sin(n * Math.PI / 4) * 1.3, Math.cos(n * Math.PI / 4) * 1.3]) : [[-1.25, 1.45], [1.25, 1.45]]).map(([x,z], n) => <Solid key={n} at={[x, 0.6, z]} size={[0.08, 1.2, 0.08]} color="#b9b7b2" />)}
      </BuildPart>
      <BuildPart clock={clock} delay={delay + 0.5 + i * 0.9} duration={1.2}>
        <Solid at={[0, (i + 1) * 1.2, 0]} size={[3, 0.18, 3.2]} round={round} color="#c6bdb5" />
      </BuildPart>
    </group>)}
    <BuildPart clock={clock} delay={17.5}>
      <Solid at={[0, floors * 1.2 + 0.35, 0]} size={[2, 0.65, 2.2]} round={round} color="#b0b9ac" />
      <Solid at={[0, floors * 1.2 + 0.75, 0]} size={[2.7, 0.15, 2.8]} round={round} color="#8a7e7c" />
    </BuildPart>
  </group>;
}

function Skyline({ clock }: { clock: Clock }) {
  const { viewport, size } = useThree();
  const desktop = size.width >= 1024;
  const phone = size.width < 640;
  const scale = Math.min(viewport.width * (desktop ? 0.0148 : phone ? 0.031 : 0.022), viewport.height * (desktop ? 0.033 : 0.036));
  return <group position={[-viewport.width * (desktop ? 0.335 : phone ? 0.24 : 0.29), -viewport.height * (phone ? 0.17 : 0.25), 0]} scale={scale} rotation={[0, 0.22, 0]}>
    <BuildPart clock={clock} delay={0} rise><Solid at={[0, -0.25, 0]} size={[14.5, 0.5, 11]} color="#bac3bc" /></BuildPart>
    {Array.from({ length: 15 }, (_, i) => <group key={i} rotation={[0, i * 0.045, 0]}>
      <BuildPart clock={clock} delay={1 + i * 0.88} duration={1.05} rise anchor={i * 1.2}>
        {[[-1.7, -1.7], [1.7, -1.7], [-1.7, 1.7], [1.7, 1.7]].map(([x, z], n) => <Solid key={n} at={[x, 0.6, z]} size={[0.22, 1.2, 0.22]} color="#52656b" />)}
      </BuildPart>
      <BuildPart clock={clock} delay={1.4 + i * 0.88} duration={1.1}>
        <Solid at={[0, (i + 1) * 1.2, 0]} size={[4.3, 0.22, 4.3]} />
      </BuildPart>
      <BuildPart clock={clock} delay={14 + i * 0.25} duration={0.8} rise anchor={i * 1.2}>
        <Solid at={[0, 0.65, 0]} size={[3.65, 0.94, 3.65]} color="#74969b" glass finish={{clock, height: (i + 0.5) * 1.2 / 20, color: "#353d4c"}} />
      </BuildPart>
    </group>)}
    <BuildPart clock={clock} delay={18.5}><Solid at={[0, 18.6, 0]} size={[4.5, 0.3, 4.5]} color="#72727a" /></BuildPart>
    <CompanionTower clock={clock} position={[-4.5, 0, 1]} floors={10} delay={2} color="#82998b" />
    <CompanionTower clock={clock} position={[4, 0, -3]} floors={12} delay={3} color="#7b939e" round />
    {Array.from({ length: 15 }, (_, i) => <group key={`finish-${i}`} rotation={[0, i * 0.045, 0]}>
      <BuildPart clock={clock} delay={18 + i * 1.2 / 20 * 6} duration={0.5} rise anchor={i * 1.2}>
        {[-1.2, 0, 1.2].map(x => <Solid key={x} at={[x, 0.6, 1.86]} size={[0.06, 1.05, 0.07]} color="#9b9da8" />)}
        <Solid at={[0, 0.16, 1.88]} size={[3.65, 0.035, 0.04]} color="#ded5c3" />
      </BuildPart>
    </group>)}
    <SiteTools clock={clock} height={22} x={5} finish={16} />
    <FinishingBrush clock={clock} height={20} width={1.6} z={5.8} lane={-1.5} />
    <FinishingBrush clock={clock} height={17} width={1.4} z={5.8} lane={3.7} offset={0.45} />
  </group>;
}

function Villa({ clock }: { clock: Clock }) {
  const { viewport, size } = useThree();
  const desktop = size.width >= 1024;
  const phone = size.width < 640;
  const scale = Math.min(viewport.width * (desktop ? (size.width < 1280 ? 0.012 : 0.015) : phone ? 0.031 : 0.026), viewport.height * 0.05);
  return <group position={[viewport.width * (desktop ? 0.30 : phone ? 0.20 : 0.23), -viewport.height * (phone ? 0.24 : 0.22), 0]} scale={scale} rotation={[0.04, -0.55, 0]}>
    <BuildPart clock={clock} delay={0.3} rise><Solid at={[0, -0.25, 0]} size={[14, 0.5, 11]} color="#b9c0b2" /></BuildPart>
    <BuildPart clock={clock} delay={2} rise>
      {[-4.5, 0, 4.5].map(x => <group key={x}><Solid at={[x, 1.75, -3]} size={[0.35, 3.5, 0.35]} color="#56656a" /><Solid at={[x, 1.75, 3]} size={[0.35, 3.5, 0.35]} color="#56656a" /></group>)}
      <Solid at={[-3.3, 1.75, -0.5]} size={[3.5, 3.5, 6]} finish={{clock, height: 1.75 / 8.5, color: "#9c8573"}} />
    </BuildPart>
    <BuildPart clock={clock} delay={4.5}><Solid at={[0, 3.6, 0]} size={[11.5, 0.4, 8]} /></BuildPart>
    <BuildPart clock={clock} delay={7} rise anchor={3.75}>
      {[-4, 0.5, 4].map(x => <group key={x}><Solid at={[x, 1.75, -2.5]} size={[0.3, 3.5, 0.3]} color="#56656a" /><Solid at={[x, 1.75, 2.5]} size={[0.3, 3.5, 0.3]} color="#56656a" /></group>)}
      <Solid at={[-3, 1.75, -0.5]} size={[3.4, 3.5, 6]} finish={{clock, height: 5.5 / 8.5, color: "#9c8573"}} />
    </BuildPart>
    <BuildPart clock={clock} delay={9.5}><Solid at={[0.5, 7.4, 0]} size={[12, 0.45, 8.5]} /></BuildPart>
    <BuildPart clock={clock} delay={12} duration={2}>
      <Solid at={[1.6, 1.8, 2.9]} size={[5.7, 3.15, 0.15]} color="#719c9d" glass finish={{clock, height: 1.8 / 8.5, color: "#434751"}} />
      <Solid at={[1.8, 5.5, 2.65]} size={[5.7, 3.1, 0.15]} color="#719c9d" glass finish={{clock, height: 5.5 / 8.5, color: "#434751"}} />
      {[0, 1.8, 3.6].map(x => <group key={x}><Solid at={[x, 1.8, 3]} size={[0.1, 3.2, 0.12]} color="#354950" /><Solid at={[x, 5.5, 2.8]} size={[0.1, 3.2, 0.12]} color="#354950" /></group>)}
    </BuildPart>
    <BuildPart clock={clock} delay={15}>
      <Solid at={[0.5, 4, 4]} size={[11.5, 0.2, 2]} color="#5e4c42" />
      <Solid at={[0.5, 4.6, 4.85]} size={[11, 1.1, 0.09]} color="#929ba5" glass />
      <Solid at={[0.5, 5.2, 4.85]} size={[11.4, 0.09, 0.12]} color="#526368" />
      {Array.from({ length: 9 }, (_, i) => <Solid key={i} at={[-4.6 + i * 0.3, 5.5, 2.65]} size={[0.13, 3.2, 0.2]} color="#74604e" />)}
    </BuildPart>
    <BuildPart clock={clock} delay={24} duration={1} rise>
      <Solid at={[3, 0.15, 4.5]} size={[5.5, 0.15, 2]} color="#6ea9a6" glass />
      {[-5, -3, -1].map(x => <group key={x}><Solid at={[x, 0.5, 4]} size={[1.1, 0.9, 1]} color="#6d8260" /><Solid at={[x, 0.15, 4]} size={[1.3, 0.3, 1.2]} color="#a58d70" /></group>)}
    </BuildPart>
    <BuildPart clock={clock} delay={22} duration={1} rise anchor={3.8}>
      <Solid at={[1.5, 0, 3.2]} size={[5.8, 0.055, 0.15]} color="#edc38a" />
      <Solid at={[0.5, 3.35, 2.8]} size={[10.5, 0.07, 0.16]} color="#a69d91" />
      {[-3.8, -2.8, -1.8].map(x => <Solid key={x} at={[x, -1.7, 2.6]} size={[0.055, 3.1, 0.09]} color="#5c4b40" />)}
    </BuildPart>
    <SiteTools clock={clock} height={11} x={7} finish={16} />
    <FinishingBrush clock={clock} height={8.5} width={1.25} z={5.5} lane={-2.5} />
    <FinishingBrush clock={clock} height={8.5} width={1.25} z={5.5} lane={2.4} offset={0.45} />
  </group>;
}

function BuildScene({ active, still, fps, onStage }: { active: boolean; still: boolean; fps: number; onStage: (stage: number) => void }) {
  const clock = useRef(still ? FINISH : 0);
  const stage = useRef(-1);
  const invalidate = useThree(state => state.invalidate);
  useEffect(() => { clock.current = still ? FINISH : 0; stage.current = -1; invalidate(); }, [still, invalidate]);
  useEffect(() => {
    if (!active || still) return;
    const timer = window.setInterval(() => { if (clock.current < FINISH) invalidate(); }, 1000 / fps);
    return () => window.clearInterval(timer);
  }, [active, still, fps, invalidate]);
  useFrame((_, delta) => {
    if (active && !still) clock.current = Math.min(FINISH, clock.current + Math.min(delta, 0.1) * 1.7);
    const next = clock.current < 3 ? 0 : clock.current < 7 ? 1 : clock.current < 13 ? 2 : clock.current < 25 ? 3 : 4;
    if (stage.current !== next) { stage.current = next; onStage(next); }
  });
  return <><Skyline clock={clock} /><Villa clock={clock} /></>;
}

export default function CombinedHero3D({ integrated = false }: { integrated?: boolean }) {
  const [isInView, setIsInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [compact, setCompact] = useState(true);
  const [stage, setStage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateSize = () => setCompact(media.matches);
    updateSize(); media.addEventListener("change", updateSize);
    const update = () => setPageVisible(!document.hidden);
    update(); document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), { rootMargin: "60px" });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => { document.removeEventListener("visibilitychange", update); media.removeEventListener("change", updateSize); observer.disconnect(); };
  }, []);
  return <div ref={containerRef} className={`relative h-full w-full overflow-hidden ${integrated ? "" : "rounded-3xl bg-[#e8e3d9]"}`}>
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {/* Supersample fine mobile details, with a 2x cap to bound GPU work. */}
      <Canvas frameloop="demand" dpr={compact ? [1.5, 2] : [1, 1.35]} camera={{ position: [0, 7, 27], fov: 40 }} gl={{ powerPreference: "low-power", antialias: true, alpha: true, stencil: false }} fallback={<img src="/villa_finished.webp" alt="" className="h-full w-full object-contain" />}>
        <ambientLight intensity={1.25} /><hemisphereLight args={["#fff9ed", "#8d9c9c", 1.5]} />
        <directionalLight position={[-8, 15, 12]} intensity={2.6} color="#fff0d4" />
        <directionalLight position={[12, 6, -4]} intensity={1.1} color="#b9d6df" />
        <BuildScene active={isInView && pageVisible} still={!!reduceMotion} fps={compact ? 24 : 30} onStage={setStage} />
      </Canvas>
    </div>
    <div className="absolute left-12 right-20 bottom-6 flex items-center justify-between gap-3 border-t border-[#69756a]/20 py-3 text-[9px] font-medium uppercase tracking-[0.13em] text-[#56605c] sm:inset-x-12 sm:bottom-2 sm:text-[10px] lg:inset-x-[8%] lg:bottom-14">
      <div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#b77b43]" /><span>{stages[stage]}</span></div>
    </div>
  </div>;
}
