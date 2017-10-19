// TODO(skeswa): docs.
export type AllTeamDetails = {
  league: { standard: TeamDetails[] }
}

// TODO(skeswa): docs.
export type TeamDetails = {
  teamId: string
  city: string
  tricode: string
  fullName: string
  nickname: string
  divName: string
  confName: string
  altCityName: string
  isNBAFranchise: string
}
