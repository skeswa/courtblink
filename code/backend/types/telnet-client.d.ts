///<reference types="node" />

declare module 'telnet-client' {
  /** Options for `Telnet#connect(...)`. */
  type ConnectOpts = {
    /** Host the client should connect to. Defaults to '127.0.0.1'. */
    host?: string
    /** Port the client should connect to. Defaults to '23'. */
    port?: number
    /**
     * Sets the socket to timeout after the specified number of milliseconds of
     * inactivity on the socket.
     */
    timeout?: number
    /**
     * Shell prompt that the host is using. Can be a string or an instance of
     * RegExp. Defaults to regex '/(?:\/ )?#\s/'.
     */
    shellPrompt?: RegExp
    /**
     * Username/login prompt that the host is using. Can be a string or an
     * instance of RegExp. Defaults to regex '/login[: ]*$/i'.
     */
    loginPrompt?: RegExp
    /**
     * Password/login prompt that the host is using. Can be a string or an
     * instance of RegExp. Defaults to regex '/Password: /i'.
     */
    passwordPrompt?: RegExp
    /**
     * String or regex to match if your host provides login failure messages.
     * Defaults to undefined.
     */
    failedLoginMatch?: string | RegExp
    /**
     * Flag used to determine if an initial '\r\n' (CR+LF) should be sent when
     * connected to server.
     */
    initialLFCR?: string
    /** Username used to login. Defaults to 'root'. */
    username?: string
    /** Password used to login. Defaults to 'guest'. */
    password?: string
    /** Duplex stream which can be used for connection hopping/reusing. */
    sock?: NodeJS.Socket
    /**
     * Input record separator. A separator used to distinguish between lines
     * of the response. Defaults to '\r\n'.
     */
    irs?: string
    /**
     * Output record separator. A separator used to execute commands (break
     * lines on input). Defaults to '\n'.
     */
    ors?: string
    /** The number of lines used to cut off the response. Defaults to 1. */
    echoLines?: number
    /**
     * Whether shell prompt should be excluded from the results.
     * Defaults to true.
     */
    stripShellPrompt?: boolean
    /**
     * The pattern used (and removed from final output) for breaking the
     * number of lines on output. Defaults to '---- More'.
     */
    pageSeparator?: string
    /**
     * Disable telnet negotiations if needed. Can be used with 'send' when
     * telnet specification is not needed. Telnet client will then basically
     * act like a simple TCP client. Defaults to true.
     */
    negotiationMandatory?: boolean
    /**
     * A timeout used to wait for a server reply when the 'exec' method is
     * used. Defaults to 2000 (ms).
     */
    execTimeout?: number
    /**
     * A timeout used to wait for a server reply when the 'send' method is
     * used. Defaults to 2000 (ms).
     */
    sendTimeout?: number
    /**
     * Maximum buffer length in bytes which can be filled with response data.
     * Defaults to 1M.
     */
    maxBufferLength?: number
    /** Enable/disable debug logs on console. Defaults to false. */
    debug?: boolean
  }

  /** Options for `Telnet#exec(...)`. */
  type ExecOpts = {
    /**
     * Shell prompt that the host is using. Can be a string or an instance of
     * RegExp. Defaults to regex `/(?:/ )?#\s/`.
     */
    shellPrompt?: RegExp

    /**
     * Username/login prompt that the host is using. Can be a string or an
     * instance of RegExp. Defaults to regex `/login[: ]*$/i`.
     */
    loginPrompt?: RegExp

    /**
     * String or regex to match if your host provides login failure messages.
     * Defaults to `undefined`.
     */
    failedLoginMatch?: string

    /**
     * Sets the socket to timeout after the specified number of milliseconds of
     * inactivity on the socket.
     */
    timeout?: number

    /**
     * A timeout used to wait for a server reply when this method is used.
     * Defaults to `undefined`.
     */
    execTimeout?: number

    /**
     * Maximum buffer length in bytes which can be filled with response data.
     * Defaults to 1M.
     */
    maxBufferLength?: number

    /**
     * Input record separator. A separator used to distinguish between lines of
     * the response. Defaults to `'\r\n'`.
     */
    irs?: string

    /**
     * Output record separator. A separator used to execute commands
     * (break lines on input). Defaults to `'\n'`.
     */
    ors?: string

    /**
     * The number of lines used to cut off the response. Defaults to `1`.
     */
    echoLines?: string
  }

  /** Telnet client used to connect toa telnet server. */
  class Telnet extends NodeJS.EventEmitter {
    /**
     * Creates a new TCP connection to the specified host.
     * @param opts options to tweak the behavior of this method.
     */
    connect(opts: ConnectOpts): Promise<void>

    /**
     * Ensures that no more I/O activity happens on this socket. Only necessary
     * in case of errors (parse error or so).
     */
    destroy(): Promise<void>

    /**
     * Half-closes the socket. i.e., it sends a FIN packet. It is possible the
     * server will still send some data.
     */
    end(): Promise<void>

    /**
     * Sends data on the socket (should be a compatible remote host's command
     * if sane information is wanted). The optional callback parameter will be
     * executed with an error and response when the command is finally written
     * out and the response data has been received.
     *
     * If there was no error when executing the command, 'error' as the first
     * argument to the callback will be undefined. Command result will be
     * passed as the second argument to the callback.
     *
     * *** important notice/API change from 0.3.0 ***
     * The callback argument is now called with a signature of
     * `(error, [response])`.
     *
     * @param data command to execute on the designated telnet server.
     * @param opts options to tweak the behavior of this method.
     * @return the server response to `data`.
     */
    exec(
      data: string,
      opts?: ExecOpts,
      callback?: (err: Error, res: string) => void
    ): Promise<string>
  }

  export = Telnet
}
