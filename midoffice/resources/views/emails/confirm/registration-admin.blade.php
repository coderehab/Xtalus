@extends ('emails.template')

@section('email_header')
<img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h1 style="margin:0 0 40px 0;">Hé admin,</h1>
<p style="font-family: 'Varela Round', sans-serif; line-height:180%; margin:0 0 20px 0;">
  Een nieuwe gebruiker wil toegang krijgen tot Xtalus. Verifieer en activeer deze gebruiker zodat hij/zij gebruik kan maken van het platform.
</p>
<p style="font-family: 'Varela Round', sans-serif; line-height:180%; margin:0 0 20px 0;">
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td>
      <div>
        <!--[if mso]>
<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="http://litmus.com" style="height:36px;v-text-anchor:middle;width:150px;" arcsize="5%" strokecolor="#a21e5c" fillcolor="#a21e5c">
<w:anchorlock/>
<center style="color:#ffffff;font-family:Helvetica, Arial,sans-serif;font-size:16px;">Dit is een knop</center>
</v:roundrect>
<![endif]-->
        <a href="http://test.xtalus.gedge.nl/simple/wicket" style="font-weight:400;background-color: #3f51b5;border:0;border-radius:3px;color:#ffffff;display:inline-block;font-size:15px;line-height:50px;text-align:center;text-decoration:none;width:auto;padding:0 20px; -webkit-text-size-adjust:none;mso-hide:all;text-transform:uppercase;font-family: 'Varela Round', sans-serif;">VERIFIEER NIEUWE GEBRUIKER<img src="http://dev.code.rehab/xtalus-nieuwsbrief/arrow.png" width="5" height="10" style="margin:20px 0 0 10px; float:right;"></a>
      </div>
    </td>
  </tr>
</table>
</p>

<p style="font-family: 'Varela Round', sans-serif; line-height:180%; margin:0 0 -20px 0;">
  <br>Met vriendelijke groeten,<br>
  Xtalus team<br><br>
</p>

@stop

@section('email_footer')

@stop