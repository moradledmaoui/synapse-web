export default function RegimeBadge({ regime }: { regime: string }) {
  const styles: Record<string, string> = {
    bull: "bg-green-50 text-green-700 border border-green-200",
    bear: "bg-red-50 text-red-700 border border-red-200",
    chop: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    panic: "bg-red-100 text-red-800 border border-red-300",
    unknown: "bg-gray-100 text-gray-500 border border-gray-200",
  };
  return (
    <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${styles[regime] || styles.unknown}`}>
      {regime.toUpperCase()}
    </span>
  );
}
