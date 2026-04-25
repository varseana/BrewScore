// ⁘[ NAVIGATION BUTTONS ]⁘
// como llegar ~ waze, google maps, uber con logos reales

interface Props {
  lat: number;
  lng: number;
  name: string;
}

// google maps pin logo
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 92.3 132.3" xmlns="http://www.w3.org/2000/svg">
    <path fill="#1a73e8" d="M60.2 2.2C55.8.8 51 0 46.1 0 32 0 19.3 6.4 10.8 16.5l21.8 18.3L60.2 2.2z"/>
    <path fill="#ea4335" d="M10.8 16.5C4.1 24.5 0 34.9 0 46.1c0 8.7 1.7 15.7 4.6 22l28-33.3-21.8-18.3z"/>
    <path fill="#4285f4" d="M46.2 28.5c9.8 0 17.7 7.9 17.7 17.7 0 4.3-1.6 8.3-4.2 11.4 0 0 13.9-16.6 27.5-32.7-5.6-10.8-15.3-19-27-22.7L32.6 34.8c3.3-3.8 8.1-6.3 13.6-6.3"/>
    <path fill="#fbbc04" d="M46.2 63.8c-9.8 0-17.7-7.9-17.7-17.7 0-4.3 1.5-8.3 4.1-11.3l-28 33.3c4.8 10.6 12.8 19.2 21 29.9l34.1-40.5c-3.3 3.9-8.1 6.3-13.5 6.3"/>
    <path fill="#34a853" d="M59.1 109.2c15.4-24.1 33.3-35 33.3-63.1 0-9.1-2.4-17.2-6.5-24.3L25.6 98c2.6 3.4 5.3 7.3 7.9 11.3 9.4 14.5 6.8 23.1 12.8 23.1s3.4-8.7 12.8-23.2"/>
  </svg>
);

// waze logo
const WazeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="#33ccff" d="M20.54 6.63A9.34 9.34 0 0 0 12.07 2C6.6 2 2.12 6.14 2 11.53a9.4 9.4 0 0 0 1.88 5.93A6.1 6.1 0 0 1 2.5 20.1a.5.5 0 0 0 .38.84 7.09 7.09 0 0 0 4.5-1.64 10.06 10.06 0 0 0 4.69 1.14c5.47 0 9.95-4.14 10.07-9.53a9.27 9.27 0 0 0-1.6-4.28zM8.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm7 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
);

// uber logo
const UberIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M0 7.97v4.958c0 1.867 1.302 3.101 3 3.101s3-1.234 3-3.101V7.97H4.565v4.924c0 1.12-.679 1.76-1.565 1.76-.886 0-1.565-.64-1.565-1.76V7.97H0zm7.5 0v7.895h1.435v-2.704c0-.085-.003-.17-.003-.255.17.63.9 1.17 1.803 1.17 1.603 0 2.765-1.302 2.765-3.053S12.338 7.97 10.735 7.97c-.903 0-1.633.54-1.803 1.17.003-.085.003-.17.003-.255V7.97H7.5zm3.468 1.285c.92 0 1.597.748 1.597 1.768s-.677 1.768-1.597 1.768-1.597-.748-1.597-1.768.677-1.768 1.597-1.768zM15 11.023c0 1.867 1.302 3.053 3 3.053 1.16 0 2.085-.544 2.55-1.404l-1.2-.68c-.255.476-.72.748-1.35.748-.886 0-1.565-.64-1.565-1.717s.679-1.717 1.565-1.717c.63 0 1.095.272 1.35.748l1.2-.68C20.085 8.514 19.16 7.97 18 7.97c-1.698 0-3 1.186-3 3.053zm6.5-3.053v5.895H23v-2.21h1.5v-1.285H23V9.255h2V7.97h-3.5z"/>
  </svg>
);

export function NavigationButtons({ lat, lng, name }: Props) {
  const encoded = encodeURIComponent(name);

  const links = [
    {
      label: "Google Maps",
      icon: <GoogleIcon />,
      url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encoded}`,
      color: "bg-[#4285F4]/10 border-[#4285F4]/25 hover:bg-[#4285F4]/20",
    },
    {
      label: "Waze",
      icon: <WazeIcon />,
      url: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&z=15`,
      color: "bg-[#33CCFF]/10 border-[#33CCFF]/25 hover:bg-[#33CCFF]/20",
    },
    {
      label: "Uber",
      icon: <UberIcon />,
      url: `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encoded}`,
      color: "bg-white/5 border-white/15 hover:bg-white/10",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-medium text-text-primary transition-all duration-150 ${l.color}`}
        >
          {l.icon}
          {l.label}
        </a>
      ))}
    </div>
  );
}
