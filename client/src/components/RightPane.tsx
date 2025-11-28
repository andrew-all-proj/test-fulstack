import { useRef } from "react";
import { apiOrder, apiUnselect } from "../api";
import { useInfiniteItems } from "../hooks/useInfiniteItems";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import { SideEnum } from "@shared/types";

type Props = {
  refreshKey: number;
  onDataChanged: () => void;
};

const RightPane = ({ refreshKey, onDataChanged }: Props) => {
  const {
    items,
    setItems,
    search,
    setSearch,
    hasMore,
    loadMore,
    loading,
  } = useInfiniteItems(SideEnum.RIGHT, refreshKey);

  const scrollRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleUnselect = async (id: number) => {
    try {
      await apiUnselect(id);
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении из выбранных");
    }
  };

  const dragItemId = useRef<number | null>(null);

  const onDragStart =
    (id: number) => (e: React.DragEvent<HTMLDivElement>) => {
      dragItemId.current = id;
      e.dataTransfer.effectAllowed = "move";
    };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop =
    (id: number) => async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const fromId = dragItemId.current;
      dragItemId.current = null;
      if (fromId == null || fromId === id) return;

      const current = [...items];
      const fromIndex = current.findIndex((i) => i.id === fromId);
      const toIndex = current.findIndex((i) => i.id === id);
      if (fromIndex === -1 || toIndex === -1) return;

      const moved = current[fromIndex];
      current.splice(fromIndex, 1);
      current.splice(toIndex, 0, moved);
      setItems(current);

      try {
        const res = await apiOrder(current.map((i) => i.id));
        if (!res.success) {
          throw new Error(`Order update failed, expected ${res.count} items`);
        }
      } catch (err) {
        console.error(err);
        alert("Ошибка при изменении порядка");
        onDataChanged();
      }
    };

  return (
    <div className="pane">
      <h2>Выбранные элементы</h2>

      <div className="pane-controls">
        <input
          type="text"
          placeholder="Фильтрация по ID..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <div ref={scrollRef} className="list">
        {items.map((item) => (
          <div
            key={item.id}
            className="list-item"
            draggable
            onDragStart={onDragStart(item.id)}
            onDragOver={onDragOver}
            onDrop={onDrop(item.id)}
          >
            <span className="drag-handle">☰</span>
            <span>ID: {item.id}</span>
            <button
              className="danger-btn"
              type="button"
              onClick={() => handleUnselect(item.id)}
            >
              Удалить
            </button>
          </div>
        ))}
        {loading && <div className="loading">Загрузка...</div>}
      </div>
    </div>
  );
};

export default RightPane;
