import React from 'react';

interface FlavorBarProps {
  label: string;
  value: number; // 1 to 5
  description?: string;
  colorClass?: string;
}

export const FlavorBar: React.FC<FlavorBarProps> = ({
  label,
  value,
  description,
  colorClass = 'bg-tierra',
}) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-espresso capitalize">{label}</span>
        <span className="font-bold text-tierra">{value} / 5</span>
      </div>
      <div className="w-full h-2 bg-lino/80 rounded-full overflow-hidden flex gap-0.5">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className={`flex-1 h-full rounded-sm transition-all duration-300 ${
              step <= value ? colorClass : 'bg-transparent'
            }`}
          />
        ))}
      </div>
      {description && <p className="text-[10px] text-tierra/70 mt-0.5">{description}</p>}
    </div>
  );
};

export const FlavorProfileWidget: React.FC<{
  profile: { acidity: number; body: number; sweetness: number; bitterness: number };
}> = ({ profile }) => {
  return (
    <div className="p-4 bg-crema-light/80 rounded-2xl border border-lino space-y-3">
      <h4 className="text-xs font-serif font-bold uppercase tracking-wider text-espresso">
        Perfil Sensorial en Taza
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FlavorBar
          label="Acidez"
          value={profile.acidity}
          description="Brillante, jugosa y cítrica"
          colorClass="bg-ocre"
        />
        <FlavorBar
          label="Cuerpo"
          value={profile.body}
          description="Sensación táctil y untuosidad"
          colorClass="bg-tierra"
        />
        <FlavorBar
          label="Dulzor"
          value={profile.sweetness}
          description="Azúcares naturales y caramelo"
          colorClass="bg-ocre-dark"
        />
        <FlavorBar
          label="Amargor"
          value={profile.bitterness}
          description="Estructura y cacao noble"
          colorClass="bg-espresso"
        />
      </div>
    </div>
  );
};
