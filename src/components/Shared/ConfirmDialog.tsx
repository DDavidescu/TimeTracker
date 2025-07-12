type Props = {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 md:bg-black/85 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-9/10 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-gray-700">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
