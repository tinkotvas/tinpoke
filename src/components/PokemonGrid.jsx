import { memo, useCallback, forwardRef } from 'react';
import { Empty, Typography, theme } from 'antd';
import { VirtuosoGrid } from 'react-virtuoso';
import { useCaughtStore } from '../stores/caughtStore.js';
import PokemonCard from './PokemonCard.jsx';

const { Text } = Typography;

const EmptyContent = memo(function EmptyContent() {
  const { token } = theme.useToken();
  return (
    <Empty
      description={
        <Text type="secondary" style={{ letterSpacing: 2 }}>
          NO POKEMON FOUND
        </Text>
      }
      style={{ padding: `${token.paddingXL * 2}px ${token.paddingLG}px` }}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  );
});

const GridList = forwardRef(function GridList({ style, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      {...props}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'flex-start',
      }}
    >
      {children}
    </div>
  );
});

const GridItem = memo(function GridItem({ children, ...props }) {
  return (
    <div
      {...props}
      style={{
        flex: '1 1 140px',
        maxWidth: 200,
        minWidth: 140,
        padding: 4,
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
});

export default function PokemonGrid({ pokemon, onToggle, onToggleShiny, onSelect }) {
  const { token } = theme.useToken();
  
  // Read from store directly
  const caught = useCaughtStore((s) => s.caught);
  const shiny = useCaughtStore((s) => s.shiny);

  const itemContent = useCallback((index, [id, name, types]) => (
    <PokemonCard
      id={id}
      name={name}
      types={types}
      isCaught={caught.has(id)}
      isShiny={shiny?.has(id)}
      onToggle={onToggle}
      onToggleShiny={onToggleShiny}
      onSelect={onSelect}
    />
  ), [caught, shiny, onToggle, onToggleShiny, onSelect]);

  if (pokemon.length === 0) {
    return <EmptyContent />;
  }

  return (
    <VirtuosoGrid
      style={{ height: '100%' }}
      data={pokemon}
      itemContent={itemContent}
      components={{
        List: GridList,
        Item: GridItem,
      }}
      listClassName="virtuoso-grid-list"
      itemClassName="virtuoso-grid-item"
    />
  );
}