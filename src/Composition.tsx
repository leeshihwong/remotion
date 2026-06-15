import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  DURATION_IN_FRAMES,
  FPS,
  type CaptionAnchor,
  type ProductKind,
  type Scene,
  type SceneTheme,
  sceneStarts,
  scenes,
  toFrame,
} from "./scenes";
import { voiceoverCaptions, voiceoverDurations } from "./voiceover.generated";

type VoiceoverMode = "auto" | "on" | "off";

type CompositionProps = {
  enableVoiceover?: VoiceoverMode | boolean;
  subtitleStyle?: SubtitleStyleName;
};

type SubtitleStyleName = "glass" | "pill" | "minimal" | "dark";

const assets = {
  logo: staticFile("assets/main-logo2.png"),
  junior: staticFile("assets/e2007f9a-d1e1-4c3e-b1d7-d6a6e6d4b1f0.png"),
  yogurt: staticFile("assets/953ab68c-56ba-402f-b681-d5c8579d89bb.png"),
  bgm: staticFile(
    "assets/bgm/joyinsound-inspiring-soft-corporate-background-music-391736.mp3",
  ),
};

const themeStyles: Record<
  SceneTheme,
  {
    bg: string;
    accent: string;
    accent2: string;
    accent3: string;
    soft: string;
    soft2: string;
    title: string;
    text: string;
    muted: string;
  }
> = {
  warm: {
    bg: "#fffaf2",
    accent: "#f2b24f",
    accent2: "#6eb8d6",
    accent3: "#f4d8a9",
    soft: "#fff2dd",
    soft2: "#edf8fb",
    title: "#243142",
    text: "#334155",
    muted: "#7a8795",
  },
  junior: {
    bg: "#fff8ed",
    accent: "#f39a28",
    accent2: "#47a7d9",
    accent3: "#ffd15c",
    soft: "#fff0d4",
    soft2: "#eaf7fe",
    title: "#273449",
    text: "#3e4b5f",
    muted: "#7a8795",
  },
  yogurt: {
    bg: "#fffaf8",
    accent: "#e790a8",
    accent2: "#82bdd6",
    accent3: "#f5ded9",
    soft: "#fff1f4",
    soft2: "#eff8fb",
    title: "#263341",
    text: "#435161",
    muted: "#7d8894",
  },
  blend: {
    bg: "#fbfbf5",
    accent: "#f39a28",
    accent2: "#e790a8",
    accent3: "#55aeda",
    soft: "#fff0d4",
    soft2: "#fff1f4",
    title: "#243142",
    text: "#384659",
    muted: "#788594",
  },
  cta: {
    bg: "#fffaf2",
    accent: "#f39a28",
    accent2: "#56afd8",
    accent3: "#e790a8",
    soft: "#fff2df",
    soft2: "#edf8fb",
    title: "#223044",
    text: "#334155",
    muted: "#7a8795",
  },
};

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const easeInOut = Easing.bezier(0.45, 0, 0.55, 1);
const LOGO_OUTRO_DURATION_IN_FRAMES = 90;
const CONTENT_DURATION_IN_FRAMES =
  sceneStarts[sceneStarts.length - 1] +
  toFrame(scenes[scenes.length - 1].durationSec);

const hasGeneratedVoiceover = scenes.every((scene) =>
  Boolean(voiceoverDurations[scene.id]),
);

const resolveVoiceover = (mode: CompositionProps["enableVoiceover"]) => {
  if (mode === true || mode === "on") {
    return true;
  }

  if (mode === false || mode === "off") {
    return false;
  }

  return hasGeneratedVoiceover;
};

const getVoiceoverPlaybackRate = (scene: Scene) =>
  Math.max(
    1,
    (voiceoverDurations[scene.id] ?? scene.durationSec) /
      Math.max(1, scene.durationSec - 0.12),
  );

