<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Testmailtje</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link href='https://fonts.googleapis.com/css?family=Varela+Round' rel='stylesheet' type='text/css'>
      <style>
      </style>
        <style>

            body{
                background-color:#f5f5f5;
                font-family: 'Varela Round', sans-serif;
                color:#888;
                font-size:14px;
                letter-spacing: 0.025em;
                font-weight:300;
            }

            table{
                margin:auto;
            }

            p{ color: #263238; line-height:180%;}

            h1{
              color: #263238;
              font-size:24px;
              margin:0 0 40px 0;
              font-weight:bold;
              font-family: 'Montserrat', sans-serif;
            }

            h2{
                margin:20px 0;
                font-weight:normal;
                color: #263238;
            }

            h3{
                font-weight:normal;
                color:#212121;
            }

            ul{
                list-style:square;
                color:#a21e5c;
                padding-left: 16px;
            }

            ul li{
                color:#a21e5c;
                font-size:16px;
                margin:0;
                padding:0;

            }

            ul li span{
                color:#888;
                font-size:14px;
            }

            a{
              color: #263238;
              text-decoration:none;
              border-bottom: 2px solid #b0bec5;
            }

            a:hover{
                border-bottom: 2px solid #ffc200;
            }

            a[class="button"] {
                display:inline-block;
                background-color:#a21e5c;
                color:#fff;
                padding: 9px 20px;
                text-decoration:none;
                border-radius: 3px;
                text-transform: uppercase;
                font-size:13px;
                letter-spacing: 0;
                margin:10px 0 20px 0;
                width:auto;
                border:1px solid #a21e5c;
            }

            a["button"]:hover{
                text-decoration:none;
                background-color:#f5f5f5;
                color:#a21e5c;
                border:1px solid #f0f0f0;
                font-weight:normal;
            }

        </style>
    </head>
    <body style='background-color:#f5f5f5;
                 font-family: "Varela Round", sans-serif;
                 color: #263238;
                 font-size:15px;
                 letter-spacing: 0.025em;
                 font-weight:300;
                 padding:60px 0;
                 '>

        <table style="width: 100%; border-collapse: collapse;" cellspacing="0" cellpadding="0">
            <tr>
                <td>
                    <center>

                        <table width="750" style="background:#fff; border:2px solid #efefef; border-collapse: collapse; " cellspacing="0" cellpadding="0">
                            <tr>
                                <td style="border:none">
                                    @yield('email_header')
                                </td>
                            </tr>
                            <tr>
                                <td style="border:none; padding:60px 80px;">
                                    @yield('email_content')
                                </td>
                            </tr>
                        </table>

                        <!-- <table width="750" style="text-align:center;">
                            <tr>
                                <td style="border:none">
                                    @yield('email_footer')
                                </td>
                            </tr>

                        </table> -->
                    </center>
                </td>
            </tr>
        </table>

    </body>
</html>
