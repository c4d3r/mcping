<?php
/**
 * Author: Maxim
 * Date: 25/07/2014
 * Time: 15:55
 */
namespace Maxim\MCPing;

use Maxim\MCPing\Server\Minecraft\MinecraftServer;
use Symfony\Component\Yaml\Parser;

class Application
{
    private $name;

    const CONFIG_LOCATION = '/../configs.yml';
    const KEY_HUB = "hub";

    private $configs;

    function __construct($name)
    {
        $this->name = $name;

        //load configs
        $yaml = new Parser();
        $this->configs = $yaml->parse(file_get_contents(__DIR__ . self::CONFIG_LOCATION));
    }

    public function run()
    {
        header('Access-Control-Allow-Origin: *');

        if(isset($_GET) && count($_GET) > 0) {
            $this->parseRoute($_GET);
            return;
        }

        if(!isset($_POST) || count($_POST) == 0 || !isset($_POST['id']))
            throw new \Exception("Could not find parameter: id in POST request");


        $id = $_POST['id'];
        if(isset($this->configs['servers'][$id]))
        {
            $server = $this->configs['servers'][$id];

            if(isset($server[self::KEY_HUB]) && $server[self::KEY_HUB]) {
                $hub = array();
                $success = false;
                foreach($server['servers'] as $child) {

                    $objServer = new MinecraftServer($server['name'], $child['ip'], $child['port']);

                    try {
                        $data = json_decode($objServer->ping(), true);
                        $data['ping'] = $objServer->getEndTime() - $objServer->getStartTime();
                        $success = true;
                    } catch(\Exception $ex) {
                        $data = array("success" => false, "message" => $ex->getMessage());
                    }

                    $hub["subServers"][] = $data;
                }
                $hub['success'] = $success;

                echo json_encode($hub);
            } else {
                $objServer = new MinecraftServer($server['name'], $server['ip'], $server['port']);
                try {
                    $data = json_decode($objServer->ping(), true);
                    $data['ping'] = $objServer->getEndTime() - $objServer->getStartTime();
                    $data['success'] = true;
                } catch(\Exception $ex) {
                    $data = array("success" => false, "message" => $ex->getMessage());
                }

                echo json_encode($data);
            }
        }


    }

    public function parseRoute($get)
    {
        if(isset($get['COMMAND']) && strtolower($get['COMMAND']) == "getserverids") {
            echo json_encode($this->getServerIds(), JSON_FORCE_OBJECT);
        }
    }

    public function getServerIds()
    {
        $output = array();
        foreach($this->configs['servers'] as $key => $server)
        {
            if(isset($server['hub']) && $server['hub'] == true) {
                $hub['name'] = $server['name'];
                foreach($server['servers'] as $k => $subServer) {
                    $hub["servers"][$k] = $subServer['name'];
                }
                $output[$key] = $hub;
            } else {
                $output[$key] = $server['name'];
            }
        }
        return $output;
    }
} 