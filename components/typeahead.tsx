'use client';
import type { TypeAheadState } from '../hooks/useTypeAhead';
import useTypeAhead from '../hooks/useTypeAhead';

type StateTypeAhead = TypeAheadState<string>;

type StatusMessage = { msg: string; ariaLive: 'polite' | 'assertive' };

const getStatusMessage = (state: StateTypeAhead): StatusMessage => {
  switch (state.status) {
    case 'idle':
      return { msg: '', ariaLive: 'polite' };
    case 'loading':
      return { msg: 'Searching...', ariaLive: 'polite' };
    case 'results':
      return { msg: `Showing ${state.items.length} of ${state.total} results`, ariaLive: 'polite' };
    case 'empty':
      return { msg: `No results for ${state.query}.`, ariaLive: 'polite' };
    case 'error':
      return { msg: `Error: ${state.message}`, ariaLive: 'assertive' };
    default: {
      const _exhaustive: never = state;
      throw new Error(`Unhandled state: ${JSON.stringify(_exhaustive)}`);
    }
  }
};

const TypeAhead = ({ limit, url }: { limit: number, url: string }) => {


  const { state, setQuery, query, select, activeIndex, onKeyDown, isOpen
  } = useTypeAhead(url, limit);

  const { msg, ariaLive } = getStatusMessage(state);
  const showList = state.status === 'results' && isOpen;

  return <>
    <div>SearchInput:
      <input
        id='search' type='text' onKeyDown={onKeyDown} role='combobox'
        aria-expanded={showList} aria-controls='suggestions'
        aria-autocomplete="list" aria-activedescendant={showList && activeIndex !== null ? `item_${activeIndex}` : undefined}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
        placeholder='searching...'
        value={query}
      />
    </div >
    {showList && (
      <>
        <ul id='suggestions' role="listbox" aria-label="Search results">
          {state.items.map((item, index) => (
            <li
              onClick={() => select(item)}
              id={`item_${index}`}
              role="option"
              aria-selected={index === activeIndex}
              key={item}
              className={`cursor-pointer px-2 py-1 ${index === activeIndex ? 'bg-blue-600 text-white font-medium' : 'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </>
    )}
    <div aria-live={ariaLive} role={ariaLive === 'assertive' ? 'alert' : 'status'}>{msg}</div>

  </>;
};

export default TypeAhead;