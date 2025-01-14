import { ReactNode } from 'react';
import { Doc, Id } from '../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import FileCardActions from './file-card-actions';
import { useMutation } from 'convex/react';
import Image from 'next/image';
import { api } from '../../../../convex/_generated/api';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileTextIcon, GanttChartIcon, ImageIcon } from 'lucide-react';
import { restoreFile } from '../../../../convex/files';

interface Props {
  file: Doc<'files'> & { url: string | null };
  favorites: Doc<'favorites'>[];
}

const FileCard = ({ file, favorites }: Props) => {
  const { toast } = useToast();
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const favorite = useMutation(api.files.toggleFavorite);

  const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<'files'>['type'], ReactNode>;

  const handleDelete = async () => {
    await deleteFile({
      fileId: file._id,
    });
    toast({
      variant: 'default',
      title: 'File marked for deletion!',
      description: 'File will be deleted soon',
    });
  };

  const handleRestore = async () => {
    await restoreFile({
      fileId: file._id,
    });
    toast({
      variant: 'default',
      title: 'File was restored!',
    });
  };

  const handleFavorite = async () => {
    await favorite({
      fileId: file._id,
    });
  };

  const handleDownload = () => {
    window.open(file?.url ?? '', '_blank');
  };

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="mr-1 flex justify-center">{typeIcons[file.type]}</div>
          {file.name}
        </CardTitle>
        <div className="absolute right-2 top-4">
          <FileCardActions
            isFavorited={isFavorited}
            handleFavorite={handleFavorite}
            handleDelete={handleDelete}
            handleRestore={handleRestore}
            shouldDelete={file.shouldDelete}
          />
        </div>
      </CardHeader>
      <CardContent className="flex h-[200px] items-center justify-center">
        {file.type === 'image' && (
          <Image src={file.url ?? ''} alt={file.name} width="200" height="100" />
        )}

        {file.type === 'csv' && <GanttChartIcon className="h-20 w-20" />}
        {file.type === 'pdf' && <FileTextIcon className="h-20 w-20" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleDownload}>Download</Button>
      </CardFooter>
    </Card>
  );
};

export default FileCard;
