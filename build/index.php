<?php
/**
 * Author: Maxim
 * Date: 25/07/2014
 * Time: 15:36
 */
require 'vendor/autoload.php';

use Maxim\MCPing\Application;
use Symfony\Component\Yaml\Exception\ParseException;


$application = new Application("Online players");

try
{
    $application->run();
}
catch(ParseException $ex)
{
    printf("Unable to parse the YAML string: %s", $ex->getMessage());
}