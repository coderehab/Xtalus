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

$app->group(['prefix' => 'api','middleware' => 'cors'], function ($app) {
	$app->get('images/{imagename}', array('uses' => 'App\Http\Controllers\ImageController@get_image'));
	$app->get('images/{w}/{h}/{imagename}', array('uses' => 'App\Http\Controllers\ImageController@get_image'));
	$app->get('images/cropped/{cx}/{cy}/{w}/{h}/{imagename}', array('uses' => 'App\Http\Controllers\ImageController@get_cropped_image'));
	$app->get('images', array('uses' => 'App\Http\Controllers\ImageController@index'));

	$app->post('images', array('uses' => 'App\Http\Controllers\ImageController@post_image'));
	$app->put('images', array('uses' => 'App\Http\Controllers\ImageController@update_image'));
	$app->delete('images', array('uses' => 'App\Http\Controllers\ImageController@delete_image'));

	$app->get('testmail', array('uses' => 'App\Http\Controllers\MailController@testmail'));
	$app->get('mail/{type}/{subject}', array('uses' => 'App\Http\Controllers\MailController@rendermail'));
	$app->post('mail/{type}/{subject}', array('uses' => 'App\Http\Controllers\MailController@sendmail'));
});
