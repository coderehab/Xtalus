<?php namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Imagine;
use Image;

class ImageController extends BaseController
{

    public function get_image($imagename=false, $w=false, $h=false ) {

        //$imagename

        if($w && $h) {
            $img = Image::make("uploads/$imagename",array(
                'width' => $w,
                'height' => $h
            ));

            $img->save("uploads/" . substr($imagename, 0 , (strrpos($imagename, "."))) . "-image(" . $w . "x" . $h . ").jpg");
            return "<img src='" . Image::url('uploads/test.jpg', $w, $h) . "' />";
        }

        return  "<img src='" . url("uploads/test.jpg") . "' />";
    }

    public function post_image(Request $request) {

        $photo = $request->file('photo');
        //$name = request->post('name');
        //$user_id = request->post('user_id');
        $extention = $photo->getExtention();

        $location = "uploads/" . $user_id . "test.jpg";

        if ($request->hasFile('photo')) ;
        if ($photo->isValid())
            $photo->move($location);

        return imagelocation;
    }

    public function update_image() {

    }

    public function delete_image() {

    }

}
