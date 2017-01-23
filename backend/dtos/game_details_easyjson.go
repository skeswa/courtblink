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
		case "1.1":
			out.HomeTeamName = string(in.String())
		case "1.2":
			out.HomeTeamCity = string(in.String())
		case "1.3":
			out.HomeTeamSplashURL = string(in.String())
		case "1.4.1":
			out.HomeTeamSplashPrimaryColor = string(in.String())
		case "1.4.2":
			out.HomeTeamSplashSecondaryColor = string(in.String())
		case "1.5.1":
			out.HomeTeamPointsLeaderID = string(in.String())
		case "1.5.2":
			out.HomeTeamPointsLeaderName = string(in.String())
		case "1.5.3":
			out.HomeTeamPointsLeaderJerseyNumber = string(in.String())
		case "1.6.1":
			out.HomeTeamAssistsLeaderID = string(in.String())
		case "1.6.2":
			out.HomeTeamAssistsLeaderName = string(in.String())
		case "1.6.3":
			out.HomeTeamAssistsLeaderJerseyNumber = string(in.String())
		case "1.7.1":
			out.HomeTeamReboundsLeaderID = string(in.String())
		case "1.7.2":
			out.HomeTeamReboundsLeaderName = string(in.String())
		case "1.7.3":
			out.HomeTeamReboundsLeaderJerseyNumber = string(in.String())
		case "2.1":
			out.AwayTeamName = string(in.String())
		case "2.2":
			out.AwayTeamCity = string(in.String())
		case "2.3":
			out.AwayTeamSplashURL = string(in.String())
		case "2.4.1":
			out.AwayTeamSplashPrimaryColor = string(in.String())
		case "2.4.2":
			out.AwayTeamSplashSecondaryColor = string(in.String())
		case "2.5.1":
			out.AwayTeamPointsLeaderID = string(in.String())
		case "2.5.2":
			out.AwayTeamPointsLeaderName = string(in.String())
		case "2.5.3":
			out.AwayTeamPointsLeaderJerseyNumber = string(in.String())
		case "2.6.1":
			out.AwayTeamAssistsLeaderID = string(in.String())
		case "2.6.2":
			out.AwayTeamAssistsLeaderName = string(in.String())
		case "2.6.3":
			out.AwayTeamAssistsLeaderJerseyNumber = string(in.String())
		case "2.7.1":
			out.AwayTeamReboundsLeaderID = string(in.String())
		case "2.7.2":
			out.AwayTeamReboundsLeaderName = string(in.String())
		case "2.7.3":
			out.AwayTeamReboundsLeaderJerseyNumber = string(in.String())
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
	out.RawString("\"1.1\":")
	out.String(string(in.HomeTeamName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.2\":")
	out.String(string(in.HomeTeamCity))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.3\":")
	out.String(string(in.HomeTeamSplashURL))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.4.1\":")
	out.String(string(in.HomeTeamSplashPrimaryColor))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.4.2\":")
	out.String(string(in.HomeTeamSplashSecondaryColor))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.5.1\":")
	out.String(string(in.HomeTeamPointsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.5.2\":")
	out.String(string(in.HomeTeamPointsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.5.3\":")
	out.String(string(in.HomeTeamPointsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.6.1\":")
	out.String(string(in.HomeTeamAssistsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.6.2\":")
	out.String(string(in.HomeTeamAssistsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.6.3\":")
	out.String(string(in.HomeTeamAssistsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.7.1\":")
	out.String(string(in.HomeTeamReboundsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.7.2\":")
	out.String(string(in.HomeTeamReboundsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1.7.3\":")
	out.String(string(in.HomeTeamReboundsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.1\":")
	out.String(string(in.AwayTeamName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.2\":")
	out.String(string(in.AwayTeamCity))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.3\":")
	out.String(string(in.AwayTeamSplashURL))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.1\":")
	out.String(string(in.AwayTeamSplashPrimaryColor))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.4.2\":")
	out.String(string(in.AwayTeamSplashSecondaryColor))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.1\":")
	out.String(string(in.AwayTeamPointsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.2\":")
	out.String(string(in.AwayTeamPointsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.5.3\":")
	out.String(string(in.AwayTeamPointsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.1\":")
	out.String(string(in.AwayTeamAssistsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.2\":")
	out.String(string(in.AwayTeamAssistsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.6.3\":")
	out.String(string(in.AwayTeamAssistsLeaderJerseyNumber))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.1\":")
	out.String(string(in.AwayTeamReboundsLeaderID))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.2\":")
	out.String(string(in.AwayTeamReboundsLeaderName))
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2.7.3\":")
	out.String(string(in.AwayTeamReboundsLeaderJerseyNumber))
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