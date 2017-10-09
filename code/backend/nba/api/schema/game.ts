import { Team } from './team'

// TODO(skeswa): docs.
export type Game = {
  gameId: string
  clock: string
  startTimeUTC: string
  endTimeUTC: string
  isStartTimeTBD: boolean
  gameDuration: Duration
  period: Period
  hTeam: Team
  vTeam: Team
  watch: VideoMetadata
}

// TODO(skeswa): docs.
export type VideoMetadata = {
  broadcast: Broadcast
}

// TODO(skeswa): docs.
export type Broadcast = {
  broadcasters: Broadcasters
  video: VideoDetails
}

// TODO(skeswa): docs.
export type Broadcasters = {
  national: Broadcaster[]
  canadian: Broadcaster[]
  hTeam: Broadcaster[]
  vTeam: Broadcaster[]
}

// TODO(skeswa): docs.
export type VideoDetails = {
  canPurchase: boolean
  isLeaguePass: boolean
  isTNTOT: boolean
  streams: GameStream[]
  deepLink: DeepLink[]
}

// TODO(skeswa): docs.
export type GameStream = {
  streamId: string
  streamType: string
  isOnAir: boolean
  duration: number
  isArchiveAvailToWatch: boolean
}

// TODO(skeswa): docs.
export type DeepLink = {
  iosApp: string
  mobileApp: string
  androidApp: string
  desktopWeb: string
  broadcaster: string
}

// TODO(skeswa): docs.
export type Period = {
  type: number
  current: number
  maxRegular: number
  isHalftime: boolean
  isEndOfPeriod: boolean
}

// TODO(skeswa): docs.
export type Duration = {
  hours: string
  minute: string
}

// TODO(skeswa): docs.
export type Broadcaster = {
  longName: string
  shortName: string
}
