@extends ('emails.template')

@section('email_header')
  <img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:bold; color: #263238; font-family: 'Bitter'; font-size:24px;">Hé admin,</h2>
<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
    Een nieuwe gebruiker wil toegang krijgen tot Xtalus. Verifieer en activeer deze gebruiker zodat hij/zij gebruik kan maken van het platform.
</p>

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
                <a href="http://test.xtalus.gedge.nl/simple/wicket" style="font-weight:700;background-color: #3f51b5;border:0;border-radius:3px;color:#ffffff;display:inline-block;font-size:15px;line-height:44px;text-align:center;text-decoration:none;width:320px;-webkit-text-size-adjust:none;mso-hide:all;text-transform:uppercase;font-family: 'Bitter';">Verifieer nieuwe gebruiker <img src="http://dev.code.rehab/xtalus-nieuwsbrief/arrow.png" style="margin-left:10px;"></a>
            </div>
        </td>
    </tr>
</table>

<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
Met vriendelijke groeten,<br>
Xtalus team<br><br>
</p>

@stop

@section('email_footer')

@stop



