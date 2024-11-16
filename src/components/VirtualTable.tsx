import React from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface Column<T> {
  key: string;
  header: string;
  width: number | string;
  render: (item: T) => React.ReactNode;
}

interface VirtualTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  minHeight?: number;
  maxHeight?: number;
}

export default function VirtualTable<T>({
  data,
  columns,
  rowHeight = 64,
  minHeight = 500,
  maxHeight = 700
}: VirtualTableProps<T>) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = data[index];
    return (
      <div 
        className="flex items-center border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50" 
        style={style}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="px-6 py-4 truncate"
            style={{ 
              width: column.width === 'auto' ? '100%' : column.width, 
              flexShrink: column.width === 'auto' ? 1 : 0,
              flexGrow: column.width === 'auto' ? 1 : 0,
              minWidth: column.width === 'auto' ? 200 : undefined
            }}
          >
            {column.render(item)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div className="flex items-center py-3">
          {columns.map((column) => (
            <div
              key={column.key}
              className="px-6 truncate"
              style={{ 
                width: column.width === 'auto' ? '100%' : column.width,
                flexShrink: column.width === 'auto' ? 1 : 0,
                flexGrow: column.width === 'auto' ? 1 : 0,
                minWidth: column.width === 'auto' ? 200 : undefined
              }}
            >
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                {column.header}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ minHeight, maxHeight }} className="dark:bg-gray-800">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={data.length}
              itemSize={rowHeight}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}