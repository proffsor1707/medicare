<?php
// validate-otp.php
include('config.php'); // Include database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $otp = $_POST['otp'];

    // Check if the OTP exists and is still valid
    $query = "SELECT * FROM otp_requests WHERE email = ? AND otp = ? AND expires > ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("sii", $email, $otp, date("U"));
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        // OTP is valid
        echo "OTP verified successfully! You are logged in.";
        // You can start a session or redirect to the dashboard here.

        // Optional: Delete the OTP after successful verification
        $query = "DELETE FROM otp_requests WHERE email = ? AND otp = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $email, $otp);
        $stmt->execute();
    } else {
        // OTP is invalid or expired
        echo "Invalid or expired OTP. Please try again.";
    }
}
?>
