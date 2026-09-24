const AuthHeader = ({ title, desc }: { title?: string; desc?: string }) => {
  return (
    <header>
      {title && <h1 className="text-2xl font-bold">{title}</h1>}
      {desc && <p className="text-sm">{desc}</p>}
    </header>
  );
};
export default AuthHeader;
