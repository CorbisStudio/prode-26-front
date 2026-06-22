const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: $localize`Fase de grupos`,
  LAST_32: $localize`Dieciseisavos de final`,
  ROUND_OF_32: $localize`Dieciseisavos de final`,
  LAST_16: $localize`Octavos de final`,
  ROUND_OF_16: $localize`Octavos de final`,
  QUARTER_FINALS: $localize`Cuartos de final`,
  QUARTER_FINAL: $localize`Cuartos de final`,
  SEMI_FINALS: $localize`Semifinales`,
  SEMI_FINAL: $localize`Semifinales`,
  THIRD_PLACE: $localize`Tercer puesto`,
  FINAL: $localize`Final`,
};

/**
 * Translates backend stage/group identifiers ("GROUP A", "GROUP_STAGE",
 * "LAST_16"…) into Spanish display labels ("Grupo A", "Fase de grupos",
 * "Octavos de final"…). Unknown values pass through unchanged.
 */
export function formatStageLabel(value: string | null | undefined): string {
  if (!value) return '';
  const norm = value.trim().toUpperCase().replace(/\s+/g, '_');
  const groupMatch = norm.match(/^GROUP_([A-L])$/);
  if (groupMatch) return $localize`Grupo ${groupMatch[1]}`;
  return STAGE_LABELS[norm] ?? value;
}
