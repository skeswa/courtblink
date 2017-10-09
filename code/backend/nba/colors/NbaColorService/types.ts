/** Tuple of the primary and secondary colors for a team. */
export type TeamColors = {
  /** Most important hex-formatted color. */
  primaryColor: string
  /** Second-most important hex-formatted color. */
  secondaryColor: string
}

/** Service that expose NBA color related functionality. */
export interface NbaColorService {
  /**
   * Gets the hex-formatted colors for the team identified by `fullTeamName`.
   * @param fullTeamName name of the team for which the color will be fetched.
   * @return hex-formatted colors for the team identified by `fullTeamName`.
   */
  fetchTeamColor(fullTeamName: string): Promise<TeamColors>
}

/** Strategy for creating a new `NbaColorService`. */
export enum NbaColorServiceCreationStrategy {
  /** Uses statically defined colors instead of fetching them from an API. */
  UsingStaticColors = 'UsingStaticColors',
}