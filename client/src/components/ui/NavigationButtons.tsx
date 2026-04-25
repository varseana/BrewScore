// ⁘[ NAVIGATION BUTTONS ]⁘
// como llegar ~ waze, google maps, uber

interface Props {
  lat: number;
  lng: number;
  name: string;
}

export function NavigationButtons({ lat, lng, name }: Props) {
  const encoded = encodeURIComponent(name);

  const links = [
    {
      label: "Google Maps",
      icon: "📍",
      url: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${encoded}`,
      color: "bg-[#4285F4]/15 border-[#4285F4]/30 text-[#4285F4] hover:bg-[#4285F4]/25",
    },
    {
      label: "Waze",
      icon: "🗺",
      url: `https://waze.com/ul?ll=${lat},${lng}&navigate=yes&z=15`,
      color: "bg-[#33CCFF]/15 border-[#33CCFF]/30 text-[#33CCFF] hover:bg-[#33CCFF]/25",
    },
    {
      label: "Uber",
      icon: "🚗",
      url: `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${lat}&dropoff[longitude]=${lng}&dropoff[nickname]=${encoded}`,
      color: "bg-[#fff]/10 border-[#fff]/20 text-text-primary hover:bg-[#fff]/15",
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
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-medium transition-all duration-150 ${l.color}`}
        >
          <span>{l.icon}</span>
          {l.label}
        </a>
      ))}
    </div>
  );
}
