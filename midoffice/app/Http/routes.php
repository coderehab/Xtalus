<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$app->group(['prefix' => 'api'], function ($app) {

    $app->get('image/{imagename}', array('uses' => 'App\Http\Controllers\ImageController@get_image'));
    $app->get('image/{w}/{h}/{imagename}', array('uses' => 'App\Http\Controllers\ImageController@get_image'));
    $app->post('image', array('uses' => 'App\Http\Controllers\ImageController@post_image'));
    $app->put('image', array('uses' => 'App\Http\Controllers\ImageController@update_image'));
    $app->delete('image', array('uses' => 'App\Http\Controllers\ImageController@delete_image'));

});
