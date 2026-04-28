'use client';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

// Affordability Engine Icon with Cape Design
// A price tag with a superhero cape - representing pricing power and savings
export function AffordabilityIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cape - flowing behind */}
      <path
        d="M14 4C14 4 18 5 19 8C20 11 19 14 18 16C17.5 17 16 18 16 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M15 3C15 3 20 4 21 9C22 14 20 17 18 19"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Main body - price tag shape */}
      <path
        d="M3 7L10 2L17 7V16C17 17.1 16.1 18 15 18H5C3.9 18 3 17.1 3 16V7Z"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
      />

      {/* Tag hole */}
      <circle cx="10" cy="6" r="1" fill={color} />

      {/* Price/savings symbol */}
      <text
        x="10"
        y="14.5"
        fontSize="7"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
        stroke="none"
      >
        $
      </text>

      {/* Small cape tie at neck */}
      <path
        d="M8 5C8 5 7 6 7 7"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Alternative: Shopping cart with cape (hero cart)
export function AffordabilityHeroIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cape flowing behind */}
      <path
        d="M16 2C16 2 21 4 22 8C23 12 21 16 19 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M15 3C15 3 19 5 20 9C21 13 19 16 17 18"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      {/* Cart body */}
      <path
        d="M6 2L3 6V18C3 19.1 3.9 20 5 20H17C18.1 20 19 19.1 19 18V6L16 2H6Z"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
      />

      {/* Cart divider line */}
      <path d="M3 6H19" stroke={color} strokeWidth="1.75" />

      {/* Price tag badge */}
      <circle cx="11" cy="12" r="3.5" fill={color} opacity="0.15" stroke={color} strokeWidth="1.25" />
      <text
        x="11"
        y="13.5"
        fontSize="5"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
        stroke="none"
      >
        $
      </text>

      {/* Cape attachment points */}
      <circle cx="6" cy="5" r="0.75" fill={color} />
      <circle cx="16" cy="5" r="0.75" fill={color} />
    </svg>
  );
}

// Third option: Shield with cape and price symbol
export function AffordabilityShieldIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Cape */}
      <path
        d="M17 3C17 3 22 5 23 10C24 15 21 19 18 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M16 4C16 4 20 6 21 10C22 14 19 18 17 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Shield shape */}
      <path
        d="M12 2L4 5V11C4 16 7.5 20.5 12 22C16.5 20.5 20 16 20 11V5L12 2Z"
        fill="none"
        stroke={color}
        strokeWidth="1.75"
      />

      {/* Dollar sign inside */}
      <text
        x="12"
        y="15"
        fontSize="9"
        fontWeight="bold"
        fill={color}
        textAnchor="middle"
        stroke="none"
      >
        $
      </text>

      {/* Cape attachment at shoulder */}
      <circle cx="5" cy="6" r="1" fill={color} opacity="0.7" />
    </svg>
  );
}

// Export all three variants
export const AFFORDABILITY_ICONS = {
  tag: AffordabilityIcon,
  heroCart: AffordabilityHeroIcon,
  shield: AffordabilityShieldIcon,
};