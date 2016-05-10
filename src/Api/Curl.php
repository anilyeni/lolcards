<?php

/**
 * Created for project LoLCards
 * User: anilyeni
 * Date: 07/05/2016
 */

namespace Api;

class Curl
{
    /** @var string */
    protected $url;

    /**
     * The contents of the "User-Agent: " header to be used in a HTTP request.
     * @var string
     */
    protected $clientName = 'LoLCards/1.0';

    /**
     * The maximum number of seconds to allow cURL functions to execute.
     * @var  integer
     */
    protected $timeout = 30;


    /**
     * @param $url
     * @return mixed
     */
    public function getResult($url)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_USERAGENT, $this->getClientName());
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, $this->getTimeout());

        $output = curl_exec($ch);

        curl_close($ch);

        return $output;
    }

    /**
     * @return mixed
     */
    public function getClientName()
    {
        return $this->clientName;
    }

    /**
     * @param mixed $clientName
     */
    public function setClientName($clientName)
    {
        $this->clientName = $clientName;
    }

    /**
     * @return int
     */
    public function getTimeout()
    {
        return $this->timeout;
    }

    /**
     * @param int $timeout
     */
    public function setTimeout($timeout)
    {
        $this->timeout = $timeout;
    }
}
