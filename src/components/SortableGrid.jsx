import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const GRIP = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="9" cy="6" r="1.6" />
    <circle cx="15" cy="6" r="1.6" />
    <circle cx="9" cy="12" r="1.6" />
    <circle cx="15" cy="12" r="1.6" />
    <circle cx="9" cy="18" r="1.6" />
    <circle cx="15" cy="18" r="1.6" />
  </svg>
);

/** 螢幕報讀器的說明與提示（dnd-kit 預設是英文） */
const accessibility = {
  screenReaderInstructions: {
    draggable: '按空白鍵拿起，用方向鍵移動位置，再按一次空白鍵放下；按 Esc 取消。'
  },
  announcements: {
    onDragStart: () => '已拿起，可以用方向鍵移動。',
    onDragOver: ({ over }) => (over ? '移到新的位置。' : ''),
    onDragEnd: ({ over }) => (over ? '已放下，順序已更新。' : '已放下。'),
    onDragCancel: () => '已取消，順序沒有改變。'
  }
};

function SortableItem({ id, as: Tag, className, style, children }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <Tag
      ref={setNodeRef}
      className={`${className} sortable-item${isDragging ? ' is-dragging' : ''}`}
      style={{ ...style, transform: CSS.Translate.toString(transform), transition }}
    >
      {/* 只有把手能拖，手機上滑動頁面、點連結都不受影響 */}
      <button type="button" className="drag-handle" ref={setActivatorNodeRef} aria-label="拖曳調整順序" {...attributes} {...listeners}>
        {GRIP}
      </button>
      {children}
    </Tag>
  );
}

/**
 * 可拖曳排序的清單。items 是 [{ id, ...任何資料 }]，排好後以新的 id 順序呼叫 onReorder。
 * renderItem(item) 回傳每一格的內容；itemProps(item) 可以給每一格加 className／style。
 */
export default function SortableGrid({ items, onReorder, as: Tag = 'ul', itemAs = 'li', className, itemProps, renderItem }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const ids = items.map((x) => x.id);

  function onDragEnd({ active, over }) {
    if (!over || active.id === over.id) return;
    onReorder(arrayMove(ids, ids.indexOf(active.id), ids.indexOf(over.id)));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd} accessibility={accessibility}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <Tag className={className}>
          {items.map((item) => {
            const extra = itemProps ? itemProps(item) : {};
            return (
              <SortableItem key={item.id} id={item.id} as={itemAs} className={extra.className || ''} style={extra.style}>
                {renderItem(item)}
              </SortableItem>
            );
          })}
        </Tag>
      </SortableContext>
    </DndContext>
  );
}
