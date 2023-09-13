import { Dispatch, SetStateAction } from 'react';

import Button from '@/components/Button';

type FilterButtonProps = {
  ids: string[];
  setFilteredId: Dispatch<SetStateAction<string | null>>;
  filteredId: string | null;
};

const FilterButton = ({
  ids,
  setFilteredId,
  filteredId,
}: FilterButtonProps) => {
  return (
    <div className="flex w-full justify-center gap-16">
      <Button isActive={!filteredId} onClick={() => setFilteredId(null)}>
        전체
      </Button>
      {ids.map((id) => (
        <Button
          key={id}
          onClick={() => setFilteredId(id)}
          isActive={id === filteredId}
        >
          {id}
        </Button>
      ))}
    </div>
  );
};

export default FilterButton;
