'use client';

export const IconArc = ({ size = 120 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <rect width="120" height="120" rx="26" fill="#131732"/>
    <path d="M 88 36 A 37 37 0 1 1 88 84" fill="none" stroke="rgba(214,31,38,0.12)" strokeWidth="18" strokeLinecap="round"/>
    <path d="M 88 36 A 37 37 0 1 1 88 84" fill="none" stroke="#D61F26" strokeWidth="9" strokeLinecap="round"/>
    <circle cx="45" cy="52" r="2.5" fill="#A2FAA3" opacity={0.9}/>
    <circle cx="58" cy="52" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="71" cy="52" r="2.5" fill="#4629FF" opacity={0.6}/>
    <circle cx="45" cy="63" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="58" cy="63" r="4" fill="#A2FAA3"/>
    <circle cx="71" cy="63" r="2.5" fill="#4629FF" opacity={0.8}/>
    <circle cx="45" cy="74" r="2.5" fill="#4629FF" opacity={0.5}/>
    <circle cx="58" cy="74" r="2.5" fill="#A2FAA3" opacity={0.55}/>
    <circle cx="71" cy="74" r="2.5" fill="#A2FAA3" opacity={0.9}/>
    <rect x="76" y="7" width="34" height="16" rx="8" fill="#D61F26"/>
    <text x="93" y="18" fontSize="8" fontWeight="700" fill="white" textAnchor="middle" fontFamily="sans-serif">DH</text>
  </svg>
);