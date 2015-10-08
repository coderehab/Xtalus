@extends ('emails.template')

@section('email_header')

<h1 style="color:#a21e5c;">Xtalus</h1>
<p style="color:#888; line-height:180%; font-weight:300;">Together the perfect 'match-maker' for finding and growing talent</p>

@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:normal; color:#212121;">{{ucfirst($postdata->firstname)}},</h2>
<p style="color:#888; line-height:180%; font-weight:300;">
    Bedankt voor uw registratie. Uw account is aangevraagd.
Binnen enkele werkdagen ontvangt u per email uw inloggegevens en kunt u via Xtalus inloggen.
</p>
<p style="color:#888; line-height:180%; font-weight:300;">
   Voor vragen kunt u contact opnemen met <a href='mailto:info@xtalus.nl'>info@xtalus.nl</a>
</p>

<p style="color:#888; line-height:180%; font-weight:300;">
Met vriendelijke groeten,<br>
Xtalus<br>
(logo Xtalus)
</p>

@stop

@section('email_footer')

<p style="color:#888; line-height:180%; font-weight:300;">Meer weten over Xtalus? Bekijk onze website: <a href="www.xtalus.nl" style="color:#a21e5c; text-decoration:none">www.xtalus.nl</a></p>

@stop


<!--


<ul style="list-style:square; color:#a21e5c; padding-left: 16px; line-height:180%;">
    <li><span style="color:#888" >item 1</span></li>
    <li><span style="color:#888" >item 2</span></li>
    <li><span style="color:#888" >item 3</span></li>
</ul>

<p style="color:#888; line-height:180%; font-weight:300;">
    Mauris vulputate orci eu faucibus consectetur. Donec nec ultrices erat, vitae fermentum ex. Praesent ut lacus vel nulla tristique lacinia. Suspendisse condimentum pellentesque felis eu venenatis.
</p>-->

<?php
    /*
    @include ('emails.partials.button', [
'width' => '150',
'height' => '45',
'bgcolor' => '#a21e5c',
'border_color' => '#a21e5c',
'color' => '#fff',
'text' => 'Dit is een knop',
'url' => 'http://www.xtalus.nl'
])
    */
?>
