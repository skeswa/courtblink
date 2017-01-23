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

func easyjsonCd224756DecodeGithubComSkeswaEnbiyayBackendDtos(in *jlexer.Lexer, out *SplashData) {
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
		case "1":
			if in.IsNull() {
				in.Skip()
				out.Games = nil
			} else {
				in.Delim('[')
				if !in.IsDelim(']') {
					out.Games = make([]GameSummary, 0, 1)
				} else {
					out.Games = []GameSummary{}
				}
				for !in.IsDelim(']') {
					var v1 GameSummary
					(v1).UnmarshalEasyJSON(in)
					out.Games = append(out.Games, v1)
					in.WantComma()
				}
				in.Delim(']')
			}
		case "2":
			if in.IsNull() {
				in.Skip()
				out.FirstGameDetails = nil
			} else {
				if out.FirstGameDetails == nil {
					out.FirstGameDetails = new(GameDetails)
				}
				(*out.FirstGameDetails).UnmarshalEasyJSON(in)
			}
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
func easyjsonCd224756EncodeGithubComSkeswaEnbiyayBackendDtos(out *jwriter.Writer, in SplashData) {
	out.RawByte('{')
	first := true
	_ = first
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"1\":")
	if in.Games == nil && (out.Flags&jwriter.NilSliceAsEmpty) == 0 {
		out.RawString("null")
	} else {
		out.RawByte('[')
		for v2, v3 := range in.Games {
			if v2 > 0 {
				out.RawByte(',')
			}
			(v3).MarshalEasyJSON(out)
		}
		out.RawByte(']')
	}
	if !first {
		out.RawByte(',')
	}
	first = false
	out.RawString("\"2\":")
	if in.FirstGameDetails == nil {
		out.RawString("null")
	} else {
		(*in.FirstGameDetails).MarshalEasyJSON(out)
	}
	out.RawByte('}')
}

// MarshalJSON supports json.Marshaler interface
func (v SplashData) MarshalJSON() ([]byte, error) {
	w := jwriter.Writer{}
	easyjsonCd224756EncodeGithubComSkeswaEnbiyayBackendDtos(&w, v)
	return w.Buffer.BuildBytes(), w.Error
}

// MarshalEasyJSON supports easyjson.Marshaler interface
func (v SplashData) MarshalEasyJSON(w *jwriter.Writer) {
	easyjsonCd224756EncodeGithubComSkeswaEnbiyayBackendDtos(w, v)
}

// UnmarshalJSON supports json.Unmarshaler interface
func (v *SplashData) UnmarshalJSON(data []byte) error {
	r := jlexer.Lexer{Data: data}
	easyjsonCd224756DecodeGithubComSkeswaEnbiyayBackendDtos(&r, v)
	return r.Error()
}

// UnmarshalEasyJSON supports easyjson.Unmarshaler interface
func (v *SplashData) UnmarshalEasyJSON(l *jlexer.Lexer) {
	easyjsonCd224756DecodeGithubComSkeswaEnbiyayBackendDtos(l, v)
}