const Background = ({ scene }: { scene: Scene }) => {
  const style = themeStyles[scene.theme];
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 70) * 10;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${style.bg} 0%, #ffffff 47%, ${style.soft2} 100%)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(148,163,184,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
          maskImage:
            "radial-gradient(circle at center, black 0%, black 44%, transparent 82%)",
          opacity: 0.14,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: 999,
          left: -230 + drift,
          top: 142,
          background: `radial-gradient(circle, ${style.soft}, transparent 68%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          borderRadius: 999,
          right: -190 - drift,
          top: 640,
          background: `radial-gradient(circle, ${style.soft2}, transparent 72%)`,
          opacity: 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 54,
          right: 54,
          top: 136,
          height: 1,
          background:
            "linear-gradient(90deg, transparent, rgba(148,163,184,0.22), transparent)",
        }}
      />
    </AbsoluteFill>
  );
};

const BrandHeader = ({ scene }: { scene: Scene }) => {
  const style = themeStyles[scene.theme];

  return (
    <div
      style={{
        position: "absolute",
        left: 54,
        right: 54,
        top: 40,
        height: 76,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Img
          src={assets.logo}
          style={{ width: 58, height: 58, objectFit: "contain" }}
        />
        <div>
          <div
            style={{
              color: style.title,
              fontSize: 22,
              fontWeight: 850,
              lineHeight: 1,
            }}
          >
            FitLine Family
          </div>
          <div
            style={{
              color: style.muted,
              fontSize: 14,
              letterSpacing: 1.2,
              marginTop: 7,
              textTransform: "uppercase",
            }}
          >
            gentle daily nutrition
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          color: style.muted,
          fontSize: 19,
          fontWeight: 800,
        }}
      >
        <span>{scene.indexLabel}</span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: style.accent,
          }}
        />
        <span>{scene.eyebrow}</span>
      </div>
    </div>
  );
};

const Product = ({
  type,
  size,
  x = 0,
  y = 0,
  delay = 0,
  rotate = 0,
  parallax = 1,
}: {
  type: Exclude<ProductKind, "both" | "none">;
  size: number;
  x?: number;
  y?: number;
  delay?: number;
  rotate?: number;
  parallax?: number;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({
    fps,
    frame: frame - delay,
    config: { damping: 18, stiffness: 105, mass: 0.82 },
  });
  const float = Math.sin((frame + delay * 2) / 36) * 10 * parallax;
  const turn = Math.sin((frame + delay) / 52) * 3 * parallax;
  const src = type === "junior" ? assets.junior : assets.yogurt;

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: `calc(50% - ${size / 2}px + ${x}px)`,
        top: `calc(50% - ${size / 2}px + ${y}px)`,
        objectFit: "contain",

        transform: [
          `translateY(${float + interpolate(enter, [0, 1], [46, 0])}px)`,
          `scale(${interpolate(enter, [0, 1], [0.84, 1])})`,
          `rotate(${rotate + turn}deg)`,
        ].join(" "),

        opacity: interpolate(enter, [0, 0.55], [0, 1], {
          extrapolateRight: "clamp",
        }),

        filter: "drop-shadow(0 52px 54px rgba(15, 23, 42, 0.16))",
        translate: "-3.3px -47.5px",
        rotate: "-7.789498deg",
      }}
    />
  );
};

const KineticTitle = ({
  scene,
  compact = false,
  align = "center",
}: {
  scene: Scene;
  compact?: boolean;
  align?: "left" | "center" | "right";
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = themeStyles[scene.theme];
  const enter = spring({
    fps,
    frame,
    config: { damping: 22, stiffness: 120 },
  });

  return (
    <div
      style={{
        textAlign: align,
        transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
        opacity: interpolate(enter, [0, 0.65], [0, 1], {
          extrapolateRight: "clamp",
        }),
      }}
    >
      <div
        style={{
          color: style.accent,
          fontSize: compact ? 18 : 21,
          fontWeight: 900,
          letterSpacing: 2.1,
          textTransform: "uppercase",
        }}
      >
        {scene.eyebrow}
      </div>
      <div
        style={{
          color: style.title,
          fontSize: compact ? 61 : 82,
          fontWeight: 950,
          lineHeight: 1,
          marginTop: 16,
          letterSpacing: 0,
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          color: style.text,
          fontSize: compact ? 29 : 34,
          lineHeight: 1.28,
          fontWeight: 760,
          whiteSpace: "pre-line",
          marginTop: 24,
        }}
      >
        {scene.screenText}
      </div>
    </div>
  );
};

const SoftPanel = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => (
  <div
    style={{
      borderRadius: 18,
      background: "rgba(255,255,255,0.82)",
      border: "1px solid rgba(148,163,184,0.14)",
      boxShadow: "0 24px 60px rgba(15,23,42,0.09)",
      backdropFilter: "blur(14px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const HighlightText = ({
  text,
  highlights = [],
  colors,
}: {
  text: string;
  highlights?: string[];
  colors: string[];
}) => {
  if (highlights.length === 0) {
    return <>{text}</>;
  }

  const pattern = new RegExp(
    `(${highlights
      .map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|")})`,
    "g",
  );

  return (
    <>
      {text.split(pattern).map((part, index) => {
        const hitIndex = highlights.indexOf(part);
        if (hitIndex === -1) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <span
            key={`${part}-${index}`}
            style={{
              color: colors[hitIndex % colors.length],
              fontWeight: 950,
            }}
          >
            {part}
          </span>
        );
      })}
    </>
  );
};

