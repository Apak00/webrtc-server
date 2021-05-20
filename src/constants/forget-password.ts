const forgotPasswordEmailTemplate = `
<div style="text-align: center;">
    <h1 style="background: black; color:#ffffff;">EYS</h1>
    <p style="margin:12px;">Click below to reset your password</p>
    <a target="_blank" href="http://${process.env.FRONT_END_DOMAIN}" style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;line-height:16px;color:#ffffff;font-weight:400;margin-top:24px;margin-bottom:100px;text-decoration:none;font-size:14px;display:inline-block;padding:10px 24px;background-color:#4184f3;border-radius:5px;min-width:90px">
        Reset Password
    </a>
<div>`;

export default forgotPasswordEmailTemplate;
