import * as $protobuf from "protobufjs";

/** Properties of a GameLeader. */
export interface IGameLeader {

    /** GameLeader id */
    id?: string;

    /** GameLeader name */
    name?: string;

    /** GameLeader minutes */
    minutes?: string;

    /** GameLeader statValue */
    statValue?: string;

    /** GameLeader jerseyNumber */
    jerseyNumber?: string;
}

/** Represents a GameLeader. */
export class GameLeader {

    /**
     * Constructs a new GameLeader.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameLeader);

    /** GameLeader id. */
    public id: string;

    /** GameLeader name. */
    public name: string;

    /** GameLeader minutes. */
    public minutes: string;

    /** GameLeader statValue. */
    public statValue: string;

    /** GameLeader jerseyNumber. */
    public jerseyNumber: string;

    /**
     * Creates a new GameLeader instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameLeader instance
     */
    public static create(properties?: IGameLeader): GameLeader;

    /**
     * Encodes the specified GameLeader message. Does not implicitly {@link GameLeader.verify|verify} messages.
     * @param message GameLeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameLeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameLeader message, length delimited. Does not implicitly {@link GameLeader.verify|verify} messages.
     * @param message GameLeader message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGameLeader, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameLeader message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameLeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameLeader;

    /**
     * Decodes a GameLeader message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameLeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameLeader;

    /**
     * Verifies a GameLeader message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameLeader message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameLeader
     */
    public static fromObject(object: { [k: string]: any }): GameLeader;

    /**
     * Creates a plain object from a GameLeader message. Also converts values to other types if specified.
     * @param message GameLeader
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameLeader, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameLeader to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GameSummary. */
export interface IGameSummary {

    /** GameSummary id */
    id?: string;

    /** GameSummary liveGameStats */
    liveGameStats?: ILiveGameStats;

    /** GameSummary gameStartTime */
    gameStartTime?: number;

    /** GameSummary gameStartTimeTbd */
    gameStartTimeTbd?: boolean;

    /** GameSummary finished */
    finished?: boolean;

    /** GameSummary notStarted */
    notStarted?: boolean;

    /** GameSummary homeTeamStatus */
    homeTeamStatus?: IGameTeamStatus;

    /** GameSummary awayTeamStatus */
    awayTeamStatus?: IGameTeamStatus;
}

/** Represents a GameSummary. */
export class GameSummary {

    /**
     * Constructs a new GameSummary.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameSummary);

    /** GameSummary id. */
    public id: string;

    /** GameSummary liveGameStats. */
    public liveGameStats?: (ILiveGameStats|null);

    /** GameSummary gameStartTime. */
    public gameStartTime: number;

    /** GameSummary gameStartTimeTbd. */
    public gameStartTimeTbd: boolean;

    /** GameSummary finished. */
    public finished: boolean;

    /** GameSummary notStarted. */
    public notStarted: boolean;

    /** GameSummary homeTeamStatus. */
    public homeTeamStatus?: (IGameTeamStatus|null);

    /** GameSummary awayTeamStatus. */
    public awayTeamStatus?: (IGameTeamStatus|null);

    /**
     * Creates a new GameSummary instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameSummary instance
     */
    public static create(properties?: IGameSummary): GameSummary;

    /**
     * Encodes the specified GameSummary message. Does not implicitly {@link GameSummary.verify|verify} messages.
     * @param message GameSummary message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameSummary, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameSummary message, length delimited. Does not implicitly {@link GameSummary.verify|verify} messages.
     * @param message GameSummary message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGameSummary, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameSummary message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameSummary;

    /**
     * Decodes a GameSummary message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameSummary;

    /**
     * Verifies a GameSummary message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameSummary message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameSummary
     */
    public static fromObject(object: { [k: string]: any }): GameSummary;

    /**
     * Creates a plain object from a GameSummary message. Also converts values to other types if specified.
     * @param message GameSummary
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameSummary, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameSummary to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a LiveGameStats. */
export interface ILiveGameStats {

    /** LiveGameStats period */
    period?: number;

    /** LiveGameStats channel */
    channel?: string;

    /** LiveGameStats timeRemaining */
    timeRemaining?: string;
}

/** Represents a LiveGameStats. */
export class LiveGameStats {

    /**
     * Constructs a new LiveGameStats.
     * @param [properties] Properties to set
     */
    constructor(properties?: ILiveGameStats);

    /** LiveGameStats period. */
    public period: number;

    /** LiveGameStats channel. */
    public channel: string;

    /** LiveGameStats timeRemaining. */
    public timeRemaining: string;

    /**
     * Creates a new LiveGameStats instance using the specified properties.
     * @param [properties] Properties to set
     * @returns LiveGameStats instance
     */
    public static create(properties?: ILiveGameStats): LiveGameStats;

    /**
     * Encodes the specified LiveGameStats message. Does not implicitly {@link LiveGameStats.verify|verify} messages.
     * @param message LiveGameStats message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ILiveGameStats, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified LiveGameStats message, length delimited. Does not implicitly {@link LiveGameStats.verify|verify} messages.
     * @param message LiveGameStats message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ILiveGameStats, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a LiveGameStats message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns LiveGameStats
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): LiveGameStats;

    /**
     * Decodes a LiveGameStats message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns LiveGameStats
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): LiveGameStats;

    /**
     * Verifies a LiveGameStats message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a LiveGameStats message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns LiveGameStats
     */
    public static fromObject(object: { [k: string]: any }): LiveGameStats;