const captionBoxByAnchor: Record<CaptionAnchor, CSSProperties> = {
  bottomFloating: {
    left: 118,
    right: 118,
    bottom: 176,
    minHeight: 112,
  },
  sideLeft: {
    left: 68,
    width: 448,
    bottom: 318,
    minHeight: 126,
  },
  sideRight: {
    right: 68,
    width: 448,
    bottom: 318,
    minHeight: 126,
  },
  centerLower: {
    left: 110,
    right: 110,
    bottom: 252,
    minHeight: 118,
  },
};

const subtitleStyles: Record<
  SubtitleStyleName,
  {
    panel: CSSProperties;
    rail?: CSSProperties;
    text: CSSProperties;
    highlightColors: string[];
    label: string;
  }
> = {
  glass: {
    label: "Glass",
    panel: {
      background: "rgba(255,255,255,0.90)",
      border: "1px solid rgba(148,163,184,0.22)",
      boxShadow: "0 18px 54px rgba(15,23,42,0.12)",
      backdropFilter: "blur(12px)",
      borderRadius: 12,
    },
    rail: {
      width: 6,
      borderRadius: 99,
    },
    text: {
      fontSize: 28,
      fontWeight: 820,
      lineHeight: 1.34,
      letterSpacing: -0.1,
    },
    highlightColors: ["#f39a28", "#56afd8", "#e790a8"],
  },
  pill: {
    label: "Pill",
    panel: {
      background: "rgba(255,255,255,0.96)",
      border: "1px solid rgba(148,163,184,0.18)",
      boxShadow: "0 16px 44px rgba(15,23,42,0.10)",
      borderRadius: 999,
    },
    rail: {
      width: 0,
    },
    text: {
      fontSize: 26,
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: -0.15,
    },
    highlightColors: ["#f39a28", "#6eb8d6", "#e790a8"],
  },
  minimal: {
    label: "Minimal",
    panel: {
      background: "transparent",
      border: "none",
      boxShadow: "none",
      backdropFilter: "none",
      borderRadius: 0,
    },
    rail: {
      width: 0,
    },
    text: {
      fontSize: 25,
      fontWeight: 760,
      lineHeight: 1.42,
      letterSpacing: 0,
    },
    highlightColors: ["#243142", "#f39a28", "#56afd8"],
  },
  dark: {
    label: "Dark",
    panel: {
      background: "rgba(17,24,39,0.92)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 22px 56px rgba(15,23,42,0.24)",
      backdropFilter: "blur(14px)",
      borderRadius: 16,
    },
    rail: {
      width: 6,
      borderRadius: 99,
    },
    text: {
      fontSize: 27,
      fontWeight: 800,
      lineHeight: 1.3,
      color: "#f8fafc",
      letterSpacing: -0.08,
    },
    highlightColors: ["#ffd15c", "#7dd3fc", "#f9a8d4"],
  },
};

