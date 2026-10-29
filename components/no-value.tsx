// Empty cell: visible dash for sighted users, readable text for screen readers.
const NoValue = () => (
  <>
    <span aria-hidden="true">—</span>
    <span className="sr-only">Not available</span>
  </>
);

export default NoValue;