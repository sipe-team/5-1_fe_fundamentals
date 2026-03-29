import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAutoComplete } from '@/hooks/queries/useAutocomplete';
import { useAutocompleteDropdown } from '@/hooks/useAutocompleteDropdown';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '../ui/input';

interface SearchInputProps {
  defaultValue?: string;
  onSearch: (keyword: string) => void;
}

export const SearchInput = ({
  defaultValue = '',
  onSearch,
}: SearchInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data } = useAutoComplete(inputValue);
  const suggestions = data?.suggestions ?? [];
  const hasSuggestions = suggestions.length > 0;

  const { isOpen, containerRef, openDropdown, closeDropdown } =
    useAutocompleteDropdown();

  useEffect(() => {
    if (suggestions.length > 0 && inputValue.trim()) {
      openDropdown();
    }
  }, [suggestions, inputValue, openDropdown]);

  const debouncedSearch = useDebounce((value: string) => {
    onSearch(value);
  }, 500);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
    if (!value.trim()) closeDropdown();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      closeDropdown();
      inputRef.current?.blur();
    }
  };

  const handleSelect = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    closeDropdown();
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <Input
        ref={inputRef}
        className="w-full"
        placeholder="keyword 검색"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />

      {isOpen && hasSuggestions && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                className="w-full cursor-pointer px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                onMouseDown={(e) => {
                  // NOTE: onBlur보다 먼저 실행되도록 mousedown 사용
                  e.preventDefault();
                  handleSelect(suggestion);
                }}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
