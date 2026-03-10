import { useCallback } from 'react';
import { Card, Typography, Flex, theme, Tooltip } from 'antd';
import { BADGES } from '../data/badges.js';
import { TYPE_HEX_COLORS, TYPE_ICONS } from '../data/pokemon.js';

const { Title, Text } = Typography;

export default function BadgeManager({ badges, onToggle }) {
  const { token } = theme.useToken();

  const handleKeyDown = useCallback((e, badgeId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle(badgeId);
    }
  }, [onToggle]);

  return (
    <Flex vertical gap={token.paddingMD} style={{ padding: token.paddingLG }}>
      <Flex vertical align="center" gap={token.paddingXS}>
        <Title level={4} style={{ margin: 0 }}>Kanto Gym Badges</Title>
        <Text type="secondary" style={{ letterSpacing: 2 }}>
          CLICK TO TOGGLE EARNED STATUS
        </Text>
      </Flex>

      <Flex wrap="wrap" gap={token.paddingMD} justify="center">
        {BADGES.map((badge) => {
          const earned = badges?.has(badge.id);
          return (
            <Card
              key={badge.id}
              variant="borderless"
              onClick={() => onToggle(badge.id)}
              onKeyDown={(e) => handleKeyDown(e, badge.id)}
              role="button"
              tabIndex={0}
              aria-label={`${badge.name} Badge, ${badge.leader}. Type: ${badge.type}. ${earned ? 'Earned' : 'Not earned'}. Click to toggle.`}
              className="badge-card"
              style={{
                width: 140,
                cursor: 'pointer',
                opacity: earned ? 1 : 0.6,
              }}
              styles={{
                body: {
                  padding: token.paddingMD,
                  textAlign: 'center',
                },
              }}
            >
              <Flex vertical align="center" gap={token.paddingXS}>
                <span
                  className={`badge-icon ${earned ? 'earned' : 'unearned'}`}
                  style={{
                    fontSize: 36,
                    lineHeight: 1,
                    filter: earned
                      ? `drop-shadow(0 0 8px ${token.colorPrimary})`
                      : 'grayscale(1)',
                  }}
                >
                  {badge.icon}
                </span>

                <Title level={5} style={{ margin: 0 }}>
                  {badge.name}
                </Title>

                <Text type="secondary" style={{ letterSpacing: 1 }}>
                  {badge.leader}
                </Text>

                <Flex gap={4} justify="center">
                  <Tooltip title={badge.type}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: token.borderRadiusSM,
                        backgroundColor: TYPE_HEX_COLORS[badge.type],
                        textTransform: 'capitalize',
                      }}
                    >
                      {TYPE_ICONS[badge.type]}
                    </span>
                  </Tooltip>
                </Flex>
              </Flex>
            </Card>
          );
        })}
      </Flex>

      <Flex justify="center" style={{ marginTop: token.paddingSM }}>
        <Text type="secondary">
          {badges?.size || 0} of 8 badges earned
        </Text>
      </Flex>
    </Flex>
  );
}
