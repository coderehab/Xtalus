<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td>
            <div>
                <!--[if mso]>
                <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{ $url }}" style="height:{{ $height }}px;v-text-anchor:middle;width:{{ $width }}px;" arcsize="5%" strokecolor="#{{ $border_color }}" fillcolor="{{ $bgcolor }}">
                <w:anchorlock/>
                <center style="color:{{ $color }};font-family:Helvetica, Arial,sans-serif;font-size:16px;">{{ $text }}</center>
                </v:roundrect>
                <![endif]-->
                <a href="{{ $url }}" style="background-color:{{ $bgcolor }};border:1px solid {{ $border_color }};border-radius:3px;color:{{ $color }};display:inline-block;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:{{$width}}px;height:{{$height}}px;-webkit-text-size-adjust:none;mso-hide:all;">
                    {{ $text }}
                </a>
            </div>
        </td>
    </tr>
</table>
