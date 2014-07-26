<?php
/**
 * Author: Maxim
 * Date: 25/07/2014
 * Time: 15:39
 */

namespace Maxim\MCPing\Server\Minecraft;

use Maxim\MCPing\Server\AbstractServer;

class MinecraftServer extends AbstractServer
{
    const PACKET_STATUS = "\x01\x00";
    const PACKET_ID = "\x00";
    const PROTOCOL_VERSION = "\x04"; #4
    const NEXT_STATE = "\x01";

    public function ping()
    {
        $this->startTime = microtime(true);

        $data = self::PACKET_ID; #packet ID (varint)
        $data .= self::PROTOCOL_VERSION; # protocol version (4 or 5) (varint)
        $data .= pack('c', strlen($this->host)) . $this->host; # server (varint len + UTF-8 addr)
        $data .= pack('n', $this->port); # next state: status (varint)
        $data .= self::NEXT_STATE;

        $data = pack('c', strlen($data)) . $data;

        $this->socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

        socket_set_option( $this->socket, SOL_SOCKET, SO_SNDTIMEO, array( 'sec' => (int)$this->timeout, 'usec' => 0 ) );
        socket_set_option( $this->socket, SOL_SOCKET, SO_RCVTIMEO, array( 'sec' => (int)$this->timeout, 'usec' => 0 ) );

        if( $this->socket === false || @socket_connect( $this->socket, $this->host, (int)$this->port) === false )
            throw new \Exception(sprintf("Could not connect to %s on port %d", $this->host, $this->port));

        socket_write($this->socket, $data, strlen($data));
        socket_write($this->socket, self::PACKET_STATUS, strlen(self::PACKET_STATUS));

        $length = $this->readVarInt();

        if($length < 10)
            throw new \Exception("Length could not be determined");

        socket_read($this->socket, 1); #packet type

        $this->endTime = microtime(true);

        $length = $this->readVarInt();

        $data = socket_read($this->socket, $length, PHP_NORMAL_READ);

        if($data === false)
            throw new \Exception("Could not read data");

        socket_close($this->socket);

        $this->data = $data;

        return $data;
    }

    private function readVarInt( )
    {
        $i = 0;
        $j = 0;

        while( true )
        {
            $k = @socket_read($this->socket, 1);

            if( $k === FALSE )
            {
                return 0;
            }

            $k = ord( $k );

            $i |= ( $k & 0x7F ) << $j++ * 7;

            if( $j > 5 )
            {
                throw new \Exception( 'VarInt too big' );
            }

            if( ( $k & 0x80 ) != 128 )
            {
                break;
            }
        }
        return $i;
    }
} 