@extends ('emails.template')

@section('email_header')
  <img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:bold; color: #263238; font-family: 'Bitter'; font-size:24px;"> Hé {{ucfirst($postdata->firstname)}},</h2>
<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
  Uw account is geverifieerd en geweigerd.<br>
 U kunt momenteel niet inloggen op Xtalus.
</p>

<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">Voor vragen kunt u contact opnemen met: <a style="padding-bottom:2px; color: #263238; border-bottom: 2px solid #ffc200;" href="mailto:info@xtalus.nl">info@xtalus.nl</a>.</p>

<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
Met vriendelijke groeten,<br>
Xtalus team<br><br>
</p>

@stop

@section('email_footer')

@stop
