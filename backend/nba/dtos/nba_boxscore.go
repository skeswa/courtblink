package dtos

// NBABoxScore represents a scoreboard box score object from the NBA API.
//
// easyjson:json
type NBABoxScore struct {
	Game  NBAGame          `json:"basicGameData"`
	Stats NBABoxScoreStats `json:"stats"`
}

// NBABoxScoreStats represents a scoreboard box score stats object from the NBA
// API.
//
// easyjson:json
type NBABoxScoreStats struct {
	TimesTied     string                   `json:"timesTied"`
	LeadChanges   string                   `json:"leadChanges"`
	HomeTeamStats NBABoxScoreTeamStats     `json:"hTeam"`
	AwayTeamStats NBABoxScoreTeamStats     `json:"vTeam"`
	ActivePlayers []NBABoxScorePlayerStats `json:"activePlayers"`
}

// NBABoxScoreTeamStats represents a scoreboard box score teams stats object
// from the NBA API.
//
// easyjson:json
type NBABoxScoreTeamStats struct {
	FastBreakPoints    string                     `json:"fastBreakPoints"`
	PointsInPaint      string                     `json:"pointsInPaint"`
	BiggestLead        string                     `json:"biggestLead"`
	SecondChancePoints string                     `json:"secondChancePoints"`
	PointsOffTurnovers string                     `json:"pointsOffTurnovers"`
	LongestRun         string                     `json:"longestRun"`
	Totals             NBABoxScoreTeamStatTotals  `json:"totals"`
	Leaders            NBABoxScoreTeamStatLeaders `json:"leaders"`
}

// NBABoxScoreTeamStatTotals represents a scoreboard box score team stats
// object from the NBA API.
//
// easyjson:json
type NBABoxScoreTeamStatTotals struct {
	Points                 string `json:"points"`
	FieldGoalsMade         string `json:"fgm"`
	FieldGoalsAttempted    string `json:"fga"`
	FieldGoalPercentage    string `json:"fgp"`
	FreeThrowsMade         string `json:"ftm"`
	FreeThrowsAttempted    string `json:"fta"`
	FreeThrowPercentage    string `json:"ftp"`
	ThreePointersMade      string `json:"tpm"`
	ThreePointersAttempted string `json:"tpa"`
	ThreePointerPercentage string `json:"tpp"`
	OffensiveRebounds      string `json:"offReb"`
	DefensiveRebounds      string `json:"defReb"`
	TotalRebounds          string `json:"totReb"`
	Assists                string `json:"assists"`
	PersonalFouls          string `json:"pFouls"`
	Steals                 string `json:"steals"`
	Turnovers              string `json:"turnovers"`
	Blocks                 string `json:"blocks"`
	PlusMinus              string `json:"plusMinus"`
	Minutes                string `json:"min"`
}

// NBABoxScoreTeamStatLeaders represents a scoreboard box score team stat
// leaders object from the NBA API.
//
// easyjson:json
type NBABoxScoreTeamStatLeaders struct {
	PointsLeader   NBABoxScoreTeamLeader `json:"points"`
	AssistsLeader  NBABoxScoreTeamLeader `json:"assists"`
	ReboundsLeader NBABoxScoreTeamLeader `json:"rebounds"`
}

// NBABoxScoreTeamLeader represents a scoreboard box score team stat leader
// object from the NBA API.
//
// easyjson:json
type NBABoxScoreTeamLeader struct {
	Value   string `json:"value"`
	Players []struct {
		ID string `json:"personId"`
	} `json:"players"`
}

// NBABoxScorePlayerStats represents a scoreboard box score player stats
// object from the NBA API.
//
// easyjson:json
type NBABoxScorePlayerStats struct {
	PlayerID               string                   `json:"personId"`
	TeamID                 string                   `json:"teamId"`
	IsOnCourt              bool                     `json:"isOnCourt"`
	Points                 string                   `json:"points"`
	FieldGoalsMade         string                   `json:"fgm"`
	FieldGoalsAttempted    string                   `json:"fga"`
	FieldGoalPercentage    string                   `json:"fgp"`
	FreeThrowsMade         string                   `json:"ftm"`
	FreeThrowsAttempted    string                   `json:"fta"`
	FreeThrowPercentage    string                   `json:"ftp"`
	ThreePointersMade      string                   `json:"tpm"`
	ThreePointersAttempted string                   `json:"tpa"`
	ThreePointerPercentage string                   `json:"tpp"`
	OffensiveRebounds      string                   `json:"offReb"`
	DefensiveRebounds      string                   `json:"defReb"`
	TotalRebounds          string                   `json:"totReb"`
	Assists                string                   `json:"assists"`
	PersonalFouls          string                   `json:"pFouls"`
	Steals                 string                   `json:"steals"`
	Turnovers              string                   `json:"turnovers"`
	Blocks                 string                   `json:"blocks"`
	PlusMinus              string                   `json:"plusMinus"`
	Minutes                string                   `json:"min"`
	DidNotPlay             string                   `json:"dnp"`
	SortKey                NBABoxScorePlayerSortKey `json:"sortKey"`
}

// NBABoxScorePlayerSortKey represents a scoreboard box score player sort key
// object from the NBA API.
//
// easyjson:json
type NBABoxScorePlayerSortKey struct {
	Name                   int `json:"name"`
	Pos                    int `json:"pos"`
	Points                 int `json:"points"`
	Minutes                int `json:"min"`
	FieldGoalsMade         int `json:"fgm"`
	FieldGoalsAttempted    int `json:"fga"`
	FieldGoalPercentage    int `json:"fgp"`
	FreeThrowsMade         int `json:"ftm"`
	FreeThrowsAttempted    int `json:"fta"`
	FreeThrowPercentage    int `json:"ftp"`
	ThreePointersMade      int `json:"tpm"`
	ThreePointersAttempted int `json:"tpa"`
	ThreePointerPercentage int `json:"tpp"`
	OffensiveRebounds      int `json:"offReb"`
	DefensiveRebounds      int `json:"defReb"`
	TotalRebounds          int `json:"totReb"`
	Assists                int `json:"assists"`
	PersonalFouls          int `json:"pFouls"`
	Steals                 int `json:"steals"`
	Turnovers              int `json:"turnovers"`
	Blocks                 int `json:"blocks"`
	PlusMinus              int `json:"plusMinus"`
}
