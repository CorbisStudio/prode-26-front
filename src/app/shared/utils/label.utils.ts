const STAGE_LABELS: Record<string, string> = {
  GROUP_STAGE: 'Fase de grupos',
  LAST_32: 'Dieciseisavos de final',
  ROUND_OF_32: 'Dieciseisavos de final',
  LAST_16: 'Octavos de final',
  ROUND_OF_16: 'Octavos de final',
  QUARTER_FINALS: 'Cuartos de final',
  QUARTER_FINAL: 'Cuartos de final',
  SEMI_FINALS: 'Semifinales',
  SEMI_FINAL: 'Semifinales',
  THIRD_PLACE: 'Tercer puesto',
  FINAL: 'Final',
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
  if (groupMatch) return `Grupo ${groupMatch[1]}`;
  return STAGE_LABELS[norm] ?? value;
}
