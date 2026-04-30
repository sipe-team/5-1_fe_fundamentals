import * as Popover from '@radix-ui/react-popover';
import { useEffect, useRef, useState } from 'react';
import { useAutocomplete } from '@/features/search/hooks/useAutocomplete';

interface SearchBarProps {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="autocomplete-highlight">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export function SearchBar({ keyword, onKeywordChange }: SearchBarProps) {
  const [inputValue, setInputValue] = useState(keyword);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { suggestions } = useAutocomplete(inputValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  function selectSuggestion(value: string) {
    setInputValue(value);
    onKeywordChange(value);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  function handleInputChange(value: string) {
    setInputValue(value);
    setIsOpen(true);
  }

  function handleSubmit() {
    onKeywordChange(inputValue);
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0) {
          selectSuggestion(suggestions[activeIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  }

  const showSuggestions = isOpen && suggestions.length > 0;

  return (
    <Popover.Root open={showSuggestions} onOpenChange={setIsOpen}>
      <Popover.Anchor asChild>
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="상품명을 검색하세요"
              value={inputValue}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleKeyDown}
              role="combobox"
              aria-expanded={showSuggestions}
              aria-autocomplete="list"
              aria-controls="autocomplete-list"
              aria-activedescendant={
                activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
              }
            />
            <button
              type="button"
              className="search-button"
              onClick={handleSubmit}
              aria-label="검색"
            >
              검색
            </button>
          </div>
        </div>
      </Popover.Anchor>
      <Popover.Portal>
        <Popover.Content
          className="autocomplete-popover"
          sideOffset={4}
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onInteractOutside={() => setIsOpen(false)}
        >
          <ul
            id="autocomplete-list"
            className="autocomplete-list"
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion}
                id={`suggestion-${index}`}
                className={`autocomplete-item ${index === activeIndex ? 'active' : ''}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={() => selectSuggestion(suggestion)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {highlightMatch(suggestion, inputValue)}
              </li>
            ))}
          </ul>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
