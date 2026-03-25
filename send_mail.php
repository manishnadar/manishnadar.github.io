<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get raw JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        $data = $_POST;
    }

    $name = strip_tags(trim($data["name"] ?? ''));
    $email = filter_var(trim($data["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $phone = strip_tags(trim($data["phone"] ?? ''));
    $service = strip_tags(trim($data["service"] ?? ''));
    $message = trim($data["message"] ?? '');

    if (empty($name) || empty($phone) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Please fill all the required fields correctly."]);
        exit;
    }

    $recipient = "manish.nadar95@gmail.com";
    $subject = "New Portfolio Lead from $name";

    $serviceNames = [
        "website" => "Website",
        "logo" => "Logo",
        "mobile-app" => "Mobile App",
        "brochure" => "Brochure Design",
        "visiting-card" => "Visiting Card",
        "others" => "Others"
    ];
    
    $serviceDisplay = isset($serviceNames[$service]) ? $serviceNames[$service] : "Not specified";

    $email_content = "
    <html>
    <head>
      <style>
        body { font-family: 'Open Sans', Arial, sans-serif; background-color: #f4f7f6; color: #333; line-height: 1.6; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
        .header { background: #3b82f6; color: #ffffff; padding: 25px; text-align: center; }
        .header h2 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 35px; }
        .field { margin-bottom: 25px; }
        .label { font-weight: bold; color: #64748b; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; }
        .value { font-size: 16px; color: #1e293b; background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0; }
        .message-box { white-space: pre-wrap; font-size: 15px; }
        .footer { text-align: center; padding: 20px; font-size: 13px; color: #94a3b8; background: #f1f5f9; border-top: 1px solid #e2e8f0; }
        a { color: #3b82f6; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <div class='container'>
        <div class='header'>
          <h2>New Lead Inquiry 🚀</h2>
        </div>
        <div class='content'>
          <div class='field'>
            <div class='label'>Name</div>
            <div class='value'>$name</div>
          </div>
          <div class='field'>
            <div class='label'>Email Address</div>
            <div class='value'><a href='mailto:$email'>$email</a></div>
          </div>
          <div class='field'>
            <div class='label'>Phone Number</div>
            <div class='value'><a href='tel:$phone'>$phone</a></div>
          </div>
          <div class='field'>
            <div class='label'>Interested Service</div>
            <div class='value'>$serviceDisplay</div>
          </div>
          <div class='field'>
            <div class='label'>Description</div>
            <div class='value message-box'>$message</div>
          </div>
        </div>
        <div class='footer'>
          This email was sent from your portfolio contact form.
        </div>
      </div>
    </body>
    </html>
    ";

    $email_headers = "MIME-Version: 1.0\r\n";
    $email_headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    // Using a default Host HTTP header element or safe fallback since SERVER_NAME might not always be reliable in all shared hosting
    $host = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : 'your-portfolio.com';
    $email_headers .= "From: Portfolio Contact <noreply@" . $host . ">\r\n";
    $email_headers .= "Reply-To: $name <$email>\r\n";

    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Thank you! Your message has been sent successfully."]);
    } else {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Oops! Something went wrong and we couldn't send your message."]);
    }
} else {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "There was a problem with your submission, please try again."]);
}
?>
