export default function LoadingState() {
  return (
    <div className="soft-card flex min-h-48 items-center justify-center p-8">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#e3d7dd] border-t-[#a99ad9]" />
        <p className="mt-4 text-sm text-[#786a76]">Loading your cake details...</p>
      </div>
    </div>
  );
}