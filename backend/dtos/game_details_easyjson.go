// AUTOGENERATED FILE: easyjson marshaller/unmarshallers.

package dtos

import (
	json "encoding/json"
	easyjson "github.com/mailru/easyjson"
	jlexer "github.com/mailru/easyjson/jlexer"
	jwriter "github.com/mailru/easyjson/jwriter"
)

// suppress unused package warning
var (
	_ *json.RawMessage
	_ *jlexer.Lexer
	_ *jwriter.Writer
	_ easyjson.Marshaler
)

func easyjsonAceadd55DecodeGithubComSkeswaEnbiyayBackendDtos(in *jlexer.Lexer, out *GameDetails) {
	isTopLevel := in.IsStart()
	if in.IsNull() {
		if isTopLevel {
			in.Consumed()
		}
		in.Skip()
		return
	}
	in.Delim('{')
	for !in.IsDelim('}') {
		key := in.UnsafeString()
		in.WantColon()
		if in.IsNull() {
			in.Skip()
			in.WantComma()
			continue
		}
		switch key {
		case "2.1":
			out.HomeTeamName = string(in.String())
		case "2.2":
			out.HomeTeamCity = string(in.String())
		case "2.3":
			out.HomeTeamSplashURL = string(in.String())
		case "2.4.1":
			out.HomeTeamPointsLeaderID = string(in.String())
		case "2.4.2":
			out.HomeTeamPointsLeaderName = string(in.String())
		case "2.4.3":
			out.HomeTeamPointsLeaderMinutes = string(in.String())
		case "2.4.4":
			out.HomeTeamPointsLeaderJerseyName = string(in.String())
		case "2.5.1":
			out.HomeTeamAssistsLeaderID = string(in.String())
		case "2.5.2":
			out.HomeTeamAssistsLeaderName = string(in.String())
		case "2.5.3":
			out.HomeTeamAssistsLeaderMinutes = string(in.String())
		case "2.5.4":
			out.HomeTeamAssistsLeaderJerseyNumber = string(in.String())
		case "2.6.1":
			out.HomeTeamReboundsLeaderID = string(in.String())
		case "2.6.2":
			out.HomeTeamReboundsLeaderName = string(in.String())
		case "2.6.3":
			out.HomeTeamReboundsLeaderMinutes = string(in.String())
		case "2.6.4":
			out.HomeTeamReboundsLeaderJerseyName = string(in.String())
		case "2.7.1":
			out.HomeTeamBlocksLeaderID = string(in.String())
		case "2.7.2":
			out.HomeTeamBlocksLeaderName = string(in.String())
		case "2.7.3":
			out.HomeTeamBlocksLeaderMinutes = string(in.String())
		case "2.7.4":
			out.HomeTeamBlocksLeaderJerseyName = string(in.String())
		case "2.8.1":
			out.HomeTeamStealsLeaderID = string(in.String())
		case "2.8.2":
			out.HomeTeamStealsLeaderName = string(in.String())
		case "2.8.3":
			out.HomeTeamStealsLeaderMinutes = string(in.String())
		case "2.8.4":
			out.HomeTeamStealsLeaderJerseyName = string(in.String())
		case "3.1":
			out.AwayTeamName = string(in.String())
		case "3.2":
			out.AwayTeamCity = string(in.String())
		case "3.3":
			out.AwayTeamSplashURL = string(in.String())
		case "3.4.1":
			out.AwayTeamPointsLeaderID = string(in.String())
		case "3.4.2":
			out.AwayTeamPointsLeaderName = string(in.String())
		case "3.4.3":
			out.AwayTeamPointsLeaderMinutes = string(in.String())
		case "3.4.4":
			out.AwayTeamPointsLeaderJerseyName = string(in.String())
		case "3.5.1":
			out.AwayTeamAssistsLeaderID = string(in.String())
		case "3.5.2":
			out.AwayTeamAssistsLeaderName = string(in.String())
		case "3.5.3":
			out.AwayTeamAssistsLeaderMinutes = string(in.String())
		case "3.5.4":
			out.AwayTeamAssistsLeaderJerseyNumber = string(in.String())
		case "3.6.1":
			out.AwayTeamReboundsLeaderID = string(in.String())
		case "3.6.2":
			out.AwayTeamReboundsLeaderName = string(in.String())
		case "3.6.3":
			out.AwayTeamReboundsLeaderMinutes = string(in.String())
		case "3.6.4":
			out.AwayTeamReboundsLeaderJerseyName = string(in.String())
		case "3.7.1":
			out.AwayTeamBlocksLeaderID = string(in.String())
		case "3.7.2":
			out.AwayTeamBlocksLeaderName = string(in.String())
		case "3.7.3":
			out.AwayTeamBlocksLeaderMinutes = string(in.String())
		case "3.7.4":
			out.AwayTeamBlocksLeaderJerseyName = string(in.String())
		case "3.8.1":
			out.AwayTeamStealsLeaderID = string(in.String())
		case "3.8.2":
			out.AwayTeamStealsLeaderName = string(in.String())
		case "3.8.3":
			out.AwayTeamStealsLeaderMinutes = string(in.String())
		case "3.8.4":
			out.AwayTeamStealsLeaderJerseyName = string(in.String())
		default:
			in.SkipRecursive()
		}
		in.WantComma()
	}
	in.Delim('}')
	if isTopLevel {
		in.Consumed()
	}
}
func easyjsonAceadd55EncodeGithubComSkeswaEnbiyayBackendDtos(out *jwriter.Writer, in GameDetails) {
	out.RawByte('{')
	first := true
	_ = first
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.1\":")
	out.String(string(in.HomeTeamName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.2\":")
	out.String(string(in.HomeTeamCity))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.3\":")
	out.String(string(in.HomeTeamSplashURL))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.1\":")
	out.String(string(in.HomeTeamPointsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.2\":")
	out.String(string(in.HomeTeamPointsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.3\":")
	out.String(string(in.HomeTeamPointsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.4\":")
	out.String(string(in.HomeTeamPointsLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.1\":")
	out.String(string(in.HomeTeamAssistsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.2\":")
	out.String(string(in.HomeTeamAssistsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.3\":")
	out.String(string(in.HomeTeamAssistsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.4\":")
	out.String(string(in.HomeTeamAssistsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.1\":")
	out.String(string(in.HomeTeamReboundsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.2\":")
	out.String(string(in.HomeTeamReboundsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.3\":")
	out.String(string(in.HomeTeamReboundsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.4\":")
	out.String(string(in.HomeTeamReboundsLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.1\":")
	out.String(string(in.HomeTeamBlocksLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.2\":")
	out.String(string(in.HomeTeamBlocksLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.3\":")
	out.String(string(in.HomeTeamBlocksLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.4\":")
	out.String(string(in.HomeTeamBlocksLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.8.1\":")
	out.String(string(in.HomeTeamStealsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.8.2\":")
	out.String(string(in.HomeTeamStealsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.8.3\":")
	out.String(string(in.HomeTeamStealsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.8.4\":")
	out.String(string(in.HomeTeamStealsLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.1\":")
	out.String(string(in.AwayTeamName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.2\":")
	out.String(string(in.AwayTeamCity))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.3\":")
	out.String(string(in.AwayTeamSplashURL))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.4.1\":")
	out.String(string(in.AwayTeamPointsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.4.2\":")
	out.String(string(in.AwayTeamPointsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.4.3\":")
	out.String(string(in.AwayTeamPointsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.4.4\":")
	out.String(string(in.AwayTeamPointsLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.5.1\":")
	out.String(string(in.AwayTeamAssistsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.5.2\":")
	out.String(string(in.AwayTeamAssistsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.5.3\":")
	out.String(string(in.AwayTeamAssistsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.5.4\":")
	out.String(string(in.AwayTeamAssistsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.6.1\":")
	out.String(string(in.AwayTeamReboundsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.6.2\":")
	out.String(string(in.AwayTeamReboundsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.6.3\":")
	out.String(string(in.AwayTeamReboundsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.6.4\":")
	out.String(string(in.AwayTeamReboundsLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.7.1\":")
	out.String(string(in.AwayTeamBlocksLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.7.2\":")
	out.String(string(in.AwayTeamBlocksLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.7.3\":")
	out.String(string(in.AwayTeamBlocksLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.7.4\":")
	out.String(string(in.AwayTeamBlocksLeaderJerseyName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.8.1\":")
	out.String(string(in.AwayTeamStealsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.8.2\":")
	out.String(string(in.AwayTeamStealsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.8.3\":")
	out.String(string(in.AwayTeamStealsLeaderMinutes))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"3.8.4\":")
	out.String(string(in.AwayTeamStealsLeaderJerseyName))
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v GameDetails) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjsonAceadd55EncodeGithubComSkeswaEnbiyayBackendDtos(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v GameDetails) MarshalEasyJSON(w *jwriter.Writer) {
	easyjsonAceadd55EncodeGithubComSkeswaEnbiyayBackendDtos(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *GameDetails) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjsonAceadd55DecodeGithubComSkeswaEnbiyayBackendDtos(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *GameDetails) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjsonAceadd55DecodeGithubComSkeswaEnbiyayBackendDtos(l, v)
}