    /**
     * Creates a plain object from a LiveGameStats message. Also converts values to other types if specified.
     * @param message LiveGameStats
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: LiveGameStats, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this LiveGameStats to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a GameTeamStatus. */
export interface IGameTeamStatus {

    /** GameTeamStatus wins */
    wins?: number;

    /** GameTeamStatus score */
    score?: number;

    /** GameTeamStatus losses */
    losses?: number;

    /** GameTeamStatus teamId */
    teamId?: string;

    /** GameTeamStatus tricode */
    tricode?: string;

    /** GameTeamStatus name */
    name?: string;

    /** GameTeamStatus city */
    city?: string;

    /** GameTeamStatus splashUrl */
    splashUrl?: string;

    /** GameTeamStatus splashPrimaryColor */
    splashPrimaryColor?: string;

    /** GameTeamStatus splashSecondaryColor */
    splashSecondaryColor?: string;

    /** GameTeamStatus pointsLeader */
    pointsLeader?: IGameLeader;

    /** GameTeamStatus assistsLeader */
    assistsLeader?: IGameLeader;

    /** GameTeamStatus reboundsLeader */
    reboundsLeader?: IGameLeader;

    /** GameTeamStatus defensiveRating */
    defensiveRating?: number;

    /** GameTeamStatus defensiveRank */
    defensiveRank?: number;

    /** GameTeamStatus offensiveRating */
    offensiveRating?: number;

    /** GameTeamStatus offensiveRank */
    offensiveRank?: number;

    /** GameTeamStatus overallRank */
    overallRank?: number;
}

/** Represents a GameTeamStatus. */
export class GameTeamStatus {

    /**
     * Constructs a new GameTeamStatus.
     * @param [properties] Properties to set
     */
    constructor(properties?: IGameTeamStatus);

    /** GameTeamStatus wins. */
    public wins: number;

    /** GameTeamStatus score. */
    public score: number;

    /** GameTeamStatus losses. */
    public losses: number;

    /** GameTeamStatus teamId. */
    public teamId: string;

    /** GameTeamStatus tricode. */
    public tricode: string;

    /** GameTeamStatus name. */
    public name: string;

    /** GameTeamStatus city. */
    public city: string;

    /** GameTeamStatus splashUrl. */
    public splashUrl: string;

    /** GameTeamStatus splashPrimaryColor. */
    public splashPrimaryColor: string;

    /** GameTeamStatus splashSecondaryColor. */
    public splashSecondaryColor: string;

    /** GameTeamStatus pointsLeader. */
    public pointsLeader?: (IGameLeader|null);

    /** GameTeamStatus assistsLeader. */
    public assistsLeader?: (IGameLeader|null);

    /** GameTeamStatus reboundsLeader. */
    public reboundsLeader?: (IGameLeader|null);

    /** GameTeamStatus defensiveRating. */
    public defensiveRating: number;

    /** GameTeamStatus defensiveRank. */
    public defensiveRank: number;

    /** GameTeamStatus offensiveRating. */
    public offensiveRating: number;

    /** GameTeamStatus offensiveRank. */
    public offensiveRank: number;

    /** GameTeamStatus overallRank. */
    public overallRank: number;

    /**
     * Creates a new GameTeamStatus instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameTeamStatus instance
     */
    public static create(properties?: IGameTeamStatus): GameTeamStatus;

    /**
     * Encodes the specified GameTeamStatus message. Does not implicitly {@link GameTeamStatus.verify|verify} messages.
     * @param message GameTeamStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: IGameTeamStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified GameTeamStatus message, length delimited. Does not implicitly {@link GameTeamStatus.verify|verify} messages.
     * @param message GameTeamStatus message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: IGameTeamStatus, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a GameTeamStatus message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameTeamStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): GameTeamStatus;

    /**
     * Decodes a GameTeamStatus message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameTeamStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): GameTeamStatus;

    /**
     * Verifies a GameTeamStatus message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a GameTeamStatus message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameTeamStatus
     */
    public static fromObject(object: { [k: string]: any }): GameTeamStatus;

    /**
     * Creates a plain object from a GameTeamStatus message. Also converts values to other types if specified.
     * @param message GameTeamStatus
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: GameTeamStatus, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this GameTeamStatus to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Properties of a SplashData. */
export interface ISplashData {

    /** SplashData games */
    games?: IGameSummary[];
}

/** Represents a SplashData. */
export class SplashData {

    /**
     * Constructs a new SplashData.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISplashData);

    /** SplashData games. */
    public games: IGameSummary[];

    /**
     * Creates a new SplashData instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SplashData instance
     */
    public static create(properties?: ISplashData): SplashData;

    /**
     * Encodes the specified SplashData message. Does not implicitly {@link SplashData.verify|verify} messages.
     * @param message SplashData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISplashData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SplashData message, length delimited. Does not implicitly {@link SplashData.verify|verify} messages.
     * @param message SplashData message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISplashData, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SplashData message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SplashData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SplashData;

    /**
     * Decodes a SplashData message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SplashData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SplashData;

    /**
     * Verifies a SplashData message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SplashData message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SplashData
     */
    public static fromObject(object: { [k: string]: any }): SplashData;

    /**
     * Creates a plain object from a SplashData message. Also converts values to other types if specified.
     * @param message SplashData
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SplashData, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SplashData to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
