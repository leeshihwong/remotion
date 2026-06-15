import "./index.css";
import { Composition } from "remotion";
import { DURATION_IN_FRAMES, FPS, MyComposition } from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{
          enableVoiceover: "auto",
          subtitleStyle: "minimal",
        }}
      />
    </>
  );
};
