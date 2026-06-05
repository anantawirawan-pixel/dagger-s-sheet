import { SelectableCard } from "@/components/SelectableCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOMAIN_ACCENT_HEX } from "@/data/spells";
import { cn } from "@/lib/utils";
import type {
  AncestryFeature,
  DomainCard,
  SubclassFeature,
} from "@/types/character";
import { Lock } from "lucide-react";
import type React from "react";

interface FeatureCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  locked?: boolean;
  levelRequirement?: number;
}

export function FeatureCard({
  title,
  subtitle,
  description,
  icon,
  locked,
  levelRequirement,
}: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "card-fantasy transition-smooth",
        locked && "opacity-50 grayscale-[50%]",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-primary">{icon}</span>}
          <CardTitle className="text-sm font-display font-bold text-foreground">
            {title}
          </CardTitle>
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {locked && levelRequirement !== undefined && (
          <div className="flex items-center gap-1 text-xs font-medium text-primary mt-1">
            <Lock className="size-3" />
            Unlocks at Level {levelRequirement}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

export function AncestryFeatureCard({ feature }: { feature: AncestryFeature }) {
  return <FeatureCard title={feature.name} description={feature.description} />;
}

export function SubclassFeatureCard({ feature }: { feature: SubclassFeature }) {
  return (
    <FeatureCard
      title={feature.name}
      subtitle={`Level ${feature.level}`}
      description={feature.description}
    />
  );
}

export function DomainCardItem({
  card,
  selected,
  onSelect,
}: {
  card: DomainCard;
  selected?: boolean;
  onSelect?: () => void;
}) {
  const accentHex =
    DOMAIN_ACCENT_HEX[card.domain as keyof typeof DOMAIN_ACCENT_HEX];
  if (onSelect) {
    return (
      <SelectableCard
        selected={selected ?? false}
        selectionType="domain"
        onClick={onSelect}
        style={{ borderColor: accentHex ? `${accentHex}60` : undefined }}
      >
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-display font-bold text-foreground">
              {card.name}
            </p>
            <span
              className="text-xs font-medium"
              style={{ color: accentHex ?? undefined }}
            >
              {card.domain} L{card.level}
            </span>
          </div>
          <p className="text-xs text-muted-foreground capitalize">
            {card.type}
          </p>
        </div>
        <div className="px-4 pb-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {card.description}
          </p>
        </div>
      </SelectableCard>
    );
  }
  return (
    <Card
      className="card-fantasy"
      style={{ borderColor: accentHex ? `${accentHex}60` : undefined }}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-display font-bold text-foreground">
            {card.name}
          </CardTitle>
          <span
            className="text-xs font-medium"
            style={{ color: accentHex ?? undefined }}
          >
            {card.domain} L{card.level}
          </span>
        </div>
        <p className="text-xs text-muted-foreground capitalize">{card.type}</p>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {card.description}
        </p>
      </CardContent>
    </Card>
  );
}
