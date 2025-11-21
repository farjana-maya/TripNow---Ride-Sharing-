<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Driver Application Approved</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            background-color: #f8f9fa;
        }
        .container {
            background-color: white;
            margin: 20px;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            background: linear-gradient(135deg, #10b981, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 10px;
        }
        .celebration {
            font-size: 48px;
            margin: 20px 0;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 30px;
        }
        .info-box {
            background: linear-gradient(135deg, #f0fdf4, #ecfdf5);
            border: 2px solid #10b981;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        .info-title {
            font-weight: bold;
            color: #065f46;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .info-item {
            margin-bottom: 10px;
            color: #047857;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            margin: 20px 0;
            box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
        }
        .highlight {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: bold;
            color: #1e40af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">TripNow</div>
            <div class="celebration">🎉</div>
            <h1 class="title">Congratulations, {{ $user->name }}!</h1>
        </div>

        <div class="message">
            <p>We're thrilled to inform you that your driver application has been <strong class="highlight">approved</strong>! Welcome to the TripNow driver family.</p>

            <p>You can now start accepting rides and earning money through our platform. Your dedication to providing excellent service is greatly appreciated.</p>
        </div>

        <div class="info-box">
            <div class="info-title">🚗 Your Driver Profile</div>
            <div class="info-item"><strong>Vehicle:</strong> {{ ucfirst($driver->vehicle_type) }} - {{ $driver->vehicle_model }}</div>
            <div class="info-item"><strong>License:</strong> {{ $driver->license_number }}</div>
            <div class="info-item"><strong>Status:</strong> <span class="highlight">Approved & Active</span></div>
        </div>

        <div class="message">
            <h3 style="color: #1f2937; margin-bottom: 15px;">What's Next?</h3>
            <ul style="color: #6b7280;">
                <li>Download the TripNow Driver app or log in to your dashboard</li>
                <li>Complete your profile and set your availability</li>
                <li>Start accepting ride requests in your area</li>
                <li>Earn money with our competitive commission rates</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/driver/dashboard') }}" class="cta-button">
                🚀 Start Driving Now
            </a>
        </div>

        <div class="message">
            <p>If you have any questions or need assistance, our support team is here to help. Contact us at <strong>support@tripnow.com</strong> or call our helpline.</p>

            <p>Thank you for choosing TripNow. Safe driving and happy earning!</p>
        </div>

        <div class="footer">
            <p>This email was sent to {{ $user->email }} because you applied to be a driver on TripNow.</p>
            <p>&copy; 2025 TripNow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
