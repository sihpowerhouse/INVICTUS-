interface PlaceholderPageProps {
  title: string;
  section?: string;
}

/**
 * Reusable placeholder for routes that haven't been built yet.
 * Will be replaced by real page components one-by-one.
 */
function PlaceholderPage({ title, section }: PlaceholderPageProps) {
  return (
    <>
      <p className="page-tag">
        INVICTUS{section ? ` / ${section}` : ''}
      </p>
      <h1>{title}</h1>
      <p style={{ color: '#5f697a', marginTop: '12px', fontSize: '14px' }}>
        This module is under development.
      </p>
    </>
  );
}

export default PlaceholderPage;
