import { theme } from 'antd';

// Pokemon type colors - consistent across all themes
const typeColors = {
  colorTypeNormal: '#A8A878',
  colorTypeFire: '#F08030',
  colorTypeWater: '#6890F0',
  colorTypeElectric: '#F8D030',
  colorTypeGrass: '#78C850',
  colorTypeIce: '#98D8D8',
  colorTypeFighting: '#C03028',
  colorTypePoison: '#A040A0',
  colorTypeGround: '#E0C068',
  colorTypeFlying: '#A890F0',
  colorTypePsychic: '#F85888',
  colorTypeBug: '#A8B820',
  colorTypeRock: '#B8A038',
  colorTypeGhost: '#705898',
  colorTypeDragon: '#7038F8',
  colorTypeDark: '#705848',
  colorTypeSteel: '#B8B8D0',
  colorTypeFairy: '#EE99AC',
};

// Stat colors - semantic (consistent across themes)
const statColors = {
  colorStatLow: '#ff4d4f',
  colorStatMedium: '#fa8c16',
  colorStatGood: '#52c41a',
  colorStatExcellent: '#1890ff',
};

// Shiny color - gold (consistent across themes)
const shinyColors = {
  colorShiny: '#FFD700',
};

// Version colors - game specific (consistent across themes)
const versionColors = {
  colorVersionFireRed: '#FF4444',
  colorVersionLeafGreen: '#2E8B3A',
};

// Combined custom tokens (same for both themes)
const customTokens = {
  ...typeColors,
  ...statColors,
  ...shinyColors,
  ...versionColors,
};

// Fire Red (dark) theme palette
export const fireRedTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    ...customTokens,
    colorPrimary: '#FF6B4A',
    colorPrimaryHover: '#FF7D5E',
    colorPrimaryActive: '#E85539',
    borderRadius: 8,
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    colorBgContainer: '#1A1412',
    colorBgElevated: '#221A18',
    colorBgLayout: '#0F0C0A',
    colorBorder: '#3A2A25',
    colorBorderSecondary: '#2A1F1C',
    colorText: '#FFF8F5',
    colorTextSecondary: '#D4BCB0',
    colorTextTertiary: '#9A8880',
    colorTextQuaternary: '#9A8880',
  },
  components: {
    Card: {
      colorBgContainer: '#1A1412',
      borderRadiusLG: 12,
    },
    Input: {
      colorBgContainer: 'transparent',
      colorText: '#FFF8F5',
      colorPlaceholder: '#9A8880',
    },
    Drawer: {
      colorBgElevated: '#221A18',
      colorBgContainer: '#221A18',
    },
    Modal: {
      contentBg: '#1A1412',
      headerBg: '#1A1412',
    },
    Table: {
      headerBg: 'transparent',
      rowHoverBg: 'rgba(255,107,74,0.08)',
      borderColor: '#3A2A25',
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Segmented: {
      itemColor: '#D4BCB0',
      itemHoverColor: '#FFF8F5',
      itemSelectedColor: '#FF6B4A',
      itemSelectedBg: 'rgba(255,107,74,0.15)',
      trackBg: 'transparent',
    },
    Progress: {
      defaultColor: '#FF6B4A',
      remainingColor: '#3A2A25',
    },
    FloatButton: {
      colorBgElevated: '#FF6B4A',
    },
    Timeline: {
      dotBg: '#FF6B4A',
      tailColor: '#3A2A25',
    },
    Divider: {
      colorSplit: '#3A2A25',
    },
  },
};

// Leaf Green (light) theme palette
export const leafGreenTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    ...customTokens,
    colorPrimary: '#4CAF50',
    colorPrimaryHover: '#43A047',
    colorPrimaryActive: '#388E3C',
    borderRadius: 8,
    fontFamily: "'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    colorBgContainer: '#FFFFFF',
    colorBgElevated: '#F6FAF6',
    colorBgLayout: '#F1F8F1',
    colorBorder: '#C8E6C9',
    colorBorderSecondary: '#D4EAD4',
    colorText: '#1A2E1A',
    colorTextSecondary: '#4A6848',
    colorTextTertiary: '#6B8868',
    colorTextQuaternary: '#6B8868',
  },
  components: {
    Card: {
      colorBgContainer: '#FFFFFF',
      borderRadiusLG: 12,
    },
    Input: {
      colorBgContainer: 'transparent',
      colorText: '#1A2E1A',
      colorPlaceholder: '#6B8868',
    },
    Drawer: {
      colorBgElevated: '#F6FAF6',
      colorBgContainer: '#F6FAF6',
    },
    Modal: {
      contentBg: '#FFFFFF',
      headerBg: '#FFFFFF',
    },
    Table: {
      headerBg: 'transparent',
      rowHoverBg: 'rgba(76,175,80,0.08)',
      borderColor: '#C8E6C9',
    },
    Collapse: {
      headerBg: 'transparent',
      contentBg: 'transparent',
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Segmented: {
      itemColor: '#4A6848',
      itemHoverColor: '#1A2E1A',
      itemSelectedColor: '#4CAF50',
      itemSelectedBg: 'rgba(76,175,80,0.15)',
      trackBg: 'transparent',
    },
    Progress: {
      defaultColor: '#4CAF50',
      remainingColor: '#E8F0E8',
    },
    FloatButton: {
      colorBgElevated: '#4CAF50',
    },
    Timeline: {
      dotBg: '#4CAF50',
      tailColor: '#E8F0E8',
    },
    Divider: {
      colorSplit: '#C8E6C9',
    },
  },
};
