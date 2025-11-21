<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Driver;

class DriverApprovalNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $driver;
    protected $status;
    protected $comment;

    public function __construct(Driver $driver, $status, $comment = null)
    {
        $this->driver = $driver;
        $this->status = $status;
        $this->comment = $comment;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $message = new MailMessage;

        if ($this->status === 'approved') {
            $message->subject('🎉 Driver Application Approved!')
                ->greeting('Congratulations!')
                ->line('Your driver application has been approved.')
                ->line('You can now start accepting rides and earning money.')
                ->action('Start Driving', url('/driver/dashboard'))
                ->line('Thank you for joining our platform!');
                
            if ($this->comment) {
                $message->line('Admin Note: ' . $this->comment);
            }
        } else {
            $message->subject('Driver Application Update')
                ->greeting('Hello!')
                ->line('We regret to inform you that your driver application has been rejected.')
                ->line('Reason: ' . ($this->comment ?? 'Please check your documents and resubmit.'))
                ->action('Resubmit Application', url('/driver/profile'))
                ->line('If you have any questions, please contact our support team.');
        }

        return $message;
    }

    public function toArray($notifiable)
    {
        return [
            'driver_id' => $this->driver->id,
            'status' => $this->status,
            'message' => $this->status === 'approved' 
                ? 'Your driver application has been approved!' 
                : 'Your driver application has been rejected.',
            'comment' => $this->comment,
            'action_url' => $this->status === 'approved' 
                ? '/driver/dashboard' 
                : '/driver/profile'
        ];
    }
}