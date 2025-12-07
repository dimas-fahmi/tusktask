const ImageBlock = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="space-y-3">
      <header>
        <h1>{title}</h1>
      </header>

      <div className="grid grid-cols-4 gap-4">{children}</div>
    </div>
  );
};

export default ImageBlock;
