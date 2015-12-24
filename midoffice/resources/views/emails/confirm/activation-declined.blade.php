@extends ('emails.template')

@section('email_header')
  <img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h1 style="margin:0 0 40px 0;">Hé {{ucfirst($postdata->firstname)}},</h1>
<p style="font-family: 'Varela Round', sans-serif; line-height:180%; margin:0 0 20px 0;">
    Uw account is geverifieerd en geweigerd.<br> U kunt momenteel niet inloggen op Xtalus.<br>Voor vragen kunt u contact opnemen met: <a style="color: #263238; text-decoration:none; border-bottom: 2px solid #b0bec5;" href="mailto:info@xtalus.nl">info@xtalus.nl</a>.
</p>

<p style="font-family: 'Varela Round', sans-serif; line-height:180%; margin:0 0 -20px 0;">
<br>Met vriendelijke groeten,<br>
Xtalus team<br><br>
</p>

@stop

@section('email_footer')

@stop
