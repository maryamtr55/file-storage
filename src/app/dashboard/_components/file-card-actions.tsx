import { useState } from 'react';
import { Trash2, MoreVertical, StarIcon, StarHalf, UndoIcon } from 'lucide-react';
import { Protect } from '@clerk/nextjs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  handleDelete: () => void;
  handleFavorite: () => void;
  handleRestore: () => void;
  isFavorited: boolean;
  shouldDelete?: boolean;
}

const FileCardActions = ({
  handleDelete,
  handleFavorite,
  isFavorited,
  shouldDelete,
  handleRestore,
}: Props) => {
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your file and remove your
              data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-1"
            onClick={handleFavorite}
          >
            {isFavorited ? (
              <>
                <StarIcon className="mr-2 h-4 w-4" />
                Unfavorite
              </>
            ) : (
              <>
                <StarHalf className="mr-2 h-4 w-4" />
                Favorite
              </>
            )}
          </DropdownMenuItem>
          <Protect role="org:admin" fallback={<></>}>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-1"
              onClick={() => (shouldDelete ? handleRestore() : setConfirmOpen(true))}
            >
              {shouldDelete ? (
                <div className="flex items-center gap-1 text-green-600">
                  <UndoIcon className="mr-2 h-4 w-4" /> Restore
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FileCardActions;
