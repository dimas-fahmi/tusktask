// Component for displaying the focus and break cycle visualizer
const CycleVisualizer = ({ cycle }: { cycle: "focus" | "break" }) => {
  return (
    <section id="cycle-visualizer" className="grid grid-cols-2 gap-3">
      <div
        className={`relative p-4 border rounded-2xl flex items-center justify-center ${
          cycle === "focus" ? "bg-tt-muted" : ""
        }`}
      >
        <div>
          <h4 className="text-2xl font-bold">25:00</h4>
          <p className="text-xs text-center">Focus</p>
        </div>
      </div>
      <div
        className={`relative p-4 border rounded-2xl flex items-center justify-center ${
          cycle === "break" ? "bg-tt-muted" : ""
        }`}
      >
        <div>
          <h4 className="text-2xl font-bold">5:00</h4>
          <p className="text-xs text-center">Break</p>
        </div>
      </div>
    </section>
  );
};

export default CycleVisualizer;
