type Props = {
  onClick: () => void;
  children: React.ReactNode;
};

export default function BackButton({ onClick, children }: Props) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6.5 py-3 rounded-md text-md md:text-base transition cursor-pointer"
    >
      {children}
    </button>
  );
}
