import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortablePlaylistItem } from './SortablePlaylistItem';

interface PlaylistItem {
  id: string;
  title: string;
  type: 'local' | 'youtube';
  addedByName: string;
}

interface PlaylistContentProps {
  playlist: PlaylistItem[];
  currentPlayingId: string | undefined;
  onPlayItem: (item: PlaylistItem) => void;
  onRemoveItem: (id: string) => void;
  onReorderItems: (startIndex: number, endIndex: number) => void;
  colors: any;
}

export const PlaylistContent = ({
  playlist,
  currentPlayingId,
  onPlayItem,
  onRemoveItem,
  onReorderItems,
  colors
}: PlaylistContentProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = playlist.findIndex((item) => item.id === active.id);
      const newIndex = playlist.findIndex((item) => item.id === over?.id);
      onReorderItems(oldIndex, newIndex);
    }
  };

  if (!playlist || playlist.length === 0) {
    return <EmptyPlaylist colors={colors} />;
  }

  return (
    <div className="flex-1 overflow-y-auto p-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={playlist.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {playlist.map((item, index) => (
              <SortablePlaylistItem
                key={item.id}
                item={item}
                index={index}
                isPlaying={currentPlayingId === item.id}
                onPlay={() => onPlayItem(item)}
                onRemove={() => onRemoveItem(item.id)}
                colors={colors}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const EmptyPlaylist = ({ colors }: { colors: any }) => (
  <div className="flex-1 flex flex-col items-center justify-center h-full text-center p-6">
    <p className="text-sm" style={{ color: colors.text.muted }}>
      Watchlist is empty
    </p>
    <p className="text-xs mt-1" style={{ color: colors.text.muted }}>
      Click the &quot;Add to Watchlist&quot; button above to add YouTube videos or local files
    </p>
  </div>
);