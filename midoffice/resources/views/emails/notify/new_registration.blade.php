@extends ('emails.template')

@section('email_header')

<h1 style="color:#a21e5c;">Xtalus</h1>
<p style="color:#888; line-height:180%; font-weight:300;">Together the perfect 'match-maker' for finding and growing talent</p>

@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:normal; color:#212121;">{{$firstname}}, Bedankt voor je registratie!</h2>
<p style="color:#888; line-height:180%; font-weight:300;">
    Mauris vulputate orci eu faucibus consectetur. Donec nec ultrices erat, vitae fermentum ex. Praesent ut lacus vel nulla tristique lacinia. Suspendisse condimentum pellentesque felis eu venenatis.
</p>
<p style="color:#888; line-height:180%; font-weight:300;">
    Etiam vel gravida velit, a fermentum diam. Curabitur placerat cursus nisl, in varius dolor semper eu. Morbi vel viverra nisi. Maecenas pulvinar cursus lacus non fringilla. Mauris tincidunt magna id congue facilisis. Praesent tempus iaculis sapien, a malesuada lectus auctor eu. Maecenas ut risus porta, consectetur libero ut, bibendum ex. Curabitur nisl tellus, fringilla eget ultrices ac, dignissim vel lacus. Vestibulum nec volutpat mi, id ornare ex. Maecenas laoreet ultrices sem a cursus. Nullam efficitur urna at libero laoreet pharetra. Nullam non dapibus nisi.
</p>

<h3 style="font-size:16px; font-weight:normal; color:#212121;">Subkopje</h3>

<p style="color:#888; line-height:180%; font-weight:300;">
    Fusce ornare nunc congue quam maximus ultrices. Duis vehicula nunc id tortor pulvinar blandit. Etiam facilisis blandit turpis vitae sagittis. Maecenas pharetra ornare aliquam. Nullam pulvinar libero ac nibh efficitur, eget aliquet magna porttitor. Integer aliquam tristique ligula in varius. In eget massa a lectus tempus finibus eu vel nunc. Phasellus placerat placerat pulvinar. Quisque facilisis sodales convallis. Mauris nec leo neque. Vivamus sodales sit amet quam sit amet eleifend.
</p>

<ul style="list-style:square; color:#a21e5c; padding-left: 16px; line-height:180%;">
    <li><span style="color:#888" >item 1</span></li>
    <li><span style="color:#888" >item 2</span></li>
    <li><span style="color:#888" >item 3</span></li>
</ul>

<p style="color:#888; line-height:180%; font-weight:300;">
    Mauris vulputate orci eu faucibus consectetur. Donec nec ultrices erat, vitae fermentum ex. Praesent ut lacus vel nulla tristique lacinia. Suspendisse condimentum pellentesque felis eu venenatis.
</p>

@include ('emails.partials.button', [
    'width' => '150',
    'height' => '45',
    'bgcolor' => '#a21e5c',
    'border_color' => '#a21e5c',
    'color' => '#fff',
    'text' => 'Dit is een knop',
    'url' => 'http://www.xtalus.nl'
])

@stop

@section('email_footer')

<p style="color:#888; line-height:180%; font-weight:300;">Meer weten over Xtalus? Bekijk onze website: <a href="www.xtalus.nl" style="color:#a21e5c; text-decoration:none">www.xtalus.nl</a></p>

@stop
