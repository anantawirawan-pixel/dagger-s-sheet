import { DOMAIN_ACCENT_HEX } from "@/data/spells";
import type { SpellDomain } from "@/data/spells";
import { useEffect, useRef } from "react";

interface SpellCastAnimationProps {
  domain: string;
  onComplete: () => void;
}

// Helper: determine animation class per domain
function getDomainAnimClass(domain: string): string {
  const map: Record<string, string> = {
    Arcana: "spell-anim-arcana",
    Blade: "spell-anim-blade",
    Bone: "spell-anim-bone",
    Codex: "spell-anim-codex",
    Grace: "spell-anim-grace",
    Midnight: "spell-anim-midnight",
    Sage: "spell-anim-sage",
    Splendor: "spell-anim-splendor",
    Valor: "spell-anim-valor",
  };
  return map[domain] ?? "spell-anim-arcana";
}

// Generate particles for each domain's visual style
function DomainParticles({ domain, color }: { domain: string; color: string }) {
  switch (domain) {
    case "Arcana": {
      // Expanding concentric rune rings
      return (
        <>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="spell-rune-ring"
              style={{
                border: `2px solid ${color}`,
                boxShadow: `0 0 18px 4px ${color}88`,
                animationDelay: `${i * 0.18}s`,
                width: `${120 + i * 120}px`,
                height: `${120 + i * 120}px`,
              }}
            />
          ))}
          {[...Array(8)].map((_, i) => (
            <div
              key={`r${i}`}
              className="spell-rune-symbol"
              style={{
                color,
                transform: `rotate(${i * 45}deg) translateY(-${60 + Math.random() * 80}px)`,
                animationDelay: `${i * 0.08}s`,
                fontSize: `${14 + Math.floor(Math.random() * 10)}px`,
              }}
            >
              {["ᚠ", "ᚢ", "ᚦ", "ᚨ", "ᚱ", "ᚲ", "ᚷ", "ᚹ"][i]}
            </div>
          ))}
        </>
      );
    }
    case "Blade": {
      // Diagonal sword slash streaks
      return (
        <>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="spell-slash-line"
              style={{
                background: `linear-gradient(135deg, transparent 30%, ${color} 50%, ${color}cc 55%, transparent 70%)`,
                boxShadow: `0 0 12px 2px ${color}88`,
                animationDelay: `${i * 0.15}s`,
                top: `${30 + i * 15}%`,
                width: "160%",
                left: "-30%",
              }}
            />
          ))}
        </>
      );
    }
    case "Bone": {
      // Scattered bone-white particles spreading outward
      return (
        <>
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * 360;
            const dist = 80 + Math.floor((i * 37) % 120);
            return (
              <div
                key={i}
                className="spell-bone-particle"
                style={
                  {
                    background: color,
                    boxShadow: `0 0 6px 2px ${color}88`,
                    animationDelay: `${(i * 0.04) % 0.5}s`,
                    "--bone-tx": `${Math.cos((angle * Math.PI) / 180) * dist}px`,
                    "--bone-ty": `${Math.sin((angle * Math.PI) / 180) * dist}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </>
      );
    }
    case "Codex": {
      // Floating rectangular scroll/page shapes
      return (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="spell-codex-page"
              style={
                {
                  border: `1px solid ${color}`,
                  boxShadow: `0 0 10px 2px ${color}66`,
                  animationDelay: `${i * 0.1}s`,
                  left: `${15 + (i % 4) * 18}%`,
                  "--codex-ty": `${-80 - (i % 3) * 60}px`,
                  "--codex-rotate": `${-15 + (i % 5) * 8}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      );
    }
    case "Grace": {
      // Radial light beams from center
      return (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="spell-grace-beam"
              style={{
                background: `linear-gradient(to top, ${color}, transparent)`,
                boxShadow: `0 0 8px 2px ${color}66`,
                transform: `rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.07}s`,
              }}
            />
          ))}
          <div
            className="spell-grace-center"
            style={{ background: color, boxShadow: `0 0 40px 20px ${color}88` }}
          />
        </>
      );
    }
    case "Midnight": {
      // Dark shadow pool spreading from bottom
      return (
        <>
          <div
            className="spell-midnight-pool"
            style={{
              background: `radial-gradient(ellipse at bottom, ${color}99 0%, ${color}44 40%, transparent 70%)`,
              boxShadow: `0 0 60px 20px ${color}66`,
            }}
          />
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="spell-midnight-wisp"
              style={
                {
                  background: color,
                  animationDelay: `${i * 0.07}s`,
                  left: `${(i / 12) * 100}%`,
                  "--wisp-tx": `${-30 + (i % 7) * 10}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </>
      );
    }
    case "Sage": {
      // Green star twinkles scattered
      return (
        <>
          {[...Array(18)].map((_, i) => (
            <div
              key={i}
              className="spell-sage-star"
              style={{
                color,
                animationDelay: `${(i * 0.06) % 0.8}s`,
                left: `${5 + ((i * 5.3) % 90)}%`,
                top: `${5 + ((i * 4.7) % 88)}%`,
                fontSize: `${10 + (i % 4) * 6}px`,
              }}
            >
              ✦
            </div>
          ))}
        </>
      );
    }
    case "Splendor": {
      // Prismatic sparkle burst
      const sparkColors = [color, "#fff", "#ffd700", "#ff69b4", "#00cfff"];
      return (
        <>
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * 360;
            const dist = 60 + (i % 5) * 40;
            return (
              <div
                key={i}
                className="spell-splendor-spark"
                style={
                  {
                    background: sparkColors[i % sparkColors.length],
                    boxShadow: `0 0 6px 3px ${sparkColors[i % sparkColors.length]}aa`,
                    animationDelay: `${(i * 0.04) % 0.6}s`,
                    "--spark-tx": `${Math.cos((angle * Math.PI) / 180) * dist}px`,
                    "--spark-ty": `${Math.sin((angle * Math.PI) / 180) * dist}px`,
                  } as React.CSSProperties
                }
              />
            );
          })}
          <div
            className="spell-splendor-burst"
            style={{
              background: `radial-gradient(circle, ${color}aa 0%, transparent 70%)`,
            }}
          />
        </>
      );
    }
    case "Valor": {
      // Shield shape that impacts and radiates
      return (
        <>
          <div
            className="spell-valor-shield"
            style={{
              border: `4px solid ${color}`,
              boxShadow: `0 0 30px 10px ${color}88, inset 0 0 20px ${color}44`,
            }}
          />
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="spell-valor-shockwave"
              style={{
                border: `2px solid ${color}`,
                boxShadow: `0 0 12px 4px ${color}66`,
                animationDelay: `${0.2 + i * 0.2}s`,
              }}
            />
          ))}
        </>
      );
    }
    default:
      return null;
  }
}

export function SpellCastAnimation({
  domain,
  onComplete,
}: SpellCastAnimationProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = DOMAIN_ACCENT_HEX[domain as SpellDomain] ?? "#7C3AED";

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onComplete();
    }, 1200);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [onComplete]);

  const animClass = getDomainAnimClass(domain);

  return (
    <div
      className={`spell-cast-overlay ${animClass}`}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      aria-hidden="true"
    >
      {/* Domain label flash */}
      <div
        className="spell-domain-flash"
        style={{
          color,
          textShadow: `0 0 20px ${color}, 0 0 40px ${color}88`,
          borderColor: color,
          boxShadow: `0 0 30px ${color}66`,
        }}
      >
        {domain}
      </div>

      {/* Domain-specific particle effects */}
      <div className="spell-particles-root">
        <DomainParticles domain={domain} color={color} />
      </div>

      {/* Full-screen vignette flash */}
      <div
        className="spell-vignette-flash"
        style={{
          background: `radial-gradient(ellipse at center, ${color}22 0%, ${color}11 40%, transparent 70%)`,
        }}
      />
    </div>
  );
}

export default SpellCastAnimation;