const SoftCaption = ({
  scene,
  durationFrames,
  subtitleStyle = "glass",
}: {
  scene: Scene;
  durationFrames: number;
  subtitleStyle?: SubtitleStyleName;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const style = themeStyles[scene.theme];
  const playbackRate = getVoiceoverPlaybackRate(scene);
  const generatedCaptions = voiceoverCaptions[scene.id] ?? [];
  const captions =
    generatedCaptions.length > 0 ? generatedCaptions : scene.captionChunks;
  const activeCaption = captions.find((item) => {
    const startFrame = (item.startMs / playbackRate / 1000) * fps;
    const endFrame = (item.endMs / playbackRate / 1000) * fps;

    return frame >= startFrame && frame <= endFrame;
  });

  if (!activeCaption) {
    return null;
  }

  const startFrame = (activeCaption.startMs / playbackRate / 1000) * fps;
  const endFrame = (activeCaption.endMs / playbackRate / 1000) * fps;
  const slideIn = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 126 },
  });
  const slideOut = spring({
    frame: frame - (endFrame - 18),
    fps,
    config: { damping: 22, stiffness: 190 },
  });
  const yIn = interpolate(slideIn, [0, 1], [84, 0]);
  const xOut = interpolate(slideOut, [0, 1], [0, 210]);
  const opacityOut = interpolate(slideOut, [0, 0.72], [1, 0], {
    extrapolateRight: "clamp",
  });
  const isLeaving = frame >= endFrame - 18;
  const y = isLeaving ? 0 : yIn;
  const x = isLeaving ? xOut : 0;
  const opacity = isLeaving ? opacityOut : 1;
  const sceneFade = interpolate(
    frame,
    [0, 12, durationFrames - 12, durationFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const matchedChunk = scene.captionChunks.find(
    (chunk) =>
      activeCaption.text.includes(chunk.text) ||
      chunk.text.includes(activeCaption.text),
  );
  const highlights =
    matchedChunk?.highlight ??
    scene.keywords.filter((keyword) => activeCaption.text.includes(keyword));
  const anchorStyle = captionBoxByAnchor[scene.captionAnchor];
  const variant = subtitleStyles[subtitleStyle];

  return (
    <div
      style={{
        position: "absolute",
        ...anchorStyle,
        display: "flex",
        alignItems: "center",
        justifyContent:
          scene.captionAnchor === "sideRight" ? "flex-end" : "flex-start",
        opacity: opacity * sceneFade,
        transform: `translateY(${y}px) translateX(${x}px)`,
      }}
    >
      <div
        style={{
          width: variant.rail?.width ?? 0,
          alignSelf: "stretch",
          minHeight: 82,
          borderRadius: variant.rail?.borderRadius ?? 0,
          background:
            variant.rail?.width === 0
              ? "transparent"
              : `linear-gradient(180deg, ${style.accent}, ${style.accent2})`,
          marginRight: variant.rail?.width === 0 ? 0 : 18,
          boxShadow:
            variant.rail?.width === 0
              ? "none"
              : `0 12px 28px ${style.accent}33`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          width: scene.captionAnchor.includes("side")
            ? "min(448px, 48vw)"
            : "min(760px, 72vw)",
          maxWidth: "calc(100vw - 180px)",
          padding:
            subtitleStyle === "pill"
              ? "16px 26px"
              : subtitleStyle === "minimal"
                ? "0"
                : "20px 30px 21px",
          ...variant.panel,
          color: variant.text.color ?? style.title,
          fontSize: scene.captionAnchor.includes("side") ? 29 : 31,
          fontWeight: 850,
          lineHeight: 1.34,
          textAlign: "left",
          letterSpacing: 0,
        }}
      >
        <HighlightText
          text={activeCaption.text}
          highlights={highlights}
          colors={variant.highlightColors}
        />
      </div>
    </div>
  );
};

const LightSweep = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const x = interpolate(frame, [10, 82], [-260, 1160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });
  const opacity = interpolate(frame, [0, 18, 72, 96], [0, 0.4, 0.4, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: x,
        width: 260,
        background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
        opacity,
        filter: "blur(18px)",
        transform: "skewX(-12deg)",
      }}
    />
  );
};

