<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Testmailtje</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>

            body{
                background-color:#f5f5f5;
                font-family: "Helvetica", "Arial", "Verdana", "Trebuchet MS";
                color:#888;
                font-size:14px;
                letter-spacing: 0.025em;
                font-weight:300;
            }

            table{
                margin:auto;
            }

            p{color:#888; line-height:180%;}

            h1{color:#a21e5c;}

            h2{
                margin:20px 0;
                font-weight:normal;
                color:#212121;
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
                color:#a21e5c;
                text-decoration:none;
            }

            a:hover{
                text-decoration:underline;
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
                 font-family: "Helvetica", "Arial", "Verdana", "Trebuchet MS";
                 color:#888;
                 font-size:14px;
                 letter-spacing: 0.025em;
                 font-weight:300;'>

        <table style="width: 100%;">
            <tr>
                <td>
                    <center>
        @yield('email_content')
                    </center>
                </td>
            </tr>
        </table>

    </body>
</html>
