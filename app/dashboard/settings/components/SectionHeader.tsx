const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div>
      <h1 className="text-xl">{title}</h1>
      <p className="text-xs font-light">{description}</p>
    </div>
  );
};

export default SectionHeader;
