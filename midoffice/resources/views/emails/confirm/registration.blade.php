@extends ('emails.template')

@section('email_content')

        <table width="750" style="text-align:center;">
            <tr>
                <td style="border:none">
                    <h1 style="color:#a21e5c;">Xtalus</h1>
                    <p style="color:#888; line-height:180%; font-weight:300;">Together the perfect 'match-maker' for finding and growing talent</p>
                </td>
            </tr>

        </table>

        <table width="750" style="background:#fff; border:2px solid #efefef; ">
            <tr>
                <td style="border:none; padding:35px 10%">
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
                                    <a href="http://buttons.cm" style="background-color:#a21e5c;border:1px solid #a21e5c;border-radius:3px;color:#ffffff;display:inline-block;font-size:16px;line-height:44px;text-align:center;text-decoration:none;width:150px;-webkit-text-size-adjust:none;mso-hide:all;">Dit is een knop</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        <table width="750" style="text-align:center;">
            <tr>
                <td style="border:none">
                    <p style="color:#888; line-height:180%; font-weight:300;">Meer weten over Xtalus? Bekijk onze website: <a href="www.xtalus.nl" style="color:#a21e5c; text-decoration:none">www.xtalus.nl</a></p>
                </td>
            </tr>

        </table>
@stop
