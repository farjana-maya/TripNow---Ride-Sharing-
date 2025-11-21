<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Application Submitted</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #10b981;
            margin-top: 0;
        }
        .status-box {
            background: linear-gradient(135deg, #ecfdf5 0%, #dbeafe 100%);
            border-left: 4px solid #10b981;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .status-box h3 {
            margin: 0 0 10px;
            color: #047857;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            background: #f9fafb;
            padding: 15px;
            border-radius: 5px;
        }
        .info-item label {
            display: block;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .info-item value {
            display: block;
            font-size: 16px;
            font-weight: bold;
            color: #111827;
        }
        .timeline {
            margin: 30px 0;
        }
        .timeline-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 20px;
        }
        .timeline-icon {
            width: 40px;
            height: 40px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            margin-right: 15px;
            flex-shrink: 0;
        }
        .timeline-icon.pending {
            background: #f59e0b;
        }
        .timeline-icon.future {
            background: #d1d5db;
        }
        .timeline-content h4 {
            margin: 0 0 5px;
            color: #111827;
        }
        .timeline-content p {
            margin: 0;
            color: #6b7280;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%);
            color: white;
            text-decoration: none;
            padding: 15px 30px;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
        }
        .footer {
            background: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
        }
        .footer a {
            color: #10b981;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🚗 TripNow</h1>
            <p>Drive with us and earn on your schedule</p>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>Hello {{ $userName }}! 👋</h2>
            
            <p>Thank you for submitting your driver application with TripNow! We're excited to have you join our community of professional drivers.</p>

            <!-- Status Box -->
            <div class="status-box">
                <h3>✅ Application Received Successfully</h3>
                <p>Your driver application has been submitted and is now being reviewed by our verification team.</p>
            </div>

            <!-- Vehicle Information -->
            <h3>📋 Submitted Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <label>Vehicle Type</label>
                    <value>{{ ucfirst($vehicleType) }}</value>
                </div>
                <div class="info-item">
                    <label>Vehicle Model</label>
                    <value>{{ $vehicleModel }}</value>
                </div>
                <div class="info-item">
                    <label>Vehicle Number</label>
                    <value>{{ $vehicleNumber }}</value>
                </div>
                <div class="info-item">
                    <label>Submitted On</label>
                    <value>{{ $submittedDate }}</value>
                </div>
            </div>

            <!-- Timeline -->
            <h3>📍 What Happens Next?</h3>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-icon">✓</div>
                    <div class="timeline-content">
                        <h4>Application Submitted</h4>
                        <p>Your information has been received successfully</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon pending">⏳</div>
                    <div class="timeline-content">
                        <h4>Document Verification (24-48 hours)</h4>
                        <p>Our team is reviewing your documents and vehicle information</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-icon future">3</div>
                    <div class="timeline-content">
                        <h4>Approval & Activation</h4>
                        <p>Once approved, you'll receive another email and can start accepting rides</p>
                    </div>
                </div>
            </div>

            <!-- Important Information -->
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <strong>⚠️ Important:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Verification typically takes 24-48 hours</li>
                    <li>You'll receive an email notification once approved</li>
                    <li>Check your dashboard for real-time status updates</li>
                    <li>Ensure your phone is accessible for verification calls</li>
                </ul>
            </div>

            <p>In the meantime, you can:</p>
            <ul>
                <li>📱 Download the TripNow Driver app (if you haven't already)</li>
                <li>📖 Review our driver guidelines and policies</li>
                <li>🎓 Watch our driver training videos</li>
            </ul>

            <center>
                <a href="{{ config('app.url') }}" class="cta-button">Visit Your Dashboard</a>
            </center>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p><strong>Need Help?</strong></p>
            <p>If you have any questions, please contact us at:</p>
            <p>
                📧 <a href="mailto:support@tripnow.com">support@tripnow.com</a><br>
                📞 +880 1234-567890
            </p>
            <p style="margin-top: 20px;">
                © 2025 TripNow. All rights reserved.<br>
                <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
            </p>
        </div>
    </div>
</body>
</html>