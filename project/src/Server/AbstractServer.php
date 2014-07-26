<?php
/**
 * Author: Maxim
 * Date: 25/07/2014
 * Time: 15:42
 */

namespace Maxim\MCPing\Server;

abstract class AbstractServer
{
    protected $name;
    protected $host;
    protected $port;

    protected $socket;

    protected $timeout;

    protected $data;

    protected $startTime;
    protected $endTime;

    public function __construct($name = null, $host = null, $port = 25565, $timeout = 3) {
        $this->setName($name);
        $this->setHost($host);
        $this->setPort($port);
        $this->setTimeout($timeout);
    }

    /**
     * @return mixed
     */
    public function getHost()
    {
        return $this->host;
    }

    /**
     * @param mixed $host
     */
    public function setHost($host)
    {
        $this->host = $host;
    }

    /**
     * @return mixed
     */
    public function getPort()
    {
        return $this->port;
    }

    /**
     * @param mixed $port
     */
    public function setPort($port)
    {
        $this->port = $port;
    }

    /**
     * @return mixed
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param mixed $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return mixed
     */
    public function getTimeout()
    {
        return $this->timeout;
    }

    /**
     * @param mixed $timeout
     */
    public function setTimeout($timeout)
    {
        $this->timeout = $timeout;
    }

    /**
     * @return mixed
     */
    public function getData()
    {
        return $this->data;
    }

    /**
     * @param mixed $data
     */
    public function setData($data)
    {
        $this->data = $data;
    }

    /**
     * @return mixed
     */
    public function getSocket()
    {
        return $this->socket;
    }

    /**
     * @param mixed $socket
     */
    public function setSocket($socket)
    {
        $this->socket = $socket;
    }

    /**
     * @return mixed
     */
    public function getEndTime()
    {
        return $this->endTime;
    }

    /**
     * @param mixed $endTime
     */
    public function setEndTime($endTime)
    {
        $this->endTime = $endTime;
    }

    /**
     * @return mixed
     */
    public function getStartTime()
    {
        return $this->startTime;
    }

    /**
     * @param mixed $startTime
     */
    public function setStartTime($startTime)
    {
        $this->startTime = $startTime;
    }

    public abstract function ping();
} 