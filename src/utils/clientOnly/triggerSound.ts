import { Howl } from "howler";
import { usePreferences } from "@/src/hooks/usePreferences";

export type SpriteKey =
  | "alert_chime"
  | "alert_echo"
  | "pop_positive"
  | "pop"
  | "pop_negative";

export type SoundReason = "notification" | "effect";

const instance = new Howl({
  src: ["/res/audio/app_sprite.mp3"],
  sprite: {
    alert_chime: [0, 1261],
    alert_echo: [1361, 4000],
    pop_negative: [5461, 1107],
    pop: [6668, 1175],
    pop_positive: [7942, 479],
  },
  preload: true,
});

export function triggerSound(sprite: SpriteKey, reason: SoundReason) {
  const soundNotification = usePreferences.getState().states.soundNotification;
  const soundEffect = usePreferences.getState().states.soundEffect;

  const shouldPlay =
    reason === "notification"
      ? soundNotification
      : reason === "effect"
        ? soundEffect
        : false;

  if (shouldPlay) {
    instance.play(sprite);
  }
}