const FluidReveal = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const reveal = interpolate(frame, [0, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });
  const ripple = interpolate(frame, [16, 82], [0.4, 2.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: -90,
          right: -90,
          top: 520,
          height: 430,
          borderRadius: "46% 54% 44% 56% / 58% 47% 53% 42%",
          background: `linear-gradient(135deg, rgba(255,255,255,0.92), ${style.soft}, ${style.soft2})`,
          transform: `translateY(${interpolate(reveal, [0, 1], [120, 0])}px) scaleX(${interpolate(reveal, [0, 1], [0.8, 1])})`,
          opacity: 0.78 * reveal,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 460,
          height: 460,
          borderRadius: 999,
          transform: `translate(-50%, -50%) scale(${ripple})`,
          border: `3px solid ${style.accent2}`,
          opacity: interpolate(frame, [16, 46, 90], [0, 0.24, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    </>
  );
};

const HeroProduct = ({ scene }: { scene: Scene }) => {
  const style = themeStyles[scene.theme];
  const frame = useCurrentFrame();
  const glow = interpolate(Math.sin(frame / 24), [-1, 1], [0.94, 1.04]);
  const isDual = scene.visualFocus === "both";
  const isYogurt = scene.visualFocus === "yogurt";

  return (
    <AbsoluteFill>
      {scene.accentMotion === "milkFlow" ? <FluidReveal scene={scene} /> : null}
      <div
        style={{
          position: "absolute",
          width: isDual ? 720 : 660,
          height: isDual ? 720 : 660,
          borderRadius: 999,
          left: "50%",
          top: isDual ? 820 : 870,
          transform: `translate(-50%, -50%) scale(${glow})`,
          background: `radial-gradient(circle, ${style.soft} 0%, rgba(255,255,255,0.28) 58%, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: isDual ? 74 : isYogurt ? 560 : 74,
          right: isDual ? 74 : isYogurt ? 72 : 520,
          top: 168,
        }}
      >
        <KineticTitle
          scene={scene}
          compact={!isDual}
          align={isDual ? "center" : isYogurt ? "right" : "left"}
        />
      </div>
      {isDual ? (
        <>
          <Product type="junior" size={585} x={-220} y={140} rotate={-7} />
          <Product
            type="yogurt"
            size={585}
            x={220}
            y={148}
            delay={8}
            rotate={7}
          />
        </>
      ) : (
        <>
          <Product
            type={isYogurt ? "yogurt" : "junior"}
            size={730}
            x={isYogurt ? -230 : 245}
            y={180}
            rotate={isYogurt ? -5 : 5}
            parallax={1.2}
          />
          <IngredientOrbit
            scene={scene}
            product={isYogurt ? "yogurt" : "junior"}
          />
        </>
      )}
      {scene.accentMotion === "goldSweep" ? <LightSweep scene={scene} /> : null}
    </AbsoluteFill>
  );
};

const ProblemCloud = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const words = scene.cloudWords ?? scene.keywords;
  const revealSpacing = toFrame(scene.durationSec / Math.max(words.length, 1));
  const cardEntries = [
    { word: words[0], subtitle: "第一类", tone: style.soft },
    { word: words[1], subtitle: "第二类", tone: style.soft2 },
    { word: words[2], subtitle: "第三类", tone: style.soft },
    { word: words[3], subtitle: "第四类", tone: style.soft2 },
  ].filter((item) => item.word);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 170 }}>
        <KineticTitle scene={scene} align="left" />
      </div>
      <div
        style={{
          position: "absolute",
          width: 580,
          height: 580,
          borderRadius: 999,
          left: 390,
          top: 610,
          background: `radial-gradient(circle, ${style.soft2}, transparent 72%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 545,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 18,
        }}
      >
        {cardEntries.map((item, index) => {
          const start = index * revealSpacing;
          const enter = interpolate(frame, [start, start + 26], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          });

          return (
            <div
              key={item.word}
              style={{
                opacity: enter,
                transform: `translateY(${interpolate(enter, [0, 1], [22, 0])}px) scale(${interpolate(enter, [0, 1], [0.96, 1])})`,
              }}
            >
              <SoftPanel
                style={{
                  padding: "18px 20px",
                  minHeight: 122,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.94), ${item.tone})`,
                }}
              >
                <div
                  style={{
                    color: style.accent,
                    fontSize: 16,
                    fontWeight: 900,
                    letterSpacing: 1.6,
                    textTransform: "uppercase",
                  }}
                >
                  {item.subtitle}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    color: style.title,
                    fontSize: 34,
                    fontWeight: 950,
                    lineHeight: 1.08,
                  }}
                >
                  {item.word}
                </div>
              </SoftPanel>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const NutritionCard = ({
  item,
  scene,
  index,
}: {
  item: NonNullable<Scene["nutritionItems"]>[number];
  scene: Scene;
  index: number;
}) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const enter = interpolate(frame, [index * 7, index * 7 + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <SoftPanel
      style={{
        padding: "20px 22px",
        transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px)`,
        opacity: enter,
        background: "rgba(255,255,255,0.72)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 7,
          borderRadius: 99,
          background: [style.accent, style.accent2, style.accent3, "#91c9dd"][
            index % 4
          ],
          marginBottom: 15,
        }}
      />
      <div
        style={{
          color: style.title,
          fontSize: 27,
          fontWeight: 820,
          lineHeight: 1.2,
        }}
      >
        {item.value}
      </div>
      <div
        style={{
          color: style.muted,
          fontSize: 16,
          fontWeight: 580,
          marginTop: 9,
        }}
      >
        {item.label}
      </div>
    </SoftPanel>
  );
};

const NutritionMatrix = ({ scene }: { scene: Scene }) => {
  const isYogurt = scene.visualFocus === "yogurt";

  return (
    <AbsoluteFill>
      {scene.accentMotion === "milkFlow" ? <FluidReveal scene={scene} /> : null}
      <div style={{ position: "absolute", left: 70, right: 70, top: 158 }}>
        <KineticTitle scene={scene} compact align="center" />
      </div>
      <Product
        type={isYogurt ? "yogurt" : "junior"}
        size={590}
        x={isYogurt ? 270 : -270}
        y={245}
        rotate={isYogurt ? 5 : -5}
        parallax={1.35}
      />
      <div
        style={{
          position: "absolute",
          left: isYogurt ? 72 : 386,
          right: isYogurt ? 386 : 72,
          top: 545,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 18,
        }}
      >
        {(scene.nutritionItems ?? []).map((item, index) => (
          <NutritionCard
            key={item.value}
            item={item}
            index={index}
            scene={scene}
          />
        ))}
      </div>
      {scene.accentMotion === "goldSweep" ? <LightSweep scene={scene} /> : null}
    </AbsoluteFill>
  );
};

const IngredientOrbit = ({
  scene,
  product,
}: {
  scene: Scene;
  product: Exclude<ProductKind, "both" | "none">;
}) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const labels =
    product === "junior"
      ? ["3-12 岁", "每日", "打底"]
      : ["早餐", "加餐", "餐桌"];
  const baseX = product === "junior" ? 170 : -210;

  return (
    <>
      {labels.map((label, index) => {
        const angle = frame / 85 + index * 2.15;
        const x = baseX + Math.cos(angle) * 180;
        const y = 175 + Math.sin(angle) * 110;
        const enter = interpolate(
          frame,
          [12 + index * 8, 42 + index * 8],
          [0, 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: easeOut,
          },
        );

        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%, -50%) scale(${interpolate(enter, [0, 1], [0.8, 1])})`,
              opacity: enter,
              padding: "14px 20px",
              borderRadius: 999,
              color: style.title,
              fontSize: 23,
              fontWeight: 900,
              background: index % 2 ? style.soft2 : style.soft,
              boxShadow: "0 14px 32px rgba(15,23,42,0.08)",
            }}
          >
            {label}
          </div>
        );
      })}
    </>
  );
};

const RecipeFlow = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const isYogurt = scene.visualFocus === "yogurt";
  const style = themeStyles[scene.theme];
  const steps = scene.recipeSteps ?? [];

  return (
    <AbsoluteFill>
      {scene.accentMotion === "milkFlow" ? <FluidReveal scene={scene} /> : null}
      <div
        style={{
          position: "absolute",
          left: isYogurt ? 70 : 540,
          right: isYogurt ? 520 : 70,
          top: 158,
        }}
      >
        <KineticTitle
          scene={scene}
          compact
          align={isYogurt ? "left" : "right"}
        />
      </div>
      <Product
        type={isYogurt ? "yogurt" : "junior"}
        size={660}
        x={isYogurt ? 250 : -270}
        y={205}
        rotate={isYogurt ? 4 : -4}
      />
      <div
        style={{
          position: "absolute",
          left: isYogurt ? 78 : 506,
          right: isYogurt ? 506 : 78,
          top: 655,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {steps.map((step, index) => {
          const enter = interpolate(
            frame,
            [index * 8, index * 8 + 28],
            [0, 1],
            {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            },
          );

          return (
            <SoftPanel
              key={step}
              style={{
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [isYogurt ? -24 : 24, 0])}px)`,
                background: "rgba(255,255,255,0.78)",
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 15,
                  background: index % 2 ? style.soft2 : style.soft,
                  color: index % 2 ? style.accent2 : style.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  fontWeight: 950,
                }}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
              <div
                style={{
                  color: style.title,
                  fontSize: 27,
                  fontWeight: 930,
                  lineHeight: 1.2,
                }}
              >
                {step}
              </div>
            </SoftPanel>
          );
        })}
      </div>
      {scene.accentMotion === "goldSweep" ? <LightSweep scene={scene} /> : null}
    </AbsoluteFill>
  );
};

