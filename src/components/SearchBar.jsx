import { memo } from 'react';
import { Input, Flex, theme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchBar = memo(function SearchBar({ 
  value, 
  onChange, 
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
    </Flex>
  );
});

export default SearchBar;
