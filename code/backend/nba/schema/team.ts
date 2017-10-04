// TODO(skeswa): docs.
export type Team = {
  teamId: string
  win: string
  loss: string
  score: string
  triCode: string
  seriesWin: string
  seriedLoss: string
  linescore: Array<{ score: string }>
}
