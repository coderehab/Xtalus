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
			$message->to('mathijs@code.rehab', "Code.Rehab");
			$message->to('mathijsiej1987@gmail.com', "Code.Rehab");
			$message->subject("Testmail");
		});

		$response = new StdClass();
		$response->success = $mail;

		return view('emails.testmail', array());

		return response()->json($response);
	}

	public function sendmail(Request $request, $type, $subject){

		$data = (object) $request->json('data');

		if(isset($data->firstName) && isset($data->lastName))
			$data->fullName = $data->firstName . ' ' .$data->lastName;
		if(isset($data->middleName)) $data->fullName = $data->firstName . ' ' . $data->middleName . ' ' . $data->lastName;

		$mail = Mail::send("emails.$type.$subject", array('postdata' => $data), function ($message) use($data) {
			$message->from('no-reply@xtalus.nl', 'Xtalus');
			$message->to("$data->email","$data->fullName");
			$message->subject("$data->subject");
		});

		//return view("emails.$type.$subject", $request->json('data'));

		$response = new StdClass();
		$response->success = $mail;

		return response()->json($response);
	}

	public function rendermail(Request $request, $type, $subject){

		$data = (object) $request->input();


		$data->fullName = $data->firstName . ' ' .$data->lastName;
		if(isset($data->middleName)) $data->fullName = $data->firstName . ' ' . $data->middleName . ' ' . $data->lastName;

		return view("emails.$type.$subject", array('postdata' => $data));
	}
}
