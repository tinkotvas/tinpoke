import { memo } from 'react';
import { Tag, theme, Tooltip } from 'antd';
import { getTypeColor, getTypeIcon } from '../data/pokemon.js';

/**
 * Reusable type tag component with icon.
 */
const TypeTag = memo(function TypeTag({
  type,
  showLabel = false,
  size = 'default', // 'default' | 'small' | 'mini'
  tooltip = true,
  style,
}) {
  const { token } = theme.useToken();

  const sizeStyles = {
    default: {
      fontSize: token.fontSizeSM,
      padding: token.paddingXXS,
      width: 24,
      height: 24,
    },
    small: {
      fontSize: token.fontSizeXS,
      padding: '0 4px',
      lineHeight: '16px',
    },
    mini: {
      fontSize: token.fontSizeSM,
      padding: 1,
      width: 20,
      height: 20,
    },
  };

  const tagContent = (
    <Tag
      color={getTypeColor(type)}
      variant="filled"
      style={{
        ...sizeStyles[size],
        borderRadius: token.borderRadiusSM,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textTransform: showLabel ? 'capitalize' : undefined,
        ...style,
      }}
    >
      {getTypeIcon(type)}
      {showLabel && <span style={{ marginLeft: 4 }}>{type}</span>}
    </Tag>
  );

  if (tooltip) {
    return (
      <Tooltip title={type}>
        {tagContent}
      </Tooltip>
    );
  }

  return tagContent;
});

export default TypeTag;