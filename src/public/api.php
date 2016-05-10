<?php
/**
 * Created for project LoLCards
 * User: anilyeni
 * Date: 07/05/2016
 */
include '../../autoloader.php';

$riot = new \Api\Riot(new \Api\Curl());

header('Content-Type: application/json');

if(isset($_GET['champions'])) {
    echo $riot->getAllChampionsAllStaticData();
}

if(isset($_GET['items'])) {
    echo $riot->getAllItemsAllStaticData();
}
