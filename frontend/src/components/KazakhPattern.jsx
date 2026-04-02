// Казахский орнамент SVG компонент
export default function KazakhPattern({ className = "" }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg className="absolute top-0 left-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="kazakh-ornament" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            {/* Центральный мотив */}
            <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
            <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="1"/>
            
            {/* Лепестки */}
            <path d="M100 60 Q110 80 100 100 Q90 80 100 60" fill="currentColor" opacity="0.3"/>
            <path d="M140 100 Q120 110 100 100 Q120 90 140 100" fill="currentColor" opacity="0.3"/>
            <path d="M100 140 Q110 120 100 100 Q90 120 100 140" fill="currentColor" opacity="0.3"/>
            <path d="M60 100 Q80 110 100 100 Q80 90 60 100" fill="currentColor" opacity="0.3"/>
            
            {/* Угловые элементы */}
            <path d="M130 70 L140 60 L150 70 L140 80 Z" fill="currentColor" opacity="0.2"/>
            <path d="M130 130 L140 140 L150 130 L140 120 Z" fill="currentColor" opacity="0.2"/>
            <path d="M70 70 L60 60 L50 70 L60 80 Z" fill="currentColor" opacity="0.2"/>
            <path d="M70 130 L60 140 L50 130 L60 120 Z" fill="currentColor" opacity="0.2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kazakh-ornament)"/>
      </svg>
    </div>
  )
}
