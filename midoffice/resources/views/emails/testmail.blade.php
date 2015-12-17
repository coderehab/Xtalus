@extends ('emails.template')

@section('email_header')
  <img src="http://dev.code.rehab/xtalus-nieuwsbrief/email-header.jpg" width="100%" height="auto">
@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:bold; color: #263238; font-family: 'Bitter'; font-size:24px;">Welkom Jan,</h2>
<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
    Bedankt voor uw registratie! Uw account is aangevraagd en wordt momenteel door een van onze medewerkers geverifieerd. Hiermee kunnen we de kwaliteit op Xtalus garanderen.
</p>
<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">Binnen enkele werkdagen is uw account geverifieerd en kunt u inloggen met de volgende gegevens:</p>
<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
<table style="margin:0;">
  <tr align="left">
    <td width="150" style="font-family: 'Bitter'; font-size:15px;">Gebruikersnaam:</td>
    <td style="font-family: 'Bitter'; font-size:15px;">jan@jansen.nl</td>
  </tr>
  <tr>
    <td style="font-family: 'Bitter'; font-size:15px;">Wachtwoord:</td>
    <td style="font-family: 'Bitter'; font-size:15px;">janjansen123!</td>
  </tr>
</table>
</p>

<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
U ontvangt per e-mail een bericht zodra dit is voltooid.<br>Voor vragen kunt u contact opnemen met: <a style="padding-bottom:2px; color: #263238; border-bottom: 2px solid #ffc200;" href="mailto:info@xtalus.nl">info@xtalus.nl</a>.
</p>

<p style="color: #263238; line-height:180%; font-family: 'Bitter'; font-size:15px;">
Met vriendelijke groeten,<br>
Xtalus team<br><br>
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
                <a href="http://dev.xtalus.nl" style="font-weight:700;background-color: #3f51b5;border:0;border-radius:3px;color:#ffffff;display:inline-block;font-size:15px;line-height:44px;text-align:center;text-decoration:none;width:360px;-webkit-text-size-adjust:none;mso-hide:all;text-transform:uppercase;font-family: 'Bitter';">MEER WETEN? BEZOEK ONZE WEBSITE <img src="http://dev.code.rehab/xtalus-nieuwsbrief/arrow.png" style="margin-left:10px;"></a>
            </div>
        </td>
    </tr>
</table>

@stop

@section('email_footer')

@stop


