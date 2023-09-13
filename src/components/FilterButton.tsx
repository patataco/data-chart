const FilterButton = ({ ids, setFilteredId }) => {
  return (
    <div>
      <button onClick={() => setFilteredId(null)}>전체</button>
      {ids.map((id) => (
        <button key={id} onClick={() => setFilteredId(id)}>
          {id}
        </button>
      ))}
    </div>
  );
};

export default FilterButton;
