<?php namespace App\Http\Controllers;

use Laravel\Lumen\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use Mail;
use StdClass;

class MailController extends BaseController
{

    public function testmail(){
        $mail = Mail::send('emails.testmail', array(), function ($message) {
            $message->from('no-reply@xtalus.nl', 'Xtalus');
            $message->to('info@code.rehab', "Code.Rehab");
            $message->subject("Testmail");
        });

        $response = new StdClass();
        $response->success = $mail;

        return view('emails.testmail', array());

        return response()->json($response);
    }

    public function sendmail(Request $request, $type, $subject){


        $data = (object) $request->json('data');



        $data->fullname = $data->firstname . ' ' .$data->lastname;
        if(isset($data->middlename)) $data->fullname = $data->firstname . ' ' . $data->middlename . ' ' . $data->lastname;


        $mail = Mail::send("emails.$type.$subject", array('postdata' => $data), function ($message) use($data) {
            $message->from('no-reply@xtalus.nl', 'Xtalus');
            $message->to("$data->email", "$data->fullname");
            $message->subject("$data->subject");
        });

        //return view("emails.$type.$subject", $request->json('data'));

        $response = new StdClass();
        $response->success = $mail;

        return response()->json($response);
    }

    public function rendermail(Request $request, $type, $subject){

        $data = (object) $request->input();


        $data->fullname = $data->firstname . ' ' .$data->lastname;
        if(isset($data->middlename)) $data->fullname = $data->firstname . ' ' . $data->middlename . ' ' . $data->lastname;

        return view("emails.$type.$subject", array('postdata' => $data));
    }
}
