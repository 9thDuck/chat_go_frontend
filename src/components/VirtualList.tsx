import { useVirtualizer } from "@tanstack/react-virtual";
import { LoadingIndicator } from "./LoadingIndicator";

export interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, isSelected: boolean) => React.ReactNode;
  getItemId: (item: T) => string | number;
  isItemSelected?: (item: T) => boolean;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  parentRef: React.RefObject<HTMLDivElement | null>;
  estimateSize?: number;
  overscan?: number;
}

export function VirtualList<T>({
  items,
  renderItem,
  getItemId,
  isItemSelected = () => false,
  hasNextPage = false,
  isFetchingNextPage = false,
  parentRef,
  estimateSize = 64,
  overscan = 5,
}: VirtualListProps<T>) {
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? items.length + 1 : items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  return (
    <div
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: "100%",
        position: "relative",
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const isLoaderRow = virtualRow.index > items.length - 1;

        if (isLoaderRow) {
          return isFetchingNextPage ? (
            <div
              key="loader"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="h-16 flex items-center justify-center"
            >
              <LoadingIndicator size="md" />
            </div>
          ) : null;
        }

        const item = items[virtualRow.index];
        const isSelected = isItemSelected(item);

        return (
          <div
            key={getItemId(item)}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {renderItem(item, isSelected)}
          </div>
        );
      })}
    </div>
  );
}
