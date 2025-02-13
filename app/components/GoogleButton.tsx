import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onClick: () => void;
}

export default function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-black text-white rounded-2xl w-full max-w-xs min-w-[200px] h-14 flex items-center justify-center gap-2 px-4 hover:bg-gray-800 mt-4 transition-all duration-300"
    >
      <FcGoogle className="text-xl sm:text-2xl" />
      <span className="font-semibold text-base sm:text-lg">Continue with Google</span>
    </button>
  );
}
