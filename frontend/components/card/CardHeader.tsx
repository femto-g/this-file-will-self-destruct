export default function CardHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return <h2 className="font-medium">{children}</h2>;
}
