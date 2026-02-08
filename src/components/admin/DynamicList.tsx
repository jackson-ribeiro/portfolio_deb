"use client";

import { Button } from "@/components/ui/Button";

interface DynamicListProps<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel: string;
  emptyMessage?: string;
}

export function DynamicList<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel,
  emptyMessage = "Nenhum item adicionado",
}: DynamicListProps<T>) {
  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-zinc-500 text-sm py-4 text-center">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative p-4 border border-zinc-200 rounded-lg bg-zinc-50"
            >
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-red-500 transition-colors"
                title="Remover"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      )}
      <Button type="button" variant="secondary" onClick={onAdd} className="w-full">
        + {addLabel}
      </Button>
    </div>
  );
}