const ComparisonBridge = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const progress = interpolate(frame, [20, 74], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 406,
        right: 406,
        top: 1168,
        height: 170,
        opacity: progress,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 8,
          height: interpolate(progress, [0, 1], [0, 76]),
          borderRadius: 99,
          background: `linear-gradient(180deg, ${style.accent}, ${style.accent2})`,
          transform: "translateX(-50%)",
        }}
      />
      <SoftPanel
        style={{
          position: "absolute",
          left: -138,
          right: -138,
          top: 66,
          padding: "18px 22px",
          textAlign: "center",
          color: style.title,
          fontSize: 28,
          fontWeight: 950,
        }}
      >
        一款打底 / 一款补充
      </SoftPanel>
    </div>
  );
};

const ComparisonMerge = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const cardEnter = (delay: number) =>
    interpolate(frame, [delay, delay + 36], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });
  const leftEnter = cardEnter(0);
  const rightEnter = cardEnter(10);

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 174 }}>
        <KineticTitle scene={scene} compact align="center" />
      </div>
      <SoftPanel
        style={{
          position: "absolute",
          left: 74,
          top: 520,
          width: 420,
          height: 650,
          padding: 28,
          background:
            "linear-gradient(180deg, #fff7e8, rgba(255,255,255,0.84))",
          opacity: leftEnter,
          transform: `translateX(${interpolate(leftEnter, [0, 1], [-52, 0])}px)`,
        }}
      >
        <Product type="junior" size={395} y={-96} />
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            bottom: 54,
            textAlign: "center",
          }}
        >
          <div style={{ color: style.title, fontSize: 34, fontWeight: 950 }}>
            每日营养打底
          </div>
          <div
            style={{
              color: style.muted,
              fontSize: 22,
              fontWeight: 760,
              marginTop: 12,
            }}
          >
            儿倍
          </div>
        </div>
      </SoftPanel>
      <SoftPanel
        style={{
          position: "absolute",
          right: 74,
          top: 520,
          width: 420,
          height: 650,
          padding: 28,
          background:
            "linear-gradient(180deg, #fff1f4, rgba(255,255,255,0.84))",
          opacity: rightEnter,
          transform: `translateX(${interpolate(rightEnter, [0, 1], [52, 0])}px)`,
        }}
      >
        <Product type="yogurt" size={395} y={-96} delay={8} />
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            bottom: 54,
            textAlign: "center",
          }}
        >
          <div style={{ color: style.title, fontSize: 34, fontWeight: 950 }}>
            家庭饮食补充
          </div>
          <div
            style={{
              color: style.muted,
              fontSize: 22,
              fontWeight: 760,
              marginTop: 12,
            }}
          >
            酸奶粉
          </div>
        </div>
      </SoftPanel>
      <ComparisonBridge scene={scene} />
    </AbsoluteFill>
  );
};

