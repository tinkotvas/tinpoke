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
    colorBorder: '#3A2A25',
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
    colorBorder: '#C8E6C9',
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
  },
};