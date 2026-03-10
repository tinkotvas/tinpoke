import { memo } from 'react';
import { Input, Button, Flex, theme } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const SearchBar = memo(function SearchBar({ 
  value, 
  onChange, 
  showFilters, 
  onToggleFilters, 
  hasActiveFilters,
  placeholder = 'Search Pokémon...' 
}) {
  const { token } = theme.useToken();

  return (
    <Flex
      align="center"
      gap={token.paddingXS}
      style={{
        padding: `${token.paddingXS}px ${token.paddingLG}px`,
      }}
    >
      <Input
        variant="borderless"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        allowClear
        prefix={<SearchOutlined />}
        size="large"
        style={{ flex: 1 }}
      />
      <Button
        type={showFilters || hasActiveFilters ? 'primary' : 'default'}
        icon={<FilterOutlined />}
        onClick={onToggleFilters}
        size="small"
      >
        Filters
      </Button>
    </Flex>
  );
});

export default SearchBar;
