<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;
use App\Models\Driver;

class DriverApplicationSubmitted extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $driver;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Driver $driver)
    {
        $this->user = $user;
        $this->driver = $driver;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject('Driver Application Submitted - TripNow')
                    ->view('emails.driver-application-submitted')
                    ->with([
                        'userName' => $this->user->name,
                        'vehicleType' => $this->driver->vehicle_type,
                        'vehicleModel' => $this->driver->vehicle_model,
                        'vehicleNumber' => $this->driver->vehicle_number,
                        'submittedDate' => $this->driver->created_at->format('F d, Y'),
                    ]);
    }
}