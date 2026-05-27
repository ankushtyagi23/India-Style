export default function IndiaFlag({ className = "w-8 h-6 mr-3 shadow-md rounded-sm overflow-hidden" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 900 600" xmlns="http://www.w3.org/2000/svg">
      <rect width="900" height="200" fill="#FF9933" />
      <rect width="900" height="200" y="200" fill="#FFFFFF" />
      <rect width="900" height="200" y="400" fill="#138808" />
      <circle cx="450" cy="300" r="80" fill="none" stroke="#000080" strokeWidth="8" />
      <circle cx="450" cy="300" r="16" fill="#000080" />
      <g transform="translate(450, 300)">
        {Array.from({ length: 24 }).map((_, i) => (
          <polygon key={i} points="0,-16 4,-75 -4,-75" fill="#000080" transform={`rotate(${i * 15})`} />
        ))}
      </g>
    </svg>
  );
}
