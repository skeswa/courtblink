/*eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.GameLeader = (function() {

    /**
     * Properties of a GameLeader.
     * @exports IGameLeader
     * @interface IGameLeader
     * @property {string} [id] GameLeader id
     * @property {string} [name] GameLeader name
     * @property {string} [minutes] GameLeader minutes
     * @property {string} [statValue] GameLeader statValue
     * @property {string} [jerseyNumber] GameLeader jerseyNumber
     */

    /**
     * Constructs a new GameLeader.
     * @exports GameLeader
     * @classdesc Represents a GameLeader.
     * @constructor
     * @param {IGameLeader=} [properties] Properties to set
     */
    function GameLeader(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameLeader id.
     * @member {string}id
     * @memberof GameLeader
     * @instance
     */
    GameLeader.prototype.id = "";

    /**
     * GameLeader name.
     * @member {string}name
     * @memberof GameLeader
     * @instance
     */
    GameLeader.prototype.name = "";

    /**
     * GameLeader minutes.
     * @member {string}minutes
     * @memberof GameLeader
     * @instance
     */
    GameLeader.prototype.minutes = "";

    /**
     * GameLeader statValue.
     * @member {string}statValue
     * @memberof GameLeader
     * @instance
     */
    GameLeader.prototype.statValue = "";

    /**
     * GameLeader jerseyNumber.
     * @member {string}jerseyNumber
     * @memberof GameLeader
     * @instance
     */
    GameLeader.prototype.jerseyNumber = "";

    /**
     * Creates a new GameLeader instance using the specified properties.
     * @function create
     * @memberof GameLeader
     * @static
     * @param {IGameLeader=} [properties] Properties to set
     * @returns {GameLeader} GameLeader instance
     */
    GameLeader.create = function create(properties) {
        return new GameLeader(properties);
    };

    /**
     * Encodes the specified GameLeader message. Does not implicitly {@link GameLeader.verify|verify} messages.
     * @function encode
     * @memberof GameLeader
     * @static
     * @param {IGameLeader} message GameLeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameLeader.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.name);
        if (message.minutes != null && message.hasOwnProperty("minutes"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.minutes);
        if (message.statValue != null && message.hasOwnProperty("statValue"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.statValue);
        if (message.jerseyNumber != null && message.hasOwnProperty("jerseyNumber"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.jerseyNumber);
        return writer;
    };

    /**
     * Encodes the specified GameLeader message, length delimited. Does not implicitly {@link GameLeader.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameLeader
     * @static
     * @param {IGameLeader} message GameLeader message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameLeader.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameLeader message from the specified reader or buffer.
     * @function decode
     * @memberof GameLeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameLeader} GameLeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameLeader.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameLeader();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.name = reader.string();
                break;
            case 3:
                message.minutes = reader.string();
                break;
            case 4:
                message.statValue = reader.string();
                break;
            case 5:
                message.jerseyNumber = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameLeader message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameLeader
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameLeader} GameLeader
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameLeader.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameLeader message.
     * @function verify
     * @memberof GameLeader
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameLeader.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.minutes != null && message.hasOwnProperty("minutes"))
            if (!$util.isString(message.minutes))
                return "minutes: string expected";
        if (message.statValue != null && message.hasOwnProperty("statValue"))
            if (!$util.isString(message.statValue))
                return "statValue: string expected";
        if (message.jerseyNumber != null && message.hasOwnProperty("jerseyNumber"))
            if (!$util.isString(message.jerseyNumber))
                return "jerseyNumber: string expected";
        return null;
    };

    /**
     * Creates a GameLeader message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameLeader
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameLeader} GameLeader
     */
    GameLeader.fromObject = function fromObject(object) {
        if (object instanceof $root.GameLeader)
            return object;
        var message = new $root.GameLeader();
        if (object.id != null)
            message.id = String(object.id);
        if (object.name != null)
            message.name = String(object.name);
        if (object.minutes != null)
            message.minutes = String(object.minutes);
        if (object.statValue != null)
            message.statValue = String(object.statValue);
        if (object.jerseyNumber != null)
            message.jerseyNumber = String(object.jerseyNumber);
        return message;
    };

    /**
     * Creates a plain object from a GameLeader message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameLeader
     * @static
     * @param {GameLeader} message GameLeader
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameLeader.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.id = "";
            object.name = "";
            object.minutes = "";
            object.statValue = "";
            object.jerseyNumber = "";
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.minutes != null && message.hasOwnProperty("minutes"))
            object.minutes = message.minutes;
        if (message.statValue != null && message.hasOwnProperty("statValue"))
            object.statValue = message.statValue;
        if (message.jerseyNumber != null && message.hasOwnProperty("jerseyNumber"))
            object.jerseyNumber = message.jerseyNumber;
        return object;
    };

    /**
     * Converts this GameLeader to JSON.
     * @function toJSON
     * @memberof GameLeader
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameLeader.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GameLeader;
})();

$root.GameNews = (function() {

    /**
     * Properties of a GameNews.
     * @exports IGameNews
     * @interface IGameNews
     * @property {Array.<INewsArticle>} [homeTeamArticles] GameNews homeTeamArticles
     * @property {Array.<INewsArticle>} [awayTeamArticles] GameNews awayTeamArticles
     */

    /**
     * Constructs a new GameNews.
     * @exports GameNews
     * @classdesc Represents a GameNews.
     * @constructor
     * @param {IGameNews=} [properties] Properties to set
     */
    function GameNews(properties) {
        this.homeTeamArticles = [];
        this.awayTeamArticles = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameNews homeTeamArticles.
     * @member {Array.<INewsArticle>}homeTeamArticles
     * @memberof GameNews
     * @instance
     */
    GameNews.prototype.homeTeamArticles = $util.emptyArray;

    /**
     * GameNews awayTeamArticles.
     * @member {Array.<INewsArticle>}awayTeamArticles
     * @memberof GameNews
     * @instance
     */
    GameNews.prototype.awayTeamArticles = $util.emptyArray;

    /**
     * Creates a new GameNews instance using the specified properties.
     * @function create
     * @memberof GameNews
     * @static
     * @param {IGameNews=} [properties] Properties to set
     * @returns {GameNews} GameNews instance
     */
    GameNews.create = function create(properties) {
        return new GameNews(properties);
    };

    /**
     * Encodes the specified GameNews message. Does not implicitly {@link GameNews.verify|verify} messages.
     * @function encode
     * @memberof GameNews
     * @static
     * @param {IGameNews} message GameNews message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameNews.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.homeTeamArticles != null && message.homeTeamArticles.length)
            for (var i = 0; i < message.homeTeamArticles.length; ++i)
                $root.NewsArticle.encode(message.homeTeamArticles[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.awayTeamArticles != null && message.awayTeamArticles.length)
            for (var i = 0; i < message.awayTeamArticles.length; ++i)
                $root.NewsArticle.encode(message.awayTeamArticles[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GameNews message, length delimited. Does not implicitly {@link GameNews.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameNews
     * @static
     * @param {IGameNews} message GameNews message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameNews.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameNews message from the specified reader or buffer.
     * @function decode
     * @memberof GameNews
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameNews} GameNews
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameNews.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameNews();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.homeTeamArticles && message.homeTeamArticles.length))
                    message.homeTeamArticles = [];
                message.homeTeamArticles.push($root.NewsArticle.decode(reader, reader.uint32()));
                break;
            case 2:
                if (!(message.awayTeamArticles && message.awayTeamArticles.length))
                    message.awayTeamArticles = [];
                message.awayTeamArticles.push($root.NewsArticle.decode(reader, reader.uint32()));
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameNews message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameNews
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameNews} GameNews
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameNews.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameNews message.
     * @function verify
     * @memberof GameNews
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameNews.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.homeTeamArticles != null && message.hasOwnProperty("homeTeamArticles")) {
            if (!Array.isArray(message.homeTeamArticles))
                return "homeTeamArticles: array expected";
            for (var i = 0; i < message.homeTeamArticles.length; ++i) {
                var error = $root.NewsArticle.verify(message.homeTeamArticles[i]);
                if (error)
                    return "homeTeamArticles." + error;
            }
        }
        if (message.awayTeamArticles != null && message.hasOwnProperty("awayTeamArticles")) {
            if (!Array.isArray(message.awayTeamArticles))
                return "awayTeamArticles: array expected";
            for (var i = 0; i < message.awayTeamArticles.length; ++i) {
                error = $root.NewsArticle.verify(message.awayTeamArticles[i]);
                if (error)
                    return "awayTeamArticles." + error;
            }
        }
        return null;
    };

    /**
     * Creates a GameNews message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameNews
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameNews} GameNews
     */
    GameNews.fromObject = function fromObject(object) {
        if (object instanceof $root.GameNews)
            return object;
        var message = new $root.GameNews();
        if (object.homeTeamArticles) {
            if (!Array.isArray(object.homeTeamArticles))
                throw TypeError(".GameNews.homeTeamArticles: array expected");
            message.homeTeamArticles = [];
            for (var i = 0; i < object.homeTeamArticles.length; ++i) {
                if (typeof object.homeTeamArticles[i] !== "object")
                    throw TypeError(".GameNews.homeTeamArticles: object expected");
                message.homeTeamArticles[i] = $root.NewsArticle.fromObject(object.homeTeamArticles[i]);
            }
        }
        if (object.awayTeamArticles) {
            if (!Array.isArray(object.awayTeamArticles))
                throw TypeError(".GameNews.awayTeamArticles: array expected");
            message.awayTeamArticles = [];
            for (var i = 0; i < object.awayTeamArticles.length; ++i) {
                if (typeof object.awayTeamArticles[i] !== "object")
                    throw TypeError(".GameNews.awayTeamArticles: object expected");
                message.awayTeamArticles[i] = $root.NewsArticle.fromObject(object.awayTeamArticles[i]);
            }
        }
        return message;
    };

    /**
     * Creates a plain object from a GameNews message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameNews
     * @static
     * @param {GameNews} message GameNews
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameNews.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults) {
            object.homeTeamArticles = [];
            object.awayTeamArticles = [];
        }
        if (message.homeTeamArticles && message.homeTeamArticles.length) {
            object.homeTeamArticles = [];
            for (var j = 0; j < message.homeTeamArticles.length; ++j)
                object.homeTeamArticles[j] = $root.NewsArticle.toObject(message.homeTeamArticles[j], options);
        }
        if (message.awayTeamArticles && message.awayTeamArticles.length) {
            object.awayTeamArticles = [];
            for (var j = 0; j < message.awayTeamArticles.length; ++j)
                object.awayTeamArticles[j] = $root.NewsArticle.toObject(message.awayTeamArticles[j], options);
        }
        return object;
    };

    /**
     * Converts this GameNews to JSON.
     * @function toJSON
     * @memberof GameNews
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameNews.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GameNews;
})();

$root.NewsArticle = (function() {

    /**
     * Properties of a NewsArticle.
     * @exports INewsArticle
     * @interface INewsArticle
     * @property {string} [author] NewsArticle author
     * @property {string} [description] NewsArticle description
     * @property {string} [imageUrl] NewsArticle imageUrl
     * @property {string} [link] NewsArticle link
     * @property {string} [title] NewsArticle title
     */

    /**
     * Constructs a new NewsArticle.
     * @exports NewsArticle
     * @classdesc Represents a NewsArticle.
     * @constructor
     * @param {INewsArticle=} [properties] Properties to set
     */
    function NewsArticle(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * NewsArticle author.
     * @member {string}author
     * @memberof NewsArticle
     * @instance
     */
    NewsArticle.prototype.author = "";

    /**
     * NewsArticle description.
     * @member {string}description
     * @memberof NewsArticle
     * @instance
     */
    NewsArticle.prototype.description = "";

    /**
     * NewsArticle imageUrl.
     * @member {string}imageUrl
     * @memberof NewsArticle
     * @instance
     */
    NewsArticle.prototype.imageUrl = "";

    /**
     * NewsArticle link.
     * @member {string}link
     * @memberof NewsArticle
     * @instance
     */
    NewsArticle.prototype.link = "";

    /**
     * NewsArticle title.
     * @member {string}title
     * @memberof NewsArticle
     * @instance
     */
    NewsArticle.prototype.title = "";

    /**
     * Creates a new NewsArticle instance using the specified properties.
     * @function create
     * @memberof NewsArticle
     * @static
     * @param {INewsArticle=} [properties] Properties to set
     * @returns {NewsArticle} NewsArticle instance
     */
    NewsArticle.create = function create(properties) {
        return new NewsArticle(properties);
    };

    /**
     * Encodes the specified NewsArticle message. Does not implicitly {@link NewsArticle.verify|verify} messages.
     * @function encode
     * @memberof NewsArticle
     * @static
     * @param {INewsArticle} message NewsArticle message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewsArticle.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.author != null && message.hasOwnProperty("author"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.author);
        if (message.description != null && message.hasOwnProperty("description"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.description);
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.imageUrl);
        if (message.link != null && message.hasOwnProperty("link"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.link);
        if (message.title != null && message.hasOwnProperty("title"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.title);
        return writer;
    };

    /**
     * Encodes the specified NewsArticle message, length delimited. Does not implicitly {@link NewsArticle.verify|verify} messages.
     * @function encodeDelimited
     * @memberof NewsArticle
     * @static
     * @param {INewsArticle} message NewsArticle message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    NewsArticle.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a NewsArticle message from the specified reader or buffer.
     * @function decode
     * @memberof NewsArticle
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {NewsArticle} NewsArticle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewsArticle.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.NewsArticle();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.author = reader.string();
                break;
            case 2:
                message.description = reader.string();
                break;
            case 3:
                message.imageUrl = reader.string();
                break;
            case 4:
                message.link = reader.string();
                break;
            case 5:
                message.title = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a NewsArticle message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof NewsArticle
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {NewsArticle} NewsArticle
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    NewsArticle.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a NewsArticle message.
     * @function verify
     * @memberof NewsArticle
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    NewsArticle.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.author != null && message.hasOwnProperty("author"))
            if (!$util.isString(message.author))
                return "author: string expected";
        if (message.description != null && message.hasOwnProperty("description"))
            if (!$util.isString(message.description))
                return "description: string expected";
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            if (!$util.isString(message.imageUrl))
                return "imageUrl: string expected";
        if (message.link != null && message.hasOwnProperty("link"))
            if (!$util.isString(message.link))
                return "link: string expected";
        if (message.title != null && message.hasOwnProperty("title"))
            if (!$util.isString(message.title))
                return "title: string expected";
        return null;
    };

    /**
     * Creates a NewsArticle message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof NewsArticle
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {NewsArticle} NewsArticle
     */
    NewsArticle.fromObject = function fromObject(object) {
        if (object instanceof $root.NewsArticle)
            return object;
        var message = new $root.NewsArticle();
        if (object.author != null)
            message.author = String(object.author);
        if (object.description != null)
            message.description = String(object.description);
        if (object.imageUrl != null)
            message.imageUrl = String(object.imageUrl);
        if (object.link != null)
            message.link = String(object.link);
        if (object.title != null)
            message.title = String(object.title);
        return message;
    };

    /**
     * Creates a plain object from a NewsArticle message. Also converts values to other types if specified.
     * @function toObject
     * @memberof NewsArticle
     * @static
     * @param {NewsArticle} message NewsArticle
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    NewsArticle.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.author = "";
            object.description = "";
            object.imageUrl = "";
            object.link = "";
            object.title = "";
        }
        if (message.author != null && message.hasOwnProperty("author"))
            object.author = message.author;
        if (message.description != null && message.hasOwnProperty("description"))
            object.description = message.description;
        if (message.imageUrl != null && message.hasOwnProperty("imageUrl"))
            object.imageUrl = message.imageUrl;
        if (message.link != null && message.hasOwnProperty("link"))
            object.link = message.link;
        if (message.title != null && message.hasOwnProperty("title"))
            object.title = message.title;
        return object;
    };

    /**
     * Converts this NewsArticle to JSON.
     * @function toJSON
     * @memberof NewsArticle
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    NewsArticle.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return NewsArticle;
})();

$root.GameSummary = (function() {

    /**
     * Properties of a GameSummary.
     * @exports IGameSummary
     * @interface IGameSummary
     * @property {string} [id] GameSummary id
     * @property {ILiveGameStats} [liveGameStats] GameSummary liveGameStats
     * @property {number} [gameStartTime] GameSummary gameStartTime
     * @property {boolean} [gameStartTimeTbd] GameSummary gameStartTimeTbd
     * @property {boolean} [finished] GameSummary finished
     * @property {boolean} [notStarted] GameSummary notStarted
     * @property {IGameTeamStatus} [homeTeamStatus] GameSummary homeTeamStatus
     * @property {IGameTeamStatus} [awayTeamStatus] GameSummary awayTeamStatus
     */

    /**
     * Constructs a new GameSummary.
     * @exports GameSummary
     * @classdesc Represents a GameSummary.
     * @constructor
     * @param {IGameSummary=} [properties] Properties to set
     */
    function GameSummary(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameSummary id.
     * @member {string}id
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.id = "";

    /**
     * GameSummary liveGameStats.
     * @member {(ILiveGameStats|null|undefined)}liveGameStats
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.liveGameStats = null;

    /**
     * GameSummary gameStartTime.
     * @member {number}gameStartTime
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.gameStartTime = 0;

    /**
     * GameSummary gameStartTimeTbd.
     * @member {boolean}gameStartTimeTbd
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.gameStartTimeTbd = false;

    /**
     * GameSummary finished.
     * @member {boolean}finished
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.finished = false;

    /**
     * GameSummary notStarted.
     * @member {boolean}notStarted
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.notStarted = false;

    /**
     * GameSummary homeTeamStatus.
     * @member {(IGameTeamStatus|null|undefined)}homeTeamStatus
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.homeTeamStatus = null;

    /**
     * GameSummary awayTeamStatus.
     * @member {(IGameTeamStatus|null|undefined)}awayTeamStatus
     * @memberof GameSummary
     * @instance
     */
    GameSummary.prototype.awayTeamStatus = null;

    /**
     * Creates a new GameSummary instance using the specified properties.
     * @function create
     * @memberof GameSummary
     * @static
     * @param {IGameSummary=} [properties] Properties to set
     * @returns {GameSummary} GameSummary instance
     */
    GameSummary.create = function create(properties) {
        return new GameSummary(properties);
    };

    /**
     * Encodes the specified GameSummary message. Does not implicitly {@link GameSummary.verify|verify} messages.
     * @function encode
     * @memberof GameSummary
     * @static
     * @param {IGameSummary} message GameSummary message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameSummary.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.id != null && message.hasOwnProperty("id"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.id);
        if (message.liveGameStats != null && message.hasOwnProperty("liveGameStats"))
            $root.LiveGameStats.encode(message.liveGameStats, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        if (message.gameStartTime != null && message.hasOwnProperty("gameStartTime"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.gameStartTime);
        if (message.gameStartTimeTbd != null && message.hasOwnProperty("gameStartTimeTbd"))
            writer.uint32(/* id 4, wireType 0 =*/32).bool(message.gameStartTimeTbd);
        if (message.finished != null && message.hasOwnProperty("finished"))
            writer.uint32(/* id 5, wireType 0 =*/40).bool(message.finished);
        if (message.notStarted != null && message.hasOwnProperty("notStarted"))
            writer.uint32(/* id 6, wireType 0 =*/48).bool(message.notStarted);
        if (message.homeTeamStatus != null && message.hasOwnProperty("homeTeamStatus"))
            $root.GameTeamStatus.encode(message.homeTeamStatus, writer.uint32(/* id 7, wireType 2 =*/58).fork()).ldelim();
        if (message.awayTeamStatus != null && message.hasOwnProperty("awayTeamStatus"))
            $root.GameTeamStatus.encode(message.awayTeamStatus, writer.uint32(/* id 8, wireType 2 =*/66).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified GameSummary message, length delimited. Does not implicitly {@link GameSummary.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameSummary
     * @static
     * @param {IGameSummary} message GameSummary message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameSummary.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameSummary message from the specified reader or buffer.
     * @function decode
     * @memberof GameSummary
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameSummary} GameSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameSummary.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameSummary();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.id = reader.string();
                break;
            case 2:
                message.liveGameStats = $root.LiveGameStats.decode(reader, reader.uint32());
                break;
            case 3:
                message.gameStartTime = reader.int32();
                break;
            case 4:
                message.gameStartTimeTbd = reader.bool();
                break;
            case 5:
                message.finished = reader.bool();
                break;
            case 6:
                message.notStarted = reader.bool();
                break;
            case 7:
                message.homeTeamStatus = $root.GameTeamStatus.decode(reader, reader.uint32());
                break;
            case 8:
                message.awayTeamStatus = $root.GameTeamStatus.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameSummary message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameSummary
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameSummary} GameSummary
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameSummary.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameSummary message.
     * @function verify
     * @memberof GameSummary
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameSummary.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.id != null && message.hasOwnProperty("id"))
            if (!$util.isString(message.id))
                return "id: string expected";
        if (message.liveGameStats != null && message.hasOwnProperty("liveGameStats")) {
            var error = $root.LiveGameStats.verify(message.liveGameStats);
            if (error)
                return "liveGameStats." + error;
        }
        if (message.gameStartTime != null && message.hasOwnProperty("gameStartTime"))
            if (!$util.isInteger(message.gameStartTime))
                return "gameStartTime: integer expected";
        if (message.gameStartTimeTbd != null && message.hasOwnProperty("gameStartTimeTbd"))
            if (typeof message.gameStartTimeTbd !== "boolean")
                return "gameStartTimeTbd: boolean expected";
        if (message.finished != null && message.hasOwnProperty("finished"))
            if (typeof message.finished !== "boolean")
                return "finished: boolean expected";
        if (message.notStarted != null && message.hasOwnProperty("notStarted"))
            if (typeof message.notStarted !== "boolean")
                return "notStarted: boolean expected";
        if (message.homeTeamStatus != null && message.hasOwnProperty("homeTeamStatus")) {
            error = $root.GameTeamStatus.verify(message.homeTeamStatus);
            if (error)
                return "homeTeamStatus." + error;
        }
        if (message.awayTeamStatus != null && message.hasOwnProperty("awayTeamStatus")) {
            error = $root.GameTeamStatus.verify(message.awayTeamStatus);
            if (error)
                return "awayTeamStatus." + error;
        }
        return null;
    };

    /**
     * Creates a GameSummary message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameSummary
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameSummary} GameSummary
     */
    GameSummary.fromObject = function fromObject(object) {
        if (object instanceof $root.GameSummary)
            return object;
        var message = new $root.GameSummary();
        if (object.id != null)
            message.id = String(object.id);
        if (object.liveGameStats != null) {
            if (typeof object.liveGameStats !== "object")
                throw TypeError(".GameSummary.liveGameStats: object expected");
            message.liveGameStats = $root.LiveGameStats.fromObject(object.liveGameStats);
        }
        if (object.gameStartTime != null)
            message.gameStartTime = object.gameStartTime | 0;
        if (object.gameStartTimeTbd != null)
            message.gameStartTimeTbd = Boolean(object.gameStartTimeTbd);
        if (object.finished != null)
            message.finished = Boolean(object.finished);
        if (object.notStarted != null)
            message.notStarted = Boolean(object.notStarted);
        if (object.homeTeamStatus != null) {
            if (typeof object.homeTeamStatus !== "object")
                throw TypeError(".GameSummary.homeTeamStatus: object expected");
            message.homeTeamStatus = $root.GameTeamStatus.fromObject(object.homeTeamStatus);
        }
        if (object.awayTeamStatus != null) {
            if (typeof object.awayTeamStatus !== "object")
                throw TypeError(".GameSummary.awayTeamStatus: object expected");
            message.awayTeamStatus = $root.GameTeamStatus.fromObject(object.awayTeamStatus);
        }
        return message;
    };

    /**
     * Creates a plain object from a GameSummary message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameSummary
     * @static
     * @param {GameSummary} message GameSummary
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameSummary.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.id = "";
            object.liveGameStats = null;
            object.gameStartTime = 0;
            object.gameStartTimeTbd = false;
            object.finished = false;
            object.notStarted = false;
            object.homeTeamStatus = null;
            object.awayTeamStatus = null;
        }
        if (message.id != null && message.hasOwnProperty("id"))
            object.id = message.id;
        if (message.liveGameStats != null && message.hasOwnProperty("liveGameStats"))
            object.liveGameStats = $root.LiveGameStats.toObject(message.liveGameStats, options);
        if (message.gameStartTime != null && message.hasOwnProperty("gameStartTime"))
            object.gameStartTime = message.gameStartTime;
        if (message.gameStartTimeTbd != null && message.hasOwnProperty("gameStartTimeTbd"))
            object.gameStartTimeTbd = message.gameStartTimeTbd;
        if (message.finished != null && message.hasOwnProperty("finished"))
            object.finished = message.finished;
        if (message.notStarted != null && message.hasOwnProperty("notStarted"))
            object.notStarted = message.notStarted;
        if (message.homeTeamStatus != null && message.hasOwnProperty("homeTeamStatus"))
            object.homeTeamStatus = $root.GameTeamStatus.toObject(message.homeTeamStatus, options);
        if (message.awayTeamStatus != null && message.hasOwnProperty("awayTeamStatus"))
            object.awayTeamStatus = $root.GameTeamStatus.toObject(message.awayTeamStatus, options);
        return object;
    };

    /**
     * Converts this GameSummary to JSON.
     * @function toJSON
     * @memberof GameSummary
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameSummary.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GameSummary;
})();

$root.LiveGameStats = (function() {

    /**
     * Properties of a LiveGameStats.
     * @exports ILiveGameStats
     * @interface ILiveGameStats
     * @property {number} [period] LiveGameStats period
     * @property {string} [channel] LiveGameStats channel
     * @property {string} [timeRemaining] LiveGameStats timeRemaining
     */

    /**
     * Constructs a new LiveGameStats.
     * @exports LiveGameStats
     * @classdesc Represents a LiveGameStats.
     * @constructor
     * @param {ILiveGameStats=} [properties] Properties to set
     */
    function LiveGameStats(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * LiveGameStats period.
     * @member {number}period
     * @memberof LiveGameStats
     * @instance
     */
    LiveGameStats.prototype.period = 0;

    /**
     * LiveGameStats channel.
     * @member {string}channel
     * @memberof LiveGameStats
     * @instance
     */
    LiveGameStats.prototype.channel = "";

    /**
     * LiveGameStats timeRemaining.
     * @member {string}timeRemaining
     * @memberof LiveGameStats
     * @instance
     */
    LiveGameStats.prototype.timeRemaining = "";

    /**
     * Creates a new LiveGameStats instance using the specified properties.
     * @function create
     * @memberof LiveGameStats
     * @static
     * @param {ILiveGameStats=} [properties] Properties to set
     * @returns {LiveGameStats} LiveGameStats instance
     */
    LiveGameStats.create = function create(properties) {
        return new LiveGameStats(properties);
    };

    /**
     * Encodes the specified LiveGameStats message. Does not implicitly {@link LiveGameStats.verify|verify} messages.
     * @function encode
     * @memberof LiveGameStats
     * @static
     * @param {ILiveGameStats} message LiveGameStats message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LiveGameStats.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.period != null && message.hasOwnProperty("period"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.period);
        if (message.channel != null && message.hasOwnProperty("channel"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.channel);
        if (message.timeRemaining != null && message.hasOwnProperty("timeRemaining"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.timeRemaining);
        return writer;
    };

    /**
     * Encodes the specified LiveGameStats message, length delimited. Does not implicitly {@link LiveGameStats.verify|verify} messages.
     * @function encodeDelimited
     * @memberof LiveGameStats
     * @static
     * @param {ILiveGameStats} message LiveGameStats message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    LiveGameStats.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a LiveGameStats message from the specified reader or buffer.
     * @function decode
     * @memberof LiveGameStats
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {LiveGameStats} LiveGameStats
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LiveGameStats.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.LiveGameStats();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.period = reader.int32();
                break;
            case 2:
                message.channel = reader.string();
                break;
            case 3:
                message.timeRemaining = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a LiveGameStats message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof LiveGameStats
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {LiveGameStats} LiveGameStats
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    LiveGameStats.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a LiveGameStats message.
     * @function verify
     * @memberof LiveGameStats
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    LiveGameStats.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.period != null && message.hasOwnProperty("period"))
            if (!$util.isInteger(message.period))
                return "period: integer expected";
        if (message.channel != null && message.hasOwnProperty("channel"))
            if (!$util.isString(message.channel))
                return "channel: string expected";
        if (message.timeRemaining != null && message.hasOwnProperty("timeRemaining"))
            if (!$util.isString(message.timeRemaining))
                return "timeRemaining: string expected";
        return null;
    };

    /**
     * Creates a LiveGameStats message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof LiveGameStats
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {LiveGameStats} LiveGameStats
     */
    LiveGameStats.fromObject = function fromObject(object) {
        if (object instanceof $root.LiveGameStats)
            return object;
        var message = new $root.LiveGameStats();
        if (object.period != null)
            message.period = object.period | 0;
        if (object.channel != null)
            message.channel = String(object.channel);
        if (object.timeRemaining != null)
            message.timeRemaining = String(object.timeRemaining);
        return message;
    };

    /**
     * Creates a plain object from a LiveGameStats message. Also converts values to other types if specified.
     * @function toObject
     * @memberof LiveGameStats
     * @static
     * @param {LiveGameStats} message LiveGameStats
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    LiveGameStats.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.period = 0;
            object.channel = "";
            object.timeRemaining = "";
        }
        if (message.period != null && message.hasOwnProperty("period"))
            object.period = message.period;
        if (message.channel != null && message.hasOwnProperty("channel"))
            object.channel = message.channel;
        if (message.timeRemaining != null && message.hasOwnProperty("timeRemaining"))
            object.timeRemaining = message.timeRemaining;
        return object;
    };

    /**
     * Converts this LiveGameStats to JSON.
     * @function toJSON
     * @memberof LiveGameStats
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    LiveGameStats.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return LiveGameStats;
})();

$root.GameTeamStatus = (function() {

    /**
     * Properties of a GameTeamStatus.
     * @exports IGameTeamStatus
     * @interface IGameTeamStatus
     * @property {number} [wins] GameTeamStatus wins
     * @property {number} [score] GameTeamStatus score
     * @property {number} [losses] GameTeamStatus losses
     * @property {string} [teamId] GameTeamStatus teamId
     * @property {string} [tricode] GameTeamStatus tricode
     * @property {string} [name] GameTeamStatus name
     * @property {string} [city] GameTeamStatus city
     * @property {string} [splashUrl] GameTeamStatus splashUrl
     * @property {string} [splashPrimaryColor] GameTeamStatus splashPrimaryColor
     * @property {string} [splashSecondaryColor] GameTeamStatus splashSecondaryColor
     * @property {IGameLeader} [pointsLeader] GameTeamStatus pointsLeader
     * @property {IGameLeader} [assistsLeader] GameTeamStatus assistsLeader
     * @property {IGameLeader} [reboundsLeader] GameTeamStatus reboundsLeader
     * @property {number} [defensiveRating] GameTeamStatus defensiveRating
     * @property {number} [defensiveRank] GameTeamStatus defensiveRank
     * @property {number} [offensiveRating] GameTeamStatus offensiveRating
     * @property {number} [offensiveRank] GameTeamStatus offensiveRank
     * @property {number} [overallRank] GameTeamStatus overallRank
     */

    /**
     * Constructs a new GameTeamStatus.
     * @exports GameTeamStatus
     * @classdesc Represents a GameTeamStatus.
     * @constructor
     * @param {IGameTeamStatus=} [properties] Properties to set
     */
    function GameTeamStatus(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameTeamStatus wins.
     * @member {number}wins
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.wins = 0;

    /**
     * GameTeamStatus score.
     * @member {number}score
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.score = 0;

    /**
     * GameTeamStatus losses.
     * @member {number}losses
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.losses = 0;

    /**
     * GameTeamStatus teamId.
     * @member {string}teamId
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.teamId = "";

    /**
     * GameTeamStatus tricode.
     * @member {string}tricode
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.tricode = "";

    /**
     * GameTeamStatus name.
     * @member {string}name
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.name = "";

    /**
     * GameTeamStatus city.
     * @member {string}city
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.city = "";

    /**
     * GameTeamStatus splashUrl.
     * @member {string}splashUrl
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.splashUrl = "";

    /**
     * GameTeamStatus splashPrimaryColor.
     * @member {string}splashPrimaryColor
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.splashPrimaryColor = "";

    /**
     * GameTeamStatus splashSecondaryColor.
     * @member {string}splashSecondaryColor
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.splashSecondaryColor = "";

    /**
     * GameTeamStatus pointsLeader.
     * @member {(IGameLeader|null|undefined)}pointsLeader
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.pointsLeader = null;

    /**
     * GameTeamStatus assistsLeader.
     * @member {(IGameLeader|null|undefined)}assistsLeader
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.assistsLeader = null;

    /**
     * GameTeamStatus reboundsLeader.
     * @member {(IGameLeader|null|undefined)}reboundsLeader
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.reboundsLeader = null;

    /**
     * GameTeamStatus defensiveRating.
     * @member {number}defensiveRating
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.defensiveRating = 0;

    /**
     * GameTeamStatus defensiveRank.
     * @member {number}defensiveRank
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.defensiveRank = 0;

    /**
     * GameTeamStatus offensiveRating.
     * @member {number}offensiveRating
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.offensiveRating = 0;

    /**
     * GameTeamStatus offensiveRank.
     * @member {number}offensiveRank
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.offensiveRank = 0;

    /**
     * GameTeamStatus overallRank.
     * @member {number}overallRank
     * @memberof GameTeamStatus
     * @instance
     */
    GameTeamStatus.prototype.overallRank = 0;

    /**
     * Creates a new GameTeamStatus instance using the specified properties.
     * @function create
     * @memberof GameTeamStatus
     * @static
     * @param {IGameTeamStatus=} [properties] Properties to set
     * @returns {GameTeamStatus} GameTeamStatus instance
     */
    GameTeamStatus.create = function create(properties) {
        return new GameTeamStatus(properties);
    };

    /**
     * Encodes the specified GameTeamStatus message. Does not implicitly {@link GameTeamStatus.verify|verify} messages.
     * @function encode
     * @memberof GameTeamStatus
     * @static
     * @param {IGameTeamStatus} message GameTeamStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameTeamStatus.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.wins != null && message.hasOwnProperty("wins"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message.wins);
        if (message.score != null && message.hasOwnProperty("score"))
            writer.uint32(/* id 2, wireType 0 =*/16).int32(message.score);
        if (message.losses != null && message.hasOwnProperty("losses"))
            writer.uint32(/* id 3, wireType 0 =*/24).int32(message.losses);
        if (message.teamId != null && message.hasOwnProperty("teamId"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.teamId);
        if (message.tricode != null && message.hasOwnProperty("tricode"))
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.tricode);
        if (message.name != null && message.hasOwnProperty("name"))
            writer.uint32(/* id 6, wireType 2 =*/50).string(message.name);
        if (message.city != null && message.hasOwnProperty("city"))
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.city);
        if (message.splashUrl != null && message.hasOwnProperty("splashUrl"))
            writer.uint32(/* id 8, wireType 2 =*/66).string(message.splashUrl);
        if (message.splashPrimaryColor != null && message.hasOwnProperty("splashPrimaryColor"))
            writer.uint32(/* id 9, wireType 2 =*/74).string(message.splashPrimaryColor);
        if (message.splashSecondaryColor != null && message.hasOwnProperty("splashSecondaryColor"))
            writer.uint32(/* id 10, wireType 2 =*/82).string(message.splashSecondaryColor);
        if (message.pointsLeader != null && message.hasOwnProperty("pointsLeader"))
            $root.GameLeader.encode(message.pointsLeader, writer.uint32(/* id 11, wireType 2 =*/90).fork()).ldelim();
        if (message.assistsLeader != null && message.hasOwnProperty("assistsLeader"))
            $root.GameLeader.encode(message.assistsLeader, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
        if (message.reboundsLeader != null && message.hasOwnProperty("reboundsLeader"))
            $root.GameLeader.encode(message.reboundsLeader, writer.uint32(/* id 13, wireType 2 =*/106).fork()).ldelim();
        if (message.defensiveRating != null && message.hasOwnProperty("defensiveRating"))
            writer.uint32(/* id 14, wireType 5 =*/117).float(message.defensiveRating);
        if (message.defensiveRank != null && message.hasOwnProperty("defensiveRank"))
            writer.uint32(/* id 15, wireType 0 =*/120).int32(message.defensiveRank);
        if (message.offensiveRating != null && message.hasOwnProperty("offensiveRating"))
            writer.uint32(/* id 16, wireType 5 =*/133).float(message.offensiveRating);
        if (message.offensiveRank != null && message.hasOwnProperty("offensiveRank"))
            writer.uint32(/* id 17, wireType 0 =*/136).int32(message.offensiveRank);
        if (message.overallRank != null && message.hasOwnProperty("overallRank"))
            writer.uint32(/* id 18, wireType 0 =*/144).int32(message.overallRank);
        return writer;
    };

    /**
     * Encodes the specified GameTeamStatus message, length delimited. Does not implicitly {@link GameTeamStatus.verify|verify} messages.
     * @function encodeDelimited
     * @memberof GameTeamStatus
     * @static
     * @param {IGameTeamStatus} message GameTeamStatus message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameTeamStatus.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameTeamStatus message from the specified reader or buffer.
     * @function decode
     * @memberof GameTeamStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {GameTeamStatus} GameTeamStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameTeamStatus.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.GameTeamStatus();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.wins = reader.int32();
                break;
            case 2:
                message.score = reader.int32();
                break;
            case 3:
                message.losses = reader.int32();
                break;
            case 4:
                message.teamId = reader.string();
                break;
            case 5:
                message.tricode = reader.string();
                break;
            case 6:
                message.name = reader.string();
                break;
            case 7:
                message.city = reader.string();
                break;
            case 8:
                message.splashUrl = reader.string();
                break;
            case 9:
                message.splashPrimaryColor = reader.string();
                break;
            case 10:
                message.splashSecondaryColor = reader.string();
                break;
            case 11:
                message.pointsLeader = $root.GameLeader.decode(reader, reader.uint32());
                break;
            case 12:
                message.assistsLeader = $root.GameLeader.decode(reader, reader.uint32());
                break;
            case 13:
                message.reboundsLeader = $root.GameLeader.decode(reader, reader.uint32());
                break;
            case 14:
                message.defensiveRating = reader.float();
                break;
            case 15:
                message.defensiveRank = reader.int32();
                break;
            case 16:
                message.offensiveRating = reader.float();
                break;
            case 17:
                message.offensiveRank = reader.int32();
                break;
            case 18:
                message.overallRank = reader.int32();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a GameTeamStatus message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof GameTeamStatus
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {GameTeamStatus} GameTeamStatus
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameTeamStatus.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameTeamStatus message.
     * @function verify
     * @memberof GameTeamStatus
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameTeamStatus.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.wins != null && message.hasOwnProperty("wins"))
            if (!$util.isInteger(message.wins))
                return "wins: integer expected";
        if (message.score != null && message.hasOwnProperty("score"))
            if (!$util.isInteger(message.score))
                return "score: integer expected";
        if (message.losses != null && message.hasOwnProperty("losses"))
            if (!$util.isInteger(message.losses))
                return "losses: integer expected";
        if (message.teamId != null && message.hasOwnProperty("teamId"))
            if (!$util.isString(message.teamId))
                return "teamId: string expected";
        if (message.tricode != null && message.hasOwnProperty("tricode"))
            if (!$util.isString(message.tricode))
                return "tricode: string expected";
        if (message.name != null && message.hasOwnProperty("name"))
            if (!$util.isString(message.name))
                return "name: string expected";
        if (message.city != null && message.hasOwnProperty("city"))
            if (!$util.isString(message.city))
                return "city: string expected";
        if (message.splashUrl != null && message.hasOwnProperty("splashUrl"))
            if (!$util.isString(message.splashUrl))
                return "splashUrl: string expected";
        if (message.splashPrimaryColor != null && message.hasOwnProperty("splashPrimaryColor"))
            if (!$util.isString(message.splashPrimaryColor))
                return "splashPrimaryColor: string expected";
        if (message.splashSecondaryColor != null && message.hasOwnProperty("splashSecondaryColor"))
            if (!$util.isString(message.splashSecondaryColor))
                return "splashSecondaryColor: string expected";
        if (message.pointsLeader != null && message.hasOwnProperty("pointsLeader")) {
            var error = $root.GameLeader.verify(message.pointsLeader);
            if (error)
                return "pointsLeader." + error;
        }
        if (message.assistsLeader != null && message.hasOwnProperty("assistsLeader")) {
            error = $root.GameLeader.verify(message.assistsLeader);
            if (error)
                return "assistsLeader." + error;
        }
        if (message.reboundsLeader != null && message.hasOwnProperty("reboundsLeader")) {
            error = $root.GameLeader.verify(message.reboundsLeader);
            if (error)
                return "reboundsLeader." + error;
        }
        if (message.defensiveRating != null && message.hasOwnProperty("defensiveRating"))
            if (typeof message.defensiveRating !== "number")
                return "defensiveRating: number expected";
        if (message.defensiveRank != null && message.hasOwnProperty("defensiveRank"))
            if (!$util.isInteger(message.defensiveRank))
                return "defensiveRank: integer expected";
        if (message.offensiveRating != null && message.hasOwnProperty("offensiveRating"))
            if (typeof message.offensiveRating !== "number")
                return "offensiveRating: number expected";
        if (message.offensiveRank != null && message.hasOwnProperty("offensiveRank"))
            if (!$util.isInteger(message.offensiveRank))
                return "offensiveRank: integer expected";
        if (message.overallRank != null && message.hasOwnProperty("overallRank"))
            if (!$util.isInteger(message.overallRank))
                return "overallRank: integer expected";
        return null;
    };

    /**
     * Creates a GameTeamStatus message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof GameTeamStatus
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {GameTeamStatus} GameTeamStatus
     */
    GameTeamStatus.fromObject = function fromObject(object) {
        if (object instanceof $root.GameTeamStatus)
            return object;
        var message = new $root.GameTeamStatus();
        if (object.wins != null)
            message.wins = object.wins | 0;
        if (object.score != null)
            message.score = object.score | 0;
        if (object.losses != null)
            message.losses = object.losses | 0;
        if (object.teamId != null)
            message.teamId = String(object.teamId);
        if (object.tricode != null)
            message.tricode = String(object.tricode);
        if (object.name != null)
            message.name = String(object.name);
        if (object.city != null)
            message.city = String(object.city);
        if (object.splashUrl != null)
            message.splashUrl = String(object.splashUrl);
        if (object.splashPrimaryColor != null)
            message.splashPrimaryColor = String(object.splashPrimaryColor);
        if (object.splashSecondaryColor != null)
            message.splashSecondaryColor = String(object.splashSecondaryColor);
        if (object.pointsLeader != null) {
            if (typeof object.pointsLeader !== "object")
                throw TypeError(".GameTeamStatus.pointsLeader: object expected");
            message.pointsLeader = $root.GameLeader.fromObject(object.pointsLeader);
        }
        if (object.assistsLeader != null) {
            if (typeof object.assistsLeader !== "object")
                throw TypeError(".GameTeamStatus.assistsLeader: object expected");
            message.assistsLeader = $root.GameLeader.fromObject(object.assistsLeader);
        }
        if (object.reboundsLeader != null) {
            if (typeof object.reboundsLeader !== "object")
                throw TypeError(".GameTeamStatus.reboundsLeader: object expected");
            message.reboundsLeader = $root.GameLeader.fromObject(object.reboundsLeader);
        }
        if (object.defensiveRating != null)
            message.defensiveRating = Number(object.defensiveRating);
        if (object.defensiveRank != null)
            message.defensiveRank = object.defensiveRank | 0;
        if (object.offensiveRating != null)
            message.offensiveRating = Number(object.offensiveRating);
        if (object.offensiveRank != null)
            message.offensiveRank = object.offensiveRank | 0;
        if (object.overallRank != null)
            message.overallRank = object.overallRank | 0;
        return message;
    };

    /**
     * Creates a plain object from a GameTeamStatus message. Also converts values to other types if specified.
     * @function toObject
     * @memberof GameTeamStatus
     * @static
     * @param {GameTeamStatus} message GameTeamStatus
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameTeamStatus.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.wins = 0;
            object.score = 0;
            object.losses = 0;
            object.teamId = "";
            object.tricode = "";
            object.name = "";
            object.city = "";
            object.splashUrl = "";
            object.splashPrimaryColor = "";
            object.splashSecondaryColor = "";
            object.pointsLeader = null;
            object.assistsLeader = null;
            object.reboundsLeader = null;
            object.defensiveRating = 0;
            object.defensiveRank = 0;
            object.offensiveRating = 0;
            object.offensiveRank = 0;
            object.overallRank = 0;
        }
        if (message.wins != null && message.hasOwnProperty("wins"))
            object.wins = message.wins;
        if (message.score != null && message.hasOwnProperty("score"))
            object.score = message.score;
        if (message.losses != null && message.hasOwnProperty("losses"))
            object.losses = message.losses;
        if (message.teamId != null && message.hasOwnProperty("teamId"))
            object.teamId = message.teamId;
        if (message.tricode != null && message.hasOwnProperty("tricode"))
            object.tricode = message.tricode;
        if (message.name != null && message.hasOwnProperty("name"))
            object.name = message.name;
        if (message.city != null && message.hasOwnProperty("city"))
            object.city = message.city;
        if (message.splashUrl != null && message.hasOwnProperty("splashUrl"))
            object.splashUrl = message.splashUrl;
        if (message.splashPrimaryColor != null && message.hasOwnProperty("splashPrimaryColor"))
            object.splashPrimaryColor = message.splashPrimaryColor;
        if (message.splashSecondaryColor != null && message.hasOwnProperty("splashSecondaryColor"))
            object.splashSecondaryColor = message.splashSecondaryColor;
        if (message.pointsLeader != null && message.hasOwnProperty("pointsLeader"))
            object.pointsLeader = $root.GameLeader.toObject(message.pointsLeader, options);
        if (message.assistsLeader != null && message.hasOwnProperty("assistsLeader"))
            object.assistsLeader = $root.GameLeader.toObject(message.assistsLeader, options);
        if (message.reboundsLeader != null && message.hasOwnProperty("reboundsLeader"))
            object.reboundsLeader = $root.GameLeader.toObject(message.reboundsLeader, options);
        if (message.defensiveRating != null && message.hasOwnProperty("defensiveRating"))
            object.defensiveRating = options.json && !isFinite(message.defensiveRating) ? String(message.defensiveRating) : message.defensiveRating;
        if (message.defensiveRank != null && message.hasOwnProperty("defensiveRank"))
            object.defensiveRank = message.defensiveRank;
        if (message.offensiveRating != null && message.hasOwnProperty("offensiveRating"))
            object.offensiveRating = options.json && !isFinite(message.offensiveRating) ? String(message.offensiveRating) : message.offensiveRating;
        if (message.offensiveRank != null && message.hasOwnProperty("offensiveRank"))
            object.offensiveRank = message.offensiveRank;
        if (message.overallRank != null && message.hasOwnProperty("overallRank"))
            object.overallRank = message.overallRank;
        return object;
    };

    /**
     * Converts this GameTeamStatus to JSON.
     * @function toJSON
     * @memberof GameTeamStatus
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameTeamStatus.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return GameTeamStatus;
})();

$root.SplashData = (function() {

    /**
     * Properties of a SplashData.
     * @exports ISplashData
     * @interface ISplashData
     * @property {Array.<IGameSummary>} [games] SplashData games
     * @property {IGameNews} [firstGameNews] SplashData firstGameNews
     */

    /**
     * Constructs a new SplashData.
     * @exports SplashData
     * @classdesc Represents a SplashData.
     * @constructor
     * @param {ISplashData=} [properties] Properties to set
     */
    function SplashData(properties) {
        this.games = [];
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SplashData games.
     * @member {Array.<IGameSummary>}games
     * @memberof SplashData
     * @instance
     */
    SplashData.prototype.games = $util.emptyArray;

    /**
     * SplashData firstGameNews.
     * @member {(IGameNews|null|undefined)}firstGameNews
     * @memberof SplashData
     * @instance
     */
    SplashData.prototype.firstGameNews = null;

    /**
     * Creates a new SplashData instance using the specified properties.
     * @function create
     * @memberof SplashData
     * @static
     * @param {ISplashData=} [properties] Properties to set
     * @returns {SplashData} SplashData instance
     */
    SplashData.create = function create(properties) {
        return new SplashData(properties);
    };

    /**
     * Encodes the specified SplashData message. Does not implicitly {@link SplashData.verify|verify} messages.
     * @function encode
     * @memberof SplashData
     * @static
     * @param {ISplashData} message SplashData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SplashData.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.games != null && message.games.length)
            for (var i = 0; i < message.games.length; ++i)
                $root.GameSummary.encode(message.games[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        if (message.firstGameNews != null && message.hasOwnProperty("firstGameNews"))
            $root.GameNews.encode(message.firstGameNews, writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SplashData message, length delimited. Does not implicitly {@link SplashData.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SplashData
     * @static
     * @param {ISplashData} message SplashData message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SplashData.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SplashData message from the specified reader or buffer.
     * @function decode
     * @memberof SplashData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SplashData} SplashData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SplashData.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SplashData();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                if (!(message.games && message.games.length))
                    message.games = [];
                message.games.push($root.GameSummary.decode(reader, reader.uint32()));
                break;
            case 2:
                message.firstGameNews = $root.GameNews.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SplashData message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SplashData
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SplashData} SplashData
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SplashData.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SplashData message.
     * @function verify
     * @memberof SplashData
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SplashData.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.games != null && message.hasOwnProperty("games")) {
            if (!Array.isArray(message.games))
                return "games: array expected";
            for (var i = 0; i < message.games.length; ++i) {
                var error = $root.GameSummary.verify(message.games[i]);
                if (error)
                    return "games." + error;
            }
        }
        if (message.firstGameNews != null && message.hasOwnProperty("firstGameNews")) {
            error = $root.GameNews.verify(message.firstGameNews);
            if (error)
                return "firstGameNews." + error;
        }
        return null;
    };

    /**
     * Creates a SplashData message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SplashData
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SplashData} SplashData
     */
    SplashData.fromObject = function fromObject(object) {
        if (object instanceof $root.SplashData)
            return object;
        var message = new $root.SplashData();
        if (object.games) {
            if (!Array.isArray(object.games))
                throw TypeError(".SplashData.games: array expected");
            message.games = [];
            for (var i = 0; i < object.games.length; ++i) {
                if (typeof object.games[i] !== "object")
                    throw TypeError(".SplashData.games: object expected");
                message.games[i] = $root.GameSummary.fromObject(object.games[i]);
            }
        }
        if (object.firstGameNews != null) {
            if (typeof object.firstGameNews !== "object")
                throw TypeError(".SplashData.firstGameNews: object expected");
            message.firstGameNews = $root.GameNews.fromObject(object.firstGameNews);
        }
        return message;
    };

    /**
     * Creates a plain object from a SplashData message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SplashData
     * @static
     * @param {SplashData} message SplashData
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SplashData.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.arrays || options.defaults)
            object.games = [];
        if (options.defaults)
            object.firstGameNews = null;
        if (message.games && message.games.length) {
            object.games = [];
            for (var j = 0; j < message.games.length; ++j)
                object.games[j] = $root.GameSummary.toObject(message.games[j], options);
        }
        if (message.firstGameNews != null && message.hasOwnProperty("firstGameNews"))
            object.firstGameNews = $root.GameNews.toObject(message.firstGameNews, options);
        return object;
    };

    /**
     * Converts this SplashData to JSON.
     * @function toJSON
     * @memberof SplashData
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SplashData.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SplashData;
})();

module.exports = $root;