const SoftCTA = ({ scene }: { scene: Scene }) => {
  const frame = useCurrentFrame();
  const style = themeStyles[scene.theme];
  const lift = interpolate(frame, [20, 72], [32, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 70, right: 70, top: 176 }}>
        <KineticTitle scene={scene} align="center" />
      </div>
      <Product type="junior" size={505} x={-250} y={205} rotate={-6} />
      <Product type="yogurt" size={505} x={250} y={215} delay={8} rotate={6} />
      <SoftPanel
        style={{
          position: "absolute",
          left: 250,
          right: 250,
          top: 540 + lift,
          height: 278,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: 34,
          background: `linear-gradient(180deg, rgba(255,255,255,0.9), ${style.soft})`,
        }}
      >
        <div
          style={{
            color: style.title,
            fontSize: 46,
            fontWeight: 950,
            lineHeight: 1.18,
          }}
        >
          先看家庭情况
          <br />
          再判断从哪款开始
        </div>
      </SoftPanel>
    </AbsoluteFill>
  );
};

const SceneVisual = ({ scene }: { scene: Scene }) => {
  switch (scene.layoutVariant) {
    case "HeroProduct":
      return <HeroProduct scene={scene} />;
    case "ProblemCloud":
      return <ProblemCloud scene={scene} />;
    case "NutritionMatrix":
      return <NutritionMatrix scene={scene} />;
    case "RecipeFlow":
      return <RecipeFlow scene={scene} />;
    case "ComparisonMerge":
      return <ComparisonMerge scene={scene} />;
    case "SoftCTA":
      return <SoftCTA scene={scene} />;
    default:
      return null;
  }
};

const TransitionOverlay = ({
  scene,
  localFrame,
}: {
  scene: Scene;
  localFrame: number;
}) => {
  const style = themeStyles[scene.theme];
  const opacity = interpolate(localFrame, [0, 18, 42], [0.88, 0.3, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (scene.accentMotion === "milkFlow") {
    const scale = interpolate(localFrame, [0, 44], [0.28, 2.2], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: easeOut,
    });

    return (
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 560,
          height: 560,
          borderRadius: 999,
          transform: `translate(-50%, -50%) scale(${scale})`,
          background:
            "radial-gradient(circle, rgba(255,255,255,0.94), rgba(255,241,244,0.48) 52%, transparent 72%)",
          opacity,
        }}
      />
    );
  }

  if (
    scene.accentMotion === "bridgeMerge" ||
    scene.accentMotion === "ctaLift"
  ) {
    return (
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffffff",
          opacity: interpolate(localFrame, [0, 24], [0.52, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />
    );
  }

  const x = interpolate(localFrame, [0, 40], [-280, 1120], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeInOut,
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: x,
        width: 230,
        background: `linear-gradient(90deg, transparent, ${style.accent}, transparent)`,
        opacity,
        filter: "blur(18px)",
        transform: "skewX(-12deg)",
      }}
    />
  );
};

