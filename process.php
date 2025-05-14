<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Validate required fields
if (!isset($_POST['name']) || !isset($_POST['email']) || !isset($_POST['mobile']) || !isset($_POST['message'])) {
    echo json_encode(['success' => false, 'message' => 'Please fill all required fields']);
    exit;
}

$to = 'info@raqmiyah.com'; // Replace with your email address
$subject = isset($_POST['subject']) ? $_POST['subject'] : 'New Contact Form Submission';
$message = "Name: " . $_POST['name'] . "\n";
$message .= "Email: " . $_POST['email'] . "\n";
$message .= "Mobile: " . $_POST['mobile'] . "\n";
$message .= "Message: " . $_POST['message'] . "\n";

$headers = 'From: ' . $_POST['email'] . "\r\n" .
    'Reply-To: ' . $_POST['email'] . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message']);
}