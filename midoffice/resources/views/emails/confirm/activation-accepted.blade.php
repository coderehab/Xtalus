@extends ('emails.template')

@section('email_header')
  <img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:bold; color: #263238; font-family: 'Montserrat'; font-size:24px;"> Hé {{ucfirst($postdata->firstname)}},</h2>
<p style="color: #263238; line-height:180%; font-family: 'Montserrat'; font-size:15px;">
  Uw account is geverifieerd en geactiveerd. U kunt inloggen met uw eerder gekozen e-mailadres en wachtwoord.
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
                <a href="http://dev.xtalus.nl" style="font-weight:700;background-color: #3f51b5;border:0;border-radius:3px;color:#ffffff;display:inline-block;font-size:15px;line-height:44px;text-align:center;text-decoration:none;width:260px;-webkit-text-size-adjust:none;mso-hide:all;text-transform:uppercase;font-family: 'Montserrat';">Inloggen op Xtalus <img src="http://dev.code.rehab/xtalus-nieuwsbrief/arrow.png" style="margin-left:10px;"></a>
            </div>
        </td>
    </tr>
</table>

<p style="color: #263238; line-height:180%; font-family: 'Montserrat'; font-size:15px;">
  Het Xtalus team wens u veel matching plezier toe.</p>
<p style="color: #263238; line-height:180%; font-family: 'Montserrat'; font-size:15px;">Voor vragen kunt u contact opnemen met: <a style="padding-bottom:2px; color: #263238; border-bottom: 2px solid #ffc200;" href="mailto:info@xtalus.nl">info@xtalus.nl</a>.</p>

<p style="color: #263238; line-height:180%; font-family: 'Montserrat'; font-size:15px;">
Met vriendelijke groeten,<br>
Xtalus team<br><br>
</p>

@stop

@section('email_footer')

@stop




