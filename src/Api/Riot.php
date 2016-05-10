<?php
/**
 * Created for project LoLCards
 * User: anilyeni
 * Date: 07/05/2016
 */

namespace Api;


class Riot
{
    /** @var  Curl */
    protected $client;

    protected $baseUrl = 'https://global.api.pvp.net/api/lol/';

    protected $apiKey = 'XXXXXXXXXXXX';

    protected $region = 'euw';

    protected $version = 'v1.2';

    /**
     * Riot constructor.
     * @param Curl $client
     */
    public function __construct(Curl $client)
    {
        $this->client = $client;
    }

    public function getAllChampionsAllStaticDataUrl()
    {
        $apiName = 'static-data';
        $staticData  = 'champion?champData=all';

        return $this->baseUrl . $apiName . '/' . $this->region . '/' . $this->version . '/' .
        $staticData . '&api_key=' . $this->apiKey;
    }

    public function getAllChampionsAllStaticData()
    {
        $url = $this->getAllChampionsAllStaticDataUrl();

        if($result = apcu_fetch('getAllChampionsAllStaticData')) {
            return $result;
        }


        $result = $this->client->getResult($url);

        apcu_add('getAllChampionsAllStaticData', $result);

        return $result;
    }


    public function getAllItemsAllStaticDataUrl()
    {
        $apiName = 'static-data';
        $staticData  = 'item?itemListData=all';

        return $this->baseUrl . $apiName . '/' . $this->region . '/' . $this->version . '/' .
        $staticData . '&api_key=' . $this->apiKey;
    }

    public function getAllItemsAllStaticData()
    {
        $url = $this->getAllItemsAllStaticDataUrl();

        if($result = apcu_fetch(md5($url))) {
            return $result;
        }

        $result = $this->client->getResult($url);

        apcu_add('', $result);

        return $result;
    }
}