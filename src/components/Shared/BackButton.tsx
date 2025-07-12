type Props = {
  onClick: () => void;
  children: React.ReactNode;
};

export default function BackButton({ onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md text-md md:text-base transition cursor-pointer"
    >
      {children}
    </button>
  );
}
