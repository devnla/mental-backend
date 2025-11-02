<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Carbon\Carbon;

class Invitation extends Model
{
    protected $fillable = ['email', 'token', 'expires_at', 'used_at', 'used_by'];

    protected $dates = ['expires_at', 'used_at'];

    public static function generateFor(string $email, ?int $days = 7): self
    {
        return self::create([
            'email' => $email,
            'token' => Str::random(40),
            'expires_at' => now()->addDays($days),
        ]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && now()->greaterThan($this->expires_at);
    }

    public function isUsed(): bool
    {
        return ! is_null($this->used_at);
    }

    public function markUsedBy(int $userId): void
    {
        $this->used_at = now();
        $this->used_by = $userId;
        $this->save();
    }
}