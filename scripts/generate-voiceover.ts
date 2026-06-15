import { execFileSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { parseMedia } from "@remotion/media-parser";
import { nodeReader } from "@remotion/media-parser/node";
import { scenes } from "../src/scenes.ts";

const provider = process.env.TTS_PROVIDER ?? "edge";
const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID ?? "eleven_multilingual_v2";
const edgeVoice = process.env.EDGE_TTS_VOICE ?? "zh-CN-XiaoxiaoNeural";
const edgeRate = process.env.EDGE_TTS_RATE ?? "+12%";
const edgeVolume = process.env.EDGE_TTS_VOLUME ?? "+0%";
const edgePitch = process.env.EDGE_TTS_PITCH ?? "+0Hz";
const edgeRetries = Number.parseInt(process.env.EDGE_TTS_RETRIES ?? "4", 10);
const edgeDelayMs = Number.parseInt(process.env.EDGE_TTS_DELAY_MS ?? "1600", 10);
const outputDir = join(process.cwd(), "public", "voiceover", "kids-nutrition");
const generatedFile = join(process.cwd(), "src", "voiceover.generated.ts");

const ensureDir = (path: string) => {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
};

const durationWithMediaParser = async (file: string) => {
  try {
    const result = await parseMedia({
      src: file,
      reader: nodeReader,
      acknowledgeRemotionLicense: true,
      fields: {
        durationInSeconds: true,
      },
    });

    return result.durationInSeconds;
  } catch {
    return null;
  }
};

const durationWithFfprobe = (file: string) => {
  try {
    const output = execFileSync(
      "ffprobe",
      [
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "default=noprint_wrappers=1:nokey=1",
        file,
      ],
      { encoding: "utf8" },
    );
    const seconds = Number.parseFloat(output.trim());
    return Number.isFinite(seconds) ? seconds : null;
  } catch {
    return null;
  }
};

const estimateDuration = (text: string) => {
  const chineseChars = [...text].filter((char) => /[\u3400-\u9fff]/.test(char)).length;
  const otherWords = text.replace(/[\u3400-\u9fff]/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, chineseChars / 4.2 + otherWords / 2.4);
};

const sceneFileName = (voiceoverFile: string) =>
  voiceoverFile.split("/").slice(-1)[0] ?? voiceoverFile;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

type GeneratedCaption = {
  text: string;
  startMs: number;
  endMs: number;
};

const timeToMs = (time: string) => {
  const [hours, minutes, seconds] = time.replace(",", ".").split(":");

  return Math.round(
    (Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds)) * 1000,
  );
};

