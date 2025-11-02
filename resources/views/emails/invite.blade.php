<p>Hello,</p>
<p>You were invited to join {{ config('app.name') }}. Click the link below to register (this link will expire at {{ $expires_at ?? 'no expiry' }}):</p>
<p><a href="{{ $link }}">{{ $link }}</a></p>
<p>If you didn't expect this, ignore this email.</p>