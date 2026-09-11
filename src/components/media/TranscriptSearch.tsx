import { Search } from 'lucide-react';

interface TranscriptSearchProps {
  query: string;
  onQueryChange: (q: string) => void;
  resultCount: number;
}

export default function TranscriptSearch({ query, onQueryChange, resultCount }: TranscriptSearchProps) {
  return (
    <div className="transcript-search">
      <Search size={14} color="var(--text-muted)" />
      <input
        type="text"
        placeholder="SEARCH TRANSCRIPT..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        aria-label="Search transcript"
      />
      {query.trim().length > 0 && (
        <span className="transcript-search__count">{resultCount} MATCHES</span>
      )}
    </div>
  );
}
