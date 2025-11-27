import { SideEnum } from "@shared/types";
import { apiAddItem, apiSelect } from "../api";
import { useInfiniteItems } from "../hooks/useInfiniteItems";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";

type Props = {
  refreshKey: number;
  onDataChanged: () => void;
};

const LeftPane = ({ refreshKey, onDataChanged }: Props) => {
  const {
    items,
    search,
    setSearch,
    hasMore,
    loadMore,
    loading,
  } = useInfiniteItems(SideEnum.LEFT, refreshKey); 

  const scrollRef = useInfiniteScroll(loadMore, hasMore, loading);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.elements.namedItem("newId") as HTMLInputElement;
    const value = Number(input.value);

    if (!Number.isInteger(value) || value <= 0) {
      alert("ID должен быть положительным целым числом");
      return;
    }

    try {
      const res = await apiAddItem(value);
      if (!res.ok) {
        alert(res.reason || "Не удалось добавить ID");
      } else {
        onDataChanged(); 
      }
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при добавлении");
    } finally {
      input.value = "";
    }
  };

  const handleSelect = async (id: number) => {
    try {
      await apiSelect(id);
      onDataChanged();
    } catch (err) {
      console.error(err);
      alert("Произошла ошибка при выборе ID");
    }
  };

  return (
    <div className="pane">
      <h2>Доступные элементы</h2>

      <div className="pane-controls">
        <input
          type="text"
          placeholder="Фильтрация по ID..."
          value={search}
          onChange={handleFilterChange}
        />

        <form onSubmit={handleAdd} className="add-form">
          <input
            type="number"
            name="newId"
            placeholder="Новый ID"
            min={1}
          />
          <button type="submit">Добавить</button>
        </form>
      </div>

      <div ref={scrollRef} className="list">
        {items.map((item) => (
          <div
            key={item.id}
            className="list-item"
            onClick={() => handleSelect(item.id)}
          >
            <span>ID: {item.id}</span>
            <button
              className="primary-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(item.id);
              }}
            >
              Выбрать
            </button>
          </div>
        ))}

        {loading && <div className="loading">Загрузка...</div>}

        {!hasMore && !loading && (
          <div className="end">Больше нет элементов</div>
        )}
      </div>
    </div>
  );
};

export default LeftPane;
