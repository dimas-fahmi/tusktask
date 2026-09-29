import { Howl } from "howler";

export type SpriteKey =
  | "alert_chime"
  | "alert_echo"
  | "pop_positive"
  | "pop"
  | "pop_negative";

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

export function triggerSound(sprite: SpriteKey) {
  return instance.play(sprite);
}
