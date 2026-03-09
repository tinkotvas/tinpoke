import { memo, useCallback } from 'react';
import PokemonMiniCard from './PokemonMiniCard.jsx';

/**
 * PokemonCard wrapper for the grid view.
 * Delegates rendering to the shared PokemonMiniCard component.
 */
const PokemonCard = memo(function PokemonCard({ id, name, types, isCaught, isShiny, onToggle, onToggleShiny, onSelect }) {
  const handleClick = useCallback((clickedId, action) => {
    if (action === 'shiny') {
      onToggleShiny?.(clickedId);
    } else {
      onToggle(clickedId);
    }
  }, [onToggle, onToggleShiny]);

  return (
    <PokemonMiniCard
      id={id}
      name={name}
      types={types}
      isCaught={isCaught}
      isShiny={isShiny}
      onClick={handleClick}
      onSelect={onSelect}
      size="card"
    />
  );
});

export default PokemonCard;
