<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\Invitation;

class InviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public Invitation $invitation;

    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation;
    }

    public function build()
    {
        $link = url("/invite/{$this->invitation->token}");

        return $this->subject('You are invited')
                    ->view('emails.invite')
                    ->with([
                        'link' => $link,
                        'email' => $this->invitation->email,
                        'expires_at' => $this->invitation->expires_at,
                    ]);
    }
}