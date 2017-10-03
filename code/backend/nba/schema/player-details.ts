// TODO(skeswa): docs.
export type AllPlayerDetails = {
  league: { standard: PlayerDetails[] }
}

// TODO(skeswa): docs.
export type PlayerDetails = {
  firstName: string
  lastName: string
  personId: string
  teamId: string
  jersey: string
  pos: string
  heightFeet: string
  heightInches: string
  weightPounds: string
  nbaDebutYear: string
  yearsPro: string
  collegeName: string
  country: string
  draft: DraftDetails
}

// TODO(skeswa): docs.
export type DraftDetails = {
  teamId: string
  pickNum: string
  roundNum: string
  seasonYear: string
}