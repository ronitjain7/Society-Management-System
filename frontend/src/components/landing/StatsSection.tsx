const stats = [
  { value: "500+", label: "Residents" },
  { value: "20+", label: "Societies" },
  { value: "99%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const StatsSection = () => {
  return (
    <section className="bg-primary py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-extrabold text-accent">{s.value}</div>
              <div className="mt-2 text-sm font-medium text-primary-foreground/70">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
