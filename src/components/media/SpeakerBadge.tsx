interface SpeakerBadgeProps {
  speaker: string;
}

export default function SpeakerBadge({ speaker }: SpeakerBadgeProps) {
  let modifier = '';
  const s = speaker.toUpperCase();
  
  if (s.includes('1') || s.includes('PRIMARY')) modifier = 'speaker-badge--1';
  else if (s.includes('2') || s.includes('SECONDARY')) modifier = 'speaker-badge--2';
  else if (s.includes('3')) modifier = 'speaker-badge--3';
  else if (s === 'SYSTEM' || s.includes('AUTO')) modifier = 'speaker-badge--system';

  return (
    <span className={`speaker-badge ${modifier}`}>
      {speaker}
    </span>
  );
}
