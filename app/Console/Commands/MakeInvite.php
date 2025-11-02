<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invitation;
use Illuminate\Support\Facades\Mail;
use App\Mail\InviteMail;

class MakeInvite extends Command
{
    protected $signature = 'make:invite {email} {--days=7}';
    protected $description = 'Create an invitation for an email and send it';

    public function handle()
    {
        $email = $this->argument('email');
        $days = (int)$this->option('days');

        $inv = Invitation::generateFor($email, $days);

        Mail::to($email)->send(new InviteMail($inv));

        $this->info("Invitation created for {$email} (token: {$inv->token})");
        $this->info("Open Mailpit at http://127.0.0.1:8025 to view the email.");
    }
}