const SceneView = ({
  scene,
  subtitleStyle,
}: {
  scene: Scene;
  subtitleStyle: SubtitleStyleName;
}) => {
  const frame = useCurrentFrame();
  const duration = toFrame(scene.durationSec);
  const opacity = interpolate(
    frame,
    [0, 8, duration - 16, duration],
    [1, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ opacity }}>
      <Background scene={scene} />
      <BrandHeader scene={scene} />
      <SceneVisual scene={scene} />
      <SoftCaption
        scene={scene}
        durationFrames={duration}
        subtitleStyle={subtitleStyle}
      />
      <TransitionOverlay scene={scene} localFrame={frame} />
    </AbsoluteFill>
  );
};

const LogoDropOutro = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const enter = interpolate(frame, [0, 55], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const settle = interpolate(frame, [42, 74], [0, 1], {
    easing: Easing.bezier(0.22, 1, 0.36, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(
    frame,
    [42, 74, LOGO_OUTRO_DURATION_IN_FRAMES],
    [0, 1, 0],
    {
      easing: easeOut,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );
  const y =
    interpolate(enter, [0, 1], [-70, 0]) + interpolate(settle, [0, 1], [8, 0]);
  const scale =
    interpolate(enter, [0, 1], [0.84, 1.02]) -
    interpolate(settle, [0, 1], [0, 0.02]);
  const blur = interpolate(enter, [0, 1], [10, 0]);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(circle at 50% 42%, rgba(103,214,255,0.14), transparent 32%), linear-gradient(180deg, #07111f 0%, #050b15 100%)",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 860,
          height: 860,
          borderRadius: 999,
          border: "2px solid rgba(103,214,255,0.18)",
          transform: `scale(${0.86 + glow * 0.18})`,
          opacity: glow * 0.7,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: width / 2 - 300,
          top: height / 2 - 300 + y,
          width: 600,
          height: 570,
          transform: `scale(${scale})`,
          opacity: fadeIn,
          filter: `blur(${blur}px) drop-shadow(0 40px 54px rgba(0,0,0,0.34))`,
        }}
      >
        <Img
          src={assets.logo}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

const Bgm = ({ voiceoverEnabled }: { voiceoverEnabled: boolean }) => {
  const { fps } = useVideoConfig();

  return (
    <Audio
      src={assets.bgm}
      loop
      loopVolumeCurveBehavior="extend"
      volume={(audioFrame) => {
        const fadeIn = interpolate(audioFrame, [0, fps], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fadeOut = interpolate(
          audioFrame,
          [DURATION_IN_FRAMES - fps, DURATION_IN_FRAMES],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        );
        const base = voiceoverEnabled ? 0.06 : 0.1;
        return base * fadeIn * fadeOut;
      }}
    />
  );
};

const Voiceover = ({ enabled }: { enabled: boolean }) => {
  if (!enabled) {
    return null;
  }

  return (
    <>
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={sceneStarts[index]}
          durationInFrames={toFrame(scene.durationSec)}
        >
          <Audio
            src={staticFile(scene.voiceoverFile)}
            volume={1}
            playbackRate={Math.max(
              1,
              (voiceoverDurations[scene.id] ?? scene.durationSec) /
                Math.max(1, scene.durationSec - 0.12),
            )}
          />
        </Sequence>
      ))}
    </>
  );
};

export const MyComposition = ({
  enableVoiceover = "auto",
  subtitleStyle = "glass",
}: CompositionProps) => {
  const voiceoverEnabled = resolveVoiceover(enableVoiceover);

  return (
    <AbsoluteFill
      style={{
        fontFamily:
          "'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', Arial, sans-serif",
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <Bgm voiceoverEnabled={voiceoverEnabled} />
      <Voiceover enabled={voiceoverEnabled} />
      {scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={sceneStarts[index]}
          durationInFrames={toFrame(scene.durationSec)}
        >
          <SceneView scene={scene} subtitleStyle={subtitleStyle} />
        </Sequence>
      ))}
      <Sequence
        from={CONTENT_DURATION_IN_FRAMES}
        durationInFrames={LOGO_OUTRO_DURATION_IN_FRAMES}
        premountFor={FPS}
      >
        <LogoDropOutro />
      </Sequence>
    </AbsoluteFill>
  );
};

export { DURATION_IN_FRAMES, FPS };
