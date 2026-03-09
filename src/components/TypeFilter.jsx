import { memo, useCallback } from 'react';
import { Tag, Flex, theme } from 'antd';
import { TYPES, getTypeIcon } from '../data/pokemon.js';

const TypeFilter = memo(function TypeFilter({ selectedTypes, onTypesChange }) {
  const { token } = theme.useToken();

  const handleTypeClick = useCallback((type) => {
    const next = new Set(selectedTypes);
    if (next.has(type)) {
      next.delete(type);
    } else {
      next.add(type);
    }
    onTypesChange(next);
  }, [selectedTypes, onTypesChange]);

  const handleClearAll = useCallback(() => {
    onTypesChange(new Set());
  }, [onTypesChange]);

  const hasSelection = selectedTypes.size > 0;

  return (
    <Flex
      vertical
      gap={token.paddingXS}
      style={{
        padding: `${token.paddingXS}px ${token.paddingLG}px`,
        borderBottom: `1px solid ${token.colorBorder}`,
      }}
    >
      <Flex align="center" justify="space-between">
        {hasSelection && (
          <Tag
            style={{ cursor: 'pointer', margin: 0 }}
            onClick={handleClearAll}
          >
            Clear all
          </Tag>
        )}
      </Flex>
      <Flex wrap="wrap" gap={token.paddingXXS}>
        {Object.keys(TYPES).map((type) => {
          const isSelected = selectedTypes.has(type);
          return (
            <Tag
              key={type}
              color={isSelected ? token.colorPrimary : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              onClick={() => handleTypeClick(type)}
              style={{
                cursor: 'pointer',
                margin: 0,
                padding: `${token.paddingXXS}px ${token.paddingXS}px`,
                borderRadius: token.borderRadiusSM,
                fontSize: token.fontSizeSM,
                whiteSpace: 'nowrap',
                transition: `all ${token.motionDurationFast}`,
                border: isSelected
                  ? `1px solid ${token.colorPrimary}`
                  : `1px solid ${token.colorBorder}`,
                background: isSelected
                  ? `${token.colorPrimary}15`
                  : 'transparent',
                color: isSelected
                  ? token.colorPrimary
                  : token.colorTextSecondary,
              }}
            >
              <span style={{ marginRight: token.paddingXXS }}>{getTypeIcon(type)}</span>
              <span style={{ textTransform: 'capitalize' }}>{type}</span>
            </Tag>
          );
        })}
      </Flex>
    </Flex>
  );
});

export default TypeFilter;