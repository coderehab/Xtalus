@extends ('emails.template')

@section('email_header')

<h1 style="color:#a21e5c;">Xtalus</h1>
<p style="color:#888; line-height:180%; font-weight:300;">Together the perfect 'match-maker' for finding and growing talent</p>

@stop

@section('email_content')

<h2 style="margin:20px 0; font-weight:normal; color:#212121;">Nieuwe Registratie!</h2>

<p style="color:#888; line-height:180%; font-weight:300;">
    <strong>{{$postdata->fullname}} </strong> heeft zich zojuist geregistreerd voor het Xtalus platform.
    Onderstaand meer informatie over deze registratie:
</p>
<table align="left" style="margin-bottom:20px;">
    @foreach($postdata as $key => $value)
    <tr>
        <td width="80">{{$key}}: </td>
        <td>{{$value}}</td>
    </tr>
    @endforeach
</table>

@stop

@section('email_footer')

<p style="color:#888; line-height:180%; font-weight:300;">Meer weten over Xtalus? Bekijk onze website: <a href="www.xtalus.nl" style="color:#a21e5c; text-decoration:none">www.xtalus.nl</a></p>

@stop