const parseVtt = (file: string): GeneratedCaption[] => {
  if (!existsSync(file)) {
    return [];
  }

  const content = readFileSync(file, "utf8");
  const blocks = content
    .split(/\r?\n\r?\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.flatMap((block) => {
    const lines = block.split(/\r?\n/);
    const timingLine = lines.find((line) => line.includes("-->"));
    if (!timingLine) {
      return [];
    }

    const [start, end] = timingLine.split("-->").map((item) => item.trim());
    const text = lines
      .slice(lines.indexOf(timingLine) + 1)
      .join("")
      .trim();

    if (!text) {
      return [];
    }

    return [
      {
        text,
        startMs: timeToMs(start),
        endMs: timeToMs(end),
      },
    ];
  });
};

const writeGeneratedVoiceover = (
  durations: Record<string, number>,
  captions: Record<string, GeneratedCaption[]>,
) => {
  const lines = [
    "export const voiceoverDurations: Record<string, number> = {",
    ...Object.entries(durations).map(
      ([id, duration]) => `  ${JSON.stringify(id)}: ${duration.toFixed(3)},`,
    ),
    "};",
    "",
    "export type GeneratedVoiceoverCaption = {",
    "  text: string;",
    "  startMs: number;",
    "  endMs: number;",
    "};",
    "",
    "export const voiceoverCaptions: Record<string, GeneratedVoiceoverCaption[]> = {",
    ...Object.entries(captions).map(
      ([id, sceneCaptions]) =>
        `  ${JSON.stringify(id)}: ${JSON.stringify(sceneCaptions)},`,
    ),
    "};",
    "",
  ];
  writeFileSync(generatedFile, lines.join("\n"), "utf8");
};

const collectVoiceoverMetadata = async () => {
  const durations: Record<string, number> = {};
  const captions: Record<string, GeneratedCaption[]> = {};

  for (const scene of scenes) {
    const file = join(outputDir, sceneFileName(scene.voiceoverFile));
    if (!existsSync(file) || statSync(file).size === 0) {
      continue;
    }

    durations[scene.id] =
      (await durationWithMediaParser(file)) ??
      durationWithFfprobe(file) ??
      estimateDuration(scene.voiceover);
    captions[scene.id] = parseVtt(file.replace(/\.mp3$/i, ".vtt"));
  }

  writeGeneratedVoiceover(durations, captions);
  return { durations, captions };
};

const assertEdgeTts = () => {
  try {
    execFileSync("python", ["-m", "edge_tts", "--version"], {
      stdio: "ignore",
    });
  } catch {
    throw new Error(
      [
        "edge-tts is not available.",
        "Install it with: python -m pip install edge-tts",
        "Then run: npm run voiceover",
      ].join("\n"),
    );
  }
};

const generateWithEdgeTts = async (
  scene: (typeof scenes)[number],
  file: string,
) => {
  for (let attempt = 1; attempt <= edgeRetries; attempt++) {
    try {
      execFileSync(
        "python",
        [
          "-m",
          "edge_tts",
          "--voice",
          edgeVoice,
          "--rate",
          edgeRate,
          "--volume",
          edgeVolume,
          "--pitch",
          edgePitch,
      "--text",
      scene.voiceover,
      "--write-media",
      file,
      "--write-subtitles",
      file.replace(/\.mp3$/i, ".vtt"),
    ],
        { stdio: "inherit" },
      );
      return;
    } catch (error) {
      if (existsSync(file) && statSync(file).size === 0) {
        unlinkSync(file);
      }

      if (attempt >= edgeRetries) {
        throw error;
      }

      const waitMs = edgeDelayMs * attempt;
      console.warn(
        `edge-tts retry ${attempt}/${edgeRetries} for ${scene.id} after ${waitMs}ms`,
      );
      await sleep(waitMs);
    }
  }
};

const generateWithElevenLabs = async (
  scene: (typeof scenes)[number],
  file: string,
) => {
  if (!apiKey) {
    throw new Error("Missing ELEVENLABS_API_KEY.");
  }

  if (!voiceId) {
    throw new Error("Missing VOICE_ID.");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: scene.voiceover,
        model_id: modelId,
        voice_settings: {
          stability: 0.62,
          similarity_boost: 0.78,
          style: 0.24,
          use_speaker_boost: true,
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`ElevenLabs failed for ${scene.id}: ${response.status} ${body}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(file, buffer);
};

const generateScene = async (scene: (typeof scenes)[number]) => {
  const file = join(outputDir, sceneFileName(scene.voiceoverFile));
  const subtitleFile = file.replace(/\.mp3$/i, ".vtt");
  const force = process.argv.includes("--force");

  if (force && existsSync(file)) {
    unlinkSync(file);
  }

  if (force && existsSync(subtitleFile)) {
    unlinkSync(subtitleFile);
  }

  if (
    existsSync(file) &&
    statSync(file).size > 0 &&
    (provider !== "edge" || existsSync(subtitleFile))
  ) {
    console.log(`skip ${scene.id}: ${file}`);
    return;
  }

  if (provider === "edge") {
    await generateWithEdgeTts(scene, file);
  } else if (provider === "elevenlabs") {
    await generateWithElevenLabs(scene, file);
  } else {
    throw new Error(`Unsupported TTS_PROVIDER: ${provider}`);
  }

  console.log(`generated ${scene.id}: ${file}`);
};

const warnForLongVoiceovers = (durations: Record<string, number>) => {
  for (const scene of scenes) {
    const duration = durations[scene.id];
    if (!duration || duration <= scene.durationSec) {
      continue;
    }

    console.warn(
      `${scene.id} voiceover is ${duration.toFixed(2)}s, longer than scene ${scene.durationSec}s. Increase EDGE_TTS_RATE or adjust timing.`,
    );
  }
};

const main = async () => {
  ensureDir(outputDir);
  ensureDir(dirname(generatedFile));

  const mode = process.argv.includes("--durations-only") ? "durations" : "generate";

  if (mode === "durations") {
    const { durations } = await collectVoiceoverMetadata();
    console.log(`updated ${Object.keys(durations).length} voiceover durations`);
    return;
  }

  if (provider === "edge") {
    assertEdgeTts();
    console.log(
      `using edge-tts voice=${edgeVoice} rate=${edgeRate} volume=${edgeVolume} pitch=${edgePitch}`,
    );
  } else if (provider === "elevenlabs") {
    console.log(`using elevenlabs model=${modelId}`);
  }

  for (const scene of scenes) {
    await generateScene(scene);
  }

  const files = readdirSync(outputDir).filter((file) => file.endsWith(".mp3"));
  console.log(`voiceover files in ${outputDir}: ${files.length}`);
  const { durations } = await collectVoiceoverMetadata();
  warnForLongVoiceovers(durations);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
