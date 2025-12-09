let interval = null;
let startTimestamp = 0;
let duration = 0;
let lastElapsed = 0;

self.onmessage = (e) => {
  const { type, payload } = e.data;

  if (type === "START") {
    duration = payload.duration;
    lastElapsed = payload?.elapsed ?? 0;
    startTimestamp = Date.now() - lastElapsed;

    if (interval) clearInterval(interval);

    interval = setInterval(() => {
      const elapsed = Date.now() - startTimestamp;

      if (elapsed >= duration) {
        clearInterval(interval);
        self.postMessage({
          type: "COMPLETE",
        });
      } else {
        self.postMessage({
          type: "TICK",
          elapsed,
        });
      }
    }, 250);
  }

  if (type === "STOP") {
    if (interval) clearInterval(interval);
  }

  if (type === "RESET") {
    if (interval) clearInterval(interval);
    startTimestamp = 0;
    duration = 0;
  }
};
