import { ANCESTRIES } from "@/data/ancestries";
import { CLASSES } from "@/data/classes";
import { COMMUNITIES } from "@/data/communities";
import { DOMAIN_CARDS } from "@/data/domainCards";
import type { Character } from "@/types/character";

interface PrintableCharacterCardProps {
  character: Character;
}

export function PrintableCharacterCard({
  character,
}: PrintableCharacterCardProps) {
  const cls = CLASSES.find((c) => c.id === character.classId);
  const ancestry = ANCESTRIES.find((a) => a.id === character.ancestryId);
  const community = COMMUNITIES.find((c) => c.id === character.communityId);
  const subclass = cls?.subclasses.find((s) => s.id === character.subclassId);
  const domainCards = DOMAIN_CARDS.filter((c) =>
    character.domainCards.includes(c.id),
  );

  const hpFilled = character.hitPoints;
  const hpMax = character.maxHitPoints;
  const stressFilled = character.stress;
  const stressMax = character.maxStress;
  const hopeFilled = character.hope;
  const hopeMax = character.maxHope;

  return (
    <div
      id="printable-character-card"
      className="printable-card font-body"
      data-ocid="printable.card"
    >
      {/* Header */}
      <div className="printable-card-header">
        <div className="flex items-center gap-3">
          {character.portraitDataUrl ? (
            <img
              src={character.portraitDataUrl}
              alt={character.name}
              className="printable-portrait"
            />
          ) : (
            <div className="printable-portrait-placeholder">
              <span className="text-xl">⚔️</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="printable-name">{character.name}</h1>
            <p className="printable-subtitle">
              Level {character.level} {cls?.name}
            </p>
            <p className="printable-subtitle">
              {ancestry?.name} · {community?.name}
            </p>
            {subclass && <p className="printable-subclass">{subclass.name}</p>}
          </div>
        </div>
      </div>

      <div className="printable-divider" />

      {/* Core Stats Row */}
      <div className="printable-stats-row">
        <div className="printable-stat-box">
          <div className="printable-stat-label">Evasion</div>
          <div className="printable-stat-value">{character.evasion}</div>
        </div>
        <div className="printable-stat-box">
          <div className="printable-stat-label">Armor</div>
          <div className="printable-stat-value">{character.armorThreshold}</div>
        </div>
        <div className="printable-stat-box">
          <div className="printable-stat-label">Proficiency</div>
          <div className="printable-stat-value">{character.proficiency}</div>
        </div>
        <div className="printable-stat-box">
          <div className="printable-stat-label">Gold</div>
          <div className="printable-stat-value gold-value">
            {character.gold ?? 0}
          </div>
        </div>
      </div>

      <div className="printable-divider" />

      {/* Tracker Section */}
      <div className="printable-section">
        <h2 className="printable-section-title">Trackers</h2>

        {/* HP */}
        <div className="printable-tracker">
          <div className="printable-tracker-label">
            Hit Points ({hpFilled}/{hpMax})
          </div>
          <div className="printable-slot-row">
            {Array.from({ length: hpMax }).map((_, i) => (
              <div
                key={`hp-${i}`}
                className={`printable-slot printable-slot-hp${i < hpFilled ? " filled" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Stress */}
        <div className="printable-tracker">
          <div className="printable-tracker-label">
            Stress ({stressFilled}/{stressMax})
          </div>
          <div className="printable-slot-row">
            {Array.from({ length: stressMax }).map((_, i) => (
              <div
                key={`stress-${i}`}
                className={`printable-slot printable-slot-stress${i < stressFilled ? " filled" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Hope */}
        <div className="printable-tracker">
          <div className="printable-tracker-label">
            Hope ({hopeFilled}/{hopeMax})
          </div>
          <div className="printable-slot-row">
            {Array.from({ length: hopeMax }).map((_, i) => (
              <div
                key={`hope-${i}`}
                className={`printable-slot printable-slot-hope${i < hopeFilled ? " filled" : ""}`}
              />
            ))}
          </div>
        </div>

        {/* Armor */}
        <div className="printable-tracker">
          <div className="printable-tracker-label">
            Spendable Armor ({character.spendableArmor}/
            {character.armorThreshold})
          </div>
          <div className="printable-slot-row">
            {Array.from({ length: Math.min(character.armorThreshold, 10) }).map(
              (_, i) => (
                <div
                  key={`armor-${i}`}
                  className={`printable-slot printable-slot-armor${i < character.spendableArmor ? " filled" : ""}`}
                />
              ),
            )}
          </div>
        </div>
      </div>

      <div className="printable-divider" />

      {/* Traits */}
      <div className="printable-section">
        <h2 className="printable-section-title">Traits</h2>
        <div className="printable-traits-grid">
          {(
            [
              ["Agility", character.traits.agility],
              ["Strength", character.traits.strength],
              ["Finesse", character.traits.finesse],
              ["Instinct", character.traits.instinct],
              ["Presence", character.traits.presence],
              ["Knowledge", character.traits.knowledge],
            ] as [string, number][]
          ).map(([label, value]) => (
            <div key={label} className="printable-trait">
              <div className="printable-trait-label">{label}</div>
              <div className="printable-trait-value">
                {value >= 0 ? `+${value}` : value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Cards */}
      {domainCards.length > 0 && (
        <>
          <div className="printable-divider" />
          <div className="printable-section">
            <h2 className="printable-section-title">
              Domain Cards ({domainCards.length})
            </h2>
            <div className="printable-list">
              {domainCards.map((card) => (
                <div key={card.id} className="printable-list-item">
                  <span className="printable-list-item-name">{card.name}</span>
                  <span className="printable-list-item-meta">
                    {card.domain} · {card.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Known Spells */}
      {character.knownSpells.length > 0 && (
        <>
          <div className="printable-divider" />
          <div className="printable-section">
            <h2 className="printable-section-title">
              Known Spells ({character.knownSpells.length})
            </h2>
            <div className="printable-list">
              {character.knownSpells.map((spell) => (
                <div key={spell} className="printable-list-item">
                  <span className="printable-list-item-name">{spell}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Experiences */}
      {character.experiences && (
        <>
          <div className="printable-divider" />
          <div className="printable-section">
            <h2 className="printable-section-title">Experiences</h2>
            <p className="printable-experiences">{character.experiences}</p>
          </div>
        </>
      )}

      {/* Notes */}
      {character.notes && (
        <>
          <div className="printable-divider" />
          <div className="printable-section">
            <h2 className="printable-section-title">Notes</h2>
            <p className="printable-experiences">{character.notes}</p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="printable-footer">
        <span>Dagger's Sheet</span>
        <span>caffeine.ai</span>
      </div>
    </div>
  );
}
