///<reference types="node" />

declare module 'socks' {
  import { Agent as HTTPAgent } from 'http';

  /**
   * Different types of socks connection.
   * 
   * | Type        | Description                                               |
   * |-------------|-----------------------------------------------------------|
   * | `connect`   | establishes a regular SOCKS connection to the target host.|
   * | `bind`      | establishes an open TCP port on the SOCKS for another     |
   * |             |                client to connect to.                      |
   * | `associate` | establishes a udp association relay on the SOCKS server.  |
   */
  type SocksConnectionType = 'connect' | 'bind' | 'associate'

  /**
   * Different types of proxy.
   * _Note: 4 works for both 4 and 4a._
   */
  type ProxyType = 4 | 5

  type Target = {
    /**
     * - When using `connect`: IP Address or hostname (`4a` and `5` only) of
     *   a target to connect to.
     * - When using `bind`: IP Address of the expected client that will
     *   connect to the newly open TCP port.
     * - When using `associate`: IP Address and Port of the expected client
     *   that will send UDP packets to this UDP association relay.
     * 
     * Note:
     * - When using SOCKS 4, only an ipv4 address can be used.
     * - When using SOCKS 4a, an ipv4 address OR a hostname can be used.
     * - When using SOCKS 5, ipv4, ipv6, or a hostname can be used.
     */
    host: string
    
    /** TCP port of target to connect to. */
    port: number
  }

  type ConnectionOptions = {
    /** Information about the proxy server. */
    proxy: {
      /** IP Address of the proxy. */
      ipaddress: string

      /** TCP port of the proxy. */
      port: number

      /** Type of proxy to use. */
      type: ProxyType

      /** Type of SOCKS connection to form. */
      command?: SocksConnectionType

      /** (SOCKS 4 specific) UserId used when making a SOCKS 4/4a request. */
      userid?: string

      /**
       * (SOCKS 5 specific) Authentication used for SOCKS 5
       * (when it's required).
       */
      authentication?: {
        username: string
        password: string
      }
    }

    /**
     * Information about target host and/or expected client of a bind
     * association.
     */
    target?: Target

    /**
     * Amount of time to wait for a connection to be established.
     * Defaults to 10000ms (10 seconds).
     */
    timeout?: number
  }

  export class Agent extends HTTPAgent {
    /**
     * Creates a new agent.
     * 
     * @param options configuration for the agent.
     * @param secure we are connecting to a HTTPS server, false for HTTP server.
     * @param rejectUnauthorized rejectUnauthorized option passed to
     *     `tls.connect()`. Only when secure is set to true,
     */
    constructor(
      options: ConnectionOptions,
      secure: boolean,
      rejectUnauthorized: boolean
    )
  }

  /**
   * There are only three exported functions that you will ever need to use.
   * @param options configuration for the connection.
   * @param callback Callback that is called when connection completes or
   *     errors.
   */
  export function createConnection(
    options: ConnectionOptions,
    callback: (
      /** If an error occurs, err will be an Error object, otherwise null. */
      err: Error | null,
      /** Socket with established connection to your target host. */
      socket: NodeJS.Socket,
      /**
       * If using BIND or associate, this will be the remote endpoint to use.
       */
      info: { host: string; port: number }
    ) => any
  ): void

  /**
   * Creates a UDP packet frame for using with UDP association relays.
   * @param target Target host object containing destination for UDP packet.
   * @param buffer Data Buffer to send in the UDP packet.
   * @param frame Frame number in UDP packet (defaults to 0).
   * @return The completed UDP packet container to be sent to the proxy for
   *     forwarding.
   */
  export function createUDPFrame(
    target: Target,
    buffer: Buffer,
    frame?: number
  ): Buffer
}
