import { theme } from 'antd';

// Fire Red (dark) theme palette
export const fireRedTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
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
