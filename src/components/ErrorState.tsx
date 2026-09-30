export default function ErrorState({ message = "Something went wrong." }: { message?: string }) {
  return (
    <div className="rounded-[20px] border border-[#edbfd2] bg-[#fdf0f5] p-6 text-sm text-[#8f4545]">
      {message}
    </div>
  );
}