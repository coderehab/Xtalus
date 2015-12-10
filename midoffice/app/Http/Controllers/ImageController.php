<?php namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Imagine;
use Image;
use stdClass;
use Imagine\Image\Point;
use Imagine\Image\Box;

class ImageController extends BaseController
{

	public function index($imagename=false, $w=false, $h=false) {

		return "nothing";
	}

	public function get_image($imagename=false, $w=false, $h=false) {
		//header('Content-type: image/jpeg');
		//if width and height are set -> create new image with new size and return url
		if($w && $h) {
			$img = Image::make("uploads/$imagename",array(
				'width' => $w,
				'height' => $h
			));

			$img_location = "uploads/" . substr($imagename, 0 , (strrpos($imagename, ".")));
			$img->save("$img_location-image(" . $w . "x" . $h . ").jpg");

			$image = $img->get('jpeg');
			return response($image)->header('Content-type', 'image/jpeg');
		}

		return  "<img src='" . url("uploads/$imagename") . "' />";
	}

	public function get_cropped_image($imagename=false, $cx=0, $cy=0, $w=false, $h=false) {

		if($w && $h)
		{
			$size  = Image::make("uploads/$imagename")->getSize();
			$box = ($w < $h) ? $size->widen($h) : $size->heighten($w);

			$img = Image::make("uploads/$imagename")
				->resize($box)
				->crop(new Point($cx, $cy), new Box($w, $h));

			$img_location = "uploads/" . substr($imagename, 0 , (strrpos($imagename, ".")));
			$img->save("$img_location-image(" . $w . "x" . $h . "-crop).jpg");

			$image = $img->get('jpeg');
			return response($image)->header('Content-type', 'image/jpeg');
		}

		return  "<img src='" . url("uploads/$imagename") . "' />";
	}

	public function post_image(Request $request) {

		$tmp_img = $request->json('image');

		$img = explode(',', $tmp_img['data']);
		$img = base64_decode($img[1]);

		$random_string = uniqid();

		$file = "uploads/" . $random_string . "-" . $tmp_img['filename'];

		$success = file_put_contents($file, $img);

		$data = new stdClass();
		$image = new stdClass();
		$image->name =  $random_string . "-" . $tmp_img['filename'];
		$image->url = url($file);
		$data->image = $image;

		return json_encode($data);
	}

	public function update_image() {

	}

	public function delete_image() {

	}

}
