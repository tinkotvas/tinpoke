import { memo, useCallback } from 'react';
import { Tag, Flex, theme } from 'antd';
import { TYPES, getTypeIcon } from '../data/pokemon.js';
import { CloseOutlined } from '@ant-design/icons';

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
    <Flex vertical gap={token.paddingXS} style={{ padding: `${token.paddingXS}px ${token.paddingLG}px` }}>
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
                whiteSpace: 'nowrap',
              }}
            >
              {getTypeIcon(type)} <span style={{ textTransform: 'capitalize' }}>{type}</span>
            </Tag>
          );
        })}
        {hasSelection && (
          <Tag
            style={{
              cursor: 'pointer',
              margin: 0,
              padding: `${token.paddingXXS}px ${token.paddingXS}px`,
              whiteSpace: 'nowrap',
            }}
            variant="solid"
            color="error"
            onClick={handleClearAll}>
            <CloseOutlined /> Clear all
          </Tag>
        )}
      </Flex>
    </Flex>
  );
});

export default TypeFilter;
