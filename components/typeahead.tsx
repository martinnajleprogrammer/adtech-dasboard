import useTypeAhead from '../hooks/useTypeAhead';

const TypeAhead = ({ limit, url }: { limit: number, url: string }) => {

  const { state, setQuery
    // , query, activeIndex, setQuery, onKeyDown, select
  } = useTypeAhead(url, limit);

  return <>
    <div>SearchInput:
      <input onChange={(e) => setQuery(e.target.value)} placeholder='searching...'>
      </input>
    </div >
    {state.status === 'results' && (
      <>
        <ul role="listbox" aria-label="Search results">
          {state.items.map((item) => (
            <li role="option" aria-selected={false} key={item}>{item}</li>
          ))}
        </ul>
        <div>Showing {state.items.length} of {state.total}</div>
      </>
    )}
    {(state.status) && <div aria-live='assertive'>{state.status}</div>}
    {(state.status === 'error') && <div aria-live='assertive'>ErrorMessage</div>}
    {(state.status === 'empty') && <div aria-live='assertive'>No results.</div>}
  </>;
};

export default TypeAhead;