import { useState, useCallback, memo } from 'react';
import { Flex, Typography, theme } from 'antd';

const { Text } = Typography;

/**
 * Reusable sprite component with error handling and fallback.
 */
const Sprite = memo(function Sprite({
  id,
  size = 80,
  isCaught = true,
  mode = 'light',
  showFallback = true,
  style,
  imgStyle,
}) {
  const { token } = theme.useToken();
  const [spriteError, setSpriteError] = useState(false);

  const handleSpriteError = useCallback(() => {
    setSpriteError(true);
  }, []);

  const formattedNumber = String(id).padStart(3, '0');

  // Compute filter based on caught status
  // "Who's that Pokemon?" silhouette effect for uncaught
  const filter = isCaught
    ? 'none'
    : 'brightness(0) opacity(0.4)';

  const baseImgStyle = {
    imageRendering: 'pixelated',
    width: '100%',
    height: '100%',
    ...imgStyle,
  };

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        width: size,
        height: size,
        filter,
        transition: `filter ${token.motionDurationMid}`,
        ...style,
      }}
    >
      {spriteError && showFallback ? (
        <Flex
          align="center"
          justify="center"
          style={{
            width: '100%',
            height: '100%',
            border: `1px dashed ${token.colorBorder}`,
            borderRadius: token.borderRadiusSM,
            color: token.colorTextQuaternary,
            fontSize: size > 48 ? token.fontSizeLG : token.fontSizeSM,
            fontWeight: token.fontWeightStrong,
          }}
        >
          #{formattedNumber}
        </Flex>
      ) : (
        <img
          src={`./sprites/${id}.png`}
          alt={`Pokemon #${formattedNumber}`}
          width={size}
          height={size}
          style={baseImgStyle}
          onError={handleSpriteError}
        />
      )}
    </Flex>
  );
});

export default Sprite;