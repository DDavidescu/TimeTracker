import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import ConfirmDialog from './ConfirmDialog';

type Props = {
  id: string;
  table: string;
  onDeleted: () => void;
  dependentTable?: string;
  dependentColumn?: string;
};

export default function DeleteButton({
  id,
  table,
  onDeleted
}: Props) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const getMessage = () => {
    if (table === 'categories') {
      return '⚠️ Deleting this Category will also remove ALL related Occupations and Time Logs. Are you sure you want to continue?';
    }
    if (table === 'occupations') {
      return '⚠️ Deleting this Occupation will also remove ALL related Time Logs. Continue?';
    }
    return 'Are you sure you want to delete this item?';
  };

  const actuallyDelete = async () => {
    setIsDeleting(true);

    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    setIsDeleting(false);
    setShowConfirm(false);

    if (error) {
      console.error(error);
      alert('Failed to delete. Please try again.');
    } else {
      console.log(`✅ Successfully deleted from "${table}" with id ${id}`);
      onDeleted();
    }
  };

  const handleClick = () => {
    // For time_logs (History) — delete instantly, no confirm
    if (table === 'time_logs') {
      actuallyDelete();
    } else {
      // For Categories and Occupations — show confirmation dialog
      setShowConfirm(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-800 text-sm font-medium transition disabled:opacity-50"
      >
        Delete
      </button>

      <ConfirmDialog
        open={showConfirm}
        title="Confirm Deletion"
        message={getMessage()}
        onConfirm={actuallyDelete}